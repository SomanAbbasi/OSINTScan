import asyncio
import sys
import time
from typing import Any, AsyncIterator, Dict, List, Optional
import httpx

from backend.app.config import get_settings
from backend.app.plugins.base import BaseOSINTPlugin
from backend.app.schemas.scan import OSINTModuleResult

settings = get_settings()


class HolehePlugin(BaseOSINTPlugin):
    id = "holehe"
    name = "Holehe"
    version = "1.61"
    description = "Password-reset and account existence auditing across 120+ platforms."
    icon = "mail-check"
    supported_input_types = ["email"]

    def __init__(self):
        self._functions = None

    def _ensure_functions_loaded(self):
        if self._functions is not None:
            return self._functions

        holehe_dir = str(settings.HOLEHE_DIR)
        if holehe_dir not in sys.path:
            sys.path.insert(0, holehe_dir)

        try:
            from holehe.core import import_submodules, get_functions
            modules = import_submodules("holehe.modules")
            self._functions = get_functions(modules)
        except Exception as e:
            import logging
            logging.getLogger(__name__).error(f"Failed to load Holehe modules: {e}", exc_info=True)
            self._functions = []
        return self._functions

    async def execute(
        self,
        target: str,
        input_type: str,
        options: Optional[Dict[str, Any]] = None,
    ) -> AsyncIterator[OSINTModuleResult]:
        funcs = self._ensure_functions_loaded()
        if not funcs:
            return

        semaphore = asyncio.Semaphore(15)
        queue: asyncio.Queue[Optional[OSINTModuleResult]] = asyncio.Queue()

        async def worker(client: httpx.AsyncClient, func):
            start_time = time.monotonic()
            out_list: List[Dict[str, Any]] = []
            async with semaphore:
                try:
                    await func(target, client, out_list)
                except Exception as e:
                    func_name = getattr(func, "__name__", "unknown")
                    out_list.append({
                        "name": func_name,
                        "domain": f"{func_name}.com",
                        "rateLimit": False,
                        "error": True,
                        "exists": False,
                        "emailrecovery": None,
                        "phoneNumber": None,
                        "others": {"errorMessage": str(e)},
                    })

            duration_ms = int((time.monotonic() - start_time) * 1000)

            for item in out_list:
                name = item.get("name", "unknown")
                domain = item.get("domain", f"{name}.com")
                exists = bool(item.get("exists", False))
                rate_limit = bool(item.get("rateLimit", False))
                is_error = bool(item.get("error", False))

                if exists:
                    status_str = "found"
                elif rate_limit:
                    status_str = "rate_limited"
                elif is_error:
                    status_str = "error"
                else:
                    status_str = "not_found"

                profile_url = f"https://{domain}" if domain else None

                metadata = {
                    "site": name,
                    "domain": domain,
                    "exists": exists,
                    "rate_limited": rate_limit,
                    "method": item.get("method", "password-recovery"),
                    "emailrecovery": item.get("emailrecovery"),
                    "phoneNumber": item.get("phoneNumber"),
                    "others": item.get("others"),
                    "durationMs": duration_ms,
                }

                res = OSINTModuleResult(
                    sourceName=self.name,
                    category="email",
                    target=target,
                    status=status_str,
                    platformName=domain,
                    profileUrl=profile_url,
                    metadata=metadata,
                )
                await queue.put(res)

        async def run_all():
            limits = httpx.Limits(max_keepalive_connections=20, max_connections=40)
            async with httpx.AsyncClient(limits=limits, timeout=12.0, verify=False) as client:
                tasks = [asyncio.create_task(worker(client, fn)) for fn in funcs]
                await asyncio.gather(*tasks, return_exceptions=True)
            await queue.put(None)

        task_runner = asyncio.create_task(run_all())
        try:
            while True:
                item = await queue.get()
                if item is None:
                    break
                yield item
        finally:
            if not task_runner.done():
                task_runner.cancel()
