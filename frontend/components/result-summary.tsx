import React from "react";
import { Clock, ShieldCheck } from "lucide-react";
import { ScanSummary } from "@/lib/types";

export function ResultSummary({
  summary,
}: {
  summary: ScanSummary;
  datasetVersion?: string;
}) {
  const profileMatches = summary.foundCount;
  // Estimate or calculate service associations and exposure signals from metadata if available
  const associatedServices = summary.results.filter(
    (r) => r.category === "messaging" || r.category === "finance" || r.category === "email" || r.metadata?.emailrecovery
  ).length;
  const exposureSignals = summary.results.filter(
    (r) => r.metadata?.dataClasses || r.category === "breach"
  ).length;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Target Identifier
          </span>
          <div className="flex items-center gap-2.5 mt-0.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
              {summary.username.includes("@") || summary.username.startsWith("+")
                ? summary.username
                : `@${summary.username}`}
            </h2>
            <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
              summary.status === "completed"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : summary.status === "running"
                ? "bg-slate-100 text-slate-800 border-slate-200"
                : "bg-slate-50 text-slate-600 border-slate-200"
            }`}>
              {summary.status === "completed" ? "Complete" : summary.status === "running" ? "Scanning" : summary.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{summary.durationSeconds}s elapsed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>{summary.totalChecked} sources checked</span>
          </div>
        </div>
      </div>

      {/* Overview Metric Tiles (Section 13) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Possible profiles */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Possible profiles
          </span>
          <div className="text-3xl font-extrabold text-slate-900">
            {profileMatches}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Public matches detected
          </span>
        </div>

        {/* Associated services */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Associated services
          </span>
          <div className="text-3xl font-extrabold text-slate-900">
            {associatedServices}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Communication & platform presence
          </span>
        </div>

        {/* Exposure signals */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Exposure signals
          </span>
          <div className="text-3xl font-extrabold text-slate-900">
            {exposureSignals}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Known database exposures
          </span>
        </div>
      </div>
    </div>
  );
}
