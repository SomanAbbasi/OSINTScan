import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://osintscan.org";

  return {
    rules: {
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
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
