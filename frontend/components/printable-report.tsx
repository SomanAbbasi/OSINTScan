"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ScanSummary, PlatformResult } from "@/lib/types";
import { WhatsMyNameLogo } from "./logo";
import { CheckCircle2, ShieldAlert, Radio, Check } from "lucide-react";

export function PrintableReport({
  summary,
  matches,
}: {
  summary: ScanSummary;
  matches: PlatformResult[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const rawTarget = summary.target || summary.username || "";
  const isPhone =
    summary.inputType === "phone" ||
    rawTarget.startsWith("+") ||
    /^\+?\d{7,15}$/.test(rawTarget.replace(/[\s\-\(\)]/g, ""));
  const isEmail = summary.inputType === "email" || rawTarget.includes("@");

  const displayTarget = isPhone
    ? rawTarget
    : isEmail
    ? rawTarget
    : `@${rawTarget.replace(/^@/, "")}`;

  const formattedDate = summary.createdAt
    ? new Date(summary.createdAt).toUTCString()
    : new Date().toUTCString();

  // Find telephony metadata if available
  const telephonyResult = summary.results.find(
    (r) =>
      r.platformId.includes("telephony") ||
      r.name.toLowerCase().includes("telephony") ||
      r.metadata?.carrier ||
      r.metadata?.e164
  );
  const phoneMeta = telephonyResult?.metadata || {};

  // Extract exposure / breach signals
  const breachMatches = summary.results.filter(
    (r) => (r.category === "breach" || r.metadata?.dataClasses) && r.status === "FOUND"
  );
  const exposureSignalsCount = breachMatches.length;

  const totalAudited = summary.totalChecked || summary.results.length;

  const enginesStr =
    summary.engines && summary.engines.length > 0
      ? summary.engines.join(", ")
      : isPhone
      ? "PhoneInfoga, Ignorant, Breach Intelligence"
      : isEmail
      ? "Holehe, Blackbird, GHunt, Breach Intelligence"
      : "WhatsMyName, Sherlock, Maigret, Blackbird";

  const reportId = summary.scanId
    ? `WMN-${summary.scanId.slice(0, 8).toUpperCase()}`
    : `WMN-${Date.now().toString(36).toUpperCase()}`;

  const content = (
    <div
      id="printable-audit-report"
      className="hidden print:block bg-white text-slate-900 p-8 max-w-5xl mx-auto space-y-6 font-sans antialiased"
    >
      {/* 1. Executive Report Header */}
      <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <WhatsMyNameLogo className="w-8 h-8" textClassName="text-xl font-bold" />
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold border border-slate-300">
              AUDIT DOSSIER
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {isPhone
              ? "Public Telephony, Carrier & Digital Footprint Audit Report"
              : isEmail
              ? "Public Email Exposure & Account Discovery Audit Report"
              : "Official Public Digital Footprint & Account Audit Report"}
          </p>
        </div>

        <div className="text-right text-xs text-slate-500 space-y-0.5">
          <div className="font-mono text-slate-900 font-bold">Report ID: {reportId}</div>
          <div>Generated: {formattedDate}</div>
          <div className="text-emerald-700 font-semibold flex items-center justify-end gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Audit Status: Complete</span>
          </div>
        </div>
      </div>

      {/* 2. Target Identifier & Top-Level Metrics */}
      <div className="grid grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {isPhone ? "Target Phone Number" : isEmail ? "Target Email" : "Target Identifier"}
          </span>
          <div className="text-lg font-bold font-mono text-slate-950 mt-0.5 truncate">
            {displayTarget}
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Resultant Matches
          </span>
          <div className="text-lg font-bold text-emerald-700 mt-0.5">
            {matches.length} Detected
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Exposure Signals
          </span>
          <div className="text-lg font-bold text-slate-900 mt-0.5">
            {exposureSignalsCount} Known Leaks
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Endpoints Audited
          </span>
          <div className="text-lg font-bold text-slate-900 mt-0.5">
            {totalAudited} Sources
          </div>
        </div>
      </div>

      {/* 3. Telephony & Carrier Overview Block (for phone scans) */}
      {isPhone && (
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 print-avoid-break">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            <Radio className="w-3.5 h-3.5 text-indigo-600" />
            <span>Telephony & Carrier Intelligence</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div>
              <span className="text-slate-400 block text-[10px]">Carrier / Provider</span>
              <span className="font-semibold text-slate-800">
                {phoneMeta.carrier && phoneMeta.carrier !== "Unknown"
                  ? phoneMeta.carrier
                  : "Private Telecom Subscriber"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Line Type</span>
              <span className="font-semibold text-slate-800">
                {phoneMeta.lineType || "Mobile"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Jurisdiction / Region</span>
              <span className="font-semibold text-slate-800">
                {phoneMeta.region || "International"} ({phoneMeta.countryCode || "+1"})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">VoIP / Virtual Status</span>
              <span className="font-semibold text-slate-800">
                {phoneMeta.isVoIP ? "Virtual / VoIP Line" : "Standard Carrier Line"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Active Engines Deployed */}
      <div className="text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
        <span>
          <strong>Deployed OSINT Engines:</strong> {enginesStr}
        </span>
        <span className="font-mono text-[11px]">Strict Multi-Engine Deduplication Active</span>
      </div>

      {/* 5. Resultant Matches Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Resultant Profile Matches ({matches.length})</span>
          </h2>
          <span className="text-[11px] text-slate-500">
            Excludes {Math.max(0, totalAudited - matches.length)} negative / unconfirmed endpoints
          </span>
        </div>

        {matches.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-slate-300 rounded-xl text-xs text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700">No active profile matches detected</div>
            <p>
              No publicly accessible accounts or exposed profile handles were discovered across the{" "}
              {totalAudited} evaluated sources.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th className="p-2 border-r border-slate-300 w-8 text-center">#</th>
                <th className="p-2 border-r border-slate-300">Platform / Service</th>
                <th className="p-2 border-r border-slate-300 w-24">Category</th>
                <th className="p-2 border-r border-slate-300 w-24">Confidence</th>
                <th className="p-2 border-r border-slate-300">Profile / Endpoint URL</th>
                <th className="p-2 border-r border-slate-300 w-28">Source Engine</th>
                <th className="p-2">Detection Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {matches.map((r, idx) => {
                const engineName =
                  r.metadata?.engines && Array.isArray(r.metadata.engines)
                    ? r.metadata.engines.join(", ")
                    : r.sourceEngine || "OSINT Engine";

                return (
                  <tr key={r.platformId || idx} className="even:bg-slate-50/60 print-avoid-break">
                    <td className="p-2 border-r border-slate-200 text-center font-mono text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="p-2 border-r border-slate-200 font-bold text-slate-900">
                      {r.displayName}
                    </td>
                    <td className="p-2 border-r border-slate-200 capitalize text-slate-600">
                      {r.category}
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          r.confidence === "high"
                            ? "bg-emerald-100 text-emerald-800"
                            : r.confidence === "medium"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {r.confidence ? r.confidence.toUpperCase() : "VERIFIED"}
                      </span>
                    </td>
                    <td className="p-2 border-r border-slate-200 font-mono text-[11px] text-indigo-600 break-all max-w-[200px]">
                      {r.profileUrl || "—"}
                    </td>
                    <td className="p-2 border-r border-slate-200 text-[11px] text-slate-600 font-medium">
                      {engineName}
                    </td>
                    <td className="p-2 text-slate-600 text-[11px] leading-tight">
                      {r.detectionReason || "Confirmed positive platform presence"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 6. Database Exposures Section (if any breach signals exist) */}
      {breachMatches.length > 0 && (
        <div className="space-y-2 pt-2 print-avoid-break">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Known Database Exposures & Historical Leaks ({breachMatches.length})</span>
          </div>
          <div className="border border-rose-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-rose-50 text-rose-900 font-bold border-b border-rose-200">
                  <th className="p-2 border-r border-rose-200">Breach Title</th>
                  <th className="p-2 border-r border-rose-200">Compromised Date</th>
                  <th className="p-2 border-r border-rose-200">Compromised Records</th>
                  <th className="p-2 border-r border-rose-200">Exposed Data Classes</th>
                  <th className="p-2">Incident Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100 bg-white">
                {breachMatches.map((b, idx) => (
                  <tr key={idx} className="even:bg-rose-50/30">
                    <td className="p-2 border-r border-rose-100 font-bold text-slate-900">
                      {b.displayName}
                    </td>
                    <td className="p-2 border-r border-rose-100 font-mono text-slate-600">
                      {b.metadata?.breachDate || "Historical"}
                    </td>
                    <td className="p-2 border-r border-rose-100 font-mono text-slate-600">
                      {b.metadata?.pwnCount
                        ? Number(b.metadata.pwnCount).toLocaleString()
                        : "Public Leak"}
                    </td>
                    <td className="p-2 border-r border-rose-100 text-[11px] text-slate-600">
                      {Array.isArray(b.metadata?.dataClasses)
                        ? b.metadata.dataClasses.join(", ")
                        : "Account Records"}
                    </td>
                    <td className="p-2 text-slate-600 text-[11px] leading-tight">
                      {b.metadata?.description || b.detectionReason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Legal & OSINT Attribution Footer */}
      <div className="pt-4 border-t border-slate-200 space-y-1.5 text-[10px] text-slate-500 leading-relaxed print-avoid-break">
        <p>
          <strong>Legal Notice & Methodology:</strong> OSINTScan queries publicly accessible endpoints, directories, and registered open databases. An existing record does not confirm current account ownership or the identity of a specific individual. Corroborate results with secondary independent review.
        </p>
        <p>
          <strong>Open Source Attribution:</strong> Detection signatures powered by community-maintained OSINT modules under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) and MIT/GPL open repositories.
        </p>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

