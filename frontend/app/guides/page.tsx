import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { GUIDES } from "@/lib/guides";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export const metadata = constructMetadata({
  title: "OSINT & Digital Footprint Research Guides | WhatsMyName",
  description:
    "In-depth guides on public footprint auditing, false-positive elimination, brand handle protection, and ethical OSINT methodologies.",
  canonical: "/guides",
});

export default function GuidesHubPage() {
  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Educational Resources</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          OSINT & Digital Footprint Guides
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Master the fundamentals of public username discovery, false-positive control, and responsible online privacy hygiene.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 :border-indigo-600 transition-all shadow-xs flex flex-col justify-between space-y-4"
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
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 :text-indigo-400 transition-colors">
                {guide.title}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {guide.description}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-medium text-indigo-600 ">
              <span>Read Guide</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
