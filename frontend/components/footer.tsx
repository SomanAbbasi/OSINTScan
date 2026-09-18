import React from "react";
import Link from "next/link";
import { OSINTScanLogo } from "./logo";
import { Shield } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-3">
            <OSINTScanLogo />
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
              Public digital footprint intelligence. Discover where publicly accessible profiles and exposure signals exist across the web with transparent signals and privacy-first in-memory scanning.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>In-memory processing · No database tracking</span>
            </div>
          </div>

          {/* Col 2: Explore */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-slate-950 transition-colors">
                  Username Search
                </Link>
              </li>
              <li>
                <Link href="/digital-footprint-check" className="hover:text-slate-950 transition-colors">
                  Digital Footprint
                </Link>
              </li>
              <li>
                <Link href="/platforms" className="hover:text-slate-950 transition-colors">
                  Platforms
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-slate-950 transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-slate-950 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Transparency */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Transparency
            </h4>
            <ul className="space-y-2">
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
              <li>
                <Link href="/open-source" className="hover:text-slate-950 transition-colors">
                  Open Source
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-slate-950 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/guides" className="hover:text-slate-950 transition-colors">
                  OSINT Guides
                </Link>
              </li>
              <li>
                <Link href="/guides/how-to-audit-your-digital-footprint" className="hover:text-slate-950 transition-colors">
                  Safety & Privacy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-slate-950 transition-colors">
                  Responsible Research
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-slate-950 transition-colors">
                  Verification FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {currentYear} OSINTScan. Built for lawful research and public footprint auditing.</p>
          <div className="flex items-center gap-4">
            <Link href="/open-source" className="hover:text-slate-600 transition-colors">
              Open-source attribution
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">
              Privacy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-slate-600 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
