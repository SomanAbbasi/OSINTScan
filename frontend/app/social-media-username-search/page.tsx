import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ScanWorkspace } from "@/components/scan-workspace";
import { MessageSquare, Users, Globe } from "lucide-react";

export const metadata = constructMetadata({
  title: "Social Media Username Search Across 700+ Networks | WhatsMyName",
  description:
    "Search any handle across hundreds of social networks, discussion boards, and creator platforms in seconds with WhatsMyName.",
  canonical: "/social-media-username-search",
});

export default function SocialMediaSearchPage() {
  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Social Media & Community Audits</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Social Media Username Search
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Search your handle across mainstream networks, alternative platforms, and niche social communities.
        </p>
      </div>

      <ScanWorkspace />

      <div className="max-w-4xl mx-auto pt-8 border-t border-slate-200 space-y-4 text-sm text-slate-600 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 ">
          Social Media Handle Reuse
        </h2>
        <p>
          Social media users frequently reuse the same avatar and handle across multiple networks. Whether you are a creator claiming your identity across emerging apps or an individual checking for impersonator profiles, WhatsMyName gives you instant visibility across public platforms.
        </p>
      </div>
    </main>
  );
}
