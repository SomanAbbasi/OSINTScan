import asyncio
import re
import sys
import time
from typing import Any, AsyncIterator, Dict, List, Optional
import httpx
import phonenumbers
from phonenumbers import geocoder, carrier, timezone

from backend.app.config import get_settings
from backend.app.plugins.base import BaseOSINTPlugin
from backend.app.schemas.scan import OSINTModuleResult

settings = get_settings()

NUMBER_TYPE_LABELS = {
    0: "Fixed Line",
    1: "Mobile",
    2: "Fixed Line / Mobile",
    3: "Toll Free",
    4: "Premium Rate",
    5: "Shared Cost",
    6: "VoIP",
    7: "Personal Number",
    8: "Pager",
    9: "UAN",
    10: "Voicemail",
    -1: "Unknown",
}


class IgnorantPlugin(BaseOSINTPlugin):
    id = "ignorant"
    name = "Ignorant"
    version = "1.2.0"
    description = "Phone number registration intelligence on Snapchat, Instagram, Amazon, WhatsApp, and more (E.164)."
    icon = "phone-call"
    supported_input_types = ["phone"]

    def __init__(self):
        self._functions = None

    def _ensure_functions_loaded(self):
        if self._functions is not None:
            return self._functions

        ignorant_dir = str(settings.IGNORANT_DIR)
        if ignorant_dir not in sys.path:
            sys.path.insert(0, ignorant_dir)

        try:
            from ignorant.core import import_submodules, get_functions
            modules = import_submodules("ignorant.modules")
            self._functions = get_functions(modules)
        except Exception as e:
            import logging
            logging.getLogger(__name__).error(f"Failed to load Ignorant modules: {e}")
            self._functions = []
        return self._functions

    def _parse_phone(self, phone_raw: str):
        cleaned = phone_raw.strip()
        if not cleaned.startswith("+"):
            cleaned = f"+{cleaned}"
        try:
            parsed = phonenumbers.parse(cleaned, None)
            is_valid = phonenumbers.is_valid_number(parsed)
            country_code = str(parsed.country_code)
            national_number = str(parsed.national_number)
            formatted_e164 = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
            formatted_intl = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.INTERNATIONAL)
            formatted_nat = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.NATIONAL)
            region = geocoder.description_for_number(parsed, "en") or "Unknown"
            carrier_name = carrier.name_for_number(parsed, "en") or "Unknown"
            tz_list = list(timezone.time_zones_for_number(parsed) or [])
            tz_str = ", ".join(tz_list) if tz_list else "Unknown"
            num_type_val = phonenumbers.number_type(parsed)
            line_type = NUMBER_TYPE_LABELS.get(num_type_val, "Mobile / Telecom")
            return country_code, national_number, formatted_e164, formatted_intl, formatted_nat, region, carrier_name, tz_str, line_type, is_valid
        except Exception:
            # Fallback simple regex
            match = re.match(r"^\+(\d{1,3})(\d{6,14})$", cleaned)
            if match:
                return match.group(1), match.group(2), cleaned, cleaned, cleaned, "Unknown", "Unknown", "Unknown", "Mobile", True
            return "1", cleaned.lstrip("+"), cleaned, cleaned, cleaned, "Unknown", "Unknown", "Unknown", "Mobile", False

    async def execute(
        self,
        target: str,
        input_type: str,
        options: Optional[Dict[str, Any]] = None,
    ) -> AsyncIterator[OSINTModuleResult]:
        country_code, phone_number, e164, intl, nat, region, carrier_name, tz_str, line_type, is_valid = self._parse_phone(target)
        clean_digits = e164.lstrip("+")

        # 1. Yield Carrier & Telephony Profile
        yield OSINTModuleResult(
            sourceName=self.name,
            category="phone",
            target=e164,
            status="found" if is_valid else "not_found",
            platformName="Telecom & Carrier Intelligence",
            profileUrl=None,
            metadata={
                "e164": e164,
                "internationalFormat": intl,
                "nationalFormat": nat,
                "countryCode": f"+{country_code}",
                "nationalNumber": phone_number,
                "region": region,
                "carrier": carrier_name,
                "lineType": line_type,
                "timezone": tz_str,
                "isValid": is_valid,
                "confidence": "high",
            },
        )

        # 2. WhatsApp Direct Chat & Presence (Direct Chat Link)
        wa_url = f"https://wa.me/{clean_digits}"
        yield OSINTModuleResult(
            sourceName=self.name,
            category="phone",
            target=e164,
            status="info",
            platformName="WhatsApp Messenger",
            profileUrl=wa_url,
            metadata={
                "domain": "whatsapp.com",
                "directChatUrl": wa_url,
                "apiEndpoint": f"https://api.whatsapp.com/send?phone={clean_digits}",
                "confidence": "high",
            },
        )

        # 3. Telegram Messenger (Direct Chat Link)
        tg_url = f"https://t.me/+{clean_digits}"
        yield OSINTModuleResult(
            sourceName=self.name,
            category="phone",
            target=e164,
            status="info",
            platformName="Telegram",
            profileUrl=tg_url,
            metadata={
                "domain": "telegram.org",
                "directUrl": tg_url,
                "confidence": "high",
            },
        )

        # 4. Viber Messenger (Direct Link)
        viber_url = "https://chats.viber.com"
        yield OSINTModuleResult(
            sourceName=self.name,
            category="phone",
            target=e164,
            status="info",
            platformName="Viber",
            profileUrl=viber_url,
            metadata={
                "domain": "viber.com",
                "deepLink": f"viber://chat?number={clean_digits}",
                "confidence": "medium",
            },
        )

        # 5. Truecaller Directory Lookup
        tc_url = f"https://www.truecaller.com/search/{country_code}/{phone_number}"
        yield OSINTModuleResult(
            sourceName=self.name,
            category="phone",
            target=e164,
            status="info",
            platformName="Truecaller Directory",
            profileUrl=tc_url,
            metadata={
                "domain": "truecaller.com",
                "searchUrl": tc_url,
                "confidence": "high",
            },
        )

        # 6. Run Ignorant submodules (Instagram, Snapchat, Amazon)
        funcs = self._ensure_functions_loaded()
        if not funcs:
            return

        semaphore = asyncio.Semaphore(5)
        queue: asyncio.Queue[Optional[OSINTModuleResult]] = asyncio.Queue()

        async def worker(client: httpx.AsyncClient, func):
            start_time = time.monotonic()
            out_list: List[Dict[str, Any]] = []
            func_name = getattr(func, "__name__", "unknown")
            async with semaphore:
                try:
                    await func(phone_number, country_code, client, out_list)
                except Exception as e:
                    out_list.append({
                        "name": func_name,
                        "domain": f"{func_name}.com",
                        "rateLimit": False,
                        "error": True,
                        "exists": False,
                        "others": {"error": str(e)},
                    })

            duration_ms = int((time.monotonic() - start_time) * 1000)

            for item in out_list:
                name = item.get("name", func_name)
                domain = item.get("domain", f"{name}.com")
                exists = bool(item.get("exists", False))
                rate_limit = bool(item.get("rateLimit", False))
                is_error = bool(item.get("error", False))

                if exists:
                    status_str = "found"
                elif rate_limit:
                    status_str = "rate_limited"
                elif is_error:
                    status_str = "error"
                else:
                    status_str = "not_found"

                profile_url = f"https://{domain}" if domain else None

                metadata = {
                    "site": name,
                    "domain": domain,
                    "exists": exists,
                    "rate_limited": rate_limit,
                    "method": item.get("method", "phone_lookup"),
                    "countryCode": f"+{country_code}",
                    "nationalNumber": phone_number,
                    "durationMs": duration_ms,
                    "region": region,
                    "carrier": carrier_name,
                }

                res = OSINTModuleResult(
                    sourceName=self.name,
                    category="phone",
                    target=e164,
                    status=status_str,
                    platformName=domain,
                    profileUrl=profile_url,
                    metadata=metadata,
                )
                await queue.put(res)

        async def run_all():
            limits = httpx.Limits(max_keepalive_connections=10, max_connections=20)
            async with httpx.AsyncClient(limits=limits, timeout=12.0, verify=False) as client:
                tasks = [asyncio.create_task(worker(client, fn)) for fn in funcs]
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
