import asyncio
import hashlib
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


class BlackbirdPlugin(BaseOSINTPlugin):
    id = "blackbird"
    name = "Blackbird"
    version = "1.0.0"
    description = "Social network identity search with metadata extraction & username cross-validation."
    icon = "network"
    supported_input_types = ["username", "email"]

    def _load_email_sites(self) -> List[Dict[str, Any]]:
        email_data_file = settings.BLACKBIRD_DIR / "data" / "email-data.json"
        if not email_data_file.exists():
            return []
        try:
            with open(email_data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            return data.get("sites", [])
        except Exception:
            return []

    def _load_wmn_metadata(self) -> Dict[str, Any]:
        meta_file = settings.BLACKBIRD_DIR / "data" / "wmn-metadata.json"
        if not meta_file.exists():
            return {}
        try:
            with open(meta_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            return data.get("sites", {})
        except Exception:
            return {}

    def _extract_json_path(self, data: Any, path: List[Any]) -> Any:
        try:
            curr = data
            for key in path:
                curr = curr[key]
            return curr
        except Exception:
            return None

    def _extract_metadata_from_response(self, site_name: str, meta_rules: Dict[str, Any], body: str, is_json: bool, json_data: Any) -> Dict[str, Any]:
        extracted: Dict[str, Any] = {}
        rules = meta_rules.get(site_name, [])
        for rule in rules:
            rule_schema = rule.get("schema", "JSON")
            rule_name = rule.get("name", "Field")
            path = rule.get("path", [])

            if rule_schema == "JSON" and is_json and json_data is not None:
                val = self._extract_json_path(json_data, path)
                if val is not None:
                    if rule_name == "Avatar":
                        extracted["avatarUrl"] = val
                    elif rule_name == "Name":
                        extracted["displayName"] = val
                    elif rule_name == "Location":
                        extracted["location"] = val
                    else:
                        extracted[rule_name.lower()] = val
            elif rule_schema == "HTML":
                pattern = rule.get("pattern", "")
                if pattern:
                    match = re.search(pattern, body)
                    if match:
                        extracted[rule_name.lower()] = match.group(1).strip()
        return extracted

    async def execute(
        self,
        target: str,
        input_type: str,
        options: Optional[Dict[str, Any]] = None,
    ) -> AsyncIterator[OSINTModuleResult]:
        if input_type == "email":
            async for res in self._execute_email(target):
                yield res
        else:
            async for res in self._execute_username(target):
                yield res

    async def _execute_email(self, email: str) -> AsyncIterator[OSINTModuleResult]:
        sites = self._load_email_sites()
        if not sites:
            # Fallback built-in email identity checks if json file not found
            sites = [
                {
                    "name": "Gravatar",
                    "uri_check": "https://gravatar.com/{account}.json",
                    "e_code": 200,
                    "e_string": "displayName",
                    "m_code": 404,
                    "input_operation": "hash-sha256",
                    "cat": "images",
                },
                {
                    "name": "GitHub (Email Search)",
                    "uri_check": "https://api.github.com/search/users?q={account}+in:email",
                    "e_code": 200,
                    "e_string": "\"total_count\": 1",
                    "m_code": 200,
                    "m_string": "\"total_count\": 0",
                    "cat": "coding",
                },
            ]

        semaphore = asyncio.Semaphore(15)
        queue: asyncio.Queue[Optional[OSINTModuleResult]] = asyncio.Queue()

        clean_email = email.lower().strip()
        sha256_hash = hashlib.sha256(clean_email.encode("utf-8")).hexdigest()
        md5_hash = hashlib.md5(clean_email.encode("utf-8")).hexdigest()

        async def check_site(client: httpx.AsyncClient, site: Dict[str, Any]):
            site_name = site.get("name", "Unknown")
            operation = site.get("input_operation")
            if operation == "hash-sha256":
                account_val = sha256_hash
            elif operation == "hash-md5":
                account_val = md5_hash
            else:
                account_val = clean_email

            uri_check = site.get("uri_check", "").replace("{account}", account_val)
            if not uri_check.startswith("http"):
                return

            e_code = site.get("e_code", 200)
            e_string = site.get("e_string")
            m_code = site.get("m_code", 404)
            m_string = site.get("m_string")

            start_time = time.monotonic()
            async with semaphore:
                try:
                    headers = {"User-Agent": settings.USER_AGENT}
                    resp = await client.get(uri_check, headers=headers, timeout=settings.SCAN_SITE_TIMEOUT_SECONDS, follow_redirects=True)
                    duration_ms = int((time.monotonic() - start_time) * 1000)

                    body = resp.text
                    is_found = False
                    if resp.status_code == e_code and resp.status_code < 400:
                        if not e_string or (e_string in body):
                            if not m_string or (m_string not in body):
                                if not any(p in body.lower() for p in UNIVERSAL_NOT_FOUND_PATTERNS):
                                    is_found = True

                    metadata: Dict[str, Any] = {
                        "category": site.get("cat", "social"),
                        "durationMs": duration_ms,
                    }

                    # Extract avatar or profile info if JSON
                    profile_url = uri_check
                    try:
                        json_body = resp.json()
                        if "Gravatar" in site_name and isinstance(json_body, dict):
                            entries = json_body.get("entry", [])
                            if entries and isinstance(entries[0], dict):
                                entry = entries[0]
                                metadata["avatarUrl"] = entry.get("thumbnailUrl")
                                metadata["displayName"] = entry.get("displayName")
                                profile_url = entry.get("profileUrl") or f"https://gravatar.com/{entry.get('preferredUsername', account_val)}"
                    except Exception:
                        pass

                    status_str = "found" if is_found else ("not_found" if resp.status_code in (m_code, 404) else "error")
                    res = OSINTModuleResult(
                        sourceName=self.name,
                        category="email",
                        target=email,
                        status=status_str,
                        platformName=site_name,
                        profileUrl=profile_url if is_found else None,
                        metadata=metadata,
                    )
                    await queue.put(res)
                except Exception as e:
                    res = OSINTModuleResult(
                        sourceName=self.name,
                        category="email",
                        target=email,
                        status="error",
                        platformName=site_name,
                        profileUrl=None,
                        metadata={"error": str(e)},
                    )
                    await queue.put(res)

        async def run_all():
            async with httpx.AsyncClient(verify=False) as client:
                tasks = [asyncio.create_task(check_site(client, site)) for site in sites]
                await asyncio.gather(*tasks, return_exceptions=True)
            await queue.put(None)

        task_runner = asyncio.create_task(run_all())
        try:
            while True:
                item = await queue.get()
                if item is None:
                    break
                yield item
        finally:
            if not task_runner.done():
                task_runner.cancel()

    async def _execute_username(self, username: str) -> AsyncIterator[OSINTModuleResult]:
        """
        Cross-validates username against premier social networks with Blackbird's
        metadata extraction (avatars, bio, display name).
        """
        wmn_metadata = self._load_wmn_metadata()
        
        # Premier high-signal cross-validation platforms
        targets = [
            {"name": "GitHub", "url": f"https://api.github.com/users/{username}", "is_json": True, "check_field": "login"},
            {"name": "TikTok", "url": f"https://www.tiktok.com/oembed?url=https://www.tiktok.com/@{username}", "is_json": True, "check_field": "author_name"},
            {"name": "Gravatar", "url": f"https://gravatar.com/{username}.json", "is_json": True, "check_field": "entry"},
            {"name": "Duolingo", "url": f"https://www.duolingo.com/2017-06-30/users?username={username}", "is_json": True, "check_field": "users"},
            {"name": "SoundCloud", "url": f"https://soundcloud.com/{username}", "is_json": False, "e_code": 200, "m_string": "We can’t find that user"},
            {"name": "DockerHub", "url": f"https://hub.docker.com/v2/users/{username}/", "is_json": True, "check_field": "username"},
            {"name": "Pastebin", "url": f"https://pastebin.com/u/{username}", "is_json": False, "e_code": 200, "m_string": "Not Found"},
            {"name": "Pinterest", "url": f"https://www.pinterest.com/{username}/", "is_json": False, "e_code": 200, "m_string": "User not found"},
        ]

        semaphore = asyncio.Semaphore(10)
        queue: asyncio.Queue[Optional[OSINTModuleResult]] = asyncio.Queue()

        async def check_target(client: httpx.AsyncClient, target_info: Dict[str, Any]):
            site_name = target_info["name"]
            url = target_info["url"]
            is_json = target_info.get("is_json", False)

            start_time = time.monotonic()
            async with semaphore:
                try:
                    headers = {"User-Agent": settings.USER_AGENT}
                    resp = await client.get(url, headers=headers, timeout=settings.SCAN_SITE_TIMEOUT_SECONDS, follow_redirects=True)
                    duration_ms = int((time.monotonic() - start_time) * 1000)

                    body = resp.text
                    is_found = False
                    json_data = None

                    # 1. Anti-bot or access denied statuses can never be found
                    if resp.status_code in (401, 403, 503):
                        is_found = False
                    elif resp.status_code in (404, 410):
                        is_found = False
                    elif resp.history and resp.url.path.rstrip("/") in ("", "/login", "/signin", "/signup", "/register", "/home", "/explore", "/404", "/error", "/search"):
                        is_found = False
                    elif not is_json and any(p in body.lower() for p in UNIVERSAL_NOT_FOUND_PATTERNS):
                        is_found = False
                    elif is_json:
                        if resp.status_code == 200:
                            try:
                                json_data = resp.json()
                                check_field = target_info.get("check_field")
                                if check_field:
                                    val = json_data.get(check_field)
                                    if val and (not isinstance(val, list) or len(val) > 0):
                                        is_found = True
                                else:
                                    is_found = True
                            except Exception:
                                pass
                    else:
                        if resp.status_code == target_info.get("e_code", 200):
                            m_string = target_info.get("m_string")
                            if not m_string or (m_string not in body):
                                is_found = True

                    metadata: Dict[str, Any] = {
                        "crossValidation": True,
                        "durationMs": duration_ms,
                    }

                    # Extract metadata (avatar, bio, display name)
                    extracted_meta = self._extract_metadata_from_response(
                        site_name=site_name,
                        meta_rules=wmn_metadata,
                        body=body,
                        is_json=is_json,
                        json_data=json_data,
                    )
                    metadata.update(extracted_meta)

                    # Custom fallbacks for common APIs
                    if is_found and json_data and isinstance(json_data, dict):
                        if site_name == "GitHub":
                            metadata["avatarUrl"] = json_data.get("avatar_url")
                            metadata["displayName"] = json_data.get("name")
                            metadata["bio"] = json_data.get("bio")
                            metadata["publicRepos"] = json_data.get("public_repos")
                        elif site_name == "TikTok":
                            metadata["displayName"] = json_data.get("author_name")

                    profile_url = f"https://github.com/{username}" if site_name == "GitHub" else (
                        f"https://www.tiktok.com/@{username}" if site_name == "TikTok" else url
                    )

                    status_str = "found" if is_found else ("not_found" if resp.status_code in (404, 200) else "error")
                    res = OSINTModuleResult(
                        sourceName=self.name,
                        category="username",
                        target=username,
                        status=status_str,
                        platformName=site_name,
                        profileUrl=profile_url if is_found else None,
                        metadata=metadata,
                    )
                    await queue.put(res)

                except Exception as e:
                    res = OSINTModuleResult(
                        sourceName=self.name,
                        category="username",
                        target=username,
                        status="error",
                        platformName=site_name,
                        profileUrl=None,
                        metadata={"error": str(e)},
                    )
                    await queue.put(res)

        async def run_all():
            async with httpx.AsyncClient(verify=False) as client:
                tasks = [asyncio.create_task(check_target(client, t)) for t in targets]
                await asyncio.gather(*tasks, return_exceptions=True)
            await queue.put(None)

        task_runner = asyncio.create_task(run_all())
        try:
            while True:
                item = await queue.get()
                if item is None:
                    break
                yield item
        finally:
            if not task_runner.done():
                task_runner.cancel()
