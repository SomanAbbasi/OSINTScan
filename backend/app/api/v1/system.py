import json
from datetime import datetime, timezone
from fastapi import APIRouter, Header, HTTPException, status

from backend.app.config import get_settings
from backend.app.core.manager import scan_manager
from backend.app.core.rate_limiter import rate_limiter

router = APIRouter()
settings = get_settings()


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "HandleScope Scanner API",
        "version": settings.VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/data-version")
async def get_data_version():
    if not settings.MANIFEST_FILE.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Manifest metadata not found. Run data pipeline scripts.",
        )
    with open(settings.MANIFEST_FILE, "r", encoding="utf-8") as f:
        manifest = json.load(f)
    return manifest


@router.get("/admin/health-metrics")
async def get_admin_metrics(x_admin_key: str = Header(..., alias="X-Admin-Key")):
    if not settings.ADMIN_API_KEY or x_admin_key != settings.ADMIN_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin authentication key.",
        )

    manifest_data = {}
    if settings.MANIFEST_FILE.exists():
        with open(settings.MANIFEST_FILE, "r", encoding="utf-8") as f:
            manifest_data = json.load(f)

    active_scans_count = sum(1 for s in scan_manager.scans.values() if s.status == "running")
    total_scans_tracked = len(scan_manager.scans)

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "activeRunningScans": active_scans_count,
        "totalScansTracked": total_scans_tracked,
        "rateLimiterActiveClients": len(rate_limiter.requests),
        "manifest": manifest_data,
        "system": {
            "maxConcurrency": settings.SCAN_MAX_CONCURRENCY,
            "siteTimeoutSeconds": settings.SCAN_SITE_TIMEOUT_SECONDS,
            "totalTimeoutSeconds": settings.SCAN_TOTAL_TIMEOUT_SECONDS,
        },
    }
