import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ToolPageTemplate } from "@/components/tool-page-template";

export const metadata = constructMetadata({
  title: "Email OSINT Tool — Open Source Email Intelligence & Verification | OSINTScan",
  description:
    "Professional open-source email intelligence (OSINT) tool. Enumerate registered services, analyze public avatar metadata, and assess security exposure.",
  canonical: "/email-osint",
});

export default function EmailOSINTPage() {
  return (
    <ToolPageTemplate
      h1="Email OSINT"
      badge="Open Source Email Intelligence"
      description="Advanced email OSINT reconnaissance for cybersecurity professionals, fraud examiners, and privacy auditors. Examine public registration footprints and exposure vectors."
      canonical="/email-osint"
      inputType="email"
      howItWorks={[
        {
          step: "01",
          title: "Domain & DNS Analysis",
          desc: "Parses email domain, MX host records, and disposable mail provider indicators.",
        },
        {
          step: "02",
          title: "Public Endpoint Probing",
          desc: "Queries non-invasive public APIs and account recovery signals across major networks.",
        },
        {
          step: "03",
          title: "Intelligence Synthesis",
          desc: "Correlates discovered usernames, avatar hashes, and breach records in real time.",
        },
      ]}
      whatCanBeFound={[
        "Registered service footprints across developer, communication, and gaming platforms",
        "Public Gravatar avatar images, bio data, and linked usernames",
        "Mail exchange (MX) provider classification (Google Workspace, Microsoft 365, custom)",
        "Known historical breach and compromise records",
      ]}
      whatCannotBeDetermined={[
        "Private email correspondence or attachments",
        "Account passwords or password hashes",
        "Confidential subscriber records or telephone billing data",
        "Private accounts on closed corporate intranets",
      ]}
      platformExamples={[
        {
          name: "Gravatar API",
          category: "Avatar Hashes",
          description: "Inspects public MD5/SHA256 hashes for attached profile photos and usernames.",
        },
        {
          name: "MX & SPF Records",
          category: "DNS Infrastructure",
          description: "Evaluates mail delivery servers, spoofing protection, and enterprise hosting.",
        },
        {
          name: "Public Breach Indexes",
          category: "Security Exposure",
          description: "Cross-references public databases of previously leaked credential collections.",
        },
      ]}
      limitations={[
        "Services with blind password resets will not disclose account registration states.",
        "A breach record reflects historical compromise, not current account status.",
        "Ethical OSINT strictly limits collection to publicly available data points.",
      ]}
      faqs={[
        {
          question: "What is email OSINT primarily used for?",
          answer:
            "Email OSINT is used for defensive security audits, investigating spear-phishing campaigns, verifying user authenticity in fraud prevention, and evaluating personal digital footprints.",
        },
        {
          question: "Does OSINTScan alert the target email address?",
          answer:
            "No. All queries are passive HTTP requests directed at public platforms and open indices. No email is sent to the address.",
        },
        {
          question: "Are search queries saved or logged?",
          answer:
            "No. In adherence to privacy-first engineering, all scans are processed strictly in volatile memory and purged upon completion.",
        },
      ]}
      relatedTools={[
        {
          name: "Email Lookup",
          href: "/email-lookup",
          desc: "Fast email footprint and account existence check.",
        },
        {
          name: "Reverse Email Lookup",
          href: "/reverse-email-lookup",
          desc: "Technical reverse email analysis and registration checks.",
        },
        {
          name: "Email Breach Check",
          href: "/email-breach-check",
          desc: "Check historical breach exposures for an email address.",
        },
      ]}
      relatedGuides={[
        {
          title: "Email OSINT: Discovery, Verification & Footprint Mapping",
          href: "/guides/email-osint",
        },
        {
          title: "OSINT Investigation Methodology: Ethics & Verification",
          href: "/guides/osint-methodology",
        },
        {
          title: "How to Reduce Your Digital Footprint",
          href: "/guides/how-to-reduce-your-digital-footprint",
        },
      ]}
    />
  );
}
