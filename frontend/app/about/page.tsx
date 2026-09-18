import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { ShieldCheck, Compass, Heart, Users, CheckCircle } from "lucide-react";

export const metadata = constructMetadata({
  title: "About OSINTScan — Mission & Ethics",
  description:
    "Learn about OSINTScan: an ethical, transparent public digital footprint auditing tool built on open-source community research.",
  canonical: "/about",
});

export default function AboutPage() {
  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About OSINTScan
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Search your public digital footprint across the web with transparent confidence signals and ethical safeguards.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 ">
            Why We Built OSINTScan
          </h2>
          <p>
            In today&apos;s hyper-connected internet, most people have created dozens of accounts over the past decade — gaming handles, coding forums, old blogs, and forgotten community memberships. These abandoned public accounts represent digital attack surfaces, identity confusion, and privacy leaks.
          </p>
          <p>
            OSINTScan was created to give individuals, creators, and security researchers a clean, fast, and transparent way to audit public handles, email identifiers, and phone registrations across 700+ websites without predatory paywalls, tracking, or deceptive claims.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 " />
            Our Core Principles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 space-y-1">
              <span className="font-semibold text-slate-900 text-xs">
                Transparent Uncertainty
              </span>
              <p className="text-xs">
                We clearly communicate confidence levels. A matching username never proves identity.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 space-y-1">
              <span className="font-semibold text-slate-900 text-xs">
                Privacy First
              </span>
              <p className="text-xs">
                Anonymous searches are processed ephemerally in RAM and are never permanently stored.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 space-y-1">
              <span className="font-semibold text-slate-900 text-xs">
                Strictly Public Access
              </span>
              <p className="text-xs">
                We only test public HTTP profile URLs. Private accounts and login walls are never accessed.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 space-y-1">
              <span className="font-semibold text-slate-900 text-xs">
                Open Source Heritage
              </span>
              <p className="text-xs">
                We proudly build upon the community-maintained WhatsMyName detection dataset.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-slate-700 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            Open Source Community Credit
          </h2>
          <p className="text-xs leading-relaxed">
            Our platform detection rules are adapted from the renowned{" "}
            <a
              href="https://github.com/WebBreacher/WhatsMyName"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 font-semibold underline"
            >
              WhatsMyName project
            </a>
            , initiated by Micah &quot;WebBreacher&quot; Hoffman and enriched by cybersecurity researchers globally. Learn more on our{" "}
            <Link href="/open-source" className="text-indigo-600 underline font-semibold">
              Open Source Attribution page
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
