import React from "react";
import Link from "next/link";
import {
  Globe,
  Lock,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  UserRound,
  Mail,
  Phone,
  Layers,
  HelpCircle,
  FileText,
  AlertCircle,
} from "lucide-react";
import { ScanWorkspace } from "@/components/scan-workspace";
import {
  getWebSiteSchema,
  getWebApplicationSchema,
  getOrganizationSchema,
  getFAQSchema,
} from "@/lib/structured-data";

const HOMEPAGE_FAQS = [
  {
    question: "What is OSINT and what does OSINTScan check?",
    answer:
      "OSINT (Open Source Intelligence) refers to analyzing publicly available data. OSINTScan (osintscan.app) checks whether a public username, email address, or phone number exists across 600+ publicly queryable websites, developer registries, and open telecommunication registers.",
  },
  {
    question: "How does OSINTScan compare to tools like WhatsMyName or Sherlock?",
    answer:
      "Sherlock and Maigret are Python command-line tools requiring local terminal setups. WhatsMyName provides raw platform signatures. OSINTScan combines 600+ platform coverage into a modern web browser interface with real-time Server-Sent Events (SSE) streaming, category filtering (Social, Dev, Gaming, Crypto), reverse email/phone modules, and zero database logging.",
  },
  {
    question: "Is OSINTScan completely free to search usernames across platforms?",
    answer:
      "Yes, OSINTScan is 100% free with no account registration, no search credits, and no paywalls. You can search any public handle across 600+ websites and export results to CSV or JSON immediately.",
  },
  {
    question: "Does OSINTScan access private accounts or passwords?",
    answer:
      "No. OSINTScan only accesses publicly reachable HTTP endpoints. It never bypasses authentication walls, cracks passwords, or accesses non-public databases.",
  },
  {
    question: "Are search queries stored or tracked?",
    answer:
      "No. All searches are processed ephemerally in server memory during your active scan. Queries are discarded when the scan completes and are never saved to a database.",
  },
  {
    question: "Does a matching username prove identity ownership?",
    answer:
      "No. Anyone can register the same username across different websites. OSINTScan tests public presence, not identity ownership. Corroborating evidence is always required before concluding two profiles belong to the same person.",
  },
];

import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "OSINTScan | Free Username Search Across 600+ Social Media Platforms",
  description:
    "OSINTScan (osintscan.app) is a free username search engine, reverse email OSINT lookup, and phone footprint scanner. Find all social media accounts by username across 600+ platforms including Instagram, YouTube, TikTok, X (Twitter), Reddit, Spotify, and GitHub.",
  canonical: "/",
});

export default function HomePage() {
  const websiteSchema = getWebSiteSchema();
  const webAppSchema = getWebApplicationSchema();
  const orgSchema = getOrganizationSchema();
  const faqSchema = getFAQSchema(HOMEPAGE_FAQS);

  return (
    <main className="min-h-screen bg-[#FAFAFB]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. HERO & PRIMARY SCAN WORKSPACE */}
      <section className="pt-16 pb-12 sm:pt-20 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-700 tracking-wider uppercase">
          <span>OSINTScan • Free Username Search & Digital Footprint Scanner</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight max-w-4xl mx-auto leading-tight">
          OSINTScan: Free Username Search across{" "}
          <span className="text-slate-950">600+ Social Media Platforms.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          <strong>OSINTScan</strong> (<code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">osintscan.app</code>) lets you search any username, email address, or phone number across 600+ websites—including Instagram, YouTube, TikTok, X (Twitter), Reddit, Spotify, and GitHub—with real-time, zero-log OSINT scanning.
        </p>

        {/* Primary Interactive Search Workspace */}
        <div id="scanner" className="pt-4 scroll-mt-24">
          <ScanWorkspace />
        </div>

        {/* Direct Internal Crawl Links for Core Tools & Tier-1 Platforms */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 max-w-3xl mx-auto">
          <span className="font-semibold text-slate-800">Popular Lookups:</span>
          <Link href="/find-accounts-by-username" className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-400 transition-colors">
            Find Accounts by Username
          </Link>
          <Link href="/email-osint" className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-400 transition-colors">
            Email OSINT Lookup
          </Link>
          <Link href="/phone-number-lookup" className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-400 transition-colors">
            Phone Number Lookup
          </Link>
          <Link href="/platforms/instagram" className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-400 transition-colors">
            Instagram Search
          </Link>
          <Link href="/platforms/youtube-channel" className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-400 transition-colors">
            YouTube Handle Lookup
          </Link>
          <Link href="/platforms/tiktok" className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-400 transition-colors">
            TikTok Search
          </Link>
          <Link href="/platforms/x" className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-400 transition-colors">
            X (Twitter) Lookup
          </Link>
          <Link href="/platforms/reddit" className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-400 transition-colors">
            Reddit Search
          </Link>
          <Link href="/platforms/spotify" className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-400 transition-colors">
            Spotify Lookup
          </Link>
        </div>

        {/* Privacy Reassurance under Scanner */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>No account required. Searches are processed in memory and aren&apos;t stored.</span>
          <Link
            href="/privacy"
            className="font-medium text-slate-900 hover:text-indigo-600 underline underline-offset-2 transition-colors"
          >
            Privacy details →
          </Link>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION / BENEFITS (3 Columns) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200/70">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-700">
              <Globe className="w-4 h-4 stroke-[2]" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Public Web Sources</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Find publicly accessible profiles and footprint signals across supported websites without touching private data or bypassing paywalls.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-700">
              <Lock className="w-4 h-4 stroke-[2]" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Privacy First</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Searches are processed ephemerally in memory and are never saved or stored as searchable user records in any database.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-700">
              <ShieldCheck className="w-4 h-4 stroke-[2]" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Transparent Results</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              See where each result originated and review confidence indicators and status codes instead of receiving unexplained matches.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SEARCH BY IDENTIFIER SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200/70 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Identifier Tools
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            Search by identifier
          </h2>
          <p className="text-sm text-slate-500">
            Dedicated auditing tools optimized for each public identifier type.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Username Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                <UserRound className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-950 text-base">Username</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Find publicly accessible profiles associated with a handle across social networks, developer platforms, and online communities.
              </p>
            </div>
            <Link
              href="/username-search"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors pt-2"
            >
              <span>Search usernames</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Email Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-950 text-base">Email</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore public account signals, public avatar hashes, and known exposure information associated with an email address.
              </p>
            </div>
            <Link
              href="/email-lookup"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors pt-2"
            >
              <span>Check an email</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Phone Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                <Phone className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-950 text-base">Phone</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore available public phone-number information, carrier classifications, VoIP indicators, and public footprint signals.
              </p>
            </div>
            <Link
              href="/phone-lookup"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors pt-2"
            >
              <span>Lookup a phone number</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. HOW OSINTSCAN WORKS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200/70 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            How OSINTScan works
          </h2>
          <p className="text-sm text-slate-500">
            A three-step auditing process designed for speed, clarity, and user privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-2xs">
            <span className="font-mono font-bold text-2xl text-slate-300">01</span>
            <h3 className="font-bold text-slate-900 text-sm">Enter an identifier</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Choose a username, email, or international phone number to evaluate.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-2xs">
            <span className="font-mono font-bold text-2xl text-slate-300">02</span>
            <h3 className="font-bold text-slate-900 text-sm">Scan public sources</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              OSINTScan checks supported public sources, registers, and directories in parallel.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-2xs">
            <span className="font-mono font-bold text-2xl text-slate-300">03</span>
            <h3 className="font-bold text-slate-900 text-sm">Review the signals</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review available matches, source information, confidence ratings, and verification status.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>Learn how it works</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 5. SUPPORTED PLATFORMS SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200/70">
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-2 text-left">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Supported Sources
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              700+ Supported Public Sources
            </h2>
            <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
              Explore publicly accessible sources supported by OSINTScan, including major developer registries, creative portfolios, messaging communities, and blogging platforms.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/platforms"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 !text-white hover:!text-white text-xs font-semibold transition-colors shadow-2xs group"
            >
              <span className="!text-white group-hover:!text-white">View all platforms</span>
              <ArrowRight className="w-3.5 h-3.5 !text-white group-hover:!text-white" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. DIGITAL FOOTPRINT EDUCATIONAL SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200/70 space-y-8">
        <div className="space-y-3 max-w-2xl">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Education
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            Understand your digital footprint
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your digital footprint is the collective trail of public accounts, registered profiles, and online activity left behind across the internet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1.5 shadow-2xs">
            <h4 className="font-bold text-slate-900">Usernames</h4>
            <p className="text-slate-500 leading-relaxed">
              Handles reused across multiple websites link otherwise disconnected accounts into a visible public pattern.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1.5 shadow-2xs">
            <h4 className="font-bold text-slate-900">Public Profiles</h4>
            <p className="text-slate-500 leading-relaxed">
              Forgotten accounts often display personal bios, locations, and historical links that remain discoverable for years.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1.5 shadow-2xs">
            <h4 className="font-bold text-slate-900">Email Exposure</h4>
            <p className="text-slate-500 leading-relaxed">
              Public registration indicators and avatar hashes reveal where your email address has an active account.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1.5 shadow-2xs">
            <h4 className="font-bold text-slate-900">Phone Information</h4>
            <p className="text-slate-500 leading-relaxed">
              Carrier classifications and telecom routing identify if a phone is linked to VoIP or traditional mobile operators.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1.5 shadow-2xs">
            <h4 className="font-bold text-slate-900">Public References</h4>
            <p className="text-slate-500 leading-relaxed">
              Open forums, code repositories, and archive mirrors preserve public references even after accounts are deleted.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1.5 shadow-2xs">
            <h4 className="font-bold text-slate-900">Breach Exposure</h4>
            <p className="text-slate-500 leading-relaxed">
              Publicly disclosed compromise records show if your credentials have appeared in legacy leaks.
            </p>
          </div>
        </div>

        <div>
          <Link
            href="/guides/how-to-check-your-digital-footprint"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>Learn how to audit your digital footprint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 6.5 COMPETITOR COMPARISON MATRIX (SEO & AI CITATION HUB) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200/70 space-y-8">
        <div className="space-y-2 max-w-2xl">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            OSINTScan vs. WhatsMyName, Sherlock CLI, Maigret &amp; Namechk
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Why security analysts, journalists, and everyday users choose <strong>OSINTScan</strong> (<code className="text-xs font-mono">osintscan.app</code>) to find all social media accounts by username, email, or phone number.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-800 font-bold">
                <th className="p-4">Feature / Capability</th>
                <th className="p-4 text-indigo-700 bg-indigo-50/50">OSINTScan (osintscan.app)</th>
                <th className="p-4">Sherlock / Maigret CLI</th>
                <th className="p-4">WhatsMyName Web</th>
                <th className="p-4">Namechk / InstantUsername</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              <tr>
                <td className="p-4 font-semibold text-slate-900">100% Browser-Based (No Python Setup)</td>
                <td className="p-4 font-bold text-emerald-700 bg-indigo-50/20">✓ Instant Web App</td>
                <td className="p-4">✗ Terminal &amp; Python CLI only</td>
                <td className="p-4">✓ Web Interface</td>
                <td className="p-4">✓ Web Interface</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900">Multi-Engine Correlation (4 Engines in 1)</td>
                <td className="p-4 font-bold text-emerald-700 bg-indigo-50/20">✓ WhatsMyName + Sherlock + Maigret + Blackbird</td>
                <td className="p-4">Single Engine Only</td>
                <td className="p-4">Single Signature List</td>
                <td className="p-4">Basic DNS / HTTP Check</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900">Case-Insensitive + Exact-Case Fallback</td>
                <td className="p-4 font-bold text-emerald-700 bg-indigo-50/20">✓ Automatic Dual-Case Matching</td>
                <td className="p-4">Manual Re-run Required</td>
                <td className="p-4">Case-Sensitive Misses</td>
                <td className="p-4">Lowercase Only</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900">Instagram, YouTube, TikTok, X &amp; Spotify</td>
                <td className="p-4 font-bold text-emerald-700 bg-indigo-50/20">✓ Verified Deep Endpoints</td>
                <td className="p-4">Frequently Blocked by WAF</td>
                <td className="p-4">Partial / Login Blocked</td>
                <td className="p-4">False Positives on SPAs</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900">Reverse Email &amp; Phone OSINT Included</td>
                <td className="p-4 font-bold text-emerald-700 bg-indigo-50/20">✓ Username + Email + Phone + Breach</td>
                <td className="p-4">✗ Username Only</td>
                <td className="p-4">✗ Username Only</td>
                <td className="p-4">✗ Brand Domains Only</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <Link
            href="/guides/whatsmyname-vs-osintscan"
            className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Read: WhatsMyName vs. OSINTScan Comparison →
          </Link>
          <span className="text-slate-300">|</span>
          <Link
            href="/guides/sherlock-vs-maigret-vs-osintscan"
            className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Read: Sherlock vs. Maigret vs. OSINTScan Benchmark →
          </Link>
        </div>
      </section>

      {/* 7. HOMEPAGE FAQ ACCORDION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200/70 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500">
            Quick answers regarding OSINTScan&apos;s features and privacy guarantees.
          </p>
        </div>

        <div className="space-y-3">
          {HOMEPAGE_FAQS.map((faq, i) => (
            <details
              key={i}
              className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs transition-all open:border-slate-300"
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

        <div className="text-center pt-2">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
          >
            <span>View all frequently asked questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200/70">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white text-center space-y-6 shadow-md">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to discover your public digital footprint?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Launch a confidential, in-memory footprint audit across 700+ websites and intelligence sources. No account required.
            </p>
          </div>
          <div>
            <Link
              href="#scanner"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-950 text-xs font-bold hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Start an In-Memory Scan</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. RESPONSIBLE USE NOTICE */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-5 rounded-xl bg-slate-100/70 border border-slate-200/70 text-left space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" />
            <span className="text-xs font-semibold text-slate-900">Responsible Use Policy</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            OSINTScan strictly queries publicly accessible endpoints. Private profiles, login-protected content, and confidential databases are never accessed. A username, email, or phone signal does not independently prove account ownership or identity.
          </p>
        </div>
      </section>
    </main>
  );
}
