import { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";
import { getTier1Platforms } from "@/lib/platforms";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.osintscan.app";
  const now = new Date().toISOString();

  // Core static & primary tool landing pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },

    // Primary Navigation
    { url: `${baseUrl}/how-it-works`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/platforms`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },

    // Username Tool Suite
    { url: `${baseUrl}/username-search`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/username-lookup`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/username-osint`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/find-accounts-by-username`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/social-media-username-search`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/check-username-across-platforms`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/username-availability-checker`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },

    // Email Tool Suite
    { url: `${baseUrl}/email-lookup`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/reverse-email-lookup`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/email-osint`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/email-breach-check`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/email-footprint`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },

    // Phone Tool Suite
    { url: `${baseUrl}/phone-lookup`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/reverse-phone-lookup`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/phone-number-lookup`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/phone-osint`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/phone-number-information`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },

    // Digital Footprint Hub
    { url: `${baseUrl}/digital-footprint-check`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },

    // Transparency & Legal
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/open-source`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Guides & Competitor Comparisons
  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${baseUrl}/guides/${g.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Only index Tier-1 high-volume platforms (Instagram, YouTube, TikTok, X, Reddit, Spotify, GitHub, etc.)
  // Prevents crawl budget exhaustion across 650+ minor/non-English/thin platform slugs
  const tier1Platforms = getTier1Platforms();
  const platformRoutes: MetadataRoute.Sitemap = tier1Platforms.map((p) => ({
    url: `${baseUrl}/platforms/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...guideRoutes, ...platformRoutes];
}
