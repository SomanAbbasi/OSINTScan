import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { getAllPlatforms, getPlatformBySlug } from "@/lib/platforms";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { PlatformIcon } from "@/components/platform-icon";
import { ScanWorkspace } from "@/components/scan-workspace";
import { ExternalLink, ShieldCheck, AlertTriangle, ArrowLeft, Globe, Terminal, BookOpen, Search } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const platforms = getAllPlatforms();
  return platforms.slice(0, 50).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const platform = getPlatformBySlug(slug);
  if (!platform) return {};

  return constructMetadata({
    title: `${platform.displayName} Username Search & Profile Footprint | OSINTScan`,
    description: `Audit public ${platform.displayName} accounts with OSINTScan. Discover profile URL patterns, detection signals, false-positive handling, and privacy-first verification.`,
    canonical: `/platforms/${platform.slug}`,
  });
}

export default async function PlatformDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const platform = getPlatformBySlug(slug);
  if (!platform) notFound();

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Platforms", url: "/platforms" },
    { name: platform.displayName, url: `/platforms/${platform.slug}` },
  ]);

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Breadcrumb / Back Link */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/platforms" className="hover:text-slate-900 transition-colors">
          Platforms
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate">{platform.displayName}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <PlatformIcon category={platform.category} name={platform.displayName} className="w-10 h-10" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                {platform.displayName} Username Search
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium capitalize">
                {platform.category}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Public profile detection specification and footprint signals
            </p>
          </div>
        </div>

        {platform.officialUrl && (
          <a
            href={platform.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
          >
            <span>Visit Platform</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Technical Spec Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            Profile URL Pattern
          </h2>
          <code className="block p-3 rounded-xl bg-slate-50 text-xs font-mono text-indigo-700 break-all border border-slate-100">
            {platform.uriPattern}
          </code>
          <p className="text-xs text-slate-500 leading-relaxed">
            The target username is substituted for the <code className="text-[11px] font-mono">&#123;account&#125;</code> parameter during automated public HTTP evaluation.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-600" />
            Detection Logic & Fingerprint
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {platform.whatItTests}
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700">Confidence Tier:</span>
            <span className="capitalize text-indigo-600 font-medium">
              {platform.confidence}
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            False Positives & Limitations
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {platform.commonFalsePositives}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Manual Verification Instructions
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {platform.verificationAdvice}
          </p>
        </div>
      </div>

      {/* Embedded Scan Workspace */}
      <div className="pt-8 border-t border-slate-200 space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-950">
            Audit {platform.displayName} and 700+ Other Sites
          </h2>
          <p className="text-xs text-slate-500">
            Enter a username below to test {platform.displayName} alongside all cataloged public networks in parallel.
          </p>
        </div>
        <ScanWorkspace initialInputType="username" />
      </div>

      {/* Related Resources */}
      <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <span>Related guide:</span>
          <Link
            href="/guides/how-to-find-social-media-accounts-by-username"
            className="text-slate-900 font-semibold hover:underline"
          >
            How to Find Social Media Accounts by Username →
          </Link>
        </div>
        <Link
          href="/username-search"
          className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
        >
          <span>All Username Search Tools</span>
          <span>→</span>
        </Link>
      </div>
    </main>
  );
}
