import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ScanWorkspace } from "@/components/scan-workspace";
import { Footprints, ShieldCheck, Lock } from "lucide-react";

export const metadata = constructMetadata({
  title: "Check Your Public Username Footprint Online | WhatsMyName",
  description:
    "Audit your online exposure. Search 700+ websites to find forgotten public accounts and minimize your digital attack surface.",
  canonical: "/digital-footprint-check",
});

export default function DigitalFootprintPage() {
  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
          <Footprints className="w-3.5 h-3.5" />
          <span>Personal Privacy Hygiene</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Digital Footprint Checker
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Uncover public accounts you may have created years ago and take control of your public presence.
        </p>
      </div>

      <ScanWorkspace />

      <div className="max-w-4xl mx-auto pt-8 border-t border-slate-200 space-y-6 text-sm text-slate-600 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 ">
          Why Audit Your Public Footprint?
        </h2>
        <p>
          Old accounts often contain outdated personal information, old email addresses, and unmonitored security settings. If an abandoned platform suffers a data breach, your credentials may be exposed without your knowledge. Performing regular username audits allows you to identify dormant profiles and request account deletion.
        </p>
      </div>
    </main>
  );
}
