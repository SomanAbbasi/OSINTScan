#!/usr/bin/env python3
"""
scripts/check-upstream-updates.py

Compares the current local upstream snapshot (data/upstream/wmn-data.json)
against GitHub raw upstream dataset, generating a structured change report.
"""

import hashlib
import json
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    requests = None

REPO_ROOT = Path(__file__).resolve().parent.parent
LOCAL_UPSTREAM = REPO_ROOT / "data" / "upstream" / "wmn-data.json"
UPSTREAM_URL = "https://raw.githubusercontent.com/WebBreacher/WhatsMyName/main/wmn-data.json"


def compare_datasets(local_data: dict, remote_data: dict) -> dict:
    local_sites = {s.get("name"): s for s in local_data.get("sites", []) if s.get("name")}
    remote_sites = {s.get("name"): s for s in remote_data.get("sites", []) if s.get("name")}

    added = [name for name in remote_sites if name not in local_sites]
    removed = [name for name in local_sites if name not in remote_sites]
    modified = []

    for name in local_sites:
        if name in remote_sites:
            l_rule = local_sites[name]
            r_rule = remote_sites[name]
            changes = []
            if l_rule.get("uri_check") != r_rule.get("uri_check"):
                changes.append(f"uri_check: '{l_rule.get('uri_check')}' -> '{r_rule.get('uri_check')}'")
            if l_rule.get("e_code") != r_rule.get("e_code"):
                changes.append(f"e_code: {l_rule.get('e_code')} -> {r_rule.get('e_code')}")
            if l_rule.get("e_string") != r_rule.get("e_string"):
                changes.append("e_string changed")
            if l_rule.get("m_code") != r_rule.get("m_code"):
                changes.append(f"m_code: {l_rule.get('m_code')} -> {r_rule.get('m_code')}")
            if changes:
                modified.append({"name": name, "changes": changes})

    return {
        "added": sorted(added),
        "removed": sorted(removed),
        "modified": modified,
        "local_count": len(local_sites),
        "remote_count": len(remote_sites),
    }


def main():
    if not LOCAL_UPSTREAM.exists():
        print(f"Error: {LOCAL_UPSTREAM} not found.", file=sys.stderr)
        sys.exit(1)

    with open(LOCAL_UPSTREAM, "r", encoding="utf-8") as f:
        local_data = json.load(f)

    if not requests:
        print("requests module not installed; using local data comparison only.")
        return

    try:
        resp = requests.get(UPSTREAM_URL, timeout=15)
        resp.raise_for_status()
        remote_data = resp.json()
    except Exception as e:
        print(f"Warning: Could not fetch remote upstream: {e}", file=sys.stderr)
        return

    diff = compare_datasets(local_data, remote_data)

    print("\n=== Upstream Update Report ===")
    print(f"Local sites: {diff['local_count']} | Upstream sites: {diff['remote_count']}")
    print(f"Added platforms: {len(diff['added'])}")
    for a in diff["added"][:10]:
        print(f"  + {a}")
    print(f"Removed platforms: {len(diff['removed'])}")
    for r in diff["removed"][:10]:
        print(f"  - {r}")
    print(f"Modified rules: {len(diff['modified'])}")
    for m in diff["modified"][:10]:
        print(f"  * {m['name']}: {', '.join(m['changes'])}")


if __name__ == "__main__":
    main()
