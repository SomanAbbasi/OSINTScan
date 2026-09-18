import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { getFAQSchema, getBreadcrumbSchema } from "@/lib/structured-data";
import { HelpCircle, ArrowRight, ShieldCheck, Lock, Search } from "lucide-react";

export const metadata = constructMetadata({
  title: "Frequently Asked Questions (FAQ) | OSINTScan",
  description:
    "Comprehensive answers regarding public footprint audits, username searches, reverse email and phone lookups, data privacy, and ethical OSINT methodologies.",
  canonical: "/faq",
});

interface FAQCategory {
  title: string;
  items: { question: string; answer: string }[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    title: "General & OSINT Fundamentals",
    items: [
      {
        question: "What is OSINT?",
        answer:
          "OSINT stands for Open Source Intelligence. It refers to the lawful collection, processing, and analysis of publicly available information published on the open web, public directories, and publicly queryable network protocols.",
      },
      {
        question: "What is OSINTScan?",
        answer:
          "OSINTScan is a privacy-first public digital footprint intelligence tool. It allows individuals, cybersecurity analysts, and privacy practitioners to search usernames, email addresses, and phone numbers to discover publicly accessible profiles and exposure signals.",
      },
      {
        question: "Does OSINTScan find passwords or private communications?",
        answer:
          "No, absolutely not. OSINTScan never searches for, cracks, or exposes passwords, private direct messages, financial details, or confidential records. We exclusively query public HTTP endpoints, DNS records, and open-source indices.",
      },
      {
        question: "Is OSINTScan free to use?",
        answer:
          "Yes. OSINTScan provides completely free in-memory footprint searches for lawful personal auditing, defensive research, and privacy education without subscriptions or paywalls.",
      },
    ],
  },
  {
    title: "Username Searches & Accuracy",
    items: [
      {
        question: "Can a matching username prove someone's identity?",
        answer:
          "No. A matching username across different services does not prove that both accounts belong to the same person. Common handles are often registered by completely different individuals worldwide. Results represent public footprint signals that require secondary human verification.",
      },
      {
        question: "How accurate are username search results?",
        answer:
          "OSINTScan utilizes multi-layered response validation (including HTTP status codes, specific error-string patterns, and page content fingerprinting) to minimize false positives. However, single-page web applications and anti-bot systems can occasionally produce ambiguous signals.",
      },
      {
        question: "Why does a result show 'Manual Review' or 'Blocked'?",
        answer:
          "Some modern web applications return HTTP 200 OK for every page and render 'User Not Found' via client-side JavaScript, while other platforms deploy Cloudflare or Akamai firewalls that challenge automated queries with CAPTCHAs (HTTP 403/503). OSINTScan marks these transparently as requiring manual verification rather than making false claims.",
      },
    ],
  },
  {
    title: "Email & Phone Number Lookups",
    items: [
      {
        question: "What information does Reverse Email Lookup provide?",
        answer:
          "Our email intelligence checks publicly accessible services to determine if an email is registered on major public platforms, retrieves public avatar information (such as Gravatar), and checks publicly disclosed breach databases to evaluate known exposure risks.",
      },
      {
        question: "What information does Phone Lookup provide?",
        answer:
          "Phone lookups standardize international numbers (ITU-T E.164), identify geographic allocation, inspect public carrier routing to distinguish mobile lines from virtual VoIP providers, and check public registration indicators.",
      },
      {
        question: "Can phone lookup reveal a subscriber's real-time location?",
        answer:
          "No. Real-time GPS location is strictly private telecommunication data accessible only to network operators and emergency services under warrant. OSINTScan only identifies geographic area codes and network prefixes allocated by national regulators.",
      },
    ],
  },
  {
    title: "Privacy, Data Retention & Legal Use",
    items: [
      {
        question: "Are my search queries or results stored in a database?",
        answer:
          "No. OSINTScan is built with a zero-retention privacy architecture. Searches are executed entirely in volatile server memory. Once the scan completes and your session terminates, all target inputs and results are purged automatically.",
      },
      {
        question: "Do I need to create an account or provide personal information to scan?",
        answer:
          "No account, email, or credit card is required to use OSINTScan. You can conduct confidential footprint audits with zero registration.",
      },
      {
        question: "What constitutes responsible and permissible use of OSINTScan?",
        answer:
          "OSINTScan is intended for personal privacy auditing, self-footprint assessments, authorized security penetration testing, and brand protection. It must not be used for harassment, stalking, unauthorized surveillance, or violating platform terms of service.",
      },
    ],
  },
];

export default function FAQPage() {
  const allQuestions = FAQ_CATEGORIES.flatMap((c) => c.items);
  const faqSchema = getFAQSchema(allQuestions);
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "FAQ", url: "/faq" },
  ]);

  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">FAQ</span>
      </nav>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
          Everything you need to know about OSINTScan&apos;s privacy model, detection accuracy, public footprint auditing, and responsible use guidelines.
        </p>
      </div>

      {/* Categorized FAQs */}
      <div className="space-y-10">
        {FAQ_CATEGORIES.map((category, idx) => (
          <section key={idx} className="space-y-4">
            <h2 className="text-lg font-bold text-slate-950 pb-2 border-b border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>{category.title}</span>
            </h2>

            <div className="space-y-3">
              {category.items.map((item, itemIdx) => (
                <details
                  key={itemIdx}
                  className="group p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs transition-all open:border-slate-300"
                >
                  <summary className="font-semibold text-sm text-slate-900 cursor-pointer list-none flex items-center justify-between gap-4">
                    <span>{item.question}</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform text-xs shrink-0">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Quick Links Banner */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-slate-900">Still have questions?</h3>
          <p className="text-xs text-slate-500">
            Explore our practical research guides or review our methodology.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/how-it-works"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/guides"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <span>Read Guides</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </main>
  );
}
