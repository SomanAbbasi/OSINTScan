import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ToolPageTemplate } from "@/components/tool-page-template";

export const metadata = constructMetadata({
  title: "Reverse Email Lookup — Public Signals & Account Search | OSINTScan",
  description:
    "Conduct an ethical reverse email lookup. Discover connected public platforms, avatar profiles, and security exposure records tied to an email address.",
  canonical: "/reverse-email-lookup",
});

export default function ReverseEmailLookupPage() {
  return (
    <ToolPageTemplate
      h1="Reverse Email Lookup"
      badge="Reverse Identifier Intelligence"
      description="Identify public services, accounts, and exposure signals associated with an email address using transparent, in-memory open-source intelligence."
      canonical="/reverse-email-lookup"
      inputType="email"
      howItWorks={[
        {
          step: "01",
          title: "Enter Email Address",
          desc: "Provide any standard email address. We validate syntax and verify domain DNS records.",
        },
        {
          step: "02",
          title: "Query Public Indicators",
          desc: "Tests public recovery endpoints, avatar registries, and open breach records in parallel.",
        },
        {
          step: "03",
          title: "Review Footprint Signals",
          desc: "Inspect verified registration signals and exposure details with zero data persistence.",
        },
      ]}
      whatCanBeFound={[
        "Account presence across supported communication and developer services",
        "Public Gravatar profile data, avatar photos, and vanity usernames",
        "Public security disclosures and credential breach inclusions",
        "Domain mail server configuration (MX, SPF, and provider type)",
      ]}
      whatCannotBeDetermined={[
        "Private email messages, contacts, or passwords",
        "Owner identity without secondary verification",
        "Accounts on private enterprise intranets",
        "Physical address or phone number not published publicly",
      ]}
      platformExamples={[
        {
          name: "Gravatar / Automattic",
          category: "Avatar Metadata",
          description: "MD5/SHA256 email hashes link to public profile photos and handles.",
        },
        {
          name: "Google Public Metadata",
          category: "Public Profiles",
          description: "Inspects publicly queryable user avatar and album links where permitted.",
        },
        {
          name: "Breach Disclosure DBs",
          category: "Cyber Hygiene",
          description: "Indexes publicly exposed breach dumps to alert users to leaks.",
        },
      ]}
      limitations={[
        "Many modern platforms return identical responses for existing and non-existing accounts to protect against enumeration.",
        "A breach record indicates that an email appeared in a past dump, not necessarily that current systems are compromised.",
        "Always use reverse email lookup defensively and ethically.",
      ]}
      faqs={[
        {
          question: "How does reverse email lookup differ from a normal search engine?",
          answer:
            "Search engines index public web pages mentioning an email address as text. Reverse email lookup queries platform-specific API indicators and public avatar endpoints directly.",
        },
        {
          question: "Is this reverse email lookup completely confidential?",
          answer:
            "Yes. Scans are processed ephemerally in RAM and are immediately discarded. No log entries or databases store your lookup target.",
        },
        {
          question: "Can I use reverse email lookup for fraud prevention?",
          answer:
            "Yes. Security teams and individuals frequently audit email age, domain validity, and profile presence to assess account authenticity.",
        },
      ]}
      relatedTools={[
        {
          name: "Email Lookup",
          href: "/email-lookup",
          desc: "Fast email footprint and account verification.",
        },
        {
          name: "Email Breach Check",
          href: "/email-breach-check",
          desc: "Check historical breach exposures for an email.",
        },
        {
          name: "Email Footprint",
          href: "/email-footprint",
          desc: "Analyze complete email footprint and exposure surface.",
        },
      ]}
      relatedGuides={[
        {
          title: "How Reverse Email Lookup Works: Technical OSINT Explained",
          href: "/guides/how-reverse-email-lookup-works",
        },
        {
          title: "Email OSINT: Discovery, Verification & Footprint Mapping",
          href: "/guides/email-osint",
        },
        {
          title: "How to Reduce Your Digital Footprint",
          href: "/guides/how-to-reduce-your-digital-footprint",
        },
      ]}
    />
  );
}
