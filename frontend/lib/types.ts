export type PlatformStatus =
  | "FOUND"
  | "NOT_FOUND"
  | "UNCERTAIN"
  | "BLOCKED"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "ERROR"
  | "SKIPPED";

export type ConfidenceLevel = "high" | "medium" | "low" | "manual_review";

export type OSINTInputType = "username" | "email" | "phone" | "breach";

export interface OSINTModuleResult {
  sourceName: string; // e.g. "WhatsMyName", "Blackbird", "Holehe", "GHunt", "Ignorant", "Breach Intelligence"
  category: "email" | "username" | "phone" | "breach" | string;
  target: string;
  status: "found" | "not_found" | "error" | "rate_limited" | string;
  platformName?: string;
  profileUrl?: string | null;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface OSINTPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  supportedInputTypes: ("email" | "username" | "phone" | "breach" | string)[];
  enabled: boolean;
  author?: string;
}

export interface PlatformResult {
  platformId: string;
  name: string;
  displayName: string;
  category: string;
  status: PlatformStatus;
  profileUrl?: string | null;
  confidence: ConfidenceLevel;
  detectionReason: string;
  durationMs: number;
  httpStatus?: number | null;
  requiresManualVerification: boolean;
  privacyNotes?: string | null;
  sourceEngine?: string;
  metadata?: Record<string, any>;
}

export interface ScanResponse {
  scanId: string;
  target?: string;
  username: string;
  inputType?: string;
  engines?: string[];
  status: "pending" | "running" | "completed" | "cancelled" | "failed";
  totalPlatforms: number;
  createdAt: string;
  eventStreamUrl: string;
}

export interface ScanSummary {
  scanId: string;
  target?: string;
  username: string;
  inputType?: string;
  engines?: string[];
  status: string;
  totalChecked: number;
  totalPlatforms: number;
  foundCount: number;
  notFoundCount: number;
  uncertainCount: number;
  blockedCount: number;
  errorCount: number;
  durationSeconds: number;
  createdAt: string;
  results: PlatformResult[];
  osintResults?: OSINTModuleResult[];
}

export interface PlatformDisplay {
  slug: string;
  id: string;
  name: string;
  displayName: string;
  category: string;
  icon: string;
  accentColor: string;
  officialUrl: string;
  uriPattern: string;
  uriPretty: string;
  shortDescription: string;
  whatItTests: string;
  commonFalsePositives: string;
  verificationAdvice: string;
  confidence: string;
  requiresManualVerification: boolean;
  enabled: boolean;
  protection: string[];
}
