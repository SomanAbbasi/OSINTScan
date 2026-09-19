import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ToolPageTemplate } from "@/components/tool-page-template";

export const metadata = constructMetadata({
  title: "Find Accounts by Username Across 600+ Sites",
  description:
    "Discover public social media accounts, developer profiles, and online footprints associated with any handle across hundreds of websites. Fast and privacy-safe with OSINTScan.",
  canonical: "/find-accounts-by-username",
});

export default function FindAccountsPage() {
  return (
    <ToolPageTemplate
      h1="Find Accounts by Username"
      badge="Multi-Platform Discovery"
      description="Locate where an online handle has active public accounts across social networks, developer communities, and creative publishing platforms."
      canonical="/find-accounts-by-username"
      inputType="username"
      howItWorks={[
        {
          step: "01",
          title: "Input Username",
          desc: "Enter the target handle or alias you want to find across the web.",
        },
        {
          step: "02",
          title: "Multi-Source Enumeration",
          desc: "Our scanner tests public endpoints across hundreds of cataloged networks simultaneously.",
        },
        {
          step: "03",
          title: "Discover Active Profiles",
          desc: "Inspect positive results, review direct profile links, and export audit reports.",
        },
      ]}
      whatCanBeFound={[
        "Active public profiles on social networks, developer hubs, and forums",
        "Public usernames, avatars, and linked portfolio websites",
        "Live HTTP status signals confirming profile existence",
        "Confidence indicators for each detected platform",
      ]}
      whatCannotBeDetermined={[
        "Private or deleted accounts",
        "Account owner's real-world identity or offline address",
        "Contact email addresses or phone numbers hidden by privacy settings",
        "Private direct messages or restricted posts",
      ]}
      platformExamples={[
        {
          name: "Pinterest",
          category: "Creative",
          description: "Public boards, profile photos, and pinned content.",
        },
        {
          name: "Spotify",
          category: "Music & Audio",
          description: "Public user profiles and public playlist curation.",
        },
        {
          name: "Telegram",
          category: "Messaging",
          description: "Public t.me channels and public user bios.",
        },
      ]}
      limitations={[
        "Popular handles may belong to multiple different people on different platforms.",
        "Some websites periodically update URL schemes or block automated probes.",
        "Always confirm account ownership manually by checking bio links and activity dates.",
      ]}
      faqs={[
        {
          question: "Can this tool find hidden or private accounts?",
          answer:
            "No. OSINTScan strictly checks public HTTP pages. Private, friends-only, or hidden accounts are never accessed.",
        },
        {
          question: "Is searching for accounts legal?",
          answer:
            "Yes. OSINTScan checks publicly available URLs just like a standard web browser. It is intended for self-footprint audits, brand defense, and authorized security assessments.",
        },
        {
          question: "How do I remove accounts I find?",
          answer:
            "Log into each identified platform and use the account settings to delete your profile, or consult our Search Removal Guide for step-by-step assistance.",
        },
      ]}
      relatedTools={[
        {
          name: "Username Search",
          href: "/username-search",
          desc: "Scan handles across 700+ websites in real time.",
        },
        {
          name: "Username Lookup",
          href: "/username-lookup",
          desc: "Verify username registration across key services.",
        },
        {
          name: "Digital Footprint Check",
          href: "/digital-footprint-check",
          desc: "Audit your overall public footprint.",
        },
      ]}
      relatedGuides={[
        {
          title: "How to Find Social Media Accounts by Username",
          href: "/guides/how-to-find-social-media-accounts-by-username",
        },
        {
          title: "How to Check Your Digital Footprint Step-by-Step",
          href: "/guides/how-to-check-your-digital-footprint",
        },
        {
          title: "How to Reduce Your Digital Footprint",
          href: "/guides/how-to-reduce-your-digital-footprint",
        },
      ]}
    />
  );
}
