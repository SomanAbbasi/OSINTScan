import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScanProvider } from "@/context/scan-context";
import { getWebApplicationSchema } from "@/lib/structured-data";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OSINTScan — Public Digital Footprint Search",
  description:
    "Search usernames, emails, and phone numbers across publicly accessible sources with OSINTScan, a privacy-conscious digital footprint auditing tool.",
  keywords: [
    "osintscan",
    "digital footprint search",
    "public username search",
    "privacy audit tool",
    "osint tool",
    "account discovery",
  ],
  authors: [{ name: "OSINTScan" }],
  openGraph: {
    title: "OSINTScan — Public Digital Footprint Search",
    description: "Search usernames, emails, and phone numbers across 700+ publicly accessible platforms with privacy-first in-memory auditing.",
    url: "https://osintscan.org",
    siteName: "OSINTScan",
    type: "website",
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
