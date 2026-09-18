import asyncio
import json
import time
from typing import Any, AsyncIterator, Dict, List, Optional
import httpx

from backend.app.config import get_settings
from backend.app.core.classifier import classify_response
from backend.app.core.security import build_safe_check_url
from backend.app.plugins.base import BaseOSINTPlugin
from backend.app.schemas.platform import PlatformRule
from backend.app.schemas.scan import OSINTModuleResult, PlatformStatus

settings = get_settings()


class WhatsMyNamePlugin(BaseOSINTPlugin):
    id = "whatsmyname"
    name = "WhatsMyName"
    version = "1.0.0"
    description = "Checks public handle existence across 700+ websites and services."
    icon = "user-check"
    supported_input_types = ["username"]

    def _load_rules(self, category_filter: Optional[List[str]] = None) -> List[PlatformRule]:
        if not settings.SITES_FILE.exists():
            return []
        with open(settings.SITES_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

        rules = []
        for raw in data.get("sites", []):
            if not raw.get("enabled", True):
                continue
            if category_filter and raw.get("category") not in category_filter:
                continue
            try:
                rules.append(PlatformRule(**raw))
            except Exception:
                continue
        return rules

    async def execute(
        self,
        target: str,
        input_type: str,
        options: Optional[Dict[str, Any]] = None,
    ) -> AsyncIterator[OSINTModuleResult]:
        categories = options.get("categories") if options else None
        sites = self._load_rules(categories)
        if not sites:
            return

        semaphore = asyncio.Semaphore(settings.SCAN_MAX_CONCURRENCY)
        limits = httpx.Limits(max_keepalive_connections=20, max_connections=50)

        # Queue to stream results as they finish
        result_queue: asyncio.Queue[Optional[OSINTModuleResult]] = asyncio.Queue()

        async def worker(client: httpx.AsyncClient, site: PlatformRule):
            start_time = time.monotonic()
            try:
                url = build_safe_check_url(site.uriCheck, target, site.stripBadChar)
            except Exception as e:
                res = OSINTModuleResult(
                    sourceName=self.name,
                    category="username",
                    target=target,
                    status="error",
                    platformName=site.displayName,
                    profileUrl=None,
                    metadata={"error": str(e), "category": site.category},
                )
                await result_queue.put(res)
                return

            profile_url = site.uriPretty.replace("{account}", target) if site.uriPretty else url

            async with semaphore:
                try:
                    headers = {"User-Agent": settings.USER_AGENT}
                    if site.headers:
                        headers.update(site.headers)

                    if site.postBody:
                        body_str = json.dumps(site.postBody) if isinstance(site.postBody, (dict, list)) else str(site.postBody)
                        post_payload = body_str.replace("{account}", target)
                        resp = await client.post(
                            url,
                            content=post_payload,
                            headers=headers,
                            timeout=settings.SCAN_SITE_TIMEOUT_SECONDS,
                            follow_redirects=True,
                        )
                    else:
                        resp = await client.get(
                            url,
                            headers=headers,
                            timeout=settings.SCAN_SITE_TIMEOUT_SECONDS,
                            follow_redirects=True,
                        )

                    duration_ms = int((time.monotonic() - start_time) * 1000)
                    status_enum, confidence_enum, reason = classify_response(
                        status_code=resp.status_code,
                        body_text=resp.text,
                        e_code=site.eCode,
                        e_string=site.eString,
                        m_code=site.mCode,
                        m_string=site.mString,
                        protections=site.protection,
                    )

                    status_str = "found" if status_enum == PlatformStatus.FOUND else (
                        "rate_limited" if status_enum in (PlatformStatus.RATE_LIMITED, PlatformStatus.BLOCKED) else (
                            "not_found" if status_enum == PlatformStatus.NOT_FOUND else "error"
                        )
                    )

                    res = OSINTModuleResult(
                        sourceName=self.name,
                        category="username",
                        target=target,
                        status=status_str,
                        platformName=site.displayName,
                        profileUrl=profile_url if status_str == "found" else None,
                        metadata={
                            "platformId": site.id,
                            "category": site.category,
                            "confidence": confidence_enum.value,
                            "detectionReason": reason,
                            "durationMs": duration_ms,
                            "requiresManualVerification": site.requiresManualVerification,
                        },
                    )
                    await result_queue.put(res)

                except httpx.TimeoutException:
                    res = OSINTModuleResult(
                        sourceName=self.name,
                        category="username",
                        target=target,
                        status="error",
                        platformName=site.displayName,
                        profileUrl=None,
                        metadata={"error": "Timeout", "category": site.category},
                    )
                    await result_queue.put(res)
                except Exception as e:
                    res = OSINTModuleResult(
                        sourceName=self.name,
                        category="username",
                        target=target,
                        status="error",
                        platformName=site.displayName,
                        profileUrl=None,
                        metadata={"error": str(e), "category": site.category},
                    )
                    await result_queue.put(res)

        async def run_all():
            async with httpx.AsyncClient(limits=limits, verify=False) as client:
                tasks = [asyncio.create_task(worker(client, site)) for site in sites]
                await asyncio.gather(*tasks, return_exceptions=True)
            await result_queue.put(None)

        task_runner = asyncio.create_task(run_all())

        try:
            while True:
                item = await result_queue.get()
                if item is None:
                    break
                yield item
        finally:
            if not task_runner.done():
                task_runner.cancel()
