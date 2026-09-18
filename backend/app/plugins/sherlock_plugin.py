import asyncio
import json
import re
import time
from typing import Any, AsyncIterator, Dict, List, Optional
import httpx

from backend.app.config import get_settings
from backend.app.plugins.base import BaseOSINTPlugin
from backend.app.schemas.scan import OSINTModuleResult

settings = get_settings()

WAF_PATTERNS = [
    ".loading-spinner{visibility:hidden}",
    '<span id="challenge-error-text">',
    "AwsWafIntegration.forceRefreshToken",
    "perimeterxIdentifiers",
    "cf-browser-verification",
    "Cloudflare Ray ID",
]


class SherlockPlugin(BaseOSINTPlugin):
    id = "sherlock"
    name = "Sherlock"
    version = "1.0.0"
    description = "Hunt down social media accounts by username across 400+ public platforms."
    icon = "search"
    supported_input_types = ["username"]

    def __init__(self):
        self._sites_cache: Optional[Dict[str, Any]] = None

    def _load_sites(self) -> Dict[str, Any]:
        if self._sites_cache is not None:
            return self._sites_cache

        data_file = settings.SHERLOCK_DATA_FILE
        if not data_file.exists():
            return {}

        try:
            with open(data_file, "r", encoding="utf-8") as f:
                raw = json.load(f)
            # Exclude schema definition
            sites = {k: v for k, v in raw.items() if k != "$schema" and isinstance(v, dict)}
            self._sites_cache = sites
            return sites
        except Exception:
            return {}

    async def execute(
        self,
        target: str,
        input_type: str,
        options: Optional[Dict[str, Any]] = None,
    ) -> AsyncIterator[OSINTModuleResult]:
        sites = self._load_sites()
        if not sites:
            return

        semaphore = asyncio.Semaphore(settings.SCAN_MAX_CONCURRENCY)
        limits = httpx.Limits(max_keepalive_connections=20, max_connections=50)
        result_queue: asyncio.Queue[Optional[OSINTModuleResult]] = asyncio.Queue()

        async def worker(client: httpx.AsyncClient, site_name: str, site_data: dict):
            # Check regex if specified
            regex_pattern = site_data.get("regexCheck")
            if regex_pattern:
                try:
                    if not re.search(regex_pattern, target):
                        # Username doesn't match site format requirement
                        return
                except Exception:
                    pass

            url_template = site_data.get("url", "")
            if not url_template:
                return

            probe_url = site_data.get("urlProbe", url_template)
            probe_url = probe_url.replace("{}", target)
            profile_url = url_template.replace("{}", target)

            error_type = site_data.get("errorType", "status_code")
            if isinstance(error_type, str):
                error_types = [error_type]
            else:
                error_types = list(error_type)

            error_msgs = site_data.get("errorMsg", [])
            if isinstance(error_msgs, str):
                error_msgs = [error_msgs]

            error_codes = site_data.get("errorCode", [])
            if isinstance(error_codes, int):
                error_codes = [error_codes]

            headers = {
                "User-Agent": settings.USER_AGENT,
                "Accept-Language": "en-US,en;q=0.9",
            }
            if site_data.get("headers"):
                headers.update(site_data["headers"])

            start_time = time.monotonic()
            follow_redirects = "response_url" not in error_types

            async with semaphore:
                try:
                    resp = await client.get(
                        probe_url,
                        headers=headers,
                        timeout=settings.SCAN_SITE_TIMEOUT_SECONDS,
                        follow_redirects=follow_redirects,
                    )
                    duration_ms = int((time.monotonic() - start_time) * 1000)
                    body_text = resp.text
                    status_code = resp.status_code

                    # Check WAF
                    if any(w in body_text for w in WAF_PATTERNS) or status_code == 429:
                        res = OSINTModuleResult(
                            sourceName=self.name,
                            category="username",
                            target=target,
                            status="rate_limited",
                            platformName=site_name,
                            profileUrl=None,
                            metadata={
                                "site": site_name,
                                "urlMain": site_data.get("urlMain"),
                                "reason": "Cloudflare / Anti-Bot challenge encountered.",
                                "durationMs": duration_ms,
                            },
                        )
                        await result_queue.put(res)
                        return

                    # Evaluate status based on errorType
                    is_claimed = False
                    is_available = False

                    if "message" in error_types:
                        # If any error message is found in the response body, username is available (not found)
                        if any(msg in body_text for msg in error_msgs):
                            is_available = True
                        else:
                            is_claimed = True

                    if "status_code" in error_types and not is_available:
                        if error_codes and status_code in error_codes:
                            is_available = True
                        elif status_code >= 300 or status_code < 200:
                            is_available = True
                        else:
                            is_claimed = True

                    if "response_url" in error_types and not is_available:
                        if 200 <= status_code < 300:
                            is_claimed = True
                        else:
                            is_available = True

                    final_status = "found" if is_claimed and not is_available else "not_found"

                    res = OSINTModuleResult(
                        sourceName=self.name,
                        category="username",
                        target=target,
                        status=final_status,
                        platformName=site_name,
                        profileUrl=profile_url if final_status == "found" else None,
                        metadata={
                            "site": site_name,
                            "urlMain": site_data.get("urlMain"),
                            "statusCode": status_code,
                            "durationMs": duration_ms,
                            "isNSFW": site_data.get("isNSFW", False),
                            "confidence": "high" if final_status == "found" else "medium",
                        },
                    )
                    await result_queue.put(res)

                except httpx.TimeoutException:
                    res = OSINTModuleResult(
                        sourceName=self.name,
                        category="username",
                        target=target,
                        status="error",
                        platformName=site_name,
                        profileUrl=None,
                        metadata={"error": "Request timed out", "durationMs": int((time.monotonic() - start_time) * 1000)},
                    )
                    await result_queue.put(res)
                except Exception as e:
                    res = OSINTModuleResult(
                        sourceName=self.name,
                        category="username",
                        target=target,
                        status="error",
                        platformName=site_name,
                        profileUrl=None,
                        metadata={"error": str(e), "durationMs": int((time.monotonic() - start_time) * 1000)},
                    )
                    await result_queue.put(res)

        async def run_all():
            async with httpx.AsyncClient(limits=limits, verify=False) as client:
                tasks = [
                    asyncio.create_task(worker(client, s_name, s_data))
                    for s_name, s_data in sites.items()
                ]
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
