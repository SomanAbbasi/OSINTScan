import React from "react";
import { ScanSearch } from "lucide-react";

export function OSINTScanLogo({
  className = "w-7 h-7",
  textClassName = "text-lg font-bold",
}: {
  className?: string;
  textClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white shadow-xs">
        <ScanSearch className="w-4 h-4 text-slate-100 stroke-[2.2]" />
      </div>
      <div className="flex items-baseline">
        <span className={`tracking-tight text-slate-900 ${textClassName}`}>
          OSINT<span className="text-indigo-600 font-extrabold">Scan</span>
        </span>
      </div>
    </div>
  );
}

// Backward compatibility alias
export const WhatsMyNameLogo = OSINTScanLogo;
