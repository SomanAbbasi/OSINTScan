import pytest
from backend.app.plugins.breach_plugin import BreachLookupPlugin
from backend.app.plugins.phoneinfoga_plugin import PhoneInfogaPlugin
from backend.app.plugins.ignorant_plugin import IgnorantPlugin
from backend.app.plugins.ghunt_plugin import GHuntPlugin


@pytest.mark.asyncio
async def test_breach_no_false_positives_without_key():
    bp = BreachLookupPlugin()
    results = [r async for r in bp.execute("MssAbbasi", "username")]
    found = [r for r in results if r.status == "found"]
    assert len(found) == 0, f"Breach returned false positives: {found}"


@pytest.mark.asyncio
async def test_phoneinfoga_dorks_are_not_found():
    pi = PhoneInfogaPlugin()
    results = [r async for r in pi.execute("+15551234567", "phone")]
    found = [r for r in results if r.status == "found"]
    for r in found:
        assert "Dork" not in (r.platformName or "")
        assert "WhatsApp" not in (r.platformName or "")
        assert "Telegram" not in (r.platformName or "")


@pytest.mark.asyncio
async def test_ignorant_messaging_links_are_info():
    ig = IgnorantPlugin()
    results = [r async for r in ig.execute("+15551234567", "phone")]
    found = [r for r in results if r.status == "found"]
    for r in found:
        assert "WhatsApp" not in (r.platformName or "")
        assert "Telegram" not in (r.platformName or "")


@pytest.mark.asyncio
async def test_ghunt_unverified_gmail_not_found():
    gh = GHuntPlugin()
    results = [r async for r in gh.execute("randomfaketestemail982374987@gmail.com", "email")]
    found = [r for r in results if r.status == "found"]
    assert len(found) == 0


def test_classifier_rejects_7cups_soft_404():
    from backend.app.core.classifier import classify_response
    from backend.app.schemas.scan import PlatformStatus
    # 7cups soft-404 body
    body = "<html><head><title>Not Found</title></head><body>Oops! The content you're attempting to access could not be found. For assistance please contact the Support Desk.</body></html>"
    status, conf, reason = classify_response(200, body, e_code=200)
    assert status == PlatformStatus.NOT_FOUND


def test_classifier_rejects_waf_202_challenge():
    from backend.app.core.classifier import classify_response
    from backend.app.schemas.scan import PlatformStatus
    status, conf, reason = classify_response(202, "", e_code=200)
    assert status == PlatformStatus.BLOCKED


def test_classifier_rejects_empty_stub_body():
    from backend.app.core.classifier import classify_response
    from backend.app.schemas.scan import PlatformStatus
    status, conf, reason = classify_response(200, "OK", e_code=200)
    assert status == PlatformStatus.NOT_FOUND


def test_classifier_rejects_not_found_title():
    from backend.app.core.classifier import classify_response
    from backend.app.schemas.scan import PlatformStatus
    body = "<html><head><title>404 - Page Not Found</title></head><body>Some long random body text that does not contain error strings directly...</body></html>"
    status, conf, reason = classify_response(200, body, e_code=200)
    assert status == PlatformStatus.NOT_FOUND
