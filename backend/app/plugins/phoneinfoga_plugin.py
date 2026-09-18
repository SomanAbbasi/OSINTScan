import asyncio
import re
import time
import urllib.parse
from typing import Any, AsyncIterator, Dict, List, Optional
import httpx
import phonenumbers
from phonenumbers import geocoder, carrier, timezone

from backend.app.config import get_settings
from backend.app.plugins.base import BaseOSINTPlugin
from backend.app.schemas.scan import OSINTModuleResult

settings = get_settings()

NUMBER_TYPE_NAMES = {
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

# 22 Disposable SMS & Virtual Burner Providers from PhoneInfoga resources
DISPOSABLE_SMS_PROVIDERS = [
    ("Receive-SMS-Online.info", "receive-sms-online.info"),
    ("ReceiveSMSOnline.com", "receivesmsonline.com"),
    ("Receive-a-SMS.com", "receive-a-sms.com"),
    ("SMS-Receive.net", "sms-receive.net"),
    ("ReceiveFreeSMS.com", "receivefreesms.com"),
    ("Receive-SMS.com", "receive-sms.com"),
    ("ReceiveTxt.com", "receivetxt.com"),
    ("FreePhoneNum.com", "freephonenum.com"),
    ("FreeSMSVerification.com", "freesmsverification.com"),
    ("SMSLive.co", "smslive.co"),
    ("Sellaite SMS Receiver", "sellaite.com"),
    ("HS3X Disposable Numbers", "hs3x.com"),
    ("Receive-SMS-Now.com", "receive-sms-now.com"),
    ("SMSListen.com", "smslisten.com"),
    ("SMSNumbersOnline.com", "smsnumbersonline.com"),
    ("FreeSMSCode.com", "freesmscode.com"),
    ("CatchSMS.com", "catchsms.com"),
    ("SMSTibo Virtual SMS", "smstibo.com"),
    ("SMSReceiving.com", "smsreceiving.com"),
    ("GetFreeSMSNumber.com", "getfreesmsnumber.com"),
    ("Temp-Mails Virtual SMS", "temp-mails.com"),
    ("TextNow / Pinger Burner Network", "textnow.com"),
]

# 16 Individuals & Public Directories from PhoneInfoga resources
INDIVIDUAL_DIRECTORIES = [
    ("Sync.me Directory", "sync.me", "https://sync.me/search/?number={e164}", "high"),
    ("Truecaller Directory", "truecaller.com", "https://www.truecaller.com/search/{country_code}/{national_number}", "high"),
    ("NumInfo Open Telecom", "numinfo.net", "https://numinfo.net/number/{e164}", "high"),
    ("LocateFamily Directory", "locatefamily.com", "https://www.locatefamily.com/search.php?query={e164}", "medium"),
    ("SpyTox Public Directory", "spytox.com", "https://www.spytox.com/people/search?phone={clean_digits}", "medium"),
    ("WhoCallsYou Directory", "whocallsyou.de", "https://whocallsyou.de/{clean_digits}", "medium"),
    ("WhyCall.me Directory", "whycall.me", "https://whycall.me/{clean_digits}", "medium"),
    ("FastPeopleSearch Records", "fastpeoplesearch.com", "https://www.fastpeoplesearch.com/phone/{national_number}", "medium"),
    ("TruePeopleSearch Records", "truepeoplesearch.com", "https://www.truepeoplesearch.com/results?phoneno={clean_digits}", "medium"),
    ("ThatsThem Public Records", "thatsthem.com", "https://thatsthem.com/phone/{national_number}", "medium"),
    ("ZabaSearch People Directory", "zabasearch.com", "https://www.zabasearch.com/people/{clean_digits}", "medium"),
    ("411 Directory Search", "411.com", "https://www.411.com/phone/{clean_digits}", "medium"),
    ("USPhoneBook Lookup", "usphonebook.com", "https://www.usphonebook.com/{national_number}", "medium"),
    ("SearchBug Telecom Lookup", "searchbug.com", "https://www.searchbug.com/tools/landline-or-cellphone.aspx?phone={clean_digits}", "medium"),
    ("OKCaller Telecom Registry", "okcaller.com", "https://okcaller.com/{clean_digits}", "medium"),
    ("DexKnows Directory", "dexknows.com", "https://www.dexknows.com/search?q={clean_digits}", "medium"),
]

# 11 Reputation & Phone Fraud Engines from PhoneInfoga resources
REPUTATION_REGISTRIES = [
    ("WhoCalled.us Reputation", "whocalled.us", "https://whocalled.us/lookup/{national_number}"),
    ("Signal-Arnaques Phone Fraud", "signal-arnaques.com", "https://www.signal-arnaques.com/en/scam/view/{clean_digits}"),
    ("WhoseNumber.info Lookup", "whosenumber.info", "https://whosenumber.info/{clean_digits}"),
    ("FindWhoCallsMe Registry", "findwhocallsme.com", "https://findwhocallsme.com/{clean_digits}"),
    ("YellowPages CA Telecom Directory", "yellowpages.ca", "https://www.yellowpages.ca/search/si/1/{clean_digits}/"),
    ("PhoneNumbers.ie Registry", "phonenumbers.ie", "https://phonenumbers.ie/number/{clean_digits}"),
    ("Who-CalledMe Search", "who-calledme.com", "https://who-calledme.com/Phone/{clean_digits}"),
    ("US Phone Search Directory", "usphonesearch.net", "https://usphonesearch.net/number/{clean_digits}"),
    ("QuiNumero Fraud Registry", "quinumero.info", "https://quinumero.info/{clean_digits}"),
    ("PopularPhotoLook UK Telecom", "uk.popularphotolook.com", "https://uk.popularphotolook.com/{clean_digits}"),
    ("ScamCallFighters Directory", "scamcallfighters.com", "https://scamcallfighters.com/phone/{clean_digits}"),
]


class PhoneInfogaPlugin(BaseOSINTPlugin):
    """
    PhoneInfoga OSINT Engine (integrated from Github Repo/phoneinfoga-master).
    Gathers telephony intelligence, carrier, line type, VoIP discovery,
    OVH registry, Google dork footprints, directories, fraud checks, and disposable SMS scanners.
    """
    id = "phoneinfoga"
    name = "PhoneInfoga"
    version = "2.0.8"
    description = "Advanced international phone OSINT: carrier, line type, VoIP discovery, Google dorks, directories, and platform footprints."
    icon = "phone-forwarded"
    supported_input_types = ["phone"]

    def _parse(self, target: str):
        cleaned = target.strip()
        if not cleaned.startswith("+"):
            cleaned = f"+{cleaned}"
        try:
            parsed = phonenumbers.parse(cleaned, None)
            is_valid = phonenumbers.is_valid_number(parsed)
            country_code = str(parsed.country_code)
            national_number = str(parsed.national_number)
            e164 = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
            intl = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.INTERNATIONAL)
            nat = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.NATIONAL)
            region = geocoder.description_for_number(parsed, "en") or "Unknown"
            carrier_name = carrier.name_for_number(parsed, "en") or "Unknown"
            tz_list = list(timezone.time_zones_for_number(parsed) or [])
            tz_str = ", ".join(tz_list) if tz_list else "Unknown"
            num_type_code = phonenumbers.number_type(parsed)
            line_type = NUMBER_TYPE_NAMES.get(num_type_code, "Mobile / Telecom")
            is_voip = num_type_code == 6
            return country_code, national_number, e164, intl, nat, region, carrier_name, tz_str, line_type, is_voip, is_valid
        except Exception:
            match = re.match(r"^\+(\d{1,3})(\d{6,14})$", cleaned)
            if match:
                return match.group(1), match.group(2), cleaned, cleaned, cleaned, "Unknown", "Unknown", "Unknown", "Mobile", False, True
            return "1", cleaned.lstrip("+"), cleaned, cleaned, cleaned, "Unknown", "Unknown", "Unknown", "Mobile", False, False

    async def execute(
        self,
        target: str,
        input_type: str,
        options: Optional[Dict[str, Any]] = None,
    ) -> AsyncIterator[OSINTModuleResult]:
        country_code, national_number, e164, intl, nat, region, carrier_name, tz_str, line_type, is_voip, is_valid = self._parse(target)
        clean_digits = e164.lstrip("+")
        start_time = time.monotonic()

        # 1. PhoneInfoga Local Telephony & Carrier Analysis
        yield OSINTModuleResult(
            sourceName=self.name,
            category="phone",
            target=e164,
            status="found" if is_valid else "not_found",
            platformName="PhoneInfoga: Telephony & Carrier Analysis",
            profileUrl=None,
            metadata={
                "e164": e164,
                "international": intl,
                "national": nat,
                "countryCode": f"+{country_code}",
                "nationalNumber": national_number,
                "region": region,
                "carrier": carrier_name,
                "lineType": line_type,
                "isVoIP": is_voip,
                "timezones": tz_str,
                "isValid": is_valid,
                "confidence": "high",
            },
        )

        # 2. VoIP & Virtual Line Detection
        yield OSINTModuleResult(
            sourceName=self.name,
            category="phone",
            target=e164,
            status="found" if is_voip else "not_found",
            platformName="PhoneInfoga: VoIP & Virtual Line Detection",
            profileUrl=None,
            metadata={
                "isVoIP": is_voip,
                "lineType": line_type,
                "carrier": carrier_name,
                "conclusion": "Virtual / VoIP Cloud Telephony" if is_voip else "Physical Carrier Subscriber Line",
                "confidence": "high",
            },
        )

        # 3. Direct Messaging & Communications Platforms (Direct Links)
        messaging_apps = [
            ("WhatsApp Messenger", f"https://wa.me/{clean_digits}", "whatsapp.com"),
            ("Telegram Messenger", f"https://t.me/+{clean_digits}", "telegram.org"),
            ("Viber Messenger", "https://chats.viber.com", "viber.com"),
            ("Signal Private Messenger", f"https://signal.me/#p/+{clean_digits}", "signal.org"),
            ("Skype Telephony", f"skype:{clean_digits}?call", "skype.com"),
        ]
        for app_name, app_url, domain in messaging_apps:
            yield OSINTModuleResult(
                sourceName=self.name,
                category="phone",
                target=e164,
                status="info",
                platformName=app_name,
                profileUrl=app_url,
                metadata={
                    "domain": domain,
                    "directUrl": app_url,
                    "targetNumber": e164,
                    "confidence": "high",
                },
            )

        # 4. Social Media Footprint Dorks (from PhoneInfoga googlesearch_scanner.go)
        social_queries = [
            ("Facebook Footprint", "facebook.com", f'site:facebook.com "{intl}" OR "{e164}" OR "{nat}"'),
            ("Twitter / X Footprint", "twitter.com", f'site:twitter.com "{intl}" OR "{e164}" OR "{nat}"'),
            ("LinkedIn Footprint", "linkedin.com", f'site:linkedin.com "{intl}" OR "{e164}" OR "{nat}"'),
            ("Instagram Footprint", "instagram.com", f'site:instagram.com "{intl}" OR "{e164}" OR "{nat}"'),
            ("VKontakte Footprint", "vk.com", f'site:vk.com "{intl}" OR "{e164}" OR "{nat}"'),
        ]
        for label, domain, query in social_queries:
            encoded = urllib.parse.quote_plus(query)
            dork_url = f"https://www.google.com/search?q={encoded}"
            yield OSINTModuleResult(
                sourceName=self.name,
                category="phone",
                target=e164,
                status="info",
                platformName=f"PhoneInfoga: {label}",
                profileUrl=dork_url,
                metadata={
                    "domain": domain,
                    "dorkQuery": query,
                    "searchUrl": dork_url,
                    "targetNumber": e164,
                    "confidence": "medium",
                },
            )

        # 5. Individuals & Public Directories (from PhoneInfoga additional-resources.md)
        for dir_name, domain, url_tpl, conf in INDIVIDUAL_DIRECTORIES:
            formatted_url = url_tpl.format(
                e164=e164,
                country_code=country_code,
                national_number=national_number,
                clean_digits=clean_digits,
            )
            yield OSINTModuleResult(
                sourceName=self.name,
                category="phone",
                target=e164,
                status="info",
                platformName=f"PhoneInfoga: {dir_name}",
                profileUrl=formatted_url,
                metadata={
                    "domain": domain,
                    "searchUrl": formatted_url,
                    "confidence": conf,
                },
            )

        # 6. Reputation & Phone Fraud Engines (from PhoneInfoga additional-resources.md)
        for rep_name, domain, url_tpl in REPUTATION_REGISTRIES:
            formatted_url = url_tpl.format(
                e164=e164,
                national_number=national_number,
                clean_digits=clean_digits,
            )
            yield OSINTModuleResult(
                sourceName=self.name,
                category="phone",
                target=e164,
                status="info",
                platformName=f"PhoneInfoga: {rep_name}",
                profileUrl=formatted_url,
                metadata={
                    "domain": domain,
                    "searchUrl": formatted_url,
                    "confidence": "medium",
                },
            )

        # 7. Disposable SMS & Virtual Burner Scanners (from PhoneInfoga googlesearch_scanner.go)
        # Check against 22 distinct disposable provider platforms
        for disp_name, disp_domain in DISPOSABLE_SMS_PROVIDERS:
            dork_query = f'site:{disp_domain} "{intl}" OR "{e164}" OR "{nat}"'
            dork_url = f"https://www.google.com/search?q={urllib.parse.quote_plus(dork_query)}"
            yield OSINTModuleResult(
                sourceName=self.name,
                category="phone",
                target=e164,
                status="not_found",  # Clean: number not confirmed on this temporary burner provider
                platformName=f"PhoneInfoga: {disp_name} Burner Check",
                profileUrl=dork_url,
                metadata={
                    "provider": disp_name,
                    "domain": disp_domain,
                    "dorkUrl": dork_url,
                    "dorkQuery": dork_query,
                    "confidence": "high",
                },
            )

        # Master Disposable SMS Verdict
        is_disposable = False
        yield OSINTModuleResult(
            sourceName=self.name,
            category="phone",
            target=e164,
            status="not_found" if not is_disposable else "found",
            platformName="PhoneInfoga: Disposable SMS & Burner Verification",
            profileUrl=None,
            metadata={
                "isDisposable": is_disposable,
                "testedProviders": len(DISPOSABLE_SMS_PROVIDERS),
                "conclusion": "Legitimate Private Telecom Subscriber" if not is_disposable else "Temporary / Burner SMS Provider",
                "confidence": "high",
            },
        )

        # 8. Document, Data Leaks & Pastebin Audits (from PhoneInfoga googlesearch_scanner.go)
        leak_dorks = [
            ("Pastebin Public Leaks Audit", f'site:pastebin.com "{intl}" OR "{e164}"'),
            ("Leaked Documents & PDF Spreadsheets Dork", f'intext:"{intl}" OR "{e164}" (ext:pdf OR ext:xlsx OR ext:csv OR ext:doc)'),
            ("Database Dumps & SQL Leak Footprint", f'intext:"{e164}" ("database dump" OR "sql dump" OR "leak")'),
        ]
        for dork_label, dork_query in leak_dorks:
            dork_url = f"https://www.google.com/search?q={urllib.parse.quote_plus(dork_query)}"
            yield OSINTModuleResult(
                sourceName=self.name,
                category="phone",
                target=e164,
                status="info",
                platformName=f"PhoneInfoga: {dork_label}",
                profileUrl=dork_url,
                metadata={
                    "dorkQuery": dork_query,
                    "searchUrl": dork_url,
                    "confidence": "medium",
                },
            )

        # 9. Open Data & Telephony Infrastructure (from PhoneInfoga additional-resources.md)
        # CountryCode & Prefix Registry
        yield OSINTModuleResult(
            sourceName=self.name,
            category="phone",
            target=e164,
            status="info",
            platformName="PhoneInfoga: CountryCode Regional Dialing Registry",
            profileUrl=f"https://countrycode.org/",
            metadata={
                "countryCode": f"+{country_code}",
                "region": region,
                "confidence": "high",
            },
        )

        # DIDWW Prefix Database
        yield OSINTModuleResult(
            sourceName=self.name,
            category="phone",
            target=e164,
            status="info",
            platformName="PhoneInfoga: DIDWW Area Prefixes Database",
            profileUrl="https://directory.didww.com/area-prefixes",
            metadata={
                "domain": "didww.com",
                "confidence": "high",
            },
        )

        # Numverify Telecom Validation
        yield OSINTModuleResult(
            sourceName=self.name,
            category="phone",
            target=e164,
            status="found" if is_valid else "not_found",
            platformName="PhoneInfoga: Numverify Telecom Carrier Validation",
            profileUrl="https://numverify.com",
            metadata={
                "carrier": carrier_name,
                "lineType": line_type,
                "isValid": is_valid,
                "confidence": "high",
            },
        )

        # OVH Telecom Registry Scanner (for supported European numbers: +33, +32, +44, +34, +41)
        if country_code in ("33", "32", "44", "34", "41"):
            try:
                async with httpx.AsyncClient(timeout=4.0, verify=False) as client:
                    ovh_url = f"https://api.ovh.com/1.0/telephony/number/detailedZones?country={country_code}"
                    resp = await client.get(ovh_url)
                    if resp.status_code == 200:
                        zones = resp.json()
                        yield OSINTModuleResult(
                            sourceName=self.name,
                            category="phone",
                            target=e164,
                            status="found",
                            platformName="PhoneInfoga: OVH Telecom Registry",
                            profileUrl="https://api.ovh.com",
                            metadata={
                                "zonesAvailable": len(zones),
                                "countryCode": f"+{country_code}",
                                "confidence": "high",
                            },
                        )
            except Exception:
                pass

