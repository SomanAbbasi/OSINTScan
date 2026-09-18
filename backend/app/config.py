from functools import lru_cache
from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

REPO_ROOT = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    PROJECT_NAME: str = "HandleScope OSINT API"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Core Data Paths
    REPO_ROOT: Path = REPO_ROOT
    DATA_DIR: Path = REPO_ROOT / "data"
    SITES_FILE: Path = REPO_ROOT / "data" / "generated" / "sites.json"
    MANIFEST_FILE: Path = REPO_ROOT / "data" / "manifest.json"
    PLATFORM_DISPLAY_FILE: Path = REPO_ROOT / "data" / "platform-display.json"

    # External Engine Paths (Github Repo)
    GITHUB_REPO_DIR: Path = REPO_ROOT / "Github Repo"
    BLACKBIRD_DIR: Path = GITHUB_REPO_DIR / "blackbird-main" / "blackbird-main"
    HOLEHE_DIR: Path = GITHUB_REPO_DIR / "holehe-master" / "holehe-master"
    GHUNT_DIR: Path = GITHUB_REPO_DIR / "GHunt-master" / "GHunt-master"
    IGNORANT_DIR: Path = GITHUB_REPO_DIR / "ignorant-main" / "ignorant-main"
    SHERLOCK_DIR: Path = GITHUB_REPO_DIR / "sherlock-master" / "sherlock-master"
    SHERLOCK_DATA_FILE: Path = SHERLOCK_DIR / "sherlock_project" / "resources" / "data.json"
    MAIGRET_DIR: Path = GITHUB_REPO_DIR / "maigret-main" / "maigret-main"
    MAIGRET_DATA_FILE: Path = MAIGRET_DIR / "maigret" / "resources" / "data.json"

    # Scan engine configuration
    SCAN_MAX_CONCURRENCY: int = 25
    SCAN_SITE_TIMEOUT_SECONDS: float = 8.0
    SCAN_TOTAL_TIMEOUT_SECONDS: float = 90.0
    
    # Rate Limiting
    SCAN_MAX_PER_IP: int = 30
    RATE_LIMIT_WINDOW_SECONDS: int = 300
    
    # Scanner Identity
    USER_AGENT: str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
    
    # Optional Third-Party Keys
    HIBP_API_KEY: Optional[str] = None
    GHUNT_MASTER_TOKEN: Optional[str] = None
    GHUNT_CREDS: Optional[str] = None
    
    # Admin Security
    ADMIN_API_KEY: str = "hs_admin_secret_key_change_in_production"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "https://osint-scan.vercel.app",
        "https://osint-scan-backend.vercel.app",
        "https://handlescope.org",
    ]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache()
def get_settings() -> Settings:
    return Settings()
