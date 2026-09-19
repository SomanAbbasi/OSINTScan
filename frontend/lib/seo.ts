import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://osintscan.org";

export function constructMetadata({
  title = "OSINTScan — Public Digital Footprint Search",
  description = "Search usernames, emails, and phone numbers across publicly accessible sources with OSINTScan, a privacy-conscious digital footprint auditing tool.",
  canonical = "/",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const fullUrl = `${SITE_URL}${canonical.startsWith("/") ? canonical : `/${canonical}`}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "OSINTScan",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: `${SITE_URL}/logo-full.png`,
          width: 1200,
          height: 630,
          alt: title || "OSINTScan — Digital Footprint Intelligence",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/logo-full.png`],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
  };
}
