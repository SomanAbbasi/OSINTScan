import React from "react";
import Link from "next/link";
import { OSINTScanLogo } from "./logo";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Philosophy */}
          <div className="space-y-3">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <OSINTScanLogo />
            </Link>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
              Public digital footprint intelligence. Discover publicly accessible profiles and exposure signals across the web with privacy-first scanning.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>In-memory processing · No database tracking</span>
            </div>
          </div>

          {/* EXPLORE */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/username-search" className="hover:text-slate-950 transition-colors">
                  Username Search
                </Link>
              </li>
              <li>
                <Link href="/email-lookup" className="hover:text-slate-950 transition-colors">
                  Email Lookup
                </Link>
              </li>
              <li>
                <Link href="/phone-lookup" className="hover:text-slate-950 transition-colors">
                  Phone Lookup
                </Link>
              </li>
              <li>
                <Link href="/reverse-email-lookup" className="hover:text-slate-950 transition-colors">
                  Reverse Email Lookup
                </Link>
              </li>
              <li>
                <Link href="/reverse-phone-lookup" className="hover:text-slate-950 transition-colors">
                  Reverse Phone Lookup
                </Link>
              </li>
              <li>
                <Link href="/digital-footprint-check" className="hover:text-slate-950 transition-colors">
                  Digital Footprint Check
                </Link>
              </li>
              <li>
                <Link href="/platforms" className="hover:text-slate-950 transition-colors">
                  All Platforms
                </Link>
              </li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/how-it-works" className="hover:text-slate-950 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/guides/how-to-check-your-digital-footprint" className="hover:text-slate-950 transition-colors">
                  Digital Footprint Guide
                </Link>
              </li>
              <li>
                <Link href="/guides/osint-methodology" className="hover:text-slate-950 transition-colors">
                  OSINT Methodology
                </Link>
              </li>
              <li>
                <Link href="/guides/how-to-reduce-your-digital-footprint" className="hover:text-slate-950 transition-colors">
                  Search Removal Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-slate-950 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-slate-950 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-950 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* TRANSPARENCY */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Transparency
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about#public-data" className="hover:text-slate-950 transition-colors">
                  Public Data Only
                </Link>
              </li>
              <li>
                <Link href="/privacy#in-memory" className="hover:text-slate-950 transition-colors">
                  No Database Tracking
                </Link>
              </li>
              <li>
                <Link href="/terms#rate-limits" className="hover:text-slate-950 transition-colors">
                  Rate Limits & Fair Use
                </Link>
              </li>
              <li>
                <Link href="/about#accuracy" className="hover:text-slate-950 transition-colors">
                  False Positive Policy
                </Link>
              </li>
              <li>
                <Link href="/open-source" className="hover:text-slate-950 transition-colors">
                  Open Source Notice
                </Link>
              </li>
              <li>
                <Link href="/about#contact" className="hover:text-slate-950 transition-colors">
                  Contact / Report Issue
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Notice */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            <span>In-memory processing · No database tracking · Public signals only</span>
          </div>
          <div>
            <span>© 2026 OSINTScan · Public information only · Responsible use</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
