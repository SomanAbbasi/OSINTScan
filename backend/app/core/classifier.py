import re
from typing import Optional, Tuple
from backend.app.schemas.scan import PlatformStatus, ConfidenceLevel

BLOCKING_TITLES = [
    "<title>just a moment...</title>",
    "<title>attention required! | cloudflare</title>",
    "<title>ddos-guard</title>",
    "<title>security check</title>",
    "<title>access denied</title>",
]


def classify_response(
    status_code: int,
    body_text: str,
    e_code: int,
    e_string: Optional[str] = "",
    m_code: Optional[int] = None,
    m_string: Optional[str] = "",
    protections: Optional[list] = None,
) -> Tuple[PlatformStatus, ConfidenceLevel, str]:
    """
    Classify an HTTP response against platform fingerprint rules.
    Prioritizes positive detection matches first, following WMN evaluation standards.
    """
    body_lower = body_text.lower() if body_text else ""
    protections = protections or []

    # 1. First priority: Positive profile match
    status_matches = (status_code == e_code)
    has_e_string = bool(e_string and e_string.strip())
    string_matches = (e_string in body_text) if has_e_string else True
    has_m_string = bool(m_string and m_string.strip())
    m_string_present = (m_string in body_text) if has_m_string else False

    if status_matches and string_matches and not m_string_present:
        confidence = ConfidenceLevel.HIGH if has_e_string else ConfidenceLevel.MEDIUM
        reason = (
            f"HTTP {status_code} matched and profile signature string detected."
            if has_e_string
            else f"HTTP {status_code} matched expected profile code."
        )
        if "cloudflare" in protections or "captcha" in protections:
            confidence = ConfidenceLevel.MEDIUM
        return (PlatformStatus.FOUND, confidence, reason)

    # 2. Second priority: Explicit missing account match
    if m_code and status_code == m_code and (not m_string or m_string in body_text):
        return (
            PlatformStatus.NOT_FOUND,
            ConfidenceLevel.HIGH,
            f"HTTP {status_code} matched expected missing account code."
        )

    if m_string_present:
        return (
            PlatformStatus.NOT_FOUND,
            ConfidenceLevel.HIGH,
            "Response body matched missing account signature string."
        )

    # 3. Third priority: Rate limiting
    if status_code == 429 or "rate limit exceeded" in body_lower or "too many requests" in body_lower:
        return (
            PlatformStatus.RATE_LIMITED,
            ConfidenceLevel.MANUAL_REVIEW,
            "Platform returned rate limit (HTTP 429). Automated checking throttled."
        )

    # 4. Fourth priority: Bot challenges and blocking (HTTP 401, 403, 503 or challenge title)
    if status_code in (401, 403, 503):
        return (
            PlatformStatus.BLOCKED,
            ConfidenceLevel.MANUAL_REVIEW,
            f"HTTP {status_code} received. Platform enforces access restrictions."
        )

    for title in BLOCKING_TITLES:
        if title in body_lower:
            return (
                PlatformStatus.BLOCKED,
                ConfidenceLevel.MANUAL_REVIEW,
                "Security challenge page detected. Manual verification required."
            )

    # 5. Fallback: Not Found if status is common 404/410 and e_code was 200
    if status_code in (404, 410) and e_code == 200:
        return (
            PlatformStatus.NOT_FOUND,
            ConfidenceLevel.HIGH,
            f"HTTP {status_code} received; standard account not found indicator."
        )

    # 6. Uncertain
    return (
        PlatformStatus.UNCERTAIN,
        ConfidenceLevel.MANUAL_REVIEW,
        f"HTTP {status_code} received, but response did not conclusively match positive or negative fingerprints."
    )
