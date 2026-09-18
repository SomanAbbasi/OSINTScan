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


class MaigretPlugin(BaseOSINTPlugin):
    id = "maigret"
    name = "Maigret"
    version = "1.0.0"
    description = "Collect a dossier on a person by username from a massive database of 3,000+ sites."
    icon = "user-check"
    supported_input_types = ["username"]

    def __init__(self):
        self._ranked_sites_cache: Optional[List[tuple]] = None

    def _load_sites(self, category_filter: Optional[List[str]] = None, limit: int = 250) -> List[tuple]:
        data_file = settings.MAIGRET_DATA_FILE
        if not data_file.exists():
            return []

        if self._ranked_sites_cache is None:
            try:
                with open(data_file, "r", encoding="utf-8") as f:
                    raw = json.load(f)
                sites_dict = raw.get("sites", {})
                
                # Sort sites by alexaRank (ranked first in ascending order, then unranked)
                sorted_sites = sorted(
                    sites_dict.items(),
                    key=lambda item: item[1].get("alexaRank", 9999999)
                )
                self._ranked_sites_cache = sorted_sites
            except Exception:
                return []

        candidates = self._ranked_sites_cache
        if category_filter:
            # Match any tag
            cat_lower = [c.lower() for c in category_filter]
            candidates = [
                (name, data) for name, data in candidates
                if any(t.lower() in cat_lower for t in data.get("tags", []))
            ]

        return candidates[:limit]

    async def execute(
        self,
        target: str,
        input_type: str,
        options: Optional[Dict[str, Any]] = None,
    ) -> AsyncIterator[OSINTModuleResult]:
        categories = options.get("categories") if options else None
        limit = options.get("limit", 250) if options else 250
        sites = self._load_sites(categories, limit=limit)
        if not sites:
            return

        semaphore = asyncio.Semaphore(settings.SCAN_MAX_CONCURRENCY)
        limits = httpx.Limits(max_keepalive_connections=20, max_connections=50)
        result_queue: asyncio.Queue[Optional[OSINTModuleResult]] = asyncio.Queue()

        async def worker(client: httpx.AsyncClient, site_name: str, site_data: dict):
            regex_pattern = site_data.get("regexCheck")
            if regex_pattern:
                try:
                    if not re.search(regex_pattern, target):
                        return
                except Exception:
                    pass

            url_template = site_data.get("url", "")
            if not url_template:
                return

            probe_url = site_data.get("urlProbe", url_template)
            probe_url = probe_url.replace("{username}", target)
            profile_url = url_template.replace("{username}", target)

            check_type = site_data.get("checkType", "message")
            presence_strs = site_data.get("presenseStrs", [])
            absence_strs = site_data.get("absenceStrs", [])

            headers = {
                "User-Agent": settings.USER_AGENT,
                "Accept-Language": "en-US,en;q=0.9",
            }
            if site_data.get("headers"):
                headers.update(site_data["headers"])

            start_time = time.monotonic()
            follow_redirects = check_type != "response_url"

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

                    # WAF detection
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
                                "reason": "Cloudflare / Anti-Bot protection triggered.",
                                "durationMs": duration_ms,
                            },
                        )
                        await result_queue.put(res)
                        return

                    is_found = False

                    if check_type == "message":
                        is_absence = any(s in body_text for s in absence_strs) if absence_strs else False
                        is_presence = any(s in body_text for s in presence_strs) if presence_strs else True
                        if not is_absence and is_presence and status_code < 400:
                            is_found = True
                    elif check_type == "status_code":
                        if 200 <= status_code < 300:
                            is_found = True
                    elif check_type == "response_url":
                        is_presence = any(s in body_text for s in presence_strs) if presence_strs else True
                        if 200 <= status_code < 300 and is_presence:
                            is_found = True

                    final_status = "found" if is_found else "not_found"

                    tags = site_data.get("tags", [])
                    primary_category = tags[0] if tags else "social"

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
                            "tags": tags,
                            "alexaRank": site_data.get("alexaRank"),
                            "category": primary_category,
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
                    for s_name, s_data in sites
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
