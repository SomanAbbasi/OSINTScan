import React from "react";
import Link from "next/link";
import { SearchX, Home, Search, ArrowRight, UserRound, Mail, Phone, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <main className="py-24 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto text-center space-y-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center mx-auto shadow-2xs">
        <SearchX className="w-8 h-8 stroke-[1.75]" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
          Error 404
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
          Page not found.
        </h1>
        <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/#scanner"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Start a Scan</span>
        </Link>
      </div>

      {/* Quick Navigation Directory */}
      <div className="pt-8 border-t border-slate-200 text-left space-y-3">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
          Helpful Destinations
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Link
            href="/username-search"
            className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-colors"
          >
            <UserRound className="w-3.5 h-3.5 text-slate-400" />
            <span>Username Search</span>
          </Link>
          <Link
            href="/email-lookup"
            className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>Email Lookup</span>
          </Link>
          <Link
            href="/phone-lookup"
            className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>Phone Lookup</span>
          </Link>
          <Link
            href="/guides"
            className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Research Guides</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
