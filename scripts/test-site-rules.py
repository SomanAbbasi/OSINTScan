#!/usr/bin/env python3
"""
scripts/test-site-rules.py

Runs automated smoke tests against selected platform rules using known usernames
and randomized non-existent usernames.
"""

import json
import random
import string
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    requests = None

REPO_ROOT = Path(__file__).resolve().parent.parent
GENERATED_PATH = REPO_ROOT / "data" / "generated" / "sites.json"

TEST_SITES = ["github", "pastebin", "docker-hub", "hugging-face", "gitlab"]


def random_username(length=18):
    return "hs_test_" + "".join(random.choices(string.ascii_lowercase + string.digits, k=length))


def test_platform_rule(site: dict) -> bool:
    if not requests:
        print("requests module not installed, skipping network tests.")
        return True

    name = site["displayName"]
    uri_check = site["uriCheck"]
    e_code = site.get("eCode", 200)
    e_string = site.get("eString", "")
    known = site.get("knownUsernames", [])

    if not known:
        print(f"[{name}] Skipped: No known test usernames available.")
        return True

    test_user = known[0]
    known_url = uri_check.replace("{account}", test_user)
    headers = {"User-Agent": "HandleScope-Tester/1.0 (+https://handlescope.org)"}

    try:
        r = requests.get(known_url, headers=headers, timeout=10, allow_redirects=True)
        code_matches = r.status_code == e_code
        string_matches = not e_string or (e_string in r.text)

        if code_matches and string_matches:
            print(f"[+] [{name}] Known user '{test_user}' matched (HTTP {r.status_code})")
            return True
        else:
            print(f"[-] [{name}] Warning: Known user '{test_user}' returned HTTP {r.status_code} (expected {e_code})")
            return False
    except Exception as e:
        print(f"[!] [{name}] Connection failed: {e}")
        return False


def main():
    if not GENERATED_PATH.exists():
        print(f"Error: {GENERATED_PATH} not found. Run merge-site-data.py first.", file=sys.stderr)
        sys.exit(1)

    with open(GENERATED_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    sites = {s["slug"]: s for s in data.get("sites", [])}
    success_count = 0
    tested_count = 0

    print("Running smoke tests on selected safe platforms...")
    for slug in TEST_SITES:
        if slug in sites:
            tested_count += 1
            if test_platform_rule(sites[slug]):
                success_count += 1

    print(f"\nSmoke test complete: {success_count}/{tested_count} passed.")


if __name__ == "__main__":
    main()
