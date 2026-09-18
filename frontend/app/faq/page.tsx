import React from "react";
import { constructMetadata } from "@/lib/seo";
import { getFAQSchema } from "@/lib/structured-data";
import { HelpCircle } from "lucide-react";

export const metadata = constructMetadata({
  title: "Frequently Asked Questions | OSINTScan",
  description:
    "Common questions regarding public digital footprint searches, confidence signals, and ethical OSINT audits with OSINTScan.",
  canonical: "/faq",
});

const ALL_FAQS = [
  {
    question: "What is OSINTScan?",
    answer:
      "OSINTScan is a privacy-conscious digital footprint auditing tool that checks whether a given public username, email address, or phone number exists across 700+ public websites and open-source intelligence sources.",
  },
  {
    question: "Does a matching username prove account ownership?",
    answer:
      "No. Anyone can register the same username across different websites. OSINTScan merely tests whether a public page or registration signal exists; it cannot confirm whether two accounts on different sites belong to the same person.",
  },
  {
    question: "Why does the tool show 'Unable to verify' or 'Manual review'?",
    answer:
      "Some websites return generic HTTP responses or render dynamic JavaScript that cannot be confirmed without visiting the page directly. When automated signals are inconclusive, we flag the result for manual inspection rather than guessing.",
  },
  {
    question: "Can OSINTScan see private accounts or bypass login walls?",
    answer:
      "No. OSINTScan only queries publicly accessible web endpoints and services. It never bypasses login screens, touches private accounts, or accesses non-public databases.",
  },
  {
    question: "How long does a scan take?",
    answer:
      "Thanks to our high-concurrency async scanner, a scan across hundreds of platforms typically completes in 5 to 20 seconds depending on platform response times. Results stream live to your browser in real time.",
  },
  {
    question: "Can I export my scan results?",
    answer:
      "Yes. You can export complete scan summaries in CSV format or JSON format directly from the scan workspace.",
  },
  {
    question: "Is OSINTScan free to use?",
    answer:
      "Yes. OSINTScan is built for lawful personal footprint auditing, security research, and personal privacy checks without paywalls or account requirements.",
  },
];

export default function FAQPage() {
  const faqSchema = getFAQSchema(ALL_FAQS);

  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Help & Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Everything you need to know about our detection engine, privacy guarantees, and result interpretations.
        </p>
      </div>

      <div className="space-y-4">
        {ALL_FAQS.map((faq, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
          >
            <h2 className="text-base font-bold text-slate-900 ">
              {faq.question}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
