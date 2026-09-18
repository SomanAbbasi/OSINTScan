import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Layers,
  BookOpen,
  Search,
} from "lucide-react";
import { ScanWorkspace } from "@/components/scan-workspace";
import { getBreadcrumbSchema, getFAQSchema, getWebApplicationSchema } from "@/lib/structured-data";
import { OSINTInputType } from "@/lib/types";

export interface ToolPageProps {
  h1: string;
  badge: string;
  description: string;
  canonical: string;
  inputType: OSINTInputType;
  howItWorks: { step: string; title: string; desc: string }[];
  whatCanBeFound: string[];
  whatCannotBeDetermined: string[];
  platformExamples: { name: string; category: string; description: string }[];
  limitations: string[];
  faqs: { question: string; answer: string }[];
  relatedTools: { name: string; href: string; desc: string }[];
  relatedGuides: { title: string; href: string }[];
}

export function ToolPageTemplate({
  h1,
  badge,
  description,
  canonical,
  inputType,
  howItWorks,
  whatCanBeFound,
  whatCannotBeDetermined,
  platformExamples,
  limitations,
  faqs,
  relatedTools,
  relatedGuides,
}: ToolPageProps) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: h1, url: canonical },
  ]);

  const faqSchema = getFAQSchema(faqs);
  const webAppSchema = getWebApplicationSchema();

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate">{h1}</span>
      </nav>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-700 tracking-wider uppercase">
          <span>{badge}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
          {h1}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Actual Working Interactive Scanner */}
      <div id="scanner" className="scroll-mt-24">
        <ScanWorkspace initialInputType={inputType} />
      </div>

      {/* In-Memory Privacy Guarantee */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center flex items-center justify-center gap-2 text-xs text-slate-600">
        <Lock className="w-3.5 h-3.5 text-slate-500" />
        <span>
          In-memory execution: queries are never stored or logged in any database.
        </span>
        <Link href="/privacy" className="font-semibold text-slate-900 underline ml-1">
          Privacy Policy
        </Link>
      </div>

      {/* How This Tool Works */}
      <section className="pt-8 border-t border-slate-200/80 space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Methodology
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
            How This Scan Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howItWorks.map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2"
            >
              <span className="font-mono text-xl font-bold text-slate-300">
                {item.step}
              </span>
              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What Can Be Found vs. What Cannot */}
      <section className="pt-8 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Can Be Found */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-sm">What Can Be Found</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            {whatCanBeFound.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cannot Be Determined */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-rose-700">
            <XCircle className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-sm">What Cannot Be Determined</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            {whatCannotBeDetermined.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Platform Examples */}
      {platformExamples.length > 0 && (
        <section className="pt-8 border-t border-slate-200/80 space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Coverage Examples
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
              Sample Platform Signals
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {platformExamples.map((ex, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  <span>{ex.category}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{ex.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{ex.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Limitations & False Positives */}
      <section className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
        <div className="flex items-center gap-2 text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <h3 className="font-bold text-xs sm:text-sm">Limitations & Corroboration Notice</h3>
        </div>
        <ul className="space-y-1.5 text-xs text-amber-950/90 leading-relaxed">
          {limitations.map((lim, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-amber-700 font-bold">•</span>
              <span>{lim}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Tool FAQ Accordion */}
      <section className="pt-8 border-t border-slate-200/80 space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Questions & Answers
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs transition-all open:border-slate-300"
            >
              <summary className="font-semibold text-xs sm:text-sm text-slate-900 cursor-pointer list-none flex items-center justify-between gap-4">
                <span>{faq.question}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform text-xs shrink-0">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Related Tools & Guides */}
      <section className="pt-8 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Related Tools */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-600" />
            <span>Related OSINTScan Tools</span>
          </h3>
          <div className="space-y-2">
            {relatedTools.map((tool, i) => (
              <Link
                key={i}
                href={tool.href}
                className="block p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {tool.name}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Related Guides */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-600" />
            <span>Recommended Research Guides</span>
          </h3>
          <div className="space-y-2">
            {relatedGuides.map((guide, i) => (
              <Link
                key={i}
                href={guide.href}
                className="block p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {guide.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Educational Article</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
