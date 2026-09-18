import React from "react";
import { ShieldCheck, AlertTriangle, HelpCircle } from "lucide-react";
import { ConfidenceLevel } from "@/lib/types";

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  switch (level) {
    case "high":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          Likely match
        </span>
      );
    case "medium":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <ShieldCheck className="w-3 h-3 text-slate-500" />
          Possible match
        </span>
      );
    case "manual_review":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          Manual review
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-500 border border-slate-200">
          <HelpCircle className="w-3 h-3 text-slate-400" />
          Uncertain
        </span>
      );
  }
}
