import React from "react";
import { constructMetadata } from "@/lib/seo";
import { Lock, Shield, EyeOff, Trash2 } from "lucide-react";

export const metadata = constructMetadata({
  title: "Privacy Policy | OSINTScan",
  description:
    "Transparent privacy policy for OSINTScan: ephemeral identifier processing, no permanent query logs, and privacy-respecting public footprint auditing.",
  canonical: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>Privacy by Design</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          OSINTScan Privacy Policy
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Last updated: September 2026. We believe digital footprint auditing should never compromise your own privacy.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-indigo-600 " />
            1. What Data We Process & Ephemeral Storage
          </h2>
          <p>
            When you enter an identifier into OSINTScan (username, email, or phone number), that query is sent to our scanning engine solely to perform parallel checks against public profile endpoints and OSINT datasets.
          </p>
          <p>
            <strong>No Permanent Search Logs:</strong> Anonymous scan queries are processed in server memory (RAM) and are not stored in a persistent database.
          </p>
          <p>
            <strong>Scan Job Lifespan:</strong> In-memory scan sessions and their associated results are automatically wiped from server memory within 30 minutes after completion.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600 " />
            2. What We Never Do
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>We do not attempt to access private or password-protected accounts.</li>
            <li>We do not bypass CAPTCHAs, bot walls, or access control systems.</li>
            <li>We do not collect passwords, cookies, or authorization tokens.</li>
            <li>We do not sell, rent, or trade your queries to advertisers or data brokers.</li>
            <li>We do not create public, indexable search pages of searched usernames.</li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 ">
            3. IP Addresses & Rate Limiting
          </h2>
          <p>
            To prevent automated abuse, denial of service, and spam, our backend maintains an in-memory sliding-window counter of requests per IP address. These counters expire automatically after 5 minutes and are never linked to personal identity.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 ">
            4. Analytics & Telemetry
          </h2>
          <p>
            If site analytics are enabled, telemetry is strictly anonymized. We never send search queries, usernames, or scan result URLs to third-party analytics providers.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 ">
            5. Contact Us
          </h2>
          <p>
            For privacy inquiries or technical questions, contact the maintainers at <code className="text-xs font-mono text-indigo-600 ">privacy@whatsmyname.app</code>.
          </p>
        </div>
      </div>
    </main>
  );
}
