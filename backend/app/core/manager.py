import asyncio
import re
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from backend.app.schemas.scan import (
    ConfidenceLevel,
    OSINTModuleResult,
    PlatformResult,
    PlatformStatus,
    ScanEvent,
    ScanSummary,
)


def canonical_platform_key(name: str) -> str:
    """Normalize platform name to canonical alphanumeric key for strict deduplication."""
    cleaned = name.lower().strip()
    cleaned = re.sub(r"^https?:\/\/", "", cleaned)
    cleaned = re.sub(r"^www\.", "", cleaned)
    if cleaned in ("x", "twitter", "x (twitter)", "twitter (x)"):
        return "twitter"
    cleaned = re.sub(r"\.(com|org|net|io|co|me|tv|app|gg|cc|ai|xyz)$", "", cleaned)
    alpha = re.sub(r"[^a-z0-9]", "", cleaned)
    return alpha or cleaned


class ScanSession:
    def __init__(
        self,
        scan_id: str,
        target: str,
        input_type: str = "username",
        engines: Optional[List[str]] = None,
        total_platforms: int = 100,
        username: Optional[str] = None,
    ):
        self.scan_id = scan_id
        self.target = target
        self.username = username or target
        self.input_type = input_type
        self.engines = engines or []
        self.total_platforms = total_platforms
        self.status = "pending"
        self.created_at = datetime.now(timezone.utc)
        self.results: List[PlatformResult] = []
        self.platform_index: Dict[str, int] = {}
        self.osint_results: List[OSINTModuleResult] = []
        self.subscribers: List[asyncio.Queue] = []
        self.cancel_event = asyncio.Event()
        self.task: Optional[asyncio.Task] = None
        self.event_counter = 0

    def add_subscriber(self) -> asyncio.Queue:
        q = asyncio.Queue()
        self.subscribers.append(q)
        return q

    def remove_subscriber(self, q: asyncio.Queue):
        if q in self.subscribers:
            self.subscribers.remove(q)

    def publish_event(self, event_type: str, data: Dict[str, Any]):
        self.event_counter += 1
        event = ScanEvent(
            eventId=f"{self.scan_id}-{self.event_counter}",
            type=event_type,
            scanId=self.scan_id,
            timestamp=datetime.now(timezone.utc).isoformat(),
            data=data,
        )
        for q in list(self.subscribers):
            try:
                q.put_nowait(event)
            except asyncio.QueueFull:
                pass

    def add_osint_result(self, osint_res: OSINTModuleResult):
        if self.cancel_event.is_set():
            return
        self.osint_results.append(osint_res)

        status_map = {
            "found": PlatformStatus.FOUND,
            "not_found": PlatformStatus.NOT_FOUND,
            "rate_limited": PlatformStatus.RATE_LIMITED,
            "blocked": PlatformStatus.BLOCKED,
            "uncertain": PlatformStatus.UNCERTAIN,
            "info": PlatformStatus.UNCERTAIN,
            "lookup": PlatformStatus.UNCERTAIN,
            "error": PlatformStatus.ERROR,
        }
        platform_status = status_map.get(osint_res.status.lower(), PlatformStatus.UNCERTAIN)
        display_name = osint_res.platformName or f"{osint_res.sourceName} Match"
        canon_key = canonical_platform_key(display_name)
        platform_id = f"platform_{canon_key}"

        meta = dict(osint_res.metadata or {})
        duration_ms = meta.get("durationMs", 0)

        # Check if this platform has already been evaluated by another engine
        if canon_key in self.platform_index:
            idx = self.platform_index[canon_key]
            existing = self.results[idx]

            # Merge confirming engines
            engines = existing.metadata.setdefault("engines", [existing.sourceEngine])
            if osint_res.sourceName not in engines:
                engines.append(osint_res.sourceName)
            existing.metadata["engines"] = engines
            existing.metadata["crossValidation"] = len(engines) > 1
            existing.metadata["crossValidationCount"] = len(engines)

            # If current engine confirms FOUND, upgrade overall status & confidence
            if platform_status == PlatformStatus.FOUND:
                existing.status = PlatformStatus.FOUND
                existing.confidence = ConfidenceLevel.HIGH
                if not existing.profileUrl and osint_res.profileUrl:
                    existing.profileUrl = osint_res.profileUrl
                for k, v in meta.items():
                    if v and k not in existing.metadata:
                        existing.metadata[k] = v
                existing.detectionReason = f"Confirmed across {', '.join(engines)}."
            elif existing.status != PlatformStatus.FOUND:
                existing.detectionReason = f"Evaluated across {', '.join(engines)}."

            self.publish_event("osint_result", osint_res.model_dump())
            self.publish_event("platform_result", existing.model_dump())
            return

        # New platform result
        confidence_str = meta.get("confidence", "high" if platform_status == PlatformStatus.FOUND else "medium")
        try:
            confidence = ConfidenceLevel(confidence_str)
        except Exception:
            confidence = ConfidenceLevel.HIGH if platform_status == PlatformStatus.FOUND else ConfidenceLevel.MEDIUM

        meta["engines"] = [osint_res.sourceName]
        meta["crossValidation"] = False
        meta["crossValidationCount"] = 1

        platform_res = PlatformResult(
            platformId=platform_id,
            name=display_name,
            displayName=display_name,
            category=osint_res.category,
            status=platform_status,
            profileUrl=osint_res.profileUrl,
            confidence=confidence,
            detectionReason=f"Detected via {osint_res.sourceName} engine." if platform_status == PlatformStatus.FOUND else f"Checked via {osint_res.sourceName}.",
            durationMs=duration_ms,
            sourceEngine=osint_res.sourceName,
            metadata=meta,
        )
        self.results.append(platform_res)
        self.platform_index[canon_key] = len(self.results) - 1

        # Stream both OSINT and Platform results
        self.publish_event("osint_result", osint_res.model_dump())
        self.publish_event("platform_result", platform_res.model_dump())

    def to_summary(self) -> ScanSummary:
        duration = (datetime.now(timezone.utc) - self.created_at).total_seconds()
        found = sum(1 for r in self.results if r.status.value == "FOUND")
        not_found = sum(1 for r in self.results if r.status.value == "NOT_FOUND")
        uncertain = sum(1 for r in self.results if r.status.value == "UNCERTAIN")
        blocked = sum(1 for r in self.results if r.status.value in ("BLOCKED", "RATE_LIMITED"))
        error = sum(1 for r in self.results if r.status.value in ("ERROR", "TIMEOUT"))

        return ScanSummary(
            scanId=self.scan_id,
            target=self.target,
            username=self.username,
            inputType=self.input_type,
            engines=self.engines,
            status=self.status,
            totalChecked=len(self.results),
            totalPlatforms=self.total_platforms,
            foundCount=found,
            notFoundCount=not_found,
            uncertainCount=uncertain,
            blockedCount=blocked,
            errorCount=error,
            durationSeconds=round(duration, 2),
            createdAt=self.created_at.isoformat(),
            results=self.results,
            osintResults=self.osint_results,
        )


class ScanManager:
    def __init__(self):
        self.scans: Dict[str, ScanSession] = {}

    def create_scan(
        self,
        username: Optional[str] = None,
        target: Optional[str] = None,
        input_type: str = "username",
        engines: Optional[List[str]] = None,
        total_platforms: int = 100,
    ) -> ScanSession:
        scan_id = str(uuid.uuid4())
        eff_target = target or username or "unknown"
        eff_user = username or eff_target
        session = ScanSession(
            scan_id=scan_id,
            target=eff_target,
            username=eff_user,
            input_type=input_type,
            engines=engines or [],
            total_platforms=total_platforms,
        )
        self.scans[scan_id] = session
        return session

    def get_scan(self, scan_id: str) -> Optional[ScanSession]:
        return self.scans.get(scan_id)

    def cancel_scan(self, scan_id: str) -> bool:
        session = self.get_scan(scan_id)
        if session and session.status == "running":
            session.cancel_event.set()
            session.status = "cancelled"
            session.publish_event("scan_cancelled", {"scanId": scan_id})
            if session.task and not session.task.done():
                session.task.cancel()
            return True
        return False

    def cleanup_old_scans(self, max_age_seconds: int = 1800):
        now = datetime.now(timezone.utc)
        to_delete = []
        for sid, s in self.scans.items():
            if (now - s.created_at).total_seconds() > max_age_seconds:
                to_delete.append(sid)
        for sid in to_delete:
            del self.scans[sid]


scan_manager = ScanManager()
