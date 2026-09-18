import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { getAllPlatforms, getPlatformBySlug } from "@/lib/platforms";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { PlatformIcon } from "@/components/platform-icon";
import { ScanWorkspace } from "@/components/scan-workspace";
import { ExternalLink, ShieldCheck, AlertTriangle, ArrowLeft, Globe, Terminal, Info } from "lucide-react";

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
    title: `${platform.displayName} Username Search & Detection Spec | WhatsMyName`,
    description: `Audit public ${platform.displayName} accounts. Learn how WhatsMyName tests profile URLs, handles false positives, and verifies public usernames.`,
    canonical: `/platforms/${platform.slug}`,
  });
}

export default async function PlatformDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const platform = getPlatformBySlug(slug);
  if (!platform) notFound();

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "https://whatsmyname.app" },
    { name: "Platforms", url: "https://whatsmyname.app/platforms" },
    { name: platform.displayName, url: `https://whatsmyname.app/platforms/${platform.slug}` },
  ]);

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Back Link */}
      <div>
        <Link
          href="/platforms"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 :text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Platforms</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <PlatformIcon category={platform.category} name={platform.displayName} className="w-8 h-8" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 ">
                {platform.displayName}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium capitalize">
                {platform.category}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Public Profile Footprint Detection Specification
            </p>
          </div>
        </div>

        {platform.officialUrl && (
          <a
            href={platform.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 :bg-zinc-800 text-xs font-medium transition-colors"
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
            <Globe className="w-4 h-4 text-indigo-500" />
            Profile URL Pattern
          </h2>
          <code className="block p-3 rounded-xl bg-slate-50 text-xs font-mono text-indigo-600 break-all">
            {platform.uriPattern}
          </code>
          <p className="text-xs text-slate-500 leading-relaxed">
            The target username is substituted for the <code className="text-[11px] font-mono">&#123;account&#125;</code> parameter during automated checks.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-500" />
            Detection Logic & Fingerprint
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {platform.whatItTests}
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700 ">Confidence Tier:</span>
            <span className="capitalize text-indigo-600 font-medium">
              {platform.confidence}
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            False Positives & Limitations
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {platform.commonFalsePositives}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            Manual Verification Instructions
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {platform.verificationAdvice}
          </p>
        </div>
      </div>

      {/* Embedded Scan Workspace */}
      <div className="pt-8 border-t border-slate-200 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 text-center">
          Test a Username Across {platform.displayName} and 700+ Other Sites
        </h2>
        <ScanWorkspace />
      </div>
    </main>
  );
}
