import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { GUIDES, getGuideBySlug } from "@/lib/guides";
import { getArticleSchema, getBreadcrumbSchema } from "@/lib/structured-data";
import { ScanWorkspace } from "@/components/scan-workspace";
import { ArrowLeft, Clock, Calendar, BookOpen, ShieldCheck, ArrowRight } from "lucide-react";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return constructMetadata({
    title: `${guide.title} | OSINTScan Guides`,
    description: guide.description,
    canonical: `/guides/${guide.slug}`,
  });
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const articleSchema = getArticleSchema({
    title: guide.title,
    description: guide.description,
    url: `/guides/${guide.slug}`,
    datePublished: guide.publishedAt,
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: guide.title, url: `/guides/${guide.slug}` },
  ]);

  // Determine related guides
  const otherGuides = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-slate-900 transition-colors">
          Guides
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate">{guide.title}</span>
      </nav>

      {/* Article Header */}
      <div className="space-y-3 pb-6 border-b border-slate-200">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          {guide.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
          {guide.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{guide.publishedAt}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{guide.readTime}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OSINTScan Research</span>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <article className="space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
        <p className="text-lg font-medium text-slate-900 leading-relaxed">
          {guide.content.intro}
        </p>

        {guide.content.sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">
              {section.heading}
            </h2>
            {section.body.map((paragraph, pIdx) => (
              <p key={pIdx}>{paragraph}</p>
            ))}
          </div>
        ))}

        <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-sm text-slate-800">
          <h3 className="font-bold mb-1 text-slate-900">Summary Key Takeaway:</h3>
          <p>{guide.content.conclusion}</p>
        </div>
      </article>

      {/* Interactive Tool CTA */}
      <div className="pt-10 border-t border-slate-200 space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-2xl font-bold text-slate-950">
            Put This Guide Into Practice
          </h3>
          <p className="text-xs text-slate-500">
            Audit your public identifiers across 700+ platforms in real time with OSINTScan.
          </p>
        </div>
        <ScanWorkspace />
      </div>

      {/* Related Guides */}
      <div className="pt-8 border-t border-slate-200 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Related Practical Guides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {otherGuides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all space-y-2 group"
            >
              <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                {g.category}
              </span>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {g.title}
              </h4>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <span>Read guide</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
