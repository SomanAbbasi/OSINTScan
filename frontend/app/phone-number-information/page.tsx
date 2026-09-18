import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ToolPageTemplate } from "@/components/tool-page-template";

export const metadata = constructMetadata({
  title: "Phone Number Information — Specifications, Formats & Carrier Data | OSINTScan",
  description:
    "Look up detailed phone number information including international E.164 formatting, country codes, network carrier, and line classification. In-memory and private.",
  canonical: "/phone-number-information",
});

export default function PhoneNumberInformationPage() {
  return (
    <ToolPageTemplate
      h1="Phone Number Information"
      badge="Technical Specifications"
      description="Inspect technical specifications, international dialing codes, carrier infrastructure, and public footprint details for any phone number."
      canonical="/phone-number-information"
      inputType="phone"
      howItWorks={[
        {
          step: "01",
          title: "Select Country & Enter Digits",
          desc: "Choose the country dial code and enter the subscriber phone number.",
        },
        {
          step: "02",
          title: "Analyze Telecom Specs",
          desc: "Resolves country code, national prefix, carrier allocation, and line classification.",
        },
        {
          step: "03",
          title: "View Technical Report",
          desc: "Review standardized formatting standards, carrier data, and public footprint signals.",
        },
      ]}
      whatCanBeFound={[
        "Standardized E.164, RFC 3966, and national formatting formats",
        "Assigned Mobile Network Operator (MNO) and carrier routing details",
        "Line type verification (Mobile SIM, Landline, Non-Fixed VoIP)",
        "Geographic region and international dial code details",
      ]}
      whatCannotBeDetermined={[
        "Private subscriber names or billing records",
        "Real-time GPS coordinates or active cellular tower pings",
        "Private call recordings, text messages, or voicemail",
        "Confidential billing accounts or identity records",
      ]}
      platformExamples={[
        {
          name: "ITU-T E.164 Standard",
          category: "Global Standards",
          description: "Resolves country prefixes, regional codes, and national destination codes.",
        },
        {
          name: "MNO Routing Tables",
          category: "Carrier Infrastructure",
          description: "Identifies whether numbers are assigned to AT&T, Verizon, Vodafone, etc.",
        },
        {
          name: "VoIP Provider Signatures",
          category: "Virtual Networks",
          description: "Detects numbers provisioned by cloud VoIP platforms like Twilio and Google Voice.",
        },
      ]}
      limitations={[
        "Local Number Portability (LNP) allows numbers to move between carriers.",
        "VoIP numbers can be acquired globally regardless of geographical location.",
        "All queries run strictly in ephemeral memory to ensure user confidentiality.",
      ]}
      faqs={[
        {
          question: "What technical formats are evaluated?",
          answer:
            "OSINTScan normalizes numbers into ITU-T E.164 (e.g., +12025550123), RFC 3966 tel URI format, and standard national display formats.",
        },
        {
          question: "Can I verify numbers from multiple countries?",
          answer:
            "Yes. We support dial codes and number plans across more than 200 countries worldwide.",
        },
        {
          question: "Is this phone information lookup saved?",
          answer:
            "No. Scans operate entirely in volatile memory and are purged once complete.",
        },
      ]}
      relatedTools={[
        {
          name: "Phone Lookup",
          href: "/phone-lookup",
          desc: "Carrier identification and standard telecom footprinting.",
        },
        {
          name: "Reverse Phone Lookup",
          href: "/reverse-phone-lookup",
          desc: "Reverse phone analysis and footprint signals.",
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
