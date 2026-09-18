from backend.app.core.classifier import classify_response
from backend.app.schemas.scan import PlatformStatus, ConfidenceLevel


def test_classify_found_with_string():
    status, confidence, reason = classify_response(
        status_code=200,
        body_text="<html><div class='profile-container'>user bio</div></html>",
        e_code=200,
        e_string="profile-container",
        m_code=404,
        m_string="User not found",
    )
    assert status == PlatformStatus.FOUND
    assert confidence == ConfidenceLevel.HIGH
    assert "profile signature string detected" in reason


def test_classify_found_code_only():
    status, confidence, reason = classify_response(
        status_code=200,
        body_text="<html>Profile loaded</html>",
        e_code=200,
        e_string="",
        m_code=404,
    )
    assert status == PlatformStatus.FOUND
    assert confidence == ConfidenceLevel.MEDIUM


def test_classify_not_found_by_code():
    status, confidence, reason = classify_response(
        status_code=404,
        body_text="<html>Page Not Found</html>",
        e_code=200,
        m_code=404,
    )
    assert status == PlatformStatus.NOT_FOUND
    assert confidence == ConfidenceLevel.HIGH


def test_classify_not_found_by_string():
    status, confidence, reason = classify_response(
        status_code=200,
        body_text="<html>This user does not exist.</html>",
        e_code=200,
        m_string="This user does not exist.",
    )
    assert status == PlatformStatus.NOT_FOUND
    assert confidence == ConfidenceLevel.HIGH


def test_classify_rate_limited():
    status, confidence, reason = classify_response(
        status_code=429,
        body_text="Too Many Requests",
        e_code=200,
    )
    assert status == PlatformStatus.RATE_LIMITED
    assert confidence == ConfidenceLevel.MANUAL_REVIEW


def test_classify_blocked_cloudflare():
    status, confidence, reason = classify_response(
        status_code=403,
        body_text="Cloudflare Ray ID: 12345 Access Denied",
        e_code=200,
    )
    assert status == PlatformStatus.BLOCKED
    assert confidence == ConfidenceLevel.MANUAL_REVIEW


def test_classify_universal_soft_404():
    status, confidence, reason = classify_response(
        status_code=200,
        body_text="<html><div>Sorry, this page isn't available</div></html>",
        e_code=200,
        e_string="",
    )
    assert status == PlatformStatus.NOT_FOUND
    assert confidence == ConfidenceLevel.HIGH
    assert "soft-404" in reason


def test_classify_403_never_found():
    status, confidence, reason = classify_response(
        status_code=403,
        body_text="Forbidden",
        e_code=403,
    )
    assert status == PlatformStatus.BLOCKED

