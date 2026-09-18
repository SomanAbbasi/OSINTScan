"use client";

import React, { useState } from "react";
import {
  X,
  Printer,
  FileSpreadsheet,
  FileCode,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Shield,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { ScanSummary, PlatformResult } from "@/lib/types";
import { downloadCSV, downloadJSON, downloadHTMLReport } from "@/lib/platform-utils";
import { WhatsMyNameLogo } from "./logo";
import { ConfidenceBadge } from "./confidence-badge";
import { PlatformIcon } from "./platform-icon";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: ScanSummary;
  matches: PlatformResult[];
}

export function ReportModal({ isOpen, onClose, summary, matches }: ReportModalProps) {
  const [copiedLinks, setCopiedLinks] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyAllLinks = () => {
    const links = matches
      .filter((m) => m.profileUrl)
      .map((m) => `${m.displayName}: ${m.profileUrl}`)
      .join("\n");

    if (links) {
      navigator.clipboard.writeText(links);
      setCopiedLinks(true);
      setTimeout(() => setCopiedLinks(false), 2500);
    }
  };

  const formattedDate = summary.createdAt
    ? new Date(summary.createdAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Recently";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Modal Top Header with Action Buttons */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <WhatsMyNameLogo className="w-7 h-7" textClassName="text-lg font-bold" />
            <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold">
              Audit Report
            </span>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={() => downloadCSV(summary)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors shadow-xs"
              title="Download CSV of Resultant Matches"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>CSV</span>
            </button>

            <button
              onClick={() => downloadJSON(summary)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors shadow-xs"
              title="Download JSON of Resultant Matches"
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-600" />
              <span>JSON</span>
            </button>

            <button
              onClick={() => downloadHTMLReport(summary)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors shadow-xs"
              title="Download Standalone Offline HTML Report"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>HTML</span>
            </button>

            <button
              onClick={handleCopyAllLinks}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors shadow-xs"
              title="Copy all matching profile links to clipboard"
            >
              {copiedLinks ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Links</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Executive Target Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-slate-50 to-white border border-indigo-100 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Audited Username Footprint
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 flex items-center gap-3">
                <span>@{summary.username}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold font-sans">
                  {matches.length} Matches Found
                </span>
              </div>
              <p className="text-xs text-slate-500" suppressHydrationWarning>
                Generated {formattedDate} • Scan ID: <code className="text-[10px]">{summary.scanId}</code>
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="text-center p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-semibold">TOTAL AUDITED</span>
                <span className="text-lg font-bold text-slate-800">{summary.totalChecked}</span>
              </div>
              <div className="text-center p-3 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs">
                <span className="text-[10px] text-emerald-600 block font-semibold">MATCHES</span>
                <span className="text-lg font-bold text-emerald-700">{matches.length}</span>
              </div>
            </div>
          </div>

          {/* Resultant Matches Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Resultant Detected Profiles ({matches.length})</span>
              </h3>
              <span className="text-xs text-slate-500">
                Excludes negative results
              </span>
            </div>

            {matches.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl text-slate-500 text-xs space-y-1">
                <p className="font-semibold">No public profile matches detected.</p>
                <p>No platforms returned positive detection signatures for @{summary.username}.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                {matches.map((r, idx) => (
                  <div
                    key={r.platformId}
                    className="p-4 hover:bg-slate-50/70 transition-colors flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <span className="w-5 text-center font-mono text-slate-400 text-[11px]">
                        {idx + 1}
                      </span>
                      <PlatformIcon category={r.category} name={r.displayName} className="w-5 h-5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {r.displayName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 capitalize">
                            {r.category}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 truncate max-w-sm mt-0.5">
                          {r.profileUrl}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <ConfidenceBadge level={r.confidence} />
                      <span className="font-mono text-slate-400 text-[11px]">
                        {r.durationMs}ms
                      </span>

                      {r.profileUrl && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(r.profileUrl || "");
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Copy profile link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={r.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legal and Open-Source Assurance */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ethical Audit & Attribution Notice</span>
            </div>
            <p>
              WhatsMyName checks publicly visible profile URLs only. An automated match does not constitute proof of identity or ownership. Detection rules adapted under Creative Commons CC BY-SA 4.0 from the open-source WhatsMyName repository.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>WhatsMyName OSINT Auditor</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
