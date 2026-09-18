from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, model_validator
import re


class PlatformStatus(str, Enum):
    FOUND = "FOUND"
    NOT_FOUND = "NOT_FOUND"
    UNCERTAIN = "UNCERTAIN"
    BLOCKED = "BLOCKED"
    RATE_LIMITED = "RATE_LIMITED"
    TIMEOUT = "TIMEOUT"
    ERROR = "ERROR"
    SKIPPED = "SKIPPED"


class ConfidenceLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    MANUAL_REVIEW = "manual_review"


class OSINTCategory(str, Enum):
    EMAIL = "email"
    USERNAME = "username"
    PHONE = "phone"
    BREACH = "breach"


class OSINTStatus(str, Enum):
    FOUND = "found"
    NOT_FOUND = "not_found"
    ERROR = "error"
    RATE_LIMITED = "rate_limited"


class OSINTModuleResult(BaseModel):
    sourceName: str = Field(..., description="Engine name, e.g. Holehe, GHunt, Blackbird, WhatsMyName, Ignorant, Breach")
    category: str = Field(..., description="Target category: email, username, phone, or breach")
    target: str = Field(..., description="Searched target identifier")
    status: str = Field(..., description="Result status: found, not_found, error, rate_limited")
    platformName: Optional[str] = Field(default=None, description="Platform or domain name, e.g. Twitter, Google Maps, Snapchat")
    profileUrl: Optional[str] = Field(default=None, description="Direct URL to public profile or proof")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Structured intelligence metadata (GAIA ID, avatars, recovery hints)")
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class PluginInfo(BaseModel):
    id: str
    name: str
    version: str
    description: str
    supportedInputTypes: List[str]
    enabled: bool = True
    author: Optional[str] = None


class ScanCreateRequest(BaseModel):
    target: Optional[str] = Field(default=None, description="Target query: username, email, E.164 phone, or breach query")
    username: Optional[str] = Field(default=None, description="Legacy username input parameter for backward compatibility")
    inputType: str = Field(default="username", description="Input category: 'username', 'email', 'phone', or 'breach'")
    engines: Optional[List[str]] = Field(default=None, description="Optional list of specific engine IDs to execute")
    categories: Optional[List[str]] = Field(default=None, description="Optional platform category filter")

    @model_validator(mode="before")
    @classmethod
    def reconcile_target_and_username(cls, data: Any) -> Any:
        if not isinstance(data, dict):
            return data
        
        target = data.get("target")
        username = data.get("username")
        input_type = data.get("inputType", "username")

        # Reconcile target vs username
        if not target and username:
            target = username
            data["target"] = target
        elif target and not username:
            data["username"] = target
            
        if not target or not str(target).strip():
            raise ValueError("Target input cannot be empty.")
            
        target = str(target).strip()
        data["target"] = target
        data["username"] = target

        # Validate input format according to inputType
        input_type_normalized = input_type.lower().strip()
        data["inputType"] = input_type_normalized

        if input_type_normalized == "username":
            if len(target) > 64:
                raise ValueError("Username must be 64 characters or fewer.")
            if not re.match(r"^[a-zA-Z0-9_\-\.]{1,64}$", target):
                raise ValueError("Username contains invalid characters. Use letters, numbers, '.', '_', or '-'.")
        elif input_type_normalized == "email":
            email_pattern = r"^[\w\.\+\-]+@[\w\-]+\.[a-zA-Z0-9\.\-_]{2,}$"
            if not re.match(email_pattern, target):
                raise ValueError(f"Invalid email address format: '{target}'. Example: user@example.com")
        elif input_type_normalized == "phone":
            # Strip spaces, dashes, parentheses
            sanitized_phone = re.sub(r"[\s\-\(\)]", "", target)
            if not re.match(r"^\+?[1-9]\d{6,14}$", sanitized_phone):
                raise ValueError("Invalid phone number format. Standard E.164 international format expected, e.g. +14155552671 or +923001234567")
            data["target"] = sanitized_phone if sanitized_phone.startswith("+") else f"+{sanitized_phone}"
            data["username"] = data["target"]
        elif input_type_normalized == "breach":
            if len(target) > 128:
                raise ValueError("Breach query string is too long (max 128 chars).")
        else:
            raise ValueError(f"Unsupported input type '{input_type}'. Supported types: username, email, phone, breach")

        return data


class PlatformResult(BaseModel):
    platformId: str
    name: str
    displayName: str
    category: str
    status: PlatformStatus
    profileUrl: Optional[str] = None
    confidence: ConfidenceLevel
    detectionReason: str
    durationMs: int
    httpStatus: Optional[int] = None
    requiresManualVerification: bool = False
    privacyNotes: Optional[str] = None
    sourceEngine: Optional[str] = "WhatsMyName"
    metadata: Optional[Dict[str, Any]] = None


class ScanResponse(BaseModel):
    scanId: str
    target: str
    username: str
    inputType: str = "username"
    engines: List[str] = []
    status: str
    totalPlatforms: int
    createdAt: str
    eventStreamUrl: str


class ScanEvent(BaseModel):
    eventId: str
    type: str
    scanId: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    data: Dict[str, Any]


class ScanSummary(BaseModel):
    scanId: str
    target: str
    username: str
    inputType: str = "username"
    engines: List[str] = []
    status: str
    totalChecked: int
    totalPlatforms: int
    foundCount: int
    notFoundCount: int
    uncertainCount: int
    blockedCount: int
    errorCount: int
    durationSeconds: float
    createdAt: str
    results: List[PlatformResult]
    osintResults: List[OSINTModuleResult] = []
