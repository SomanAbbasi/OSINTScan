import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { COMPARISONS, getComparisonBySlug } from "@/lib/comparisons";
import { getArticleSchema, getBreadcrumbSchema } from "@/lib/structured-data";
import { AlertTriangle, ArrowRight, Scale, Search } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const study = getComparisonBySlug(slug);
  if (!study) return {};

  return constructMetadata({
    title: study.metaTitle,
    description: study.metaDescription,
    canonical: `/comparisons/${study.slug}`,
  });
}

export default async function ComparisonDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getComparisonBySlug(slug);
  if (!study) notFound();

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Comparisons", url: "/comparisons" },
    { name: study.title, url: `/comparisons/${study.slug}` },
  ]);

  const articleSchema = getArticleSchema({
    title: study.title,
    description: study.metaDescription,
    url: `/comparisons/${study.slug}`,
    datePublished: study.datePublished,
    dateModified: study.dateUpdated,
    authorName: study.author,
  });

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>›</span>
        <Link href="/comparisons" className="hover:text-slate-900 transition-colors">
          Comparisons
        </Link>
        <span>›</span>
        <span className="text-slate-900 font-semibold truncate">{study.title}</span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-900">By {study.author}</span>
          <span>•</span>
          <span>Published {study.datePublished}</span>
          <span>•</span>
          <span>Last updated {study.dateUpdated}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
          {study.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {study.subtitle}
        </p>
      </header>

      {/* Methodology Box */}
      <section className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Scale className="w-4 h-4 text-indigo-600" />
          <span>Evaluation Methodology &amp; Scope</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {study.methodologySummary}
        </p>
        <p className="text-xs text-slate-500">
          <strong>Sample Scope:</strong> {study.sampleSize}
        </p>
      </section>

      {/* Comparison Matrix */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-950">Technical Comparison Matrix</h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-800 font-bold">
                <th className="p-4">Dimension</th>
                <th className="p-4 text-indigo-700 bg-indigo-50/50">{study.toolsCompared[0]}</th>
                <th className="p-4">{study.toolsCompared[1]}</th>
                <th className="p-4">{study.toolsCompared[2]}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              {study.comparisonRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="p-4 font-semibold text-slate-900">{row.dimension}</td>
                  <td className="p-4 font-medium text-slate-900 bg-indigo-50/10">{row.osintscan}</td>
                  <td className="p-4">{row.toolA}</td>
                  <td className="p-4">{row.toolB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Analytical Sections */}
      {study.sections.map((sec, idx) => (
        <section key={idx} className="space-y-3">
          <h2 className="text-xl font-bold text-slate-950">{sec.heading}</h2>
          {sec.body.map((p, pIdx) => (
            <p key={pIdx} className="text-sm text-slate-600 leading-relaxed">
              {p}
            </p>
          ))}
        </section>
      ))}

      {/* Limitations */}
      <section className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Known Limitations &amp; Responsible Interpretation</span>
        </h2>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
          {study.limitations.map((lim, idx) => (
            <li key={idx}>{lim}</li>
          ))}
        </ul>
      </section>

      {/* Related Tools & Studies */}
      <section className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <Link
            href="/username-search"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Launch Username Search</span>
          </Link>
          <Link
            href="/email-lookup"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors"
          >
            Email Lookup
          </Link>
          <Link
            href="/digital-footprint-check"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors"
          >
            Digital Footprint Check
          </Link>
        </div>
        <Link
          href="/comparisons"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
        >
          <span>All Comparisons</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </main>
  );
}
