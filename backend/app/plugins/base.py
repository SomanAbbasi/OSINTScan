from abc import ABC, abstractmethod
from typing import Any, AsyncIterator, Dict, List, Optional
from backend.app.schemas.scan import OSINTModuleResult, PluginInfo


class BaseOSINTPlugin(ABC):
    """
    Abstract Base Class for all OSINT plugins.
    Ensures seamless modularity and pluggability for future intelligence
    and breach engines without modifying core routers or UI code.
    """

    id: str
    name: str
    version: str
    description: str
    icon: str = "shield"
    supported_input_types: List[str]  # e.g. ["email", "username", "phone", "breach"]

    def to_info(self) -> PluginInfo:
        return PluginInfo(
            id=self.id,
            name=self.name,
            version=self.version,
            description=self.description,
            supportedInputTypes=self.supported_input_types,
            enabled=True,
        )

    @abstractmethod
    async def execute(
        self,
        target: str,
        input_type: str,
        options: Optional[Dict[str, Any]] = None,
    ) -> AsyncIterator[OSINTModuleResult]:
        """
        Execute the OSINT intelligence search asynchronously.
        Yields structured OSINTModuleResult items as each platform finishes.
        """
        pass
