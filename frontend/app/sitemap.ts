import { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";
import { COMPARISONS } from "@/lib/comparisons";
import { getTier1Platforms } from "@/lib/platforms";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.osintscan.app";
  const lastModified = "2026-09-27T00:00:00.000Z";

  // Core Information Architecture (Canonical Indexable Pages Only — No 301 Redirects or Doorway Pages)
  const coreRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/username-search`, lastModified, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/email-lookup`, lastModified, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/email-breach-check`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/phone-lookup`, lastModified, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/digital-footprint-check`, lastModified, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/how-it-works`, lastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/platforms`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/guides`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/comparisons`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/faq`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/open-source`, lastModified, changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Educational Guides
  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${baseUrl}/guides/${g.slug}`,
    lastModified: g.dateModified ? `${g.dateModified}T00:00:00.000Z` : lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // First-Party Research & Tool Comparisons
  const comparisonRoutes: MetadataRoute.Sitemap = COMPARISONS.map((c) => ({
    url: `${baseUrl}/comparisons/${c.slug}`,
    lastModified: `${c.dateUpdated}T00:00:00.000Z`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Tier-1 Indexable Platform Pages Only (No NOINDEX pages in XML sitemap)
  const tier1Platforms = getTier1Platforms();
  const platformRoutes: MetadataRoute.Sitemap = tier1Platforms.map((p) => ({
    url: `${baseUrl}/platforms/${p.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...coreRoutes, ...guideRoutes, ...comparisonRoutes, ...platformRoutes];
}
