import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ScanWorkspace } from "@/components/scan-workspace";
import { Globe, Layers } from "lucide-react";

export const metadata = constructMetadata({
  title: "Check Username Across Platforms in Real Time | WhatsMyName",
  description:
    "Fast, unified cross-platform username checker. Search across hundreds of public websites with confidence labels and exportable reports.",
  canonical: "/check-username-across-platforms",
});

export default function CheckAcrossPlatformsPage() {
  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
          <Globe className="w-3.5 h-3.5" />
          <span>Unified Cross-Platform Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Check Username Across Platforms
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          One search, 700+ websites. Audit your public footprint across developer portals, social channels, and discussion forums.
        </p>
      </div>

      <ScanWorkspace />
    </main>
  );
}
