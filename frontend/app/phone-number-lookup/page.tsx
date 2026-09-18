import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ToolPageTemplate } from "@/components/tool-page-template";

export const metadata = constructMetadata({
  title: "Phone Number Lookup — Verify Carrier, Line Type & Origin | OSINTScan",
  description:
    "Verify international phone numbers instantly. Discover carrier routing, mobile vs. landline vs. VoIP classification, and public footprint signals.",
  canonical: "/phone-number-lookup",
});

export default function PhoneNumberLookupPage() {
  return (
    <ToolPageTemplate
      h1="Phone Number Lookup"
      badge="Number Verification"
      description="Quickly verify any international phone number to inspect network carrier allocation, line type, format validity, and public digital presence."
      canonical="/phone-number-lookup"
      inputType="phone"
      howItWorks={[
        {
          step: "01",
          title: "Enter Phone Number",
          desc: "Select your country dial code and enter local digits to begin verification.",
        },
        {
          step: "02",
          title: "Validate & Route",
          desc: "Our engine standardizes formatting into E.164 and checks carrier allocation records.",
        },
        {
          step: "03",
          title: "Inspect Results",
          desc: "Review line type, carrier name, geographic region, and public footprint indicators.",
        },
      ]}
      whatCanBeFound={[
        "Standardized E.164 and national formatting specifications",
        "Mobile Network Operator (MNO) and carrier identification",
        "Line type classification (Mobile, Landline, or Virtual VoIP)",
        "Geographic area codes and international routing data",
      ]}
      whatCannotBeDetermined={[
        "Private subscriber identities or unlisted home addresses",
        "Live location tracking or active cellular GPS coordinates",
        "Call history, text messages, or voicemail recordings",
        "Internal carrier account records protected by privacy laws",
      ]}
      platformExamples={[
        {
          name: "Global Telecom Plans",
          category: "Numbering Plans",
          description: "Resolves country prefixes and national destination codes across 200+ nations.",
        },
        {
          name: "Carrier Routing Infrastructure",
          category: "Telecom Databases",
          description: "Maps telecom prefixes to active network operators.",
        },
        {
          name: "VoIP Detection Indices",
          category: "Virtual Networks",
          description: "Identifies numbers provisioned by cloud VoIP providers.",
        },
      ]}
      limitations={[
        "Number portability between carriers may alter the current servicing network.",
        "VoIP numbers can be acquired globally without reflecting geographic residency.",
        "Always corroborate phone intelligence with independent public evidence.",
      ]}
      faqs={[
        {
          question: "Can I lookup phone numbers from any country?",
          answer:
            "Yes. OSINTScan supports international ITU-T E.164 standard formatting across more than 200 countries and territories.",
        },
        {
          question: "Is this phone number lookup anonymous?",
          answer:
            "Yes. All lookups are executed in ephemeral RAM with zero search logging. Target phone numbers are never stored.",
        },
        {
          question: "How can I tell if a phone number is a scam or virtual number?",
          answer:
            "Our line classification highlights 'VoIP' numbers, which are commonly utilized by call centers, virtual PBX systems, and online services.",
        },
      ]}
      relatedTools={[
        {
          name: "Phone Lookup",
          href: "/phone-lookup",
          desc: "Full carrier identification and telecom footprinting.",
        },
        {
          name: "Reverse Phone Lookup",
          href: "/reverse-phone-lookup",
          desc: "In-depth reverse phone analysis and footprint signals.",
        },
        {
          name: "Phone OSINT",
          href: "/phone-osint",
          desc: "Advanced open-source intelligence for phone numbers.",
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
