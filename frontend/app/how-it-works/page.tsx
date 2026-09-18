import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema, getFAQSchema } from "@/lib/structured-data";
import { ScanWorkspace } from "@/components/scan-workspace";
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Lock,
  Layers,
  CheckCircle2,
  HelpCircle,
  Cpu,
  ArrowRight,
} from "lucide-react";

export const metadata = constructMetadata({
  title: "How OSINTScan Works — Public Footprint Methodology | OSINTScan",
  description:
    "Learn how OSINTScan conducts privacy-first public footprint audits across 700+ websites. Understand our in-memory execution, confidence scoring, and ethical boundaries.",
  canonical: "/how-it-works",
});

const METHODOLOGY_FAQS = [
  {
    question: "Does an automated account match prove identity?",
    answer:
      "No. A matching username across different services does not independently prove that both profiles belong to the same person. Common handles are frequently registered by unrelated individuals. Automated results should be treated as investigative leads requiring manual corroboration.",
  },
  {
    question: "Are my search queries saved or logged in a database?",
    answer:
      "No. OSINTScan processes queries entirely in ephemeral system memory during the duration of your scan. Search inputs and results are never stored in a database, sold, or shared with third parties.",
  },
  {
    question: "Why do some platforms return 'Blocked' or 'Rate Limited'?",
    answer:
      "Modern web platforms frequently employ anti-bot firewalls (such as Cloudflare or Akamai) that challenge automated requests with CAPTCHAs or rate limits. When an endpoint blocks automated verification, OSINTScan transparently flags it rather than assuming the account does not exist.",
  },
  {
    question: "Does OSINTScan access private or password-protected content?",
    answer:
      "Never. OSINTScan only accesses publicly reachable HTTP endpoints, DNS records, and open-source indices. We do not bypass login barriers, access private messages, or crack passwords.",
  },
];

export default function HowItWorksPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "How It Works", url: "/how-it-works" },
  ]);

  const faqSchema = getFAQSchema(METHODOLOGY_FAQS);

  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">How It Works</span>
      </nav>

      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5" />
          <span>Audit Methodology & Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
          How OSINTScan Works
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          A transparent, privacy-first explanation of our in-memory scanning architecture, signal classification, and the technical boundaries of public footprint intelligence.
        </p>
      </div>

      {/* 3-Step Process Flow */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-950">The Three-Step Audit Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <span className="font-mono text-3xl font-extrabold text-slate-300">01</span>
            <h3 className="text-base font-bold text-slate-900">Enter an Identifier</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provide a username, email address, or international phone number. OSINTScan standardizes the input (normalizing casing, trimming whitespace, or formatting phone numbers into ITU-T E.164 standard) to ensure accurate target routing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <span className="font-mono text-3xl font-extrabold text-slate-300">02</span>
            <h3 className="text-base font-bold text-slate-900">Scan Public Sources</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our asynchronous scanner queries supported public web endpoints, carrier registries, and open metadata services in parallel. Requests are executed strictly in memory without saving search history.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <span className="font-mono text-3xl font-extrabold text-slate-300">03</span>
            <h3 className="text-base font-bold text-slate-900">Review the Signals</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Signals are categorized with transparent confidence indicators. You receive verified direct URLs, status codes, and manual inspection guidance to corroborate whether discovered profiles relate to your subject.
            </p>
          </div>
        </div>
      </section>

      {/* Critical Disclaimer: Signal vs. Proof of Identity */}
      <section className="p-8 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-4">
        <div className="flex items-center gap-2.5 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <h2 className="text-base font-bold">Public Signals vs. Proof of Identity</h2>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-amber-950/90 leading-relaxed">
          <p>
            An essential principle of open-source intelligence is that <strong>a matching identifier does not prove identity ownership</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-amber-900">
            <li>
              A username like <code className="bg-amber-100/80 px-1 py-0.5 rounded">alexdev</code> may be registered by dozens of entirely unrelated individuals across different networks.
            </li>
            <li>
              Automated scanners identify <em>public existence</em>, not human correlation. Never assume two profiles belong to the same person without secondary corroborating evidence (e.g., cross-linked bios, verified PGP keys, matching avatar hashes).
            </li>
            <li>
              OSINTScan does not make exaggerated claims like &ldquo;find everything about anyone.&rdquo; We report verifiable public indicators with transparent limitations.
            </li>
          </ul>
        </div>
      </section>

      {/* In-Memory Privacy Architecture */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-950">In-Memory Ephemeral Execution</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            OSINTScan was engineered from the ground up for privacy. Scans are processed in volatile server memory. When the connection closes, the query and matched results are discarded. We maintain no persistent search logs, user profiles, or tracking history.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-950">High-Concurrency Async Engine</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Instead of querying hundreds of websites sequentially, our engine utilizes asynchronous connection pooling with strict per-domain rate limits. Complete sweeps across 700+ endpoints typically stream back to your browser within 8 to 20 seconds.
          </p>
        </div>
      </section>

      {/* Status Language Breakdown */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-950">Signal Status Definitions</h2>
        <p className="text-xs text-slate-500">
          OSINTScan avoids presenting probabilistic or ambiguous signals as undeniable facts. We use precise classification tiers:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-900">Found / Positive Match</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              A publicly accessible profile page exists and matched positive response fingerprints (HTTP 200, valid user bio markers).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-slate-900">Manual Review Required</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              The endpoint responded with ambiguous content or client-side JavaScript that requires visiting the URL directly to confirm.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="text-xs font-bold text-slate-900">Not Found / No Signal</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              The platform returned a verified 404 Not Found or confirmed the username/identifier is not registered.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-slate-900">Blocked / Rate Limited</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              An anti-bot firewall challenged the automated request (HTTP 403/429/503). The account may or may not exist.
            </p>
          </div>
        </div>
      </section>

      {/* Embedded Scanner */}
      <section className="pt-8 border-t border-slate-200 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-950">
            Experience the Process
          </h2>
          <p className="text-xs text-slate-500">
            Launch an in-memory scan below to observe real-time parallel detection in action.
          </p>
        </div>
        <ScanWorkspace />
      </section>

      {/* Methodology FAQ */}
      <section className="pt-8 border-t border-slate-200 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-950">Methodology FAQ</h2>
          <p className="text-xs text-slate-500">
            Answers to common questions regarding technical detection and ethical boundaries.
          </p>
        </div>

        <div className="space-y-3">
          {METHODOLOGY_FAQS.map((faq, i) => (
            <details
              key={i}
              className="group p-4 rounded-xl bg-white border border-slate-200 transition-all open:ring-1 open:ring-slate-300"
            >
              <summary className="font-semibold text-xs sm:text-sm text-slate-900 cursor-pointer list-none flex items-center justify-between">
                <span>{faq.question}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform text-xs">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
