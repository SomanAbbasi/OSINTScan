import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ToolPageTemplate } from "@/components/tool-page-template";

export const metadata = constructMetadata({
  title: "Username Search — Find Public Profiles Across 600+ Sites",
  description:
    "Free username search across 600+ social media platforms, developer communities, and forums. Discover public accounts and footprint signals instantly with OSINTScan.",
  canonical: "/username-search",
});

export default function UsernameSearchPage() {
  return (
    <ToolPageTemplate
      h1="Username Search"
      badge="Public Handle Discovery"
      description="Scan over 600 public platforms simultaneously to discover where a username has active public profiles, social pages, and online accounts."
      canonical="/username-search"
      inputType="username"
      howItWorks={[
        {
          step: "01",
          title: "Normalize Handle",
          desc: "Trims whitespace, strips protocol prefixes, and handles casing according to platform URL requirements.",
        },
        {
          step: "02",
          title: "Asynchronous HTTP Checks",
          desc: "Queries hundreds of public endpoints concurrently using fingerprint signatures to detect profile existence.",
        },
        {
          step: "03",
          title: "Confidence Classification",
          desc: "Filters out false positives and soft-404 redirects to present direct verified links with confidence scoring.",
        },
      ]}
      whatCanBeFound={[
        "Publicly accessible profile pages across 700+ services",
        "Developer repositories (GitHub, GitLab, CodeSandbox)",
        "Social networks, discussion forums, and community accounts",
        "Direct verified profile links and status responses",
      ]}
      whatCannotBeDetermined={[
        "Private or hidden profile details behind login gates",
        "Whether two accounts with the same username belong to the same person",
        "Passwords, authentication tokens, or personal messages",
        "Deleted or permanently purged historical profiles",
      ]}
      platformExamples={[
        {
          name: "GitHub",
          category: "Developer",
          description: "Public repositories, developer bios, contribution activity.",
        },
        {
          name: "Reddit",
          category: "Community",
          description: "Public user profile pages and forum participation signals.",
        },
        {
          name: "Instagram",
          category: "Social Media",
          description: "Public profile availability and vanity handle status.",
        },
      ]}
      limitations={[
        "Common usernames (e.g., 'johndoe', 'alexdev') are frequently registered by different people across different websites.",
        "Some services deploy anti-bot firewalls that return HTTP 403 or CAPTCHA challenges during automated checks.",
        "Always cross-reference bio links and avatar images to corroborate true identity ownership.",
      ]}
      faqs={[
        {
          question: "How does OSINTScan check 700+ platforms so quickly?",
          answer:
            "OSINTScan employs an asynchronous I/O architecture that evaluates requests in parallel connection pools, streaming results live in seconds.",
        },
        {
          question: "Does an active profile prove that the person owns it?",
          answer:
            "No. A matching username only proves that a profile exists under that handle. Anyone can register identical names on different platforms.",
        },
        {
          question: "Are username searches saved anywhere?",
          answer:
            "No. Searches are executed entirely in volatile memory and are discarded when the scan completes.",
        },
      ]}
      relatedTools={[
        {
          name: "Username Lookup",
          href: "/username-lookup",
          desc: "Quick handle verification across top online networks.",
        },
        {
          name: "Find Accounts by Username",
          href: "/find-accounts-by-username",
          desc: "Locate linked social media accounts and community footprints.",
        },
        {
          name: "Username OSINT",
          href: "/username-osint",
          desc: "Deep open-source intelligence analysis for usernames.",
        },
      ]}
      relatedGuides={[
        {
          title: "How to Find Social Media Accounts by Username",
          href: "/guides/how-to-find-social-media-accounts-by-username",
        },
        {
          title: "Why Username Search Results Can Be Wrong",
          href: "/guides/why-username-search-results-can-be-wrong",
        },
        {
          title: "How to Audit Your Digital Footprint Step-by-Step",
          href: "/guides/how-to-check-your-digital-footprint",
        },
      ]}
    />
  );
}
