from typing import Dict, List, Optional
from backend.app.plugins.base import BaseOSINTPlugin
from backend.app.schemas.scan import PluginInfo


class OSINTPluginRegistry:
    """
    Central registry managing available and registered OSINT plugins.
    Enables runtime plugin discovery, capability querying, and extensible execution.
    """

    def __init__(self):
        self._plugins: Dict[str, BaseOSINTPlugin] = {}

    def register(self, plugin: BaseOSINTPlugin) -> None:
        self._plugins[plugin.id.lower()] = plugin

    def get(self, plugin_id: str) -> Optional[BaseOSINTPlugin]:
        return self._plugins.get(plugin_id.lower())

    def get_for_input_type(self, input_type: str) -> List[BaseOSINTPlugin]:
        normalized = input_type.lower().strip()
        return [
            plugin for plugin in self._plugins.values()
            if normalized in [t.lower() for t in plugin.supported_input_types]
        ]

    def list_plugins(self) -> List[PluginInfo]:
        return [plugin.to_info() for plugin in self._plugins.values()]

    def all_plugins(self) -> List[BaseOSINTPlugin]:
        return list(self._plugins.values())


# Singleton registry instance
plugin_registry = OSINTPluginRegistry()
