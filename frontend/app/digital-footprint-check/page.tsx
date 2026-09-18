import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ToolPageTemplate } from "@/components/tool-page-template";

export const metadata = constructMetadata({
  title: "Digital Footprint Check — Audit Public Accounts & Online Exposure | OSINTScan",
  description:
    "Audit your public digital footprint. Search usernames, email addresses, and phone numbers across 700+ websites to discover public profiles and exposure points.",
  canonical: "/digital-footprint-check",
});

export default function DigitalFootprintPage() {
  return (
    <ToolPageTemplate
      h1="Digital Footprint Check"
      badge="Personal Privacy Hygiene"
      description="Uncover public accounts, registered profiles, and exposure signals you may have created years ago across the internet. Take control of your public presence."
      canonical="/digital-footprint-check"
      inputType="username"
      howItWorks={[
        {
          step: "01",
          title: "Select an Identifier",
          desc: "Audit a username, email address, or phone number to map your public attack surface.",
        },
        {
          step: "02",
          title: "In-Memory Scanning",
          desc: "OSINTScan scans 700+ public sources, developer hubs, and communities in parallel with zero logging.",
        },
        {
          step: "03",
          title: "Audit & Clean Up",
          desc: "Review active public profiles, download your audit report, and reclaim or delete dormant accounts.",
        },
      ]}
      whatCanBeFound={[
        "Forgotten public accounts on social, developer, and forum platforms",
        "Publicly exposed profiles displaying legacy bios and avatar pictures",
        "Email registration signals and known historical breach records",
        "Carrier classifications and public phone footprint indicators",
      ]}
      whatCannotBeDetermined={[
        "Private or deleted accounts not accessible via the public web",
        "Passwords, authentication tokens, or private messages",
        "Identity proof without secondary manual verification",
        "Corporate accounts hosted entirely on private intranets",
      ]}
      platformExamples={[
        {
          name: "Developer Hubs",
          category: "Technical Footprint",
          description: "GitHub, GitLab, CodeSandbox profiles and public code contributions.",
        },
        {
          name: "Social Communities",
          category: "Public Discussion",
          description: "Reddit, Medium, and discussion forum accounts with public comments.",
        },
        {
          name: "Breach Archives",
          category: "Security Exposure",
          description: "Known public disclosures identifying legacy compromise points.",
        },
      ]}
      limitations={[
        "A matching username across platforms does not automatically prove they belong to the same person.",
        "Some websites challenge automated scans with CAPTCHAs, requiring manual review.",
        "A digital footprint check provides visibility; actual removal requires contacting the respective platforms.",
      ]}
      faqs={[
        {
          question: "Why is auditing your digital footprint important?",
          answer:
            "Forgotten accounts often retain outdated passwords, security questions, and personal data. If an old platform suffers a breach, those credentials can be weaponized against you. Routine audits allow you to identify and delete dormant accounts.",
        },
        {
          question: "Is this digital footprint audit private?",
          answer:
            "Yes. OSINTScan processes your search entirely in ephemeral memory. No search history, queries, or results are logged in any database.",
        },
        {
          question: "How can I delete accounts that I discover?",
          answer:
            "Visit each detected profile, log in, and use the platform's account settings to delete your profile. For guidance, consult our Search Removal Guide.",
        },
      ]}
      relatedTools={[
        {
          name: "Username Search",
          href: "/username-search",
          desc: "Scan handles across 700+ websites in real time.",
        },
        {
          name: "Email Lookup",
          href: "/email-lookup",
          desc: "Verify email presence and breach records.",
        },
        {
          name: "Phone Lookup",
          href: "/phone-lookup",
          desc: "Inspect phone carrier routing and line classification.",
        },
      ]}
      relatedGuides={[
        {
          title: "How to Check Your Digital Footprint Step-by-Step",
          href: "/guides/how-to-check-your-digital-footprint",
        },
        {
          title: "How to Reduce Your Digital Footprint: Practical Privacy Guide",
          href: "/guides/how-to-reduce-your-digital-footprint",
        },
        {
          title: "How to Find Social Media Accounts by Username",
          href: "/guides/how-to-find-social-media-accounts-by-username",
        },
      ]}
    />
  );
}
