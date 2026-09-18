import React from "react";
import Image from "next/image";

export function OSINTScanLogo({
  className = "w-9 h-9",
  textClassName = "text-xl font-bold",
}: {
  className?: string;
  textClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 select-none group">
      <div className="relative flex items-center justify-center shrink-0">
        <Image
          src="/logo-icon.png"
          alt="OSINTScan Emblem"
          width={36}
          height={36}
          className={`${className} object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-sm`}
          priority
        />
      </div>
      <div className="flex items-baseline">
        <span className={`tracking-tight text-slate-900 ${textClassName}`}>
          OSINT<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-extrabold">Scan</span>
        </span>
      </div>
    </div>
  );
}

// Backward compatibility alias
export const WhatsMyNameLogo = OSINTScanLogo;

