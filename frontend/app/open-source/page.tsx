import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { Heart, ExternalLink, Code2, ShieldAlert } from "lucide-react";

export const metadata = constructMetadata({
  title: "Open Source Attribution & Licensing | WhatsMyName",
  description:
    "Attribution disclosure and licensing details for the community-maintained WhatsMyName dataset adapted by WhatsMyName under Creative Commons CC BY-SA 4.0.",
  canonical: "/open-source",
});

export default function OpenSourcePage() {
  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5" />
          <span>Open Source Attribution</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          WhatsMyName Dataset Attribution & Licensing
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          WhatsMyName is built on top of the invaluable work of the open-source cybersecurity and OSINT community.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 ">
          1. Upstream Dataset & Authors
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          The platform detection rules utilized by WhatsMyName are adapted from the{" "}
          <a
            href="https://github.com/WebBreacher/WhatsMyName"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-semibold underline inline-flex items-center gap-1"
          >
            WhatsMyName repository
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          , originally created by <strong>Micah &quot;WebBreacher&quot; Hoffman</strong> in 2015 and maintained by hundreds of volunteer contributors worldwide.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 ">
          2. Applicable License (CC BY-SA 4.0)
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          The upstream WhatsMyName dataset is licensed under the{" "}
          <a
            href="http://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-semibold underline"
          >
            Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0)
          </a>
          .
        </p>
        <div className="p-4 rounded-xl bg-slate-50 text-xs font-mono text-slate-700 ">
          Copyright (C) 2015-2026 Micah Hoffman and contributors.<br />
          Licensed under Creative Commons Attribution-ShareAlike 4.0 International License.
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 ">
          3. Adaptations Made by WhatsMyName
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          In accordance with the ShareAlike terms, our adapted and normalized dataset is publicly verifiable. WhatsMyName makes the following technical adaptations:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>
            <strong>Schema Normalization:</strong> Raw upstream rules are transformed into a strict TypeScript/Python schema with canonical slugs and unique IDs.
          </li>
          <li>
            <strong>SSRF & Host Security Hardening:</strong> Strict validation filters out private IP addresses, localhost, and non-HTTPS endpoints to prevent Server-Side Request Forgery.
          </li>
          <li>
            <strong>Confidence Scoring:</strong> Automated calculation of confidence tiers (High, Medium, Low, Manual Review) based on signature robustness.
          </li>
          <li>
            <strong>Local Overrides Layer:</strong> Custom annotations, display names, and verification advice stored in an isolated overlay.
          </li>
        </ul>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 ">
          4. How to Inspect Data or Submit Corrections
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Anyone can inspect the normalized dataset in our repository under <code className="px-2 py-0.5 rounded bg-slate-100 text-xs font-mono">data/generated/sites.json</code>.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          To propose a new platform or fix a broken detection string, we strongly encourage submitting the change directly to the upstream{" "}
          <a
            href="https://github.com/WebBreacher/WhatsMyName/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline"
          >
            WhatsMyName Issue Tracker
          </a>
          , so the entire global OSINT community benefits from your discovery.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Notice Regarding Commercial Redistribution</span>
        </div>
        <p>
          WhatsMyName does not make legal claims regarding licensing. The dataset is provided under CC BY-SA 4.0. Any commercial redistribution, downstream repackaging, or derivative works incorporating this dataset should be reviewed by a qualified intellectual property attorney.
        </p>
      </div>
    </main>
  );
}
