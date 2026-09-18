import ipaddress
import re
import urllib.parse
from urllib.parse import urlparse
from typing import Optional

DISALLOWED_HOSTS = {
    "localhost", "127.0.0.1", "0.0.0.0", "169.254.169.254", "metadata.google.internal",
    "instance-data", "metadata"
}


def sanitize_username(raw: str) -> str:
    """Validate and clean public username input."""
    cleaned = raw.strip()
    if not cleaned:
        raise ValueError("Username cannot be empty.")
    if len(cleaned) > 64:
        raise ValueError("Username exceeds maximum length of 64 characters.")
    if not re.match(r"^[a-zA-Z0-9_\-\.]{1,64}$", cleaned):
        raise ValueError("Invalid username format. Only letters, numbers, '.', '_', and '-' are allowed.")
    return cleaned


def is_safe_target_url(url_str: str) -> bool:
    """
    Ensure the target URL is safe and cannot be exploited for SSRF,
    internal network traversal, or metadata exfiltration.
    """
    try:
        parsed = urlparse(url_str)
        if parsed.scheme not in ("https", "http"):
            return False

        host = parsed.netloc.split(":")[0].lower()
        if not host or host in DISALLOWED_HOSTS:
            return False

        # Check for numeric IP addresses
        try:
            ip = ipaddress.ip_address(host)
            if (ip.is_private or ip.is_loopback or ip.is_link_local or
                ip.is_reserved or ip.is_multicast or ip.is_unspecified):
                return False
        except ValueError:
            pass  # It's a hostname, not a raw IP address

        return True
    except Exception:
        return False


def build_safe_check_url(template: str, username: str, strip_chars: Optional[str] = None) -> str:
    """Safely substitute username into URL template."""
    clean_user = username
    if strip_chars:
        for c in strip_chars:
            clean_user = clean_user.replace(c, "")
    
    # URL encode path component
    encoded_user = urllib.parse.quote(clean_user, safe="~-._")
    target_url = template.replace("{account}", encoded_user)
    
    if not is_safe_target_url(target_url):
        raise ValueError(f"Constructed check URL is unsafe: {target_url}")
        
    return target_url
