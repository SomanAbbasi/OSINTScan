#!/usr/bin/env python3
"""
scripts/validate-site-rules.py

Validates data/generated/sites.json against strict rules:
- Schema completeness
- URL template / POST body validation ({account} placeholder in uriCheck or postBody)
- Protocol restrictions (HTTPS / HTTP)
- SSRF checks (disallows private IPs, localhost, metadata IP addresses)
- Duplicate slug/name detection
- HTTP status code range checks
"""

import ipaddress
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

REPO_ROOT = Path(__file__).resolve().parent.parent
GENERATED_PATH = REPO_ROOT / "data" / "generated" / "sites.json"

ALLOWED_CATEGORIES = {
    "archived", "art", "blog", "business", "coding", "dating", "finance",
    "gaming", "health", "hobby", "images", "misc", "music", "news",
    "political", "search", "shopping", "social", "tech", "video", "xx NSFW xx"
}

DISALLOWED_HOSTS = {
    "localhost", "127.0.0.1", "0.0.0.0", "169.254.169.254", "metadata.google.internal"
}


def is_private_or_invalid_host(host: str) -> bool:
    if not host:
        return True
    host_clean = host.split(":")[0].lower()
    if host_clean in DISALLOWED_HOSTS:
        return True
    try:
        ip = ipaddress.ip_address(host_clean)
        if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved or ip.is_multicast:
            return True
    except ValueError:
        pass
    return False


def validate_rules():
    if not GENERATED_PATH.exists():
        print(f"Error: {GENERATED_PATH} not found. Run merge-site-data.py first.", file=sys.stderr)
        sys.exit(1)

    with open(GENERATED_PATH, "r", encoding="utf-8") as f:
        doc = json.load(f)

    sites = doc.get("sites", [])
    errors = []
    seen_slugs = set()
    seen_names = set()

    for idx, site in enumerate(sites):
        name = site.get("name", "")
        slug = site.get("slug", "")
        uri_check = site.get("uriCheck", "")
        post_body = site.get("postBody")
        e_code = site.get("eCode")
        m_code = site.get("mCode")
        cat = site.get("category", "")

        # 1. Required fields
        if not name:
            errors.append(f"Site #{idx}: Missing 'name'")
        if not slug:
            errors.append(f"Site #{idx} ({name}): Missing 'slug'")
        if not uri_check:
            errors.append(f"Site #{idx} ({name}): Missing 'uriCheck'")

        # 2. Duplicate checks
        if slug in seen_slugs:
            errors.append(f"Duplicate slug '{slug}' for site '{name}'")
        seen_slugs.add(slug)

        if name.lower() in seen_names:
            errors.append(f"Duplicate site name '{name}'")
        seen_names.add(name.lower())

        # 3. Account placeholder in URI or POST body
        has_account_placeholder = ("{account}" in uri_check) or (post_body and "{account}" in str(post_body))
        if not has_account_placeholder:
            errors.append(f"Site '{name}': Neither uriCheck nor postBody contains '{{account}}' placeholder")

        # 4. Allowed schemes and SSRF prevention
        parsed = urlparse(uri_check)
        if parsed.scheme not in ("http", "https"):
            errors.append(f"Site '{name}': Disallowed scheme '{parsed.scheme}' in '{uri_check}'")
        if is_private_or_invalid_host(parsed.netloc):
            errors.append(f"Site '{name}': SSRF danger: Disallowed host '{parsed.netloc}' in '{uri_check}'")

        # 5. Status code validity
        if not isinstance(e_code, int) or not (100 <= e_code <= 599):
            errors.append(f"Site '{name}': Invalid eCode '{e_code}'")
        if m_code is not None:
            if not isinstance(m_code, int) or not (100 <= m_code <= 599):
                errors.append(f"Site '{name}': Invalid mCode '{m_code}'")

        # 6. Category validation
        if cat and cat not in ALLOWED_CATEGORIES:
            errors.append(f"Site '{name}': Category '{cat}' not in recognized categories list")

    if errors:
        print(f"Validation FAILED with {len(errors)} error(s):", file=sys.stderr)
        for err in errors[:30]:
            print(f" - {err}", file=sys.stderr)
        if len(errors) > 30:
            print(f" ... and {len(errors) - 30} more errors.", file=sys.stderr)
        sys.exit(1)

    print(f"Validation PASSED: All {len(sites)} site rules in {GENERATED_PATH} are valid and safe.")


if __name__ == "__main__":
    validate_rules()
