import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.v1.router import api_v1_router
from backend.app.config import get_settings
from backend.app.core.manager import scan_manager
from backend.app.core.rate_limiter import rate_limiter

settings = get_settings()


async def periodic_cleanup_task():
    """Background task to cleanup stale in-memory scans and rate limit windows."""
    while True:
        try:
            await asyncio.sleep(300)
            scan_manager.cleanup_old_scans(max_age_seconds=1800)
            rate_limiter.cleanup()
        except asyncio.CancelledError:
            break
        except Exception:
            pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    cleanup_task = asyncio.create_task(periodic_cleanup_task())
    yield
    # Shutdown
    cleanup_task.cancel()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="HandleScope Public Username Footprint Auditing API",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*(osintscan\.(app|org)|vercel\.app)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "service": "HandleScope API",
        "tagline": "Search your public username footprint across the web.",
        "version": settings.VERSION,
        "docs": "/docs",
    }
