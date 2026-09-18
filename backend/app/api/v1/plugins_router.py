from typing import List
from fastapi import APIRouter
from backend.app.plugins import plugin_registry
from backend.app.schemas.scan import PluginInfo

router = APIRouter()


@router.get("", response_model=List[PluginInfo])
async def list_available_plugins():
    """
    Enumerate all registered OSINT plugins, supported input types,
    versioning, and system readiness.
    """
    return plugin_registry.list_plugins()
