import asyncio
import json
import re
import time
from typing import Any, AsyncIterator, Dict, List, Optional
import httpx

from backend.app.config import get_settings
from backend.app.core.classifier import UNIVERSAL_NOT_FOUND_PATTERNS
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

                    # Check WAF headers & challenge actions
                    waf_header = resp.headers.get("x-amzn-waf-action") or resp.headers.get("cf-mitigated")
                    if waf_header or status_code in (202, 429) or any(w in body_text for w in WAF_PATTERNS):
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
                                "reason": f"WAF challenge detected (status {status_code}, header {waf_header}).",
                                "durationMs": duration_ms,
                            },
                        )
                        await result_queue.put(res)
                        return

                    # 1. Anti-bot and access restriction statuses
                    if status_code in (401, 403, 503):
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
                                "statusCode": status_code,
                                "reason": f"HTTP {status_code} Access Denied / Protected.",
                                "durationMs": duration_ms,
                            },
                        )
                        await result_queue.put(res)
                        return

                    # 2. Standard 404 / 410 -> Not found immediately
                    if status_code in (404, 410):
                        res = OSINTModuleResult(
                            sourceName=self.name,
                            category="username",
                            target=target,
                            status="not_found",
                            platformName=site_name,
                            profileUrl=None,
                            metadata={
                                "site": site_name,
                                "urlMain": site_data.get("urlMain"),
                                "statusCode": status_code,
                                "durationMs": duration_ms,
                            },
                        )
                        await result_queue.put(res)
                        return

                    # 3. Redirect validation: if redirected away from profile path to root/login/search
                    if resp.history:
                        final_path = resp.url.path.rstrip("/")
                        if final_path in ("", "/login", "/signin", "/signup", "/register", "/home", "/explore", "/404", "/error", "/search"):
                            res = OSINTModuleResult(
                                sourceName=self.name,
                                category="username",
                                target=target,
                                status="not_found",
                                platformName=site_name,
                                profileUrl=None,
                                metadata={
                                    "site": site_name,
                                    "urlMain": site_data.get("urlMain"),
                                    "reason": f"Redirected to non-profile path {resp.url.path}",
                                    "durationMs": duration_ms,
                                },
                            )
                            await result_queue.put(res)
                            return

                    # 4. Title tag check & soft-404 verification
                    body_lower = body_text.lower()
                    title_match = re.search(r"<title>(.*?)</title>", body_lower)
                    if title_match:
                        page_title = title_match.group(1).strip()
                        if any(term in page_title for term in [
                            "not found", "page not found", "404", "error 404",
                            "user not found", "profile not found", "oops!",
                            "does not exist", "doesn't exist", "cannot be found",
                            "could not be found", "unregistered"
                        ]):
                            res = OSINTModuleResult(
                                sourceName=self.name,
                                category="username",
                                target=target,
                                status="not_found",
                                platformName=site_name,
                                profileUrl=None,
                                metadata={
                                    "site": site_name,
                                    "urlMain": site_data.get("urlMain"),
                                    "reason": f"Title matched not-found indicator: '{page_title}'",
                                    "durationMs": duration_ms,
                                },
                            )
                            await result_queue.put(res)
                            return

                    # Reject empty or stub responses (<15 bytes) that are not JSON
                    is_json = body_text.strip().startswith("{") or body_text.strip().startswith("[")
                    if not is_json and len(body_text.strip()) < 15:
                        res = OSINTModuleResult(
                            sourceName=self.name,
                            category="username",
                            target=target,
                            status="not_found",
                            platformName=site_name,
                            profileUrl=None,
                            metadata={
                                "site": site_name,
                                "urlMain": site_data.get("urlMain"),
                                "reason": f"Empty or stub response ({len(body_text.strip())} bytes).",
                                "durationMs": duration_ms,
                            },
                        )
                        await result_queue.put(res)
                        return

                    if any(p in body_lower for p in UNIVERSAL_NOT_FOUND_PATTERNS):
                        res = OSINTModuleResult(
                            sourceName=self.name,
                            category="username",
                            target=target,
                            status="not_found",
                            platformName=site_name,
                            profileUrl=None,
                            metadata={
                                "site": site_name,
                                "urlMain": site_data.get("urlMain"),
                                "reason": "Universal soft-404 signature detected in body.",
                                "durationMs": duration_ms,
                            },
                        )
                        await result_queue.put(res)
                        return

                    # 5. Evaluate status based on errorType only if 200 <= status_code < 300 and not 202
                    is_claimed = False
                    is_available = False

                    if 200 <= status_code < 300 and status_code != 202:
                        if "message" in error_types:
                            if any(msg in body_text for msg in error_msgs):
                                is_available = True
                            else:
                                is_claimed = True

                        if "status_code" in error_types and not is_available:
                            if error_codes and status_code in error_codes:
                                is_available = True
                            else:
                                is_claimed = True

                        if "response_url" in error_types and not is_available:
                            error_url = site_data.get("errorUrl")
                            if error_url and error_url in str(resp.url):
                                is_available = True
                            else:
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
