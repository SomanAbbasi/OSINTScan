import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ToolPageTemplate } from "@/components/tool-page-template";

export const metadata = constructMetadata({
  title: "Email Lookup — Reverse Email Search & Account Verification | OSINTScan",
  description:
    "Perform a privacy-first email lookup to discover registered services, public avatar hashes, and footprint signals tied to an email address. In-memory and secure.",
  canonical: "/email-lookup",
});

export default function EmailLookupPage() {
  return (
    <ToolPageTemplate
      h1="Email Lookup"
      badge="Reverse Email Intelligence"
      description="Discover where an email address has publicly detectable accounts, registered service footprints, and known security breach exposures."
      canonical="/email-lookup"
      inputType="email"
      howItWorks={[
        {
          step: "01",
          title: "Format Validation",
          desc: "Validates email RFC syntax, extracts the domain, and verifies public mail exchange (MX) DNS records.",
        },
        {
          step: "02",
          title: "Public Endpoint Probing",
          desc: "Queries non-invasive public endpoints and account existence signals across supported services.",
        },
        {
          step: "03",
          title: "Footprint Synthesis",
          desc: "Aggregates confirmed service registrations, public avatar profiles, and breach exposure records.",
        },
      ]}
      whatCanBeFound={[
        "Public service registrations and active accounts tied to the email",
        "Public avatar profiles, usernames, and display names via Gravatar",
        "Domain MX and mail server infrastructure details",
        "Known data breach exposure and disclosure records",
      ]}
      whatCannotBeDetermined={[
        "Email passwords, credentials, or inbox contents",
        "Private correspondence, draft emails, or personal contacts",
        "Real-time IP address or physical location of the email owner",
        "Accounts on services that employ blind registration responses",
      ]}
      platformExamples={[
        {
          name: "Gravatar",
          category: "Avatar & Identity",
          description: "Public hash lookups reveal user avatars, associated handles, and bio text.",
        },
        {
          name: "GitHub / Developer Hubs",
          category: "Code Repositories",
          description: "Public author commits and verified email associations in git logs.",
        },
        {
          name: "Public Breach Repositories",
          category: "Security Intelligence",
          description: "Checks against known historical security compromises.",
        },
      ]}
      limitations={[
        "Modern platforms increasingly use anti-enumeration protections, making some account detections inconclusive.",
        "An email appearing in a breach dump does not mean the current password has been compromised if it was changed.",
        "Queries are executed strictly in memory to maintain confidential auditing standards.",
      ]}
      faqs={[
        {
          question: "Can anyone see what email I am looking up?",
          answer:
            "No. OSINTScan processes all email searches ephemerally in memory without logging or saving any queries to disk.",
        },
        {
          question: "Does looking up an email send an alert or message to that address?",
          answer:
            "No. Our checks evaluate passive public metadata and non-invasive existence endpoints. We never send emails to the target address.",
        },
        {
          question: "What should I do if my email appears in a public breach?",
          answer:
            "Immediately change your password on that service and any other account where you reused that password, and enable app-based two-factor authentication (2FA).",
        },
      ]}
      relatedTools={[
        {
          name: "Reverse Email Lookup",
          href: "/reverse-email-lookup",
          desc: "Technical reverse email analysis and registration checks.",
        },
        {
          name: "Email Breach Check",
          href: "/email-breach-check",
          desc: "Audit public data breach exposures for any email.",
        },
        {
          name: "Email OSINT",
          href: "/email-osint",
          desc: "Comprehensive open-source email intelligence.",
        },
      ]}
      relatedGuides={[
        {
          title: "How Reverse Email Lookup Works: Technical OSINT Explained",
          href: "/guides/how-reverse-email-lookup-works",
        },
        {
          title: "How to Check Email Breach Exposure & Protect Your Accounts",
          href: "/guides/how-to-check-email-breach-exposure",
        },
        {
          title: "Email OSINT: Discovery, Verification & Footprint Mapping",
          href: "/guides/email-osint",
        },
      ]}
    />
  );
}
