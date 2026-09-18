import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://whatsmyname.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/scans/",
        "/*?*username=*", // Avoid indexing ephemeral user search query URLs
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
