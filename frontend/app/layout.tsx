import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScanProvider } from "@/context/scan-context";
import { getWebApplicationSchema } from "@/lib/structured-data";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.osintscan.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OSINTScan | Free Username Search across 600+ Social Media Platforms",
    template: "%s | OSINTScan",
  },
  description:
    "Free username search and digital footprint scanner across 600+ social media platforms, developer communities, and forums. Real-time OSINT scanning, completely free with zero logs.",
  keywords: [
    "username search",
    "free username search",
    "social media username search",
    "check username across platforms",
    "find accounts by username",
    "username lookup",
    "reverse username lookup",
    "osint username search",
    "digital footprint search",
    "whatsmyname alternative",
    "sherlock username search online",
    "username availability checker",
    "reverse email lookup",
    "phone number osint",
  ],
  authors: [{ name: "OSINTScan Team" }],
  creator: "OSINTScan",
  publisher: "OSINTScan",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "OSINTScan — Public Digital Footprint Search",
    description: "Search usernames, emails, and phone numbers across 700+ publicly accessible platforms with privacy-first in-memory auditing.",
    url: SITE_URL,
    siteName: "OSINTScan",
    locale: "en_US",
    images: [
      {
        url: "/logo-full.png",
        width: 1200,
        height: 630,
        alt: "OSINTScan — Digital Footprint Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OSINTScan — Public Digital Footprint Search",
    description: "Privacy-conscious public digital footprint intelligence and handle audit across 700+ platforms.",
    images: ["/logo-full.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "BFtPanIXisSNmF0wW1-fwbPoYjsLWCfvTt4VP_HGmtw",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getWebApplicationSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="BFtPanIXisSNmF0wW1-fwbPoYjsLWCfvTt4VP_HGmtw" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.className} bg-[#FAFAFB] text-slate-900 flex flex-col min-h-screen antialiased selection:bg-indigo-500/10 selection:text-indigo-900`}
      >
        <ScanProvider>
          <Header />
          <div className="flex-1 no-print">{children}</div>
          <Footer />
        </ScanProvider>
      </body>
    </html>
  );
}
