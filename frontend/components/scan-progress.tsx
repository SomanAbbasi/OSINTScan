"use client";

import React, { useState } from "react";
import { Loader2, StopCircle, Info, ChevronDown } from "lucide-react";

interface ScanProgressProps {
  totalChecked: number;
  totalPlatforms: number;
  currentPlatform?: string;
  onCancel?: () => void;
  isCancelling?: boolean;
}

export function ScanProgress({
  totalChecked,
  totalPlatforms,
  currentPlatform,
  onCancel,
  isCancelling = false,
}: ScanProgressProps) {
  const [showDetails, setShowDetails] = useState(false);
  const percentage =
    totalPlatforms > 0 ? Math.min(100, Math.round((totalChecked / totalPlatforms) * 100)) : 0;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Loader2 className="w-4 h-4 text-slate-700 animate-spin shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Scanning public sources...
            </h3>
            <p className="text-xs text-slate-400">
              {totalChecked} sources evaluated
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isCancelling}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors disabled:opacity-50"
          >
            <StopCircle className="w-3.5 h-3.5" />
            <span>{isCancelling ? "Cancelling..." : "Stop"}</span>
          </button>
        )}
      </div>

      {/* Progress Bar - Calm, restrained indigo accent */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-slate-900 transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Progress Step Signals (Section 23) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-500 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span>Public profiles</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          <span>Service associations</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          <span>Phone intelligence</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          <span>Exposure signals</span>
        </div>
      </div>

      {/* Technical details toggle (Section 23) */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center gap-1 hover:text-slate-700 transition-colors"
        >
          <Info className="w-3 h-3 text-slate-400" />
          <span>{showDetails ? "Hide technical details" : "View technical details"}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${showDetails ? "rotate-180" : ""}`} />
        </button>

        <span className="font-mono text-slate-500">{percentage}%</span>
      </div>

      {showDetails && (
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono space-y-1 animate-in fade-in duration-150">
          <div>Status: Active in-memory execution</div>
          {currentPlatform && <div>Testing endpoint: {currentPlatform}</div>}
          <div>Evaluated: {totalChecked} of ~{totalPlatforms} endpoints</div>
        </div>
      )}
    </div>
  );
}
