"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { OSINTScanLogo } from "./logo";
import { useScanContext } from "@/context/scan-context";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const {
    status,
    target,
    username,
    foundMatches,
  } = useScanContext();

  const displayTarget = target || username;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Platforms", href: "/platforms" },
    { name: "Guides", href: "/guides" },
    { name: "FAQ", href: "/faq" },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-lg"
          >
            <OSINTScanLogo />
          </Link>
        </div>

        {/* Center: Minimal Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const active = isActiveLink(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  active
                    ? "text-slate-950 font-semibold bg-slate-100/80"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Status */}
        <div className="flex items-center gap-3">
          {status === "running" && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-slate-600" />
              <span>Scanning...</span>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          {status === "running" && (
            <div className="p-2.5 mb-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-800">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-slate-600" />
              <span className="truncate">Scanning {displayTarget}...</span>
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
