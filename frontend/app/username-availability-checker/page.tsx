import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ScanWorkspace } from "@/components/scan-workspace";
import { CheckCircle2, Sparkles } from "lucide-react";

export const metadata = constructMetadata({
  title: "Username Availability Checker Across 600+ Sites",
  description:
    "Check if your desired handle is available or taken across hundreds of social networks, developer hubs, and communities in seconds with OSINTScan.",
  canonical: "/username-availability-checker",
});

export default function AvailabilityCheckerPage() {
  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Brand & Handle Availability</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Username Availability Checker
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Launching a new project or brand? Check where your target username is already registered and where it remains unclaimed.
        </p>
      </div>

      <ScanWorkspace />

      <div className="max-w-4xl mx-auto pt-8 border-t border-slate-200 space-y-4 text-sm text-slate-600 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 ">
          Secure Your Online Brand Identity
        </h2>
        <p>
          Before naming a startup, podcast, or product, it is critical to reserve corresponding usernames on major platforms. WhatsMyName scans 700+ sites to give you a clear map of where your name is already claimed and where you can still secure it.
        </p>
      </div>
    </main>
  );
}
