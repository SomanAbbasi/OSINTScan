import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ToolPageTemplate } from "@/components/tool-page-template";

export const metadata = constructMetadata({
  title: "Reverse Phone Lookup — Carrier, VoIP & Footprint Search | OSINTScan",
  description:
    "Conduct an ethical reverse phone lookup to uncover carrier metadata, VoIP status, geographic prefix data, and public web footprint signals. 100% in-memory.",
  canonical: "/reverse-phone-lookup",
});

export default function ReversePhoneLookupPage() {
  return (
    <ToolPageTemplate
      h1="Reverse Phone Lookup"
      badge="Reverse Telecom Intelligence"
      description="Reverse lookup international telephone numbers to identify mobile network operators, VoIP classifications, geographic allocations, and public web citations."
      canonical="/reverse-phone-lookup"
      inputType="phone"
      howItWorks={[
        {
          step: "01",
          title: "Standardize Input",
          desc: "Formats international phone numbers to E.164 standard, verifying country and area codes.",
        },
        {
          step: "02",
          title: "Carrier & Line Type Check",
          desc: "Evaluates whether the number belongs to a major cellular network, landline, or virtual VoIP service.",
        },
        {
          step: "03",
          title: "Footprint Aggregation",
          desc: "Surfaces public web footprint signals and open directory presence with in-memory execution.",
        },
      ]}
      whatCanBeFound={[
        "Issuing carrier and current network routing indicators",
        "Line type classification (Mobile vs. Landline vs. Non-Fixed VoIP)",
        "Geographic region and international dial code details",
        "Public web footprint and open-source citations",
      ]}
      whatCannotBeDetermined={[
        "Private subscriber names or unlisted personal addresses",
        "Call history, SMS contents, or voicemail recordings",
        "Live location tracking or active cellular ping data",
        "Confidential billing accounts or identity records",
      ]}
      platformExamples={[
        {
          name: "National Telecom Registers",
          category: "Regulatory Bodies",
          description: "Maps area codes and telephone exchanges to geographic zones.",
        },
        {
          name: "MNO Routing Tables",
          category: "Network Providers",
          description: "Identifies whether numbers are assigned to AT&T, Verizon, Vodafone, etc.",
        },
        {
          name: "VoIP Classification",
          category: "Virtual Services",
          description: "Flags numbers operating over Bandwidth.com, Twilio, or Google Voice.",
        },
      ]}
      limitations={[
        "Numbers ported between carriers may reflect the receiving network or require manual verification.",
        "Scammers frequently spoof caller ID; reverse phone lookup verifies the true registered number, not spoofed caller IDs.",
        "OSINTScan respects user privacy by operating strictly in memory without recording search queries.",
      ]}
      faqs={[
        {
          question: "Can reverse phone lookup reveal if a caller is using VoIP?",
          answer:
            "Yes. Our telecom intelligence checks line allocation databases to classify whether a number is a physical mobile SIM or a virtual VoIP number often used for online calling services.",
        },
        {
          question: "Is this lookup private and untraceable by the phone owner?",
          answer:
            "Yes. The query is performed against public routing databases. No ping, SMS, or notification is ever triggered on the target phone.",
        },
        {
          question: "What is the difference between Phone Lookup and Reverse Phone Lookup?",
          answer:
            "Phone Lookup standardizes and formats telecommunications numbers, while Reverse Phone Lookup emphasizes identifying the underlying carrier, line classification, and public web footprint.",
        },
      ]}
      relatedTools={[
        {
          name: "Phone Lookup",
          href: "/phone-lookup",
          desc: "Carrier identification and number formatting.",
        },
        {
          name: "Phone OSINT",
          href: "/phone-osint",
          desc: "Advanced open-source intelligence for telephone numbers.",
        },
        {
          name: "Phone Number Information",
          href: "/phone-number-information",
          desc: "Comprehensive telecommunication specifications.",
        },
      ]}
      relatedGuides={[
        {
          title: "How Reverse Phone Lookup Works: Carrier & Footprint Signals",
          href: "/guides/how-reverse-phone-lookup-works",
        },
        {
          title: "Phone OSINT: Number Analysis & Telecom Routing",
          href: "/guides/phone-osint",
        },
        {
          title: "How to Reduce Your Digital Footprint",
          href: "/guides/how-to-reduce-your-digital-footprint",
        },
      ]}
    />
  );
}
