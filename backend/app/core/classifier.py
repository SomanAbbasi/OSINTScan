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

BLOCKING_PATTERNS = [
    "cf-browser-verification",
    "cloudflare ray id",
    "challenge-error-text",
    "awswafintegration",
    "perimeterxidentifiers",
]

UNIVERSAL_NOT_FOUND_PATTERNS = [
    "user not found",
    "page not found",
    "profile not found",
    "account not found",
    "this account doesn't exist",
    "this user doesn't exist",
    "user does not exist",
    "account does not exist",
    "channel does not exist",
    "this page isn't available",
    "this content isn't available right now",
    "the specified profile could not be found",
    "we couldn't find this page",
    "we can't find that user",
    "sorry, this page isn't available",
    "sorry, nobody on reddit goes by that name",
    "the requested user was not found",
    "404 - page not found",
    "404 not found",
    "account has been suspended",
    "account suspended",
    "nobody with that handle",
    "the member you requested does not exist",
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
    Prioritizes security blocks, rate limiting, and explicit non-existence signals
    to prevent false positive matches.
    """
    body_lower = body_text.lower() if body_text else ""
    protections = protections or []

    # 1. Top priority: Rate limiting (HTTP 429 or throttling strings)
    if status_code == 429 or "rate limit exceeded" in body_lower or "too many requests" in body_lower:
        return (
            PlatformStatus.RATE_LIMITED,
            ConfidenceLevel.MANUAL_REVIEW,
            "Platform returned rate limit (HTTP 429). Automated checking throttled."
        )

    # 2. Top priority: Bot challenges, Cloudflare WAF, Access Denied (HTTP 401, 403, 503 or challenge body)
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

    for pattern in BLOCKING_PATTERNS:
        if pattern in body_lower:
            return (
                PlatformStatus.BLOCKED,
                ConfidenceLevel.MANUAL_REVIEW,
                "Anti-bot or WAF challenge signature detected."
            )

    # 3. Third priority: Explicit missing account match (m_code or m_string)
    has_m_string = bool(m_string and m_string.strip())
    m_string_present = (m_string in body_text) if has_m_string else False

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

    # Fallback missing account: Standard 404 / 410 HTTP statuses
    if status_code in (404, 410):
        return (
            PlatformStatus.NOT_FOUND,
            ConfidenceLevel.HIGH,
            f"HTTP {status_code} received; standard account not found indicator."
        )

    # 4. Fourth priority: Universal soft-404 check (SPAs returning HTTP 200 with not-found body text)
    has_e_string = bool(e_string and e_string.strip())
    if not has_e_string and status_code < 400:
        for unf_pattern in UNIVERSAL_NOT_FOUND_PATTERNS:
            if unf_pattern in body_lower:
                return (
                    PlatformStatus.NOT_FOUND,
                    ConfidenceLevel.HIGH,
                    f"Response contained soft-404 signature: '{unf_pattern}'."
                )

    # 5. Fifth priority: Positive profile match
    # Any HTTP 4xx or 5xx can NEVER be a positive profile match
    if status_code < 400:
        status_matches = (status_code == e_code)
        string_matches = (e_string in body_text) if has_e_string else True

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

    # 6. Uncertain
    return (
        PlatformStatus.UNCERTAIN,
        ConfidenceLevel.MANUAL_REVIEW,
        f"HTTP {status_code} received, but response did not conclusively match positive or negative fingerprints."
    )

