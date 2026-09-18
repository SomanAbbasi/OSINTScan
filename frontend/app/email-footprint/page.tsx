import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ToolPageTemplate } from "@/components/tool-page-template";

export const metadata = constructMetadata({
  title: "Email Footprint Check — Map Public Email Exposure | OSINTScan",
  description:
    "Map and audit your email's public digital footprint. Identify registered accounts, open avatar profiles, and exposure points across the web.",
  canonical: "/email-footprint",
});

export default function EmailFootprintPage() {
  return (
    <ToolPageTemplate
      h1="Email Footprint Check"
      badge="Exposure Mapping"
      description="Analyze where your email address has left publicly observable footprints across online platforms, developer hubs, and public registrations."
      canonical="/email-footprint"
      inputType="email"
      howItWorks={[
        {
          step: "01",
          title: "Input Target Email",
          desc: "Provide the email address you want to audit for public exposure.",
        },
        {
          step: "02",
          title: "Multi-Source Scan",
          desc: "Queries public avatar systems, recovery indicators, and breach archives in parallel.",
        },
        {
          step: "03",
          title: "Footprint Map",
          desc: "Provides a structured inventory of active accounts and recommended privacy hygiene steps.",
        },
      ]}
      whatCanBeFound={[
        "Public service registrations linked to your email",
        "Gravatar avatars, display names, and linked vanity handles",
        "Mail server and MX domain routing configuration",
        "Known historical security disclosures and breach data",
      ]}
      whatCannotBeDetermined={[
        "Private email contents or personal address books",
        "Current passwords or active session tokens",
        "Real-time IP location or browsing history",
        "Accounts on private corporate networks",
      ]}
      platformExamples={[
        {
          name: "Gravatar",
          category: "Avatar Footprint",
          description: "Inspects public MD5/SHA256 email hashes for linked public profiles.",
        },
        {
          name: "Developer Hubs",
          category: "Code & Contributions",
          description: "Identifies public email associations in open git logs and author profiles.",
        },
        {
          name: "Public Breach Records",
          category: "Security Exposure",
          description: "Maps historical data compromise points.",
        },
      ]}
      limitations={[
        "Platforms with anti-enumeration features cannot be definitively verified.",
        "An email footprint reflects public surface area, not internal security health.",
        "Use this tool for defensive privacy auditing of your own identifiers.",
      ]}
      faqs={[
        {
          question: "Why should I audit my email footprint?",
          answer:
            "Over years of internet use, people register on dozens of websites they eventually forget about. An email footprint audit reveals dormant accounts that could be targeted in credential stuffing attacks.",
        },
        {
          question: "Is this email footprint audit private?",
          answer:
            "Yes. In-memory processing guarantees that your email address is never stored in our database or logged in query history.",
        },
        {
          question: "How can I reduce my email footprint?",
          answer:
            "Log into forgotten platforms to delete unused accounts, remove public email addresses from forum signatures, and use email alias services for new registrations.",
        },
      ]}
      relatedTools={[
        {
          name: "Email Lookup",
          href: "/email-lookup",
          desc: "Fast email footprint and account verification.",
        },
        {
          name: "Reverse Email Lookup",
          href: "/reverse-email-lookup",
          desc: "Technical reverse email analysis and registration checks.",
        },
        {
          name: "Digital Footprint Check",
          href: "/digital-footprint-check",
          desc: "Audit your overall public footprint.",
        },
      ]}
      relatedGuides={[
        {
          title: "How to Reduce Your Digital Footprint: Practical Privacy Guide",
          href: "/guides/how-to-reduce-your-digital-footprint",
        },
        {
          title: "How Reverse Email Lookup Works: Technical OSINT Explained",
          href: "/guides/how-reverse-email-lookup-works",
        },
        {
          title: "How to Check Your Digital Footprint Step-by-Step",
          href: "/guides/how-to-check-your-digital-footprint",
        },
      ]}
    />
  );
}
