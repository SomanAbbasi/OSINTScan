import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ToolPageTemplate } from "@/components/tool-page-template";

export const metadata = constructMetadata({
  title: "Phone Lookup — Public Carrier & Phone Number Search | OSINTScan",
  description:
    "Look up international phone numbers to analyze carrier routing, geographic allocation, VoIP classification, and public footprint signals. In-memory and private.",
  canonical: "/phone-lookup",
});

export default function PhoneLookupPage() {
  return (
    <ToolPageTemplate
      h1="Phone Lookup"
      badge="Telecommunication Footprint"
      description="Inspect international phone numbers to discover carrier routing, line type (mobile, landline, VoIP), geographic region, and public presence signals."
      canonical="/phone-lookup"
      inputType="phone"
      howItWorks={[
        {
          step: "01",
          title: "Standardize E.164",
          desc: "Parses country code, national prefix, and normalizes into standard international ITU-T E.164 format.",
        },
        {
          step: "02",
          title: "Carrier & Line Inspection",
          desc: "Evaluates public telecom routing tables to classify provider, line type, and geographic origin.",
        },
        {
          step: "03",
          title: "Public Footprint Signals",
          desc: "Inspects open web references, VoIP indicators, and public footprint markers without tracking.",
        },
      ]}
      whatCanBeFound={[
        "Standardized E.164 and international formatting",
        "Carrier / Mobile Network Operator (MNO) details",
        "Line type classification (Mobile, Fixed Line, or Virtual VoIP)",
        "Nominal country, state, or regional geographic allocation",
        "Public web footprint and registration indicators",
      ]}
      whatCannotBeDetermined={[
        "Real-time GPS tracking or live physical subscriber location",
        "Private text messages (SMS), call logs, or voicemail",
        "Confidential billing records, credit reports, or legal names",
        "Private subscriber data protected by telecommunications law",
      ]}
      platformExamples={[
        {
          name: "ITU-T Registry",
          category: "Telecommunications",
          description: "Resolves country dial codes and regional telecom allocation tables.",
        },
        {
          name: "Carrier Routing Tables",
          category: "Network Infrastructure",
          description: "Distinguishes physical SIM cards from cloud-based virtual VoIP numbers.",
        },
        {
          name: "Public Registration Dorks",
          category: "Open Source Search",
          description: "Identifies open public citations in forums and directories.",
        },
      ]}
      limitations={[
        "Number portability (LNP) may cause a number to be actively serviced by a carrier different from its original allocation.",
        "VoIP numbers can be registered remotely without indicating the caller's actual physical location.",
        "OSINTScan queries strictly public telecom indicators; it never accesses private subscriber databases.",
      ]}
      faqs={[
        {
          question: "Can this phone lookup track someone's live GPS location?",
          answer:
            "No. Live GPS tracking is strictly restricted to cellular network towers and law enforcement under warrant. OSINTScan only reveals the geographic area code and carrier routing.",
        },
        {
          question: "Does the phone owner know I searched their number?",
          answer:
            "No. Searches are passive, read-only queries against public routing databases and open indices. No SMS, phone call, or ping is ever sent to the device.",
        },
        {
          question: "How does OSINTScan detect VoIP numbers?",
          answer:
            "Our telecom engine inspects operating company numbers (OCN) and routing headers to distinguish virtual providers (e.g. Google Voice, Twilio) from major wireless carriers.",
        },
      ]}
      relatedTools={[
        {
          name: "Reverse Phone Lookup",
          href: "/reverse-phone-lookup",
          desc: "Deep reverse phone analysis and footprint intelligence.",
        },
        {
          name: "Phone OSINT",
          href: "/phone-osint",
          desc: "Advanced open-source intelligence for telephone numbers.",
        },
        {
          name: "Phone Number Information",
          href: "/phone-number-information",
          desc: "Detailed telecommunication routing and formatting specs.",
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
