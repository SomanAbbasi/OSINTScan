"use client";

import React, { useState } from "react";
import { ExternalLink, Copy, Check } from "lucide-react";
import { PlatformResult } from "@/lib/types";
import { PlatformIcon } from "./platform-icon";
import { ConfidenceBadge } from "./confidence-badge";
import { StatusBadge } from "./status-badge";

export function ResultTable({ results }: { results: PlatformResult[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, url?: string | null) => {
    if (!url) return;
    try {
      navigator.clipboard.writeText(url).catch(() => {});
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const getEngineBadgeStyle = (eng: string) => {
    const lower = eng.toLowerCase();
    if (lower.includes("holehe")) return "bg-teal-50 text-teal-700 border-teal-200";
    if (lower.includes("ghunt")) return "bg-amber-50 text-amber-700 border-amber-200";
    if (lower.includes("ignorant")) return "bg-sky-50 text-sky-700 border-sky-200";
    if (lower.includes("blackbird")) return "bg-violet-50 text-violet-700 border-violet-200";
    if (lower.includes("breach")) return "bg-rose-50 text-rose-700 border-rose-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Mobile Swipe Hint */}
      <div className="md:hidden flex items-center justify-between text-[11px] text-slate-400 px-4 py-1.5 bg-slate-50 border-b border-slate-100">
        <span>Swipe horizontally to view all details</span>
        <span className="font-mono text-slate-500 font-bold">→</span>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[880px] text-left text-xs border-collapse">
          <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4 pl-6 min-w-[200px]">Platform</th>
              <th className="py-3 px-4 whitespace-nowrap">Engine</th>
              <th className="py-3 px-4 whitespace-nowrap">Category</th>
              <th className="py-3 px-4 whitespace-nowrap">Status</th>
              <th className="py-3 px-4 whitespace-nowrap">Confidence</th>
              <th className="py-3 px-4 min-w-[220px]">Detection Details</th>
              <th className="py-3 px-4 pr-6 text-right whitespace-nowrap min-w-[130px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.map((r) => {
              const isFound = r.status === "FOUND";
              const engine = r.sourceEngine || "WhatsMyName";
              const meta = r.metadata || {};
              return (
                <tr
                  key={r.platformId}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isFound ? "bg-white font-medium" : "opacity-75"
                  }`}
                >
                  <td className="py-3 px-4 pl-6">
                    <div className="flex items-center gap-2.5">
                      {meta.avatarUrl ? (
                        <img
                          src={meta.avatarUrl}
                          alt={r.displayName}
                          className="w-5 h-5 rounded-md object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            try {
                              e.currentTarget.style.display = "none";
                            } catch {}
                          }}
                        />
                      ) : (
                        <PlatformIcon category={r.category} name={r.displayName} className="w-4 h-4" />
                      )}
                      <span className="text-slate-900 font-semibold truncate max-w-[180px]">
                        {r.displayName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${getEngineBadgeStyle(
                        engine
                      )}`}
                    >
                      {engine}
                    </span>
                  </td>
                  <td className="py-3 px-4 capitalize text-slate-500 whitespace-nowrap">
                    {r.category}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {isFound ? <ConfidenceBadge level={r.confidence} /> : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-600" title={r.detectionReason}>
                    {meta.emailrecovery ? (
                      <span className="text-teal-700 font-mono text-[11px]">
                        Hint: {meta.emailrecovery}
                      </span>
                    ) : meta.gaiaId && meta.gaiaId !== "Public Footprint" ? (
                      <span className="text-amber-800 font-mono text-[11px]">
                        GAIA: {meta.gaiaId}
                      </span>
                    ) : (
                      r.detectionReason
                    )}
                  </td>
                  <td className="py-3 px-4 pr-6 text-right whitespace-nowrap">
                    {r.profileUrl && isFound ? (
                      <div className="flex items-center justify-end gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopy(r.platformId, r.profileUrl)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                          title="Copy URL"
                          aria-label="Copy profile URL"
                        >
                          {copiedId === r.platformId ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={r.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 !text-white hover:!text-white text-xs font-medium transition-colors shadow-2xs group"
                        >
                          <span className="!text-white group-hover:!text-white">Open</span>
                          <ExternalLink className="w-3 h-3 !text-white group-hover:!text-white" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
