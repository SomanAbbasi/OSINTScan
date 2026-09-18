import json
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status

from backend.app.config import get_settings
from backend.app.schemas.platform import PlatformDisplay, PlatformListResponse

router = APIRouter()
settings = get_settings()


def _get_platform_display_data():
    if not settings.PLATFORM_DISPLAY_FILE.exists():
        return []
    with open(settings.PLATFORM_DISPLAY_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("platforms", [])


@router.get("", response_model=PlatformListResponse)
async def list_platforms(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search by name or slug"),
):
    platforms_raw = _get_platform_display_data()
    all_categories = sorted(list({p.get("category", "misc") for p in platforms_raw}))

    filtered = platforms_raw
    if category:
        filtered = [p for p in filtered if p.get("category", "").lower() == category.lower()]
    if search:
        s_lower = search.lower()
        filtered = [
            p for p in filtered
            if s_lower in p.get("displayName", "").lower() or s_lower in p.get("slug", "").lower()
        ]

    platforms = [PlatformDisplay(**p) for p in filtered]
    enabled_count = sum(1 for p in platforms if p.enabled)

    return PlatformListResponse(
        total=len(platforms),
        enabled=enabled_count,
        categories=all_categories,
        platforms=platforms,
    )


@router.get("/{platform_id_or_slug}", response_model=PlatformDisplay)
async def get_platform(platform_id_or_slug: str):
    platforms_raw = _get_platform_display_data()
    target = platform_id_or_slug.lower()

    for p in platforms_raw:
        if p.get("slug", "").lower() == target or p.get("id", "").lower() == target:
            return PlatformDisplay(**p)

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Platform '{platform_id_or_slug}' not found.",
    )
