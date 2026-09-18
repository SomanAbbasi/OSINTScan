import { OSINTPlugin, PlatformDisplay, ScanResponse, ScanSummary } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

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

  const res = await fetch(`${API_BASE}/api/v1/scans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Failed to start scan" }));
    throw new Error(errorData.detail || `Server returned HTTP ${res.status}`);
  }

  return res.json();
}

export async function getScanSummary(scanId: string): Promise<ScanSummary> {
  const res = await fetch(`${API_BASE}/api/v1/scans/${scanId}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch scan summary: ${res.statusText}`);
  }
  return res.json();
}

export const getScanStatus = getScanSummary;

export async function cancelScan(scanId: string): Promise<void> {
  await fetch(`${API_BASE}/api/v1/scans/${scanId}/cancel`, {
    method: "POST",
  });
}

export function getScanEventsUrl(scanId: string): string {
  return `${API_BASE}/api/v1/scans/${scanId}/events`;
}

export async function getAvailablePlugins(): Promise<OSINTPlugin[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/plugins`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getPlatforms(category?: string, search?: string): Promise<PlatformDisplay[]> {
  const params = new URLSearchParams();
  if (category && category !== "all") params.append("category", category);
  if (search) params.append("search", search);

  const res = await fetch(`${API_BASE}/api/v1/platforms?${params.toString()}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return data.platforms || [];
}

export async function getPlatform(slug: string): Promise<PlatformDisplay | null> {
  const res = await fetch(`${API_BASE}/api/v1/platforms/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getDataVersion() {
  const res = await fetch(`${API_BASE}/api/v1/data-version`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  return res.json();
}
