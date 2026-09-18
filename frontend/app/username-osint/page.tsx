import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ScanWorkspace } from "@/components/scan-workspace";
import { Terminal, Shield, CheckCircle } from "lucide-react";

export const metadata = constructMetadata({
  title: "Username OSINT Tool for Public Profile Discovery | WhatsMyName",
  description:
    "Ethical username OSINT tool for cybersecurity researchers, fraud investigators, and intelligence analysts. Search public handles across 700+ platforms.",
  canonical: "/username-osint",
});

export default function UsernameOSINTPage() {
  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
          <Terminal className="w-3.5 h-3.5" />
          <span>Open Source Intelligence (OSINT)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Username OSINT & Public Profile Discovery
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Streamlined public footprint enumeration for security analysts, incident responders, and lawful OSINT practitioners.
        </p>
      </div>

      <ScanWorkspace />

      <div className="max-w-4xl mx-auto pt-8 border-t border-slate-200 space-y-6 text-sm text-slate-600 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 ">
          Lawful OSINT Methodology & Best Practices
        </h2>
        <p>
          In open-source intelligence (OSINT), username enumeration is a foundational pivot point. An adversary or person of interest often reuses online handles across developer communities, forum accounts, and social platforms.
        </p>
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-2">
          <h3 className="font-semibold text-slate-900 text-xs">
            Crucial Investigator Reminder:
          </h3>
          <p className="text-xs">
            WhatsMyName tests the existence of public pages. <strong>A username match is merely an investigative lead, never conclusive evidence of shared ownership.</strong> Corroborate all findings with manual analysis of creation dates, account activity, and profile metadata.
          </p>
        </div>
      </div>
    </main>
  );
}
