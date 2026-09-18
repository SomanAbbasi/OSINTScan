import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.plugins import plugin_registry
from backend.app.schemas.scan import OSINTModuleResult

client = TestClient(app)


def test_plugins_registry():
    plugins = plugin_registry.all_plugins()
    assert len(plugins) >= 8

    ids = [p.id for p in plugins]
    assert "whatsmyname" in ids
    assert "blackbird" in ids
    assert "sherlock" in ids
    assert "maigret" in ids
    assert "holehe" in ids
    assert "ghunt" in ids
    assert "ignorant" in ids
    assert "breach" in ids

    # Filter by input type
    email_plugins = plugin_registry.get_for_input_type("email")
    email_ids = [p.id for p in email_plugins]
    assert "holehe" in email_ids
    assert "ghunt" in email_ids
    assert "blackbird" in email_ids
    assert "breach" in email_ids

    phone_plugins = plugin_registry.get_for_input_type("phone")
    phone_ids = [p.id for p in phone_plugins]
    assert "ignorant" in phone_ids
    assert "breach" in phone_ids

    username_plugins = plugin_registry.get_for_input_type("username")
    username_ids = [p.id for p in username_plugins]
    assert "whatsmyname" in username_ids
    assert "blackbird" in username_ids
    assert "sherlock" in username_ids
    assert "maigret" in username_ids


def test_api_plugins_list():
    resp = client.get("/api/v1/plugins")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 6
    ids = [p["id"] for p in data]
    assert "whatsmyname" in ids
    assert "blackbird" in ids
    assert "holehe" in ids
    assert "ghunt" in ids
    assert "ignorant" in ids
    assert "breach" in ids


def test_create_email_scan():
    resp = client.post(
        "/api/v1/scans",
        json={"target": "security_test@example.com", "inputType": "email"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert "scanId" in data
    assert data["target"] == "security_test@example.com"
    assert data["inputType"] == "email"
    assert len(data["engines"]) > 0


def test_create_phone_scan():
    resp = client.post(
        "/api/v1/scans",
        json={"target": "+14155552671", "inputType": "phone"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert "scanId" in data
    assert data["target"] == "+14155552671"
    assert data["inputType"] == "phone"


def test_create_breach_scan():
    resp = client.post(
        "/api/v1/scans",
        json={"target": "audit_victim@gmail.com", "inputType": "breach"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert "scanId" in data
    assert data["inputType"] == "breach"


def test_invalid_input_validation():
    # Invalid email
    resp = client.post(
        "/api/v1/scans",
        json={"target": "not-an-email", "inputType": "email"},
    )
    assert resp.status_code == 422

    # Invalid phone
    resp = client.post(
        "/api/v1/scans",
        json={"target": "not-a-phone", "inputType": "phone"},
    )
    assert resp.status_code == 422


def test_breach_plugin_execution():
    import asyncio
    from backend.app.plugins.breach_plugin import BreachLookupPlugin
    plugin = BreachLookupPlugin()
    
    async def run():
        res_list = []
        async for res in plugin.execute("target@example.com", "email"):
            res_list.append(res)
        return res_list

    results = asyncio.run(run())
    assert len(results) >= 1
    assert isinstance(results[0], OSINTModuleResult)
    assert results[0].sourceName == "Breach Intelligence"


def test_sherlock_plugin_loading():
    from backend.app.plugins.sherlock_plugin import SherlockPlugin
    plugin = SherlockPlugin()
    sites = plugin._load_sites()
    assert len(sites) >= 100
    assert "GitHub" in sites
    assert sites["GitHub"]["errorType"] == "status_code"


def test_maigret_plugin_loading():
    from backend.app.plugins.maigret_plugin import MaigretPlugin
    plugin = MaigretPlugin()
    sites = plugin._load_sites(limit=50)
    assert len(sites) == 50
    # Verify ranked order
    first_site_data = sites[0][1]
    assert "alexaRank" in first_site_data


def test_scan_session_deduplication():
    from backend.app.core.manager import ScanSession
    from backend.app.schemas.scan import OSINTModuleResult, PlatformStatus

    session = ScanSession(scan_id="test-dedup", target="alexdev", input_type="username")

    # 1. First engine reports GitHub
    res1 = OSINTModuleResult(
        sourceName="WhatsMyName",
        category="username",
        target="alexdev",
        status="found",
        platformName="GitHub",
        profileUrl="https://github.com/alexdev",
        metadata={"confidence": "high"},
    )
    session.add_osint_result(res1)
    assert len(session.results) == 1
    assert session.results[0].name == "GitHub"
    assert session.results[0].status == PlatformStatus.FOUND
    assert session.results[0].metadata["engines"] == ["WhatsMyName"]
    assert session.results[0].metadata["crossValidation"] is False

    # 2. Second engine reports GitHub (Sherlock)
    res2 = OSINTModuleResult(
        sourceName="Sherlock",
        category="username",
        target="alexdev",
        status="found",
        platformName="GitHub",
        profileUrl="https://github.com/alexdev",
        metadata={"confidence": "high"},
    )
    session.add_osint_result(res2)
    # MUST REMAIN 1 result! Strictly deduplicated!
    assert len(session.results) == 1
    assert session.results[0].metadata["engines"] == ["WhatsMyName", "Sherlock"]
    assert session.results[0].metadata["crossValidation"] is True
    assert session.results[0].metadata["crossValidationCount"] == 2

    # 3. Third engine reports GitHub (Maigret)
    res3 = OSINTModuleResult(
        sourceName="Maigret",
        category="username",
        target="alexdev",
        status="found",
        platformName="github.com",  # domain variation
        profileUrl="https://github.com/alexdev",
        metadata={"confidence": "high"},
    )
    session.add_osint_result(res3)
    # MUST STILL BE 1 result!
    assert len(session.results) == 1
    assert session.results[0].metadata["engines"] == ["WhatsMyName", "Sherlock", "Maigret"]
    assert session.results[0].metadata["crossValidationCount"] == 3


def test_holehe_plugin_loading():
    from backend.app.plugins.holehe_plugin import HolehePlugin
    plugin = HolehePlugin()
    funcs = plugin._ensure_functions_loaded()
    assert len(funcs) >= 120, f"Expected >= 120 functions, got {len(funcs)}"


def test_email_scan_estimation():
    resp = client.post(
        "/api/v1/scans",
        json={"target": "test_user_osint@gmail.com", "inputType": "email"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["totalPlatforms"] >= 130
    assert "Holehe" in data["engines"]
    assert "Blackbird" in data["engines"]


def test_phoneinfoga_plugin_execution():
    import asyncio
    from backend.app.plugins.phoneinfoga_plugin import PhoneInfogaPlugin
    plugin = PhoneInfogaPlugin()

    async def run():
        res_list = []
        async for res in plugin.execute("+14155552671", "phone"):
            res_list.append(res)
        return res_list

    results = asyncio.run(run())
    assert len(results) >= 60
    names = [r.platformName for r in results]
    assert "PhoneInfoga: Telephony & Carrier Analysis" in names
    assert "WhatsApp Messenger" in names
    assert "Telegram Messenger" in names
    assert "PhoneInfoga: Truecaller Directory" in names
    assert "PhoneInfoga: WhoCalled.us Reputation" in names
    assert "PhoneInfoga: Pastebin Public Leaks Audit" in names
    assert any("Burner Check" in name for name in names)
    assert "PhoneInfoga: Disposable SMS & Burner Verification" in names
    # Verify metadata on telephony analysis
    telephony = next(r for r in results if r.platformName == "PhoneInfoga: Telephony & Carrier Analysis")
    assert telephony.metadata["e164"] == "+14155552671"
    assert telephony.metadata["countryCode"] == "+1"
    assert "lineType" in telephony.metadata


def test_phone_scan_engines():
    resp = client.post(
        "/api/v1/scans",
        json={"target": "+14155552671", "inputType": "phone"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert "PhoneInfoga" in data["engines"]
    assert "Ignorant" in data["engines"]
    assert "Breach Intelligence" in data["engines"]
    assert data["totalPlatforms"] >= 75


