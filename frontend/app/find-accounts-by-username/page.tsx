import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ScanWorkspace } from "@/components/scan-workspace";
import { UserCheck, Globe } from "lucide-react";

export const metadata = constructMetadata({
  title: "Find Accounts by Username Across the Web | WhatsMyName",
  description:
    "Discover public profiles associated with any handle across hundreds of platforms. Instant search, confidence labels, and direct profile links.",
  canonical: "/find-accounts-by-username",
});

export default function FindAccountsPage() {
  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Profile Discovery Tool</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Find Accounts by Username
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Search for an online alias across 700+ websites to discover where matching public profiles exist.
        </p>
      </div>

      <ScanWorkspace />
    </main>
  );
}
