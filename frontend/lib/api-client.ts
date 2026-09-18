import { OSINTPlugin, PlatformDisplay, ScanResponse, ScanSummary } from "./types";

/**
 * Dynamically resolves the API Base URL.
 * - On localhost (e.g. http://localhost:3000, 127.0.0.1, local network):
 *   Automatically connects to the local backend (http://localhost:8000),
 *   without requiring manual .env toggling.
 * - In production (e.g. osint-scan.vercel.app, osintscan.org):
 *   Directs requests to the production backend (https://osint-scan-backend.vercel.app),
 *   never attempting to connect to localhost.
 */
export function getApiBase(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname.endsWith(".local") ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.");

    if (isLocalhost) {
      // Local development runtime: default to local backend on port 8000
      // Respect explicit local override if provided
      if (process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL) {
        return process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL.replace(/\/+$/, "");
      }
      return "http://localhost:8000";
    }

    // Production browser runtime: never use localhost
    const configured = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (configured && !configured.includes("localhost") && !configured.includes("127.0.0.1")) {
      return configured.replace(/\/+$/, "");
    }
    return "https://osint-scan-backend.vercel.app";
  }

  // Server-Side Rendering (SSR) / Node runtime
  if (process.env.NODE_ENV === "production") {
    const configured = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (configured && !configured.includes("localhost") && !configured.includes("127.0.0.1")) {
      return configured.replace(/\/+$/, "");
    }
    return "https://osint-scan-backend.vercel.app";
  }

  return (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "");
}

export interface CreateScanOptions {
  target?: string;
  username?: string;
  inputType?: string;
  engines?: string[];
  categories?: string[];
}

export async function createScan(
  targetOrOptions: string | CreateScanOptions,
  legacyCategories?: string[]
): Promise<ScanResponse> {
  let body: Record<string, any>;

  if (typeof targetOrOptions === "string") {
    body = {
      target: targetOrOptions,
      username: targetOrOptions,
      inputType: "username",
      categories: legacyCategories,
    };
  } else {
    body = {
      target: targetOrOptions.target || targetOrOptions.username,
      username: targetOrOptions.username || targetOrOptions.target,
      inputType: targetOrOptions.inputType || "username",
      engines: targetOrOptions.engines,
      categories: targetOrOptions.categories,
    };
  }

  const apiBase = getApiBase();

  let res: Response;
  try {
    res = await fetch(`${apiBase}/api/v1/scans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err: any) {
    const isLocal = apiBase.includes("localhost") || apiBase.includes("127.0.0.1");
    if (isLocal) {
      throw new Error(
        `Unable to reach local backend at ${apiBase}. Please ensure your Python backend is running on port 8000 (uvicorn app.main:app --port 8000).`
      );
    }
    throw new Error(err.message || "Failed to reach scan backend.");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Failed to start scan" }));
    throw new Error(errorData.detail || `Server returned HTTP ${res.status}`);
  }

  return res.json();
}

export async function getScanSummary(scanId: string): Promise<ScanSummary> {
  const apiBase = getApiBase();
  const res = await fetch(`${apiBase}/api/v1/scans/${scanId}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch scan summary: ${res.statusText}`);
  }
  return res.json();
}

export const getScanStatus = getScanSummary;

export async function cancelScan(scanId: string): Promise<void> {
  const apiBase = getApiBase();
  await fetch(`${apiBase}/api/v1/scans/${scanId}/cancel`, {
    method: "POST",
  });
}

export function getScanEventsUrl(scanId: string): string {
  const apiBase = getApiBase();
  return `${apiBase}/api/v1/scans/${scanId}/events`;
}

export async function getAvailablePlugins(): Promise<OSINTPlugin[]> {
  const apiBase = getApiBase();
  try {
    const res = await fetch(`${apiBase}/api/v1/plugins`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getPlatforms(category?: string, search?: string): Promise<PlatformDisplay[]> {
  const apiBase = getApiBase();
  const params = new URLSearchParams();
  if (category && category !== "all") params.append("category", category);
  if (search) params.append("search", search);

  try {
    const res = await fetch(`${apiBase}/api/v1/platforms?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return data.platforms || [];
  } catch {
    return [];
  }
}

export async function getPlatform(slug: string): Promise<PlatformDisplay | null> {
  const apiBase = getApiBase();
  try {
    const res = await fetch(`${apiBase}/api/v1/platforms/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getDataVersion() {
  const apiBase = getApiBase();
  try {
    const res = await fetch(`${apiBase}/api/v1/data-version`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
