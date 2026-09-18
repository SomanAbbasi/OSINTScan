import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ShieldAlert, AlertOctagon, CheckCircle2 } from "lucide-react";

export const metadata = constructMetadata({
  title: "Terms of Use | OSINTScan",
  description:
    "OSINTScan Terms of Use: strict prohibitions against harassment, stalking, doxxing, and unlawful use.",
  canonical: "/terms",
});

export default function TermsPage() {
  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Legal & Ethical Conduct</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Terms of Use & Acceptable Use Policy
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Effective date: September 2026. Please read these terms carefully before accessing OSINTScan.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
        {/* Prohibited uses card */}
        <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-200 text-slate-900 space-y-3">
          <h2 className="text-lg font-bold text-rose-700 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5" />
            1. Strict Prohibitions Against Abusive & Unlawful Use
          </h2>
          <p className="text-xs text-rose-900/80 ">
            OSINTScan is engineered strictly for lawful personal footprint auditing, brand safety research, and authorized OSINT investigations. By using this tool, you explicitly agree that you will NOT use it for:
          </p>
          <ul className="list-disc pl-5 text-xs text-rose-950 space-y-1.5">
            <li><strong>Stalking, cyberstalking, or unwanted surveillance.</strong></li>
            <li><strong>Harassment, intimidation, or bullying of any individual.</strong></li>
            <li><strong>Doxxing or non-consensual publication of personal data.</strong></li>
            <li><strong>Identity theft, unauthorized profiling, or discrimination.</strong></li>
            <li><strong>Credential stuffing or brute-forcing accounts.</strong></li>
            <li><strong>Attempting to circumvent login systems, paywalls, or CAPTCHAs.</strong></li>
            <li><strong>Automated scraping, denial-of-service, or rate limit circumvention against third-party platforms.</strong></li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            2. Permitted & Intended Uses
          </h2>
          <p>OSINTScan is provided exclusively for:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Auditing your own public footprint and finding forgotten accounts.</li>
            <li>Checking identifier availability and protecting creator or brand handles from cybersquatting.</li>
            <li>Lawful OSINT research relying strictly on publicly accessible endpoints.</li>
            <li>Security hygiene assessments with proper authorization.</li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 ">
            3. Disclaimer of Account Ownership & Accuracy
          </h2>
          <p>
            OSINTScan performs automated OSINT fingerprinting. <strong>A matching profile or identifier does NOT prove identity or account ownership.</strong> Multiple unconnected persons can register identical handles across various services.
          </p>
          <p>
            OSINTScan makes no representations or warranties regarding the 100% accuracy of detection strings, which may change at any time without notice.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 ">
            4. Termination of Access
          </h2>
          <p>
            We reserve the right to block, throttle, or ban any IP address or user attempting to abuse our infrastructure or violate these Terms of Use.
          </p>
        </div>
      </div>
    </main>
  );
}
