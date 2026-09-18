import { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";
import { getAllPlatforms } from "@/lib/platforms";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://whatsmyname.app";
  const now = new Date().toISOString();

  // Core static landing pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/username-search`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/digital-footprint-check`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/username-osint`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/social-media-username-search`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/find-accounts-by-username`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/username-availability-checker`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/check-username-across-platforms`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/platforms`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/open-source`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  // Guides
  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${baseUrl}/guides/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Platforms (cataloged platforms)
  const platforms = getAllPlatforms();
  const platformRoutes: MetadataRoute.Sitemap = platforms.map((p) => ({
    url: `${baseUrl}/platforms/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...guideRoutes, ...platformRoutes];
}
