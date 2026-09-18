import React from "react";
import Link from "next/link";
import {
  Globe,
  Lock,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { ScanWorkspace } from "@/components/scan-workspace";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAFAFB]">
      {/* 1. HERO & PRIMARY SCAN WORKSPACE */}
      <section className="pt-16 pb-12 sm:pt-20 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-600 tracking-wider uppercase">
          <span>Public Digital Footprint Search</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight max-w-3xl mx-auto leading-tight">
          Discover your{" "}
          <span className="text-slate-950">public digital footprint.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          OSINTScan helps you discover publicly accessible profiles, account associations, and known exposure signals from a single search.
        </p>

        {/* Primary Interactive Search Workspace */}
        <div className="pt-4">
          <ScanWorkspace />
        </div>
      </section>

      {/* 2. TRUST & VALUE PROPOSITION (3 Columns) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200/70">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-700">
              <Globe className="w-4 h-4 stroke-[2]" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Public Web</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Find publicly accessible profiles and footprint signals across supported sources without invasive tracking.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-700">
              <Lock className="w-4 h-4 stroke-[2]" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Privacy First</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Searches are processed ephemerally in memory and are never saved or stored as searchable user records.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-700">
              <ShieldCheck className="w-4 h-4 stroke-[2]" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Transparent Results</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              See where each result came from and review confidence indicators instead of receiving unexplained matches.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (Section 11) */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200/70 scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-2xs">
            <span className="font-mono font-bold text-2xl text-slate-300">01</span>
            <h3 className="font-bold text-slate-900 text-sm">Enter an identifier</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Provide a username, email address, or international phone number to evaluate.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-2xs">
            <span className="font-mono font-bold text-2xl text-slate-300">02</span>
            <h3 className="font-bold text-slate-900 text-sm">OSINTScan searches</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Supported public sources, profiles, and registers are evaluated automatically in parallel.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-2xs">
            <span className="font-mono font-bold text-2xl text-slate-300">03</span>
            <h3 className="font-bold text-slate-900 text-sm">Review your footprint</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore detected profiles, verify source links, and export audit summaries securely.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SUPPORTED PLATFORMS PREVIEW (Section 12) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200/70">
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-2 text-left">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Coverage
            </span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              700+ Public Platforms
            </h2>
            <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
              Including major developer registries, creative portfolios, social media services, messaging communities, and blogging platforms.
            </p>
          </div>

          <Link
            href="/platforms"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-2xs shrink-0"
          >
            <span>Browse supported platforms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 5. RESPONSIBLE USE NOTICE (Section 9) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-6 rounded-xl bg-slate-100/60 border border-slate-200/70 text-left space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-900">Responsible use</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            OSINTScan only checks publicly accessible information. Private accounts, login-protected content, and restricted data are not accessed. A username match does not prove account ownership or identity.
          </p>
        </div>
      </section>
    </main>
  );
}
