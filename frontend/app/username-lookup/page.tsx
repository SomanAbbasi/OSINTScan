import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ToolPageTemplate } from "@/components/tool-page-template";

export const metadata = constructMetadata({
  title: "Username Lookup — Public Account & Handle Verification | OSINTScan",
  description:
    "Perform a fast public username lookup to verify account presence and discover online footprints across hundreds of platforms. In-memory and privacy-safe.",
  canonical: "/username-lookup",
});

export default function UsernameLookupPage() {
  return (
    <ToolPageTemplate
      h1="Username Lookup"
      badge="Account Presence Verification"
      description="Look up any username to verify if it is registered or publicly active across web platforms, discussion forums, and technical repositories."
      canonical="/username-lookup"
      inputType="username"
      howItWorks={[
        {
          step: "01",
          title: "Input Target Handle",
          desc: "Enter the handle you wish to verify without symbols or URL prefixes.",
        },
        {
          step: "02",
          title: "Query Public Endpoints",
          desc: "Our engine executes high-speed parallel checks against verified profile endpoints.",
        },
        {
          step: "03",
          title: "Inspect Matches",
          desc: "Receive actionable results indicating confirmed profiles, manual review targets, and missing accounts.",
        },
      ]}
      whatCanBeFound={[
        "Confirmed registrations on popular web platforms",
        "Public handles across developer and gaming networks",
        "Direct URLs to active user portfolios and accounts",
        "Real-time response status (Found, Not Found, Blocked)",
      ]}
      whatCannotBeDetermined={[
        "Account owner's real-world identity or legal name",
        "Contact email or phone number registered behind private settings",
        "Private profile posts or direct messages",
        "Accounts on private corporate intranets",
      ]}
      platformExamples={[
        {
          name: "GitLab",
          category: "Developer",
          description: "Public code repositories, developer profiles, and activity logs.",
        },
        {
          name: "Medium",
          category: "Publishing",
          description: "Author profiles, published articles, and public reading lists.",
        },
        {
          name: "Steam",
          category: "Gaming",
          description: "Public community profiles and gaming activity footprints.",
        },
      ]}
      limitations={[
        "A username lookup tests public URL status; it cannot guarantee that two identically named profiles belong to the same person.",
        "Some endpoints return soft 404s that necessitate manual review.",
        "Suspended or banned accounts may return 'Not Found' on public pages.",
      ]}
      faqs={[
        {
          question: "What is the difference between Username Search and Username Lookup?",
          answer:
            "Username lookup focuses on verifying specific platform account presence and availability, while full username search scans broadly across all cataloged public repositories.",
        },
        {
          question: "Can I lookup multiple handles?",
          answer:
            "Yes, you can run sequential lookups without limits. Each search runs independently in memory.",
        },
        {
          question: "Do target accounts get notified when I look them up?",
          answer:
            "No. OSINTScan performs standard public HTTP GET/HEAD requests just like a regular web browser. No notifications are sent.",
        },
      ]}
      relatedTools={[
        {
          name: "Username Search",
          href: "/username-search",
          desc: "Search handles across 700+ websites simultaneously.",
        },
        {
          name: "Find Accounts by Username",
          href: "/find-accounts-by-username",
          desc: "Identify linked social profiles across online communities.",
        },
        {
          name: "Digital Footprint Check",
          href: "/digital-footprint-check",
          desc: "Audit your overall public footprint and exposure surface.",
        },
      ]}
      relatedGuides={[
        {
          title: "Username Search vs. Username Availability",
          href: "/guides/username-search-vs-username-availability",
        },
        {
          title: "How to Verify a Public Profile Manually After an OSINT Match",
          href: "/guides/how-to-verify-a-public-profile",
        },
        {
          title: "How to Reduce Your Digital Footprint",
          href: "/guides/how-to-reduce-your-digital-footprint",
        },
      ]}
    />
  );
}
