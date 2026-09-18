import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { GUIDES } from "@/lib/guides";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export const metadata = constructMetadata({
  title: "OSINT & Digital Footprint Research Guides | OSINTScan",
  description:
    "Practical guides on public footprint auditing, reverse email lookups, phone intelligence, false-positive elimination, and responsible privacy hygiene.",
  canonical: "/guides",
});

export default function GuidesHubPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
  ]);

  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Educational Content Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
          OSINT & Digital Footprint Guides
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Master the methodology of public username discovery, reverse email investigations, phone carrier lookups, and personal privacy hygiene.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-indigo-600 uppercase tracking-wider text-[10px]">
                  {guide.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {guide.readTime}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {guide.title}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {guide.description}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
              <span>Read Guide</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
