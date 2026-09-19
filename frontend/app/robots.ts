import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.osintscan.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/scans/",
          "/*?*username=*", // Disallow indexing of ephemeral query parameter variations
          "/*?*email=*",
          "/*?*phone=*",
        ],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-Web",
          "Google-Extended",
          "Applebot-Extended",
          "CCBot",
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt", "/how-it-works", "/platforms", "/guides", "/faq"],
        disallow: ["/api/", "/scans/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
