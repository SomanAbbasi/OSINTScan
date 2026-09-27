import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { COMPARISONS } from "@/lib/comparisons";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { ArrowRight, Scale, CheckCircle2, FileText } from "lucide-react";

export const metadata = constructMetadata({
  title: "OSINT Tool Comparisons & Benchmarks | OSINTScan",
  description:
    "First-party technical comparisons and accuracy benchmarks evaluating OSINTScan, Sherlock CLI, Maigret, WhatsMyName, and public digital footprint tools.",
  canonical: "/comparisons",
});

export default function ComparisonsIndexPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Comparisons", url: "/comparisons" },
  ]);

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>›</span>
        <span className="text-slate-900 font-semibold">Comparisons</span>
      </nav>

      {/* Header */}
      <header className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
          <Scale className="w-3.5 h-3.5" />
          <span>OSINTScan Research &amp; Benchmarks</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
          OSINT Tool Comparisons &amp; Methodology Studies
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Objective, first-party technical evaluations comparing open-source command-line utilities (Sherlock, Maigret, WhatsMyName, Blackbird) and browser-based digital footprint workflows across detection accuracy, false-positive handling, and privacy.
        </p>
      </header>

      {/* Studies List */}
      <section className="grid grid-cols-1 gap-6">
        {COMPARISONS.map((study) => (
          <article
            key={study.slug}
            className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-2xs space-y-4"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">{study.author}</span>
              <span>•</span>
              <span>Updated {study.dateUpdated}</span>
              <span>•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                {study.sampleSize}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
              <Link href={`/comparisons/${study.slug}`} className="hover:text-indigo-600 transition-colors">
                {study.title}
              </Link>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {study.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                {study.toolsCompared.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <Link
                href={`/comparisons/${study.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                <span>Read Full Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* Internal Link Graph to Tools & Guides */}
      <section className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Test the Tools Directly</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Evaluate public digital footprint signals across username, email, and phone number directories using OSINTScan&apos;s in-memory workspace.
        </p>
        <div className="flex flex-wrap gap-3 pt-1 text-xs font-semibold">
          <Link href="/username-search" className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors">
            Username Search
          </Link>
          <Link href="/email-lookup" className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors">
            Email Lookup
          </Link>
          <Link href="/phone-lookup" className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors">
            Phone Lookup
          </Link>
          <Link href="/digital-footprint-check" className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors">
            Digital Footprint Check
          </Link>
          <Link href="/guides" className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors">
            <FileText className="w-3.5 h-3.5" />
            <span>OSINT Guides</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
