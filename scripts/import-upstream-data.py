#!/usr/bin/env python3
"""
scripts/import-upstream-data.py

Imports the upstream WhatsMyName dataset snapshot into data/upstream/wmn-data.json
and records metadata (hash, site count, timestamp, license) into data/manifest.json.
"""

import hashlib
import json
import os
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
UPSTREAM_SOURCE_DEFAULT = REPO_ROOT / "wmn-data.json"
UPSTREAM_TARGET = REPO_ROOT / "data" / "upstream" / "wmn-data.json"
MANIFEST_PATH = REPO_ROOT / "data" / "manifest.json"


def compute_sha256(file_path: Path) -> str:
    sha = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(65536):
            sha.update(chunk)
    return sha.hexdigest()


def import_upstream_data(source_path: Path = UPSTREAM_SOURCE_DEFAULT) -> dict:
    if not source_path.exists():
        print(f"Error: Source upstream file not found at {source_path}", file=sys.stderr)
        sys.exit(1)

    # Validate JSON syntax
    try:
        with open(source_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error: Failed to parse upstream JSON: {e}", file=sys.stderr)
        sys.exit(1)

    sites = data.get("sites", [])
    categories = data.get("categories", [])
    authors = data.get("authors", [])

    UPSTREAM_TARGET.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source_path, UPSTREAM_TARGET)
    sha = compute_sha256(UPSTREAM_TARGET)

    enabled_sites = sum(1 for s in sites if s.get("valid", True) is not False)
    disabled_sites = len(sites) - enabled_sites

    manifest = {
        "upstream_repository": "https://github.com/WebBreacher/WhatsMyName",
        "upstream_commit_sha": "snapshot-pinned",
        "file_sha256": sha,
        "import_date": datetime.now(timezone.utc).isoformat(),
        "total_sites": len(sites),
        "enabled_sites": enabled_sites,
        "disabled_sites": disabled_sites,
        "categories_count": len(categories),
        "authors_count": len(authors),
        "dataset_license": "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)",
        "dataset_copyright": "Copyright (C) 2015-2026 Micah Hoffman and contributors",
        "generated_data_version": "1.0.0",
        "provenance_notes": "Adapted and normalized for HandleScope public footprint auditing.",
    }

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"Successfully imported {len(sites)} sites into {UPSTREAM_TARGET}")
    print(f"Updated manifest at {MANIFEST_PATH}")
    return manifest


if __name__ == "__main__":
    import_upstream_data()
