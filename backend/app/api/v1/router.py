from fastapi import APIRouter
from backend.app.api.v1.scans import router as scans_router
from backend.app.api.v1.platforms import router as platforms_router
from backend.app.api.v1.plugins_router import router as plugins_router
from backend.app.api.v1.system import router as system_router

api_v1_router = APIRouter()

api_v1_router.include_router(scans_router, prefix="/scans", tags=["scans"])
api_v1_router.include_router(platforms_router, prefix="/platforms", tags=["platforms"])
api_v1_router.include_router(plugins_router, prefix="/plugins", tags=["plugins"])
api_v1_router.include_router(system_router, tags=["system"])
