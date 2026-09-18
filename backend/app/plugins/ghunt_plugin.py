import asyncio
import re
import sys
import time
from typing import Any, AsyncIterator, Dict, List, Optional
import httpx

from backend.app.config import get_settings
from backend.app.plugins.base import BaseOSINTPlugin
from backend.app.schemas.scan import OSINTModuleResult

settings = get_settings()


class GHuntPlugin(BaseOSINTPlugin):
    id = "ghunt"
    name = "GHunt"
    version = "2.3.4"
    description = "Google Account footprinting: GAIA ID, Google Maps reviews, profile photo, and active Google services."
    icon = "chrome"
    supported_input_types = ["email"]

    def _ensure_ghunt_imported(self):
        ghunt_dir = str(settings.GHUNT_DIR)
        if ghunt_dir not in sys.path:
            sys.path.insert(0, ghunt_dir)

    async def execute(
        self,
        target: str,
        input_type: str,
        options: Optional[Dict[str, Any]] = None,
    ) -> AsyncIterator[OSINTModuleResult]:
        clean_email = target.lower().strip()
        domain = clean_email.split("@")[-1] if "@" in clean_email else ""
        is_gmail = domain in ("gmail.com", "googlemail.com")

        start_time = time.monotonic()

        # Check authenticated mode
        has_auth = bool(settings.GHUNT_MASTER_TOKEN or settings.GHUNT_CREDS)

        gaia_id: Optional[str] = None
        avatar_url: Optional[str] = None
        custom_picture = False
        services: List[str] = []
        is_workspace = False
        account_found = False

        if has_auth:
            try:
                self._ensure_ghunt_imported()
                from ghunt.apis.peoplepa import PeoplePaHttp
                from ghunt.helpers import auth
                from ghunt.objects.base import GHuntCreds

                async with httpx.AsyncClient(verify=False) as client:
                    ghunt_creds = await auth.load_and_auth(client)
                    people_pa = PeoplePaHttp(ghunt_creds)
                    is_found, target_obj = await people_pa.people_lookup(client, clean_email, params_template="max_details")
                    if is_found and target_obj:
                        account_found = True
                        gaia_id = target_obj.personId
                        container = "PROFILE"
                        if container in target_obj.profilePhotos:
                            photo = target_obj.profilePhotos[container]
                            if not photo.isDefault:
                                avatar_url = photo.url
                                custom_picture = True
                        services = ["Gmail", "Google Profile", "Google Drive", "Google Chat", "Google Maps"]
            except Exception:
                has_auth = False  # Fall back to public footprinting

        if not account_found:
            # Public Google Footprint Discovery Mode
            async with httpx.AsyncClient(timeout=10.0, verify=False) as client:
                # 1. Check Google Workspace / MX lookup
                try:
                    import dns.resolver
                    mx_records = dns.resolver.resolve(domain, "MX")
                    for rdata in mx_records:
                        if "google.com" in str(rdata.exchange).lower() or "googlemail.com" in str(rdata.exchange).lower():
                            is_workspace = True
                            services.append("Google Workspace (Enterprise Mail)")
                            break
                except Exception:
                    if is_gmail:
                        services.append("Gmail (Consumer Google Account)")

                # 2. Public profile avatar probe
                try:
                    avatar_url = f"https://www.google.com/s2/photos/public/{clean_email}"
                    probe_resp = await client.get(avatar_url, follow_redirects=True)
                    # Check if response returned a real custom photo instead of default placeholder
                    url_str = str(probe_resp.url).lower()
                    if (
                        probe_resp.status_code == 200
                        and "default-user" not in url_str
                        and "default" not in url_str
                        and "image" in probe_resp.headers.get("content-type", "")
                        and len(probe_resp.content) > 1200
                    ):
                        account_found = True
                        custom_picture = True
                except Exception:
                    pass

                # 3. Identify possible services without falsely claiming account existence
                if is_gmail:
                    services.append("Gmail Domain")
                elif is_workspace:
                    services.append("Google Workspace Domain")

        duration_ms = int((time.monotonic() - start_time) * 1000)

        maps_url = f"https://www.google.com/maps/contrib/{gaia_id}/reviews" if gaia_id else None

        metadata = {
            "isGmail": is_gmail,
            "isGoogleWorkspace": is_workspace,
            "gaiaId": gaia_id or "Public Footprint",
            "avatarUrl": avatar_url,
            "hasCustomAvatar": custom_picture,
            "googleMapsUrl": maps_url,
            "activeServices": services,
            "operatingMode": "Authenticated PeoplePA" if has_auth else "Public Footprint Discovery",
            "durationMs": duration_ms,
        }

        # Yield Primary Google Account Footprint
        yield OSINTModuleResult(
            sourceName=self.name,
            category="email",
            target=clean_email,
            status="found" if account_found else "not_found",
            platformName="Google Account Footprint",
            profileUrl=maps_url or avatar_url or f"https://contacts.google.com",
            metadata=metadata,
        )

        # If GAIA ID exists or account is confirmed, yield Google Maps specific footprint
        if gaia_id or account_found:
            yield OSINTModuleResult(
                sourceName=self.name,
                category="email",
                target=clean_email,
                status="found" if account_found else "not_found",
                platformName="Google Maps Reviews & Local Contributions",
                profileUrl=maps_url or "https://www.google.com/maps",
                metadata={
                    "gaiaId": gaia_id,
                    "contributionsUrl": maps_url,
                    "reviewCheck": "Available via GAIA ID" if gaia_id else "Requires GAIA ID",
                    "durationMs": duration_ms,
                },
            )
