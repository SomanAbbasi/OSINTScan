import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ToolPageTemplate } from "@/components/tool-page-template";

export const metadata = constructMetadata({
  title: "Email Breach Check — Have You Been Compromised? | OSINTScan",
  description:
    "Check if your email address has appeared in publicly disclosed data breaches or security leaks. Confidential in-memory scan with zero logging.",
  canonical: "/email-breach-check",
});

export default function EmailBreachCheckPage() {
  return (
    <ToolPageTemplate
      h1="Email Breach Check"
      badge="Compromise Exposure Intelligence"
      description="Check whether your email address has appeared in known public data breaches, credential leaks, or historical corporate disclosures."
      canonical="/email-breach-check"
      inputType="email"
      howItWorks={[
        {
          step: "01",
          title: "Input Email Address",
          desc: "Enter your email address to initiate a confidential security check.",
        },
        {
          step: "02",
          title: "Query Breach Intelligence",
          desc: "Our engine cross-references known public disclosure archives and leak indices in parallel.",
        },
        {
          step: "03",
          title: "Remediation Guidance",
          desc: "Review which services experienced breaches, which data classes were exposed, and take corrective action.",
        },
      ]}
      whatCanBeFound={[
        "Names and dates of platforms that experienced disclosed security compromises",
        "Classes of data compromised in each event (emails, hashed passwords, names)",
        "Known historical pastebin references and public credential dumps",
        "Actionable guidance to remediate credential exposure",
      ]}
      whatCannotBeDetermined={[
        "Unreported or zero-day breaches not publicly known",
        "Your current active passwords on any account",
        "Direct contents of private emails or account communications",
        "Unauthorized access occurring without a recorded database leak",
      ]}
      platformExamples={[
        {
          name: "Historical Data Leaks",
          category: "Security Archive",
          description: "Major historical compromises of consumer websites and services.",
        },
        {
          name: "Corporate Disclosures",
          category: "Public Disclosures",
          description: "Public breach notifications cataloged by cybersecurity researchers.",
        },
        {
          name: "Credential Dump Indices",
          category: "Dark Web Aggregation",
          description: "Indexes of credential stuffing lists circulating in public forums.",
        },
      ]}
      limitations={[
        "A breach record indicates that your email appeared in a past dump; it does not mean your account is currently compromised if you have updated credentials.",
        "Breach checks rely on publicly documented security events; newly compromised data may take time to surface.",
        "Never use unverified breach sites that require you to enter your password.",
      ]}
      faqs={[
        {
          question: "Does OSINTScan store my email when I check for breaches?",
          answer:
            "No. All queries are handled ephemerally in RAM. Your email address is never stored in a database, saved to log files, or shared with third parties.",
        },
        {
          question: "What should I do if my email was found in a breach?",
          answer:
            "1) Immediately change your password on the breached platform. 2) Change the password on any other service where you reused that same password. 3) Enable multi-factor authentication (2FA) across all vital accounts.",
        },
        {
          question: "Can checking for breaches alert hackers to my email?",
          answer:
            "No. OSINTScan performs read-only lookups against local intelligence indexes and open APIs. No public alert or notification is emitted.",
        },
      ]}
      relatedTools={[
        {
          name: "Email Lookup",
          href: "/email-lookup",
          desc: "Discover public service accounts registered to your email.",
        },
        {
          name: "Email Footprint",
          href: "/email-footprint",
          desc: "Analyze your complete email footprint and surface area.",
        },
        {
          name: "Digital Footprint Check",
          href: "/digital-footprint-check",
          desc: "Audit your overall public digital footprint.",
        },
      ]}
      relatedGuides={[
        {
          title: "How to Check Email Breach Exposure & Protect Your Accounts",
          href: "/guides/how-to-check-email-breach-exposure",
        },
        {
          title: "How to Reduce Your Digital Footprint",
          href: "/guides/how-to-reduce-your-digital-footprint",
        },
        {
          title: "How to Audit Your Digital Footprint Step-by-Step",
          href: "/guides/how-to-check-your-digital-footprint",
        },
      ]}
    />
  );
}
