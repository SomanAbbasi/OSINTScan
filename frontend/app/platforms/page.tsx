import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { getAllPlatforms } from "@/lib/platforms";
import { PlatformIcon } from "@/components/platform-icon";
import { Layers, ArrowRight, ExternalLink } from "lucide-react";
import { PlatformsDirectoryClient } from "./client";

export const metadata = constructMetadata({
  title: "Supported Platforms Directory (700+ Sites) | OSINTScan",
  description:
    "Browse the full directory of 700+ public websites, communities, and developer hubs audited by OSINTScan's footprint detection engine.",
  canonical: "/platforms",
});

export default function PlatformsPage() {
  const platforms = getAllPlatforms();
  const categories = Array.from(new Set(platforms.map((p) => p.category))).sort();

  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>{platforms.length} Platforms Cataloged</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Supported Platforms Directory
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Every platform below is tested using community-maintained detection fingerprints. Click any platform to view its profile URL pattern, detection rules, and verification guidance.
        </p>
      </div>

      <PlatformsDirectoryClient platforms={platforms} categories={categories} />
    </main>
  );
}
