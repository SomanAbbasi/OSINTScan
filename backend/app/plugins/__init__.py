from backend.app.plugins.base import BaseOSINTPlugin
from backend.app.plugins.registry import plugin_registry, OSINTPluginRegistry
from backend.app.plugins.whatsmyname_plugin import WhatsMyNamePlugin
from backend.app.plugins.blackbird_plugin import BlackbirdPlugin
from backend.app.plugins.holehe_plugin import HolehePlugin
from backend.app.plugins.ghunt_plugin import GHuntPlugin
from backend.app.plugins.ignorant_plugin import IgnorantPlugin
from backend.app.plugins.breach_plugin import BreachLookupPlugin
from backend.app.plugins.sherlock_plugin import SherlockPlugin
from backend.app.plugins.maigret_plugin import MaigretPlugin
from backend.app.plugins.phoneinfoga_plugin import PhoneInfogaPlugin

# Register built-in OSINT plugins
plugin_registry.register(WhatsMyNamePlugin())
plugin_registry.register(BlackbirdPlugin())
plugin_registry.register(SherlockPlugin())
plugin_registry.register(MaigretPlugin())
plugin_registry.register(HolehePlugin())
plugin_registry.register(GHuntPlugin())
plugin_registry.register(IgnorantPlugin())
plugin_registry.register(PhoneInfogaPlugin())
plugin_registry.register(BreachLookupPlugin())

__all__ = [
    "BaseOSINTPlugin",
    "plugin_registry",
    "OSINTPluginRegistry",
    "WhatsMyNamePlugin",
    "BlackbirdPlugin",
    "SherlockPlugin",
    "MaigretPlugin",
    "HolehePlugin",
    "GHuntPlugin",
    "IgnorantPlugin",
    "BreachLookupPlugin",
]
