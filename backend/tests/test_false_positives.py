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
