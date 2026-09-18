#!/usr/bin/env python3
"""
scripts/merge-site-data.py

Merges upstream WhatsMyName dataset snapshot with local overrides into
the normalized, production-ready data/generated/sites.json.
"""

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
UPSTREAM_PATH = REPO_ROOT / "data" / "upstream" / "wmn-data.json"
OVERRIDES_PATH = REPO_ROOT / "data" / "overrides" / "overrides.json"
GENERATED_PATH = REPO_ROOT / "data" / "generated" / "sites.json"


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")


def calculate_default_confidence(site: dict) -> str:
    has_e_string = bool(site.get("e_string"))
    has_m_string = bool(site.get("m_string"))
    protections = site.get("protection", [])

    if "cloudflare" in protections or "captcha" in protections:
        return "medium"
    if has_e_string and (has_m_string or site.get("m_code")):
        return "high"
    if has_e_string or has_m_string:
        return "medium"
    return "low"


def merge_data():
    if not UPSTREAM_PATH.exists():
        print(f"Upstream file not found at {UPSTREAM_PATH}. Run import-upstream-data.py first.", file=sys.stderr)
        sys.exit(1)

    with open(UPSTREAM_PATH, "r", encoding="utf-8") as f:
        upstream = json.load(f)

    overrides_data = {}
    disabled_rule_names = set()
    if OVERRIDES_PATH.exists():
        with open(OVERRIDES_PATH, "r", encoding="utf-8") as f:
            overrides_content = json.load(f)
            overrides_data = overrides_content.get("overrides", {})
            for item in overrides_content.get("disabled_rules", []):
                disabled_rule_names.add(item.get("name"))

    raw_sites = upstream.get("sites", [])
    merged_sites = []
    used_slugs = set()

    for raw in raw_sites:
        name = raw.get("name", "").strip()
        if not name:
            continue

        base_slug = slugify(name)
        slug = base_slug
        counter = 1
        while slug in used_slugs:
            counter += 1
            slug = f"{base_slug}-{counter}"
        used_slugs.add(slug)

        override = overrides_data.get(name, {})
        is_disabled_by_override = name in disabled_rule_names
        is_valid_upstream = raw.get("valid", True) is not False

        enabled = is_valid_upstream and not is_disabled_by_override

        uri_check = raw.get("uri_check", "")
        uri_pretty = raw.get("uri_pretty") or uri_check

        category = override.get("category") or raw.get("cat", "misc")
        confidence = override.get("confidence") or calculate_default_confidence(raw)
        requires_manual = override.get("requiresManualVerification", confidence in ("low", "medium"))

        merged_site = {
            "id": slug,
            "name": name,
            "displayName": override.get("displayName", name),
            "slug": slug,
            "category": category,
            "uriCheck": uri_check,
            "uriPretty": uri_pretty,
            "eCode": raw.get("e_code", 200),
            "eString": raw.get("e_string", ""),
            "mCode": raw.get("m_code"),
            "mString": raw.get("m_string", ""),
            "postBody": raw.get("post_body"),
            "headers": raw.get("headers", {}),
            "stripBadChar": raw.get("strip_bad_char"),
            "knownUsernames": raw.get("known", []),
            "enabled": enabled,
            "confidence": confidence,
            "protection": raw.get("protection", []),
            "requiresManualVerification": requires_manual,
            "detectionNotes": override.get("detectionNotes", ""),
            "privacyNotes": override.get("privacyNotes", ""),
            "source": "override" if name in overrides_data else "upstream",
        }
        merged_sites.append(merged_site)

    # Sort deterministically by name
    merged_sites.sort(key=lambda s: s["displayName"].lower())

    GENERATED_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(GENERATED_PATH, "w", encoding="utf-8") as f:
        json.dump({
            "version": "1.0.0",
            "count": len(merged_sites),
            "enabledCount": sum(1 for s in merged_sites if s["enabled"]),
            "sites": merged_sites,
        }, f, indent=2, ensure_ascii=False)

    print(f"Successfully generated {len(merged_sites)} normalized sites in {GENERATED_PATH}")
    print(f"Enabled: {sum(1 for s in merged_sites if s['enabled'])}, Overrides applied: {len(overrides_data)}")


if __name__ == "__main__":
    merge_data()
