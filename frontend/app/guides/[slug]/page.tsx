import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { GUIDES, getGuideBySlug } from "@/lib/guides";
import { getArticleSchema, getBreadcrumbSchema } from "@/lib/structured-data";
import { ScanWorkspace } from "@/components/scan-workspace";
import { ArrowLeft, Clock, Calendar, BookOpen, Share2 } from "lucide-react";

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
    title: `${guide.title} | WhatsMyName Guides`,
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
    url: `https://whatsmyname.app/guides/${guide.slug}`,
    datePublished: guide.publishedAt,
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "https://whatsmyname.app" },
    { name: "Guides", url: "https://whatsmyname.app/guides" },
    { name: guide.title, url: `https://whatsmyname.app/guides/${guide.slug}` },
  ]);

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Back button */}
      <div>
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 :text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Guides</span>
        </Link>
      </div>

      {/* Article Header */}
      <div className="space-y-3 pb-6 border-b border-slate-200 ">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 ">
          {guide.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
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
        </div>
      </div>

      {/* Article Body */}
      <article className="space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
        <p className="text-lg font-medium text-slate-900 leading-relaxed">
          {guide.content.intro}
        </p>

        {guide.content.sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 ">
              {section.heading}
            </h2>
            {section.body.map((paragraph, pIdx) => (
              <p key={pIdx}>{paragraph}</p>
            ))}
          </div>
        ))}

        <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-sm text-slate-800 ">
          <h3 className="font-bold mb-1 text-slate-900 ">Summary Key Takeaway:</h3>
          <p>{guide.content.conclusion}</p>
        </div>
      </article>

      {/* Interactive CTA to scan username */}
      <div className="pt-10 border-t border-slate-200 space-y-4">
        <h3 className="text-xl font-bold text-slate-900 text-center">
          Put This Guide Into Practice
        </h3>
        <p className="text-xs text-slate-500 text-center max-w-md mx-auto">
          Audit your public handles across 700+ platforms with WhatsMyName now.
        </p>
        <ScanWorkspace />
      </div>
    </main>
  );
}
