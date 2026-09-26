import asyncio
import json
import time
from typing import List, Optional
import httpx

from backend.app.config import get_settings
from backend.app.core.classifier import classify_response
from backend.app.core.manager import ScanSession
from backend.app.core.security import build_safe_check_url
from backend.app.schemas.platform import PlatformRule
from backend.app.schemas.scan import ConfidenceLevel, PlatformResult, PlatformStatus

settings = get_settings()


def load_platform_rules(category_filter: Optional[List[str]] = None) -> List[PlatformRule]:
    """Load and filter enabled platform rules from data/generated/sites.json."""
    if not settings.SITES_FILE.exists():
        return []

    with open(settings.SITES_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    rules = []
    for raw in data.get("sites", []):
        if not raw.get("enabled", True):
            continue
        if category_filter and raw.get("category") not in category_filter:
            continue
        try:
            rules.append(PlatformRule(**raw))
        except Exception:
            continue
    return rules


async def check_single_platform(
    client: httpx.AsyncClient,
    session: ScanSession,
    site: PlatformRule,
    semaphore: asyncio.Semaphore,
) -> Optional[PlatformResult]:
    """Check a single platform rule against the session's username."""
    if session.cancel_event.is_set():
        return None

    raw_username = session.username
    username_candidates = [raw_username.lower()]
    if raw_username != raw_username.lower():
        username_candidates.append(raw_username)

    start_time = time.monotonic()

    # Validate URL template once upfront
    try:
        build_safe_check_url(site.uriCheck, username_candidates[0], site.stripBadChar)
    except Exception as e:
        return PlatformResult(
            platformId=site.id,
            name=site.name,
            displayName=site.displayName,
            category=site.category,
            status=PlatformStatus.ERROR,
            profileUrl=None,
            confidence=ConfidenceLevel.LOW,
            detectionReason=f"Invalid check URL template: {e}",
            durationMs=0,
            requiresManualVerification=True,
        )

    async with semaphore:
        if session.cancel_event.is_set():
            return None

        # Notify platform checking started
        session.publish_event("platform_started", {
            "platformId": site.id,
            "displayName": site.displayName,
            "category": site.category,
        })

        try:
            headers = {
                "User-Agent": settings.USER_AGENT,
                "Accept-Language": "en-US,en;q=0.9",
                "Cookie": "SOCS=CAESHAgBEhJnd3NfMjAyMzA4MTAtMF9SQzIaAmVuIAEaBgiAo_CmBg; CONSENT=YES+cb.20210720-07-p0.en+FX+410",
            }
            if site.headers:
                headers.update(site.headers)

            result = None
            for candidate in username_candidates:
                url = build_safe_check_url(site.uriCheck, candidate, site.stripBadChar)
                if site.uriPretty:
                    try:
                        profile_url = site.uriPretty.replace("{account}", candidate)
                    except Exception:
                        profile_url = url
                else:
                    profile_url = url

                if site.postBody:
                    post_body_str = json.dumps(site.postBody) if isinstance(site.postBody, (dict, list)) else str(site.postBody)
                    post_payload = post_body_str.replace("{account}", candidate)
                    response = await client.post(
                        url,
                        content=post_payload,
                        headers=headers,
                        timeout=settings.SCAN_SITE_TIMEOUT_SECONDS,
                        follow_redirects=True,
                    )
                else:
                    response = await client.get(
                        url,
                        headers=headers,
                        timeout=settings.SCAN_SITE_TIMEOUT_SECONDS,
                        follow_redirects=True,
                    )

                duration_ms = int((time.monotonic() - start_time) * 1000)
                status_code = response.status_code
                body_text = response.text

                e_str = site.eString.replace("{account}", candidate) if site.eString else ""
                m_str = site.mString.replace("{account}", candidate) if site.mString else ""

                status, confidence, reason = classify_response(
                    status_code=status_code,
                    body_text=body_text,
                    e_code=site.eCode,
                    e_string=e_str,
                    m_code=site.mCode,
                    m_string=m_str,
                    protections=site.protection,
                )

                result = PlatformResult(
                    platformId=site.id,
                    name=site.name,
                    displayName=site.displayName,
                    category=site.category,
                    status=status,
                    profileUrl=profile_url if status == PlatformStatus.FOUND else None,
                    confidence=confidence,
                    detectionReason=reason,
                    durationMs=duration_ms,
                    httpStatus=status_code,
                    requiresManualVerification=site.requiresManualVerification or (confidence != ConfidenceLevel.HIGH),
                    privacyNotes=site.privacyNotes,
                )

                if status == PlatformStatus.FOUND:
                    break

        except httpx.TimeoutException:
            duration_ms = int((time.monotonic() - start_time) * 1000)
            result = PlatformResult(
                platformId=site.id,
                name=site.name,
                displayName=site.displayName,
                category=site.category,
                status=PlatformStatus.TIMEOUT,
                profileUrl=None,
                confidence=ConfidenceLevel.LOW,
                detectionReason=f"Request timed out after {settings.SCAN_SITE_TIMEOUT_SECONDS}s.",
                durationMs=duration_ms,
                requiresManualVerification=True,
            )
        except Exception as e:
            duration_ms = int((time.monotonic() - start_time) * 1000)
            result = PlatformResult(
                platformId=site.id,
                name=site.name,
                displayName=site.displayName,
                category=site.category,
                status=PlatformStatus.ERROR,
                profileUrl=None,
                confidence=ConfidenceLevel.LOW,
                detectionReason=f"Network error: {type(e).__name__}",
                durationMs=duration_ms,
                requiresManualVerification=True,
            )

    if not session.cancel_event.is_set():
        session.results.append(result)
        # Stream result event to frontend
        session.publish_event("platform_result", result.model_dump())

    return result


async def run_scan_job(session: ScanSession, sites: List[PlatformRule]):
    """Execute scan across all candidate sites with bounded concurrency."""
    session.status = "running"
    session.publish_event("scan_started", {
        "scanId": session.scan_id,
        "username": session.username,
        "totalPlatforms": len(sites),
    })

    semaphore = asyncio.Semaphore(settings.SCAN_MAX_CONCURRENCY)

    limits = httpx.Limits(max_keepalive_connections=20, max_connections=50)
    async with httpx.AsyncClient(limits=limits, verify=False) as client:
        tasks = [
            check_single_platform(client, session, site, semaphore)
            for site in sites
        ]

        # Process with overall timeout
        try:
            await asyncio.wait_for(
                asyncio.gather(*tasks, return_exceptions=True),
                timeout=settings.SCAN_TOTAL_TIMEOUT_SECONDS,
            )
        except asyncio.TimeoutError:
            session.publish_event("platform_error", {
                "message": "Scan reached total execution timeout limit."
            })
        except asyncio.CancelledError:
            session.status = "cancelled"
            return
        except Exception as e:
            session.status = "failed"
            session.publish_event("scan_failed", {"error": str(e)})
            return

    if session.cancel_event.is_set():
        session.status = "cancelled"
    else:
        session.status = "completed"
        summary = session.to_summary()
        session.publish_event("scan_completed", summary.model_dump())


async def run_osint_orchestrator(session: ScanSession, options: Optional[dict] = None):
    """
    Coordinates and executes all selected OSINT plugins concurrently.
    Publishes live engine lifecycle events and real-time streaming results.
    """
    from backend.app.plugins import plugin_registry

    session.status = "running"
    session.publish_event("scan_started", {
        "scanId": session.scan_id,
        "target": session.target,
        "username": session.username,
        "inputType": session.input_type,
        "engines": session.engines,
        "totalPlatforms": session.total_platforms,
    })

    available = plugin_registry.get_for_input_type(session.input_type)
    if session.engines:
        selected_ids = [e.lower() for e in session.engines]
        plugins_to_run = [
            p for p in available
            if p.id.lower() in selected_ids or p.name.lower() in selected_ids
        ]
    else:
        plugins_to_run = available

    if not plugins_to_run:
        session.status = "completed"
        session.publish_event("scan_completed", session.to_summary().model_dump())
        return

    session.engines = [p.name for p in plugins_to_run]

    async def execute_plugin(plugin):
        session.publish_event("engine_started", {
            "engine": plugin.name,
            "id": plugin.id,
            "category": session.input_type,
        })
        plugin_target = session.target.lower() if session.input_type == "username" else session.target
        plugin_options = dict(options or {})
        plugin_options["raw_target"] = session.target
        try:
            async for result in plugin.execute(plugin_target, session.input_type, plugin_options):
                if session.cancel_event.is_set():
                    break
                session.add_osint_result(result)
        except Exception as e:
            session.publish_event("engine_error", {
                "engine": plugin.name,
                "id": plugin.id,
                "error": str(e),
            })
        finally:
            session.publish_event("engine_completed", {
                "engine": plugin.name,
                "id": plugin.id,
            })

    try:
        tasks = [asyncio.create_task(execute_plugin(p)) for p in plugins_to_run]
        await asyncio.wait_for(
            asyncio.gather(*tasks, return_exceptions=True),
            timeout=settings.SCAN_TOTAL_TIMEOUT_SECONDS,
        )
    except asyncio.TimeoutError:
        session.publish_event("platform_error", {
            "message": "Scan reached total execution timeout limit."
        })
    except asyncio.CancelledError:
        session.status = "cancelled"
        return
    except Exception as e:
        session.status = "failed"
        session.publish_event("scan_failed", {"error": str(e)})
        return

    if session.cancel_event.is_set():
        session.status = "cancelled"
    else:
        session.status = "completed"
        summary = session.to_summary()
        session.publish_event("scan_completed", summary.model_dump())

