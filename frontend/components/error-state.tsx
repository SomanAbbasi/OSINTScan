import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export function ErrorState({
  error,
  onRetry,
}: {
  error?: string;
  onRetry?: () => void;
}) {
  const isRateLimit = error?.toLowerCase().includes("rate limit");

  return (
    <div className="p-6 rounded-2xl border border-slate-200/90 bg-white text-slate-800 space-y-3.5 shadow-2xs text-left">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4 stroke-[2]" />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-slate-900 text-sm">
            {isRateLimit
              ? "Some sources temporarily limited the scan"
              : "Something went wrong while running the scan"}
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
            {isRateLimit
              ? "Some sources temporarily limited the scan requests to prevent rate limiting. Please wait a moment and try again."
              : "Some public endpoints could not be reached or connection was interrupted. A partial scan is not a negative result."}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
          {error}
        </div>
      )}

      {onRetry && (
        <div className="pt-1">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 !text-white hover:!text-white text-xs font-medium transition-colors shadow-2xs group"
          >
            <RefreshCw className="w-3 h-3 !text-white group-hover:!text-white" />
            <span className="!text-white group-hover:!text-white">Retry scan</span>
          </button>
        </div>
      )}
    </div>
  );
}
