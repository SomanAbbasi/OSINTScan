import time
from collections import defaultdict
from typing import Dict, List, Tuple
from backend.app.config import get_settings


class InMemoryRateLimiter:
    """Sliding-window rate limiter per client IP address."""

    def __init__(self, max_requests: int = 30, window_seconds: int = 300):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, List[float]] = defaultdict(list)

    def is_allowed(self, client_ip: str) -> Tuple[bool, int]:
        now = time.time()
        window_start = now - self.window_seconds
        
        # Filter timestamps within current window
        valid_timestamps = [t for t in self.requests[client_ip] if t > window_start]
        self.requests[client_ip] = valid_timestamps

        if len(valid_timestamps) >= self.max_requests:
            # Oldest timestamp + window gives when next request will be allowed
            oldest = valid_timestamps[0]
            retry_after = max(1, int(oldest + self.window_seconds - now))
            return False, retry_after

        self.requests[client_ip].append(now)
        return True, 0

    def cleanup(self):
        now = time.time()
        window_start = now - self.window_seconds
        keys_to_remove = []
        for ip, timestamps in self.requests.items():
            valid = [t for t in timestamps if t > window_start]
            if valid:
                self.requests[ip] = valid
            else:
                keys_to_remove.append(ip)
        for ip in keys_to_remove:
            del self.requests[ip]


settings = get_settings()
rate_limiter = InMemoryRateLimiter(
    max_requests=settings.SCAN_MAX_PER_IP,
    window_seconds=settings.RATE_LIMIT_WINDOW_SECONDS
)
