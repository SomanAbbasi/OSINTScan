#!/usr/bin/env python3
"""
scripts/generate-platform-index.py

Generates data/platform-display.json containing visual metadata, descriptions,
accent colors, and verification tips for platforms to support SEO directory pages.
"""

import json
import sys
from pathlib import Path
from urllib.parse import urlparse

REPO_ROOT = Path(__file__).resolve().parent.parent
GENERATED_PATH = REPO_ROOT / "data" / "generated" / "sites.json"
PLATFORM_DISPLAY_PATH = REPO_ROOT / "data" / "platform-display.json"

CATEGORY_ICONS = {
    "coding": "code-2",
    "social": "message-circle",
    "tech": "cpu",
    "gaming": "gamepad-2",
    "blog": "newspaper",
    "art": "palette",
    "video": "video",
    "music": "headphones",
    "finance": "circle-dollar-sign",
    "shopping": "shopping-bag",
    "dating": "heart",
    "hobby": "compass",
    "images": "image",
    "news": "rss",
    "search": "search",
    "business": "briefcase",
    "misc": "globe",
}

CATEGORY_COLORS = {
    "coding": "#3b82f6",     # blue
    "social": "#8b5cf6",     # violet
    "tech": "#06b6d4",       # cyan
    "gaming": "#10b981",     # emerald
    "blog": "#f59e0b",       # amber
    "art": "#ec4899",        # pink
    "video": "#ef4444",      # red
    "music": "#6366f1",      # indigo
    "finance": "#14b8a6",    # teal
    "shopping": "#f97316",   # orange
    "dating": "#f43f5e",     # rose
    "hobby": "#84cc16",      # lime
    "images": "#a855f7",     # purple
    "news": "#64748b",       # slate
    "search": "#0ea5e9",     # sky
    "business": "#475569",   # slate dark
    "misc": "#6b7280",       # gray
}


def generate_platform_index():
    if not GENERATED_PATH.exists():
        print(f"Error: {GENERATED_PATH} not found. Run merge-site-data.py first.", file=sys.stderr)
        sys.exit(1)

    with open(GENERATED_PATH, "r", encoding="utf-8") as f:
        doc = json.load(f)

    sites = doc.get("sites", [])
    display_index = []

    for site in sites:
        slug = site["slug"]
        name = site["name"]
        cat = site.get("category", "misc")
        uri_check = site.get("uriCheck", "")
        parsed = urlparse(uri_check)
        official_url = f"{parsed.scheme}://{parsed.netloc}"

        icon = CATEGORY_ICONS.get(cat, "globe")
        color = CATEGORY_COLORS.get(cat, "#6366f1")

        description = f"Public profile detection for {site.get('displayName', name)} ({cat} platform)."
        what_it_tests = f"Checks {site.get('displayName', name)} public profile URLs by verifying HTTP response status and unique platform profile indicators."
        false_positives = "False positives can occur if the platform shows a generic landing page or CAPTCHA challenge instead of a proper 404 status."
        verification_advice = f"Always visit the live URL manually on {site.get('displayName', name)} to inspect profile activity and bio markers before drawing conclusions."

        display_item = {
            "slug": slug,
            "id": site["id"],
            "name": name,
            "displayName": site.get("displayName", name),
            "category": cat,
            "icon": icon,
            "accentColor": color,
            "officialUrl": official_url,
            "uriPattern": uri_check,
            "uriPretty": site.get("uriPretty", uri_check),
            "shortDescription": description,
            "whatItTests": what_it_tests,
            "commonFalsePositives": false_positives,
            "verificationAdvice": verification_advice,
            "confidence": site.get("confidence", "high"),
            "requiresManualVerification": site.get("requiresManualVerification", False),
            "enabled": site.get("enabled", True),
            "protection": site.get("protection", []),
        }
        display_index.append(display_item)

    display_index.sort(key=lambda s: s["displayName"].lower())

    with open(PLATFORM_DISPLAY_PATH, "w", encoding="utf-8") as f:
        json.dump({
            "version": "1.0.0",
            "count": len(display_index),
            "platforms": display_index,
        }, f, indent=2, ensure_ascii=False)

    print(f"Generated platform display index with {len(display_index)} items in {PLATFORM_DISPLAY_PATH}")


if __name__ == "__main__":
    generate_platform_index()
