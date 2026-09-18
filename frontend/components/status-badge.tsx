import React from "react";
import { CheckCircle2, XCircle, Clock, Ban, HelpCircle } from "lucide-react";
import { PlatformStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: PlatformStatus }) {
  switch (status) {
    case "FOUND":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Profile found
        </span>
      );
    case "NOT_FOUND":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-400 border border-slate-200">
          <XCircle className="w-3 h-3 text-slate-400" />
          No match
        </span>
      );
    case "BLOCKED":
    case "RATE_LIMITED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <Ban className="w-3 h-3 text-slate-500" />
          Limited
        </span>
      );
    case "TIMEOUT":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
          <Clock className="w-3 h-3 text-slate-400" />
          Timed out
        </span>
      );
    case "ERROR":
    case "UNCERTAIN":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <HelpCircle className="w-3 h-3 text-amber-600" />
          Unable to verify
        </span>
      );
  }
}
