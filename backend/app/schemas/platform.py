from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class PlatformRule(BaseModel):
    id: str
    name: str
    displayName: str
    slug: str
    category: str
    uriCheck: str
    uriPretty: Optional[str] = None
    eCode: int = 200
    eString: Optional[str] = ""
    mCode: Optional[int] = None
    mString: Optional[str] = ""
    postBody: Optional[Any] = None
    headers: Optional[Dict[str, str]] = Field(default_factory=dict)
    stripBadChar: Optional[str] = None
    knownUsernames: List[str] = Field(default_factory=list)
    enabled: bool = True
    confidence: str = "high"
    protection: List[str] = Field(default_factory=list)
    requiresManualVerification: bool = False
    detectionNotes: Optional[str] = ""
    privacyNotes: Optional[str] = ""
    source: str = "upstream"


class PlatformDisplay(BaseModel):
    slug: str
    id: str
    name: str
    displayName: str
    category: str
    icon: str = "globe"
    accentColor: str = "#6366f1"
    officialUrl: str = ""
    uriPattern: str = ""
    uriPretty: str = ""
    shortDescription: str = ""
    whatItTests: str = ""
    commonFalsePositives: str = ""
    verificationAdvice: str = ""
    confidence: str = "high"
    requiresManualVerification: bool = False
    enabled: bool = True
    protection: List[str] = Field(default_factory=list)


class PlatformListResponse(BaseModel):
    total: int
    enabled: int
    categories: List[str]
    platforms: List[PlatformDisplay]
