import asyncio
import json
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Request, Response, status
from sse_starlette.sse import EventSourceResponse

from backend.app.core.manager import scan_manager
from backend.app.core.rate_limiter import rate_limiter
from backend.app.core.scanner import run_osint_orchestrator
from backend.app.plugins import plugin_registry
from backend.app.schemas.scan import (
    ScanCreateRequest,
    ScanResponse,
    ScanSummary,
)

router = APIRouter()


@router.post("", response_model=ScanResponse, status_code=status.HTTP_201_CREATED)
async def create_scan(payload: ScanCreateRequest, request: Request, response: Response):
    # 1. Rate Limiting Check
    client_ip = request.client.host if request.client else "unknown"
    allowed, retry_after = rate_limiter.is_allowed(client_ip)
    if not allowed:
        response.headers["Retry-After"] = str(retry_after)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Try again in {retry_after} seconds.",
        )

    target = payload.target or payload.username
    input_type = payload.inputType or "username"

    # 2. Check available plugins for inputType
    available_plugins = plugin_registry.get_for_input_type(input_type)
    if payload.engines:
        selected_ids = [e.lower() for e in payload.engines]
        active_plugins = [
            p for p in available_plugins
            if p.id.lower() in selected_ids or p.name.lower() in selected_ids
        ]
    else:
        active_plugins = available_plugins

    if not active_plugins:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No active OSINT engines available for input type '{input_type}'.",
        )

    # Estimate platform counts based on input type & active engines
    engine_names = [p.name for p in active_plugins]
    if input_type == "username":
        est = 0
        if any(p.id == "whatsmyname" for p in active_plugins):
            est += 716
        if any(p.id == "sherlock" for p in active_plugins):
            est += 482
        if any(p.id == "maigret" for p in active_plugins):
            est += 250
        if any(p.id == "blackbird" for p in active_plugins):
            est += 140
        total_est = max(est, 100)
    elif input_type == "email":
        est = 0
        if any(p.id == "holehe" for p in active_plugins):
            est += 124
        if any(p.id == "blackbird" for p in active_plugins):
            est += 16
        if any(p.id == "ghunt" for p in active_plugins):
            est += 2
        if any(p.id == "breach" for p in active_plugins):
            est += 2
        total_est = max(est, 140)
    elif input_type == "phone":
        est = 0
        if any(p.id == "phoneinfoga" for p in active_plugins):
            est += 68
        if any(p.id == "ignorant" for p in active_plugins):
            est += 8
        if any(p.id == "breach" for p in active_plugins):
            est += 4
        total_est = max(est, 80)
    else:
        total_est = len(active_plugins) * 10

    # 3. Create scan session
    session = scan_manager.create_scan(
        target=target,
        input_type=input_type,
        engines=engine_names,
        username=payload.username or target,
        total_platforms=total_est,
    )

    # 4. Launch multi-plugin OSINT orchestrator asynchronously
    options = {"categories": payload.categories}
    task = asyncio.create_task(run_osint_orchestrator(session, options))
    session.task = task

    return ScanResponse(
        scanId=session.scan_id,
        target=session.target,
        username=session.username,
        inputType=session.input_type,
        engines=session.engines,
        status=session.status,
        totalPlatforms=session.total_platforms,
        createdAt=session.created_at.isoformat(),
        eventStreamUrl=f"/api/v1/scans/{session.scan_id}/events",
    )


@router.get("/{scan_id}/events")
async def stream_scan_events(scan_id: str, request: Request):
    session = scan_manager.get_scan(scan_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan ID '{scan_id}' not found or expired.",
        )

    async def event_generator():
        queue = session.add_subscriber()
        try:
            # Yield initial sync event
            yield {
                "event": "scan_sync",
                "id": f"{session.scan_id}-sync",
                "data": json.dumps({
                    "scanId": session.scan_id,
                    "target": session.target,
                    "username": session.username,
                    "inputType": session.input_type,
                    "engines": session.engines,
                    "status": session.status,
                    "totalPlatforms": session.total_platforms,
                    "resultsCount": len(session.results),
                }),
            }

            # If already completed or cancelled, yield final summary
            if session.status in ("completed", "cancelled", "failed"):
                summary = session.to_summary()
                yield {
                    "event": f"scan_{session.status}",
                    "id": f"{session.scan_id}-final",
                    "data": json.dumps(summary.model_dump()),
                }
                await asyncio.sleep(0.1)
                return

            # Listen for new events from queue
            while True:
                if await request.is_disconnected():
                    break
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield {
                        "event": event.type,
                        "id": event.eventId,
                        "data": json.dumps(event.data),
                    }
                    if event.type in ("scan_completed", "scan_cancelled", "scan_failed"):
                        await asyncio.sleep(0.1)
                        break
                except asyncio.TimeoutError:
                    # Send periodic keep-alive ping
                    yield {
                        "event": "ping",
                        "data": json.dumps({"time": datetime.now(timezone.utc).isoformat()}),
                    }
        finally:
            session.remove_subscriber(queue)

    return EventSourceResponse(
        event_generator(),
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@router.get("/{scan_id}", response_model=ScanSummary)
async def get_scan_summary(scan_id: str):
    session = scan_manager.get_scan(scan_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan ID '{scan_id}' not found or expired.",
        )
    return session.to_summary()


@router.post("/{scan_id}/cancel")
async def cancel_scan(scan_id: str):
    success = scan_manager.cancel_scan(scan_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Scan could not be cancelled (either not found or already finished).",
        )
    return {"message": "Scan cancelled successfully.", "scanId": scan_id}
