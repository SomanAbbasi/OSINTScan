import { PlatformResult, ScanSummary } from "./types";

export function sortResults(
  results: PlatformResult[],
  sortBy: "confidence" | "name" | "category" | "duration" | "status"
): PlatformResult[] {
  const sorted = [...results];
  switch (sortBy) {
    case "confidence": {
      const rank: Record<string, number> = {
        high: 1,
        medium: 2,
        low: 3,
        manual_review: 4,
      };
      return sorted.sort((a, b) => (rank[a.confidence] || 5) - (rank[b.confidence] || 5));
    }
    case "name":
      return sorted.sort((a, b) => a.displayName.localeCompare(b.displayName));
    case "category":
      return sorted.sort((a, b) => a.category.localeCompare(b.category));
    case "duration":
      return sorted.sort((a, b) => b.durationMs - a.durationMs);
    case "status": {
      const statusRank: Record<string, number> = {
        FOUND: 1,
        UNCERTAIN: 2,
        BLOCKED: 3,
        RATE_LIMITED: 4,
        ERROR: 5,
        TIMEOUT: 6,
        NOT_FOUND: 7,
        SKIPPED: 8,
      };
      return sorted.sort((a, b) => (statusRank[a.status] || 9) - (statusRank[b.status] || 9));
    }
    default:
      return sorted;
  }
}

export function filterResults(
  results: PlatformResult[],
  filter: {
    statusFilter: string;
    categoryFilter: string;
    searchQuery: string;
  }
): PlatformResult[] {
  return results.filter((r) => {
    // Status filter
    if (filter.statusFilter === "matches" && r.status !== "FOUND") return false;
    if (filter.statusFilter === "high_confidence" && (r.status !== "FOUND" || r.confidence !== "high")) return false;
    if (filter.statusFilter === "manual_review" && !r.requiresManualVerification) return false;
    if (filter.statusFilter === "not_found" && r.status !== "NOT_FOUND") return false;
    if (filter.statusFilter === "blocked" && r.status !== "BLOCKED" && r.status !== "RATE_LIMITED") return false;
    if (filter.statusFilter === "errors" && r.status !== "ERROR" && r.status !== "TIMEOUT") return false;

    // Category filter
    if (filter.categoryFilter && filter.categoryFilter !== "all" && r.category !== filter.categoryFilter) {
      return false;
    }

    // Search query
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      const matchesName = r.displayName.toLowerCase().includes(q) || r.name.toLowerCase().includes(q);
      const matchesCat = r.category.toLowerCase().includes(q);
      const matchesReason = r.detectionReason.toLowerCase().includes(q);
      if (!matchesName && !matchesCat && !matchesReason) return false;
    }

    return true;
  });
}

export function downloadCSV(summary: ScanSummary) {
  const matches = summary.results.filter((r) => r.status === "FOUND");
  const target = summary.target || summary.username;
  const lines = [
    "# ==================================================================",
    "# HandleScope — Multi-Engine OSINT Intelligence Audit Report",
    "# ==================================================================",
    `# Target: ${target}`,
    `# Input Type: ${summary.inputType || "username"}`,
    `# Active Engines: ${(summary.engines || []).join(", ") || "WhatsMyName"}`,
    `# Scan Timestamp (UTC): ${summary.createdAt}`,
    `# Total Platforms Audited: ${summary.totalChecked}`,
    `# Total Resultant Matches: ${matches.length}`,
    "# Disclaimer: Audits publicly visible profile endpoints only. An existing handle does not prove account ownership.",
    "# ==================================================================",
    "",
    [
      "Platform",
      "Engine",
      "Category",
      "Profile URL",
      "Status",
      "Confidence",
      "Response Time (ms)",
      "HTTP Status",
      "Detection Details",
      "Manual Review Required",
    ].join(","),
  ];

  if (matches.length === 0) {
    lines.push(`"No profile matches found across ${summary.totalChecked} tested platforms","","","","","","","","",""`);
  } else {
    for (const r of matches) {
      lines.push(
        [
          `"${r.displayName.replace(/"/g, '""')}"`,
          `"${r.sourceEngine || "WhatsMyName"}"`,
          `"${r.category}"`,
          `"${(r.profileUrl || "").replace(/"/g, '""')}"`,
          `"${r.status}"`,
          `"${r.confidence.toUpperCase()}"`,
          r.durationMs || 0,
          r.httpStatus || "",
          `"${r.detectionReason.replace(/"/g, '""')}"`,
          r.requiresManualVerification ? "Yes" : "No",
        ].join(",")
      );
    }
  }

  const csvContent = lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `osint-audit-${target.replace(/[^a-zA-Z0-9_\-]/g, "_")}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJSON(summary: ScanSummary) {
  const matches = summary.results.filter((r) => r.status === "FOUND");
  const target = summary.target || summary.username;
  const payload = {
    tool: "HandleScope OSINT Hub",
    tagline: "Extensible Multi-Engine OSINT Intelligence Auditing",
    auditMetadata: {
      target,
      username: summary.username,
      inputType: summary.inputType || "username",
      engines: summary.engines || [],
      scanId: summary.scanId,
      scanDateUtc: summary.createdAt,
      totalPlatformsAudited: summary.totalChecked,
      totalMatchesFound: matches.length,
    },
    disclaimer:
      "WhatsMyName checks publicly accessible profile pages only. A matching username does not prove account ownership. Always verify profiles manually.",
    resultantMatches: matches.map((r) => ({
      platform: r.displayName,
      category: r.category,
      profileUrl: r.profileUrl,
      status: r.status,
      confidence: r.confidence,
      responseTimeMs: r.durationMs,
      httpStatusCode: r.httpStatus,
      detectionDetails: r.detectionReason,
      requiresManualVerification: r.requiresManualVerification,
    })),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `whatsmyname-${summary.username}-matches-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadHTMLReport(summary: ScanSummary) {
  const matches = summary.results.filter((r) => r.status === "FOUND");
  const scanDate = new Date(summary.createdAt).toUTCString();

  const rowsHtml = matches.length === 0
    ? `<tr><td colspan="6" style="text-align:center; padding: 24px; color: #64748b;">No profile matches detected across ${summary.totalChecked} tested websites.</td></tr>`
    : matches.map((m, idx) => `
      <tr>
        <td style="color: #94a3b8; font-family: monospace; text-align: center;">${idx + 1}</td>
        <td style="font-weight: 700; color: #0f172a;">${escapeHtml(m.displayName)}</td>
        <td style="text-transform: capitalize; color: #475569;">${escapeHtml(m.category)}</td>
        <td>
          <span style="display:inline-block; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; ${
            m.confidence === 'high' ? 'background:#dcfce7;color:#166534;' : 'background:#e0e7ff;color:#3730a3;'
          }">${m.confidence.toUpperCase()}</span>
        </td>
        <td><a href="${escapeHtml(m.profileUrl || '')}" target="_blank" rel="noopener noreferrer">${escapeHtml(m.profileUrl || '—')}</a></td>
        <td style="color: #64748b; font-size: 11px;">${escapeHtml(m.detectionReason)}</td>
      </tr>
    `).join("");

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WhatsMyName Audit Report - @${escapeHtml(summary.username)}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 40px 16px; line-height: 1.5; }
    .card { max-width: 960px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #4f46e5; padding-bottom: 18px; margin-bottom: 24px; }
    .brand { font-size: 22px; font-weight: 800; color: #0f172a; }
    .brand span { color: #4f46e5; }
    .meta-box { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; background: #f1f5f9; padding: 18px; border-radius: 12px; margin-bottom: 28px; }
    .meta-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; }
    .meta-value { font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 2px; }
    .highlight { color: #166534; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 12px; }
    th { background: #f8fafc; text-align: left; padding: 10px 12px; border-bottom: 2px solid #e2e8f0; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 11px; }
    td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) { background: #fafafa; }
    a { color: #4f46e5; text-decoration: none; font-weight: 500; word-break: break-all; }
    a:hover { text-decoration: underline; }
    .disclaimer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.6; }
    .print-btn { display: inline-block; background: #4f46e5; color: #ffffff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; text-decoration: none; }
    .print-btn:hover { background: #4338ca; }
    @media print { .no-print { display: none !important; } body { padding: 0; background: #fff; } .card { border: none; box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <div class="brand">Whats<span>My</span>Name</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Public Username Footprint Audit Report</div>
      </div>
      <div style="text-align: right;">
        <button onclick="window.print()" class="print-btn no-print">Print / Save PDF</button>
        <div style="font-size: 11px; color: #64748b; margin-top: 8px;">Date: ${scanDate}</div>
      </div>
    </div>

    <div class="meta-box">
      <div>
        <div class="meta-label">Audit Target Handle</div>
        <div class="meta-value" style="font-family: monospace; color: #4f46e5;">@${escapeHtml(summary.username)}</div>
      </div>
      <div>
        <div class="meta-label">Resultant Matches</div>
        <div class="meta-value highlight">${matches.length} Found</div>
      </div>
      <div>
        <div class="meta-label">Platforms Checked</div>
        <div class="meta-value">${summary.totalChecked} Sites</div>
      </div>
      <div>
        <div class="meta-label">Audit Engine</div>
        <div class="meta-value" style="font-size: 14px; padding-top: 3px;">WhatsMyName v1.0</div>
      </div>
    </div>

    <div style="font-size: 14px; font-weight: 800; margin-bottom: 8px; color: #0f172a;">
      Resultant Matches (${matches.length})
    </div>
    <div style="font-size: 12px; color: #64748b; margin-bottom: 12px;">
      Excludes ${summary.totalChecked - matches.length} negative and unconfirmed websites.
    </div>

    <table style="width: 100%;">
      <thead>
        <tr>
          <th style="width: 36px; text-align: center;">#</th>
          <th>Platform</th>
          <th>Category</th>
          <th>Confidence</th>
          <th>Profile URL</th>
          <th>Detection Reason</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div class="disclaimer">
      <p><strong>Methodology & Legal Notice:</strong> WhatsMyName checks publicly accessible web endpoints only. Automated presence of a username does not constitute proof of identity or account ownership. Please manually verify findings before taking action.</p>
      <p><strong>Attribution:</strong> Platform detection signatures adapted from the community-maintained WhatsMyName repository under Creative Commons CC BY-SA 4.0.</p>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `whatsmyname-${summary.username}-report-${new Date().toISOString().slice(0, 10)}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

