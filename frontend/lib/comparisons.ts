export interface ComparisonStudy {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  subtitle: string;
  author: string;
  datePublished: string;
  dateUpdated: string;
  methodologySummary: string;
  sampleSize: string;
  toolsCompared: string[];
  comparisonRows: {
    dimension: string;
    osintscan: string;
    toolA: string;
    toolB: string;
  }[];
  sections: {
    heading: string;
    body: string[];
  }[];
  limitations: string[];
}

export const COMPARISONS: ComparisonStudy[] = [
  {
    slug: "sherlock-vs-maigret",
    title: "Sherlock vs. Maigret: Username Enumeration Architecture & Accuracy Comparison",
    metaTitle: "Sherlock vs Maigret — Username OSINT Benchmark & Comparison | OSINTScan",
    metaDescription:
      "Technical comparison of Sherlock CLI, Maigret CLI, and OSINTScan across detection methodology, false-positive rates, WAF handling, and browser usability.",
    subtitle:
      "First-party technical evaluation comparing Python CLI username scanners (Sherlock and Maigret) with browser-based multi-engine verification.",
    author: "OSINTScan Research",
    datePublished: "2026-09-20",
    dateUpdated: "2026-09-27",
    methodologySummary:
      "Evaluated using 10 test handles (5 existing multi-platform accounts, 3 mixed-case handles, and 2 non-existent random control strings) across public social, developer, and community endpoints.",
    sampleSize: "10 test handles evaluated across public HTTP endpoints",
    toolsCompared: ["OSINTScan (Web)", "Sherlock CLI", "Maigret CLI"],
    comparisonRows: [
      {
        dimension: "Execution Environment",
        osintscan: "Web browser (Server-Sent Events streaming)",
        toolA: "Python 3 CLI (local terminal)",
        toolB: "Python 3 CLI (local terminal)",
      },
      {
        dimension: "Primary Detection Mechanism",
        osintscan: "HTTP status + positive/negative body signatures + soft-404 title filter",
        toolA: "status_code, message, or response_url per rule",
        toolB: "Presence/absence strings + recursive profile link extraction",
      },
      {
        dimension: "Case-Sensitivity Handling",
        osintscan: "Automatic lowercase normalization with exact-case fallback",
        toolA: "Passes raw CLI argument unless manually re-run",
        toolB: "Passes raw CLI argument unless manually re-run",
      },
      {
        dimension: "Single-Page Application (SPA) Soft-404 Protection",
        osintscan: "Explicit mString & page title soft-404 suppression",
        toolA: "Susceptible on status_code-only rules",
        toolB: "Moderated by presence string checks",
      },
      {
        dimension: "Additional Identifier Support",
        osintscan: "Username, Email Lookup, Email Breach, Phone Lookup",
        toolA: "Username only",
        toolB: "Username and recursive profile tags",
      },
      {
        dimension: "Report Export Formats",
        osintscan: "CSV and JSON in-browser export",
        toolA: "TXT, CSV, JSON via CLI flags",
        toolB: "HTML, PDF, XMind, TXT, JSON via CLI flags",
      },
    ],
    sections: [
      {
        heading: "How Sherlock and Maigret Differ Architecturally",
        body: [
          "Sherlock is designed as a lightweight, single-pass Python CLI utility that checks approximately 400+ public websites using three primary error-detection modes: HTTP status code (e.g. 200 vs 404), error message substring matching, and redirect URL inspection. Because many rules rely solely on HTTP 200 status codes, modern React and Next.js single-page applications (SPAs) that return HTTP 200 for missing profiles can produce false positives when run from datacenter or residential connections behind Cloudflare.",
          "Maigret began as a fork of Sherlock and expanded the database to over 2,500 sites while introducing two major capabilities: dual presence/absence string verification (presenseStrs and absenceStrs) and profile metadata scraping (extracting links to other accounts directly from a found profile page). However, Maigret's larger site catalog increases scan duration and triggers rate limiting (HTTP 429) or WAF challenges on unproxied connections.",
        ],
      },
      {
        heading: "Where Browser-Based Multi-Engine Correlation Fits",
        body: [
          "Running Sherlock or Maigret requires installing Python, managing virtual environments, and keeping JSON rule definitions updated locally. OSINTScan executes curated rule sets from WhatsMyName, Sherlock, Maigret, and Blackbird concurrently in memory, deduplicating platform matches by canonical domain and applying strict soft-404 filtering before presenting results in a mobile-friendly web interface.",
          "In our 10-handle test suite, mixed-case inputs (such as PascalCase usernames) caused standard CLI runs to miss oEmbed endpoints like TikTok that enforce lowercase handle URLs. Normalizing queries to lowercase first—and falling back to exact casing only when needed—eliminated casing discrepancies across all tested endpoints.",
        ],
      },
    ],
    limitations: [
      "CLI tools allow users to supply custom Tor/SOCKS5 proxies or authenticated session cookies locally, which a public zero-log web application does not accept for privacy and security reasons.",
      "Sites protected by interactive CAPTCHAs or strict login walls cannot be verified automatically by any unauthenticated scanner and require manual browser verification.",
    ],
  },
  {
    slug: "whatsmyname-vs-sherlock",
    title: "WhatsMyName vs. Sherlock: Signature Accuracy & False-Positive Analysis",
    metaTitle: "WhatsMyName vs Sherlock — OSINT Accuracy & Signature Comparison | OSINTScan",
    metaDescription:
      "Detailed comparison of the WhatsMyName (WMN) detection schema and Sherlock CLI ruleset, examining positive/negative fingerprints and false-positive prevention.",
    subtitle:
      "Analyzing why dual-fingerprint rules (eCode + eString + mCode + mString) reduce false positives compared to status-code-only checks.",
    author: "OSINTScan Research",
    datePublished: "2026-09-20",
    dateUpdated: "2026-09-27",
    methodologySummary:
      "Audited rule definitions across WhatsMyName (wmn-data.json) and Sherlock (data.json) against live HTTP responses from social networks, developer registries, and CDN-protected endpoints.",
    sampleSize: "720 curated WhatsMyName rules vs 400+ Sherlock site rules",
    toolsCompared: ["OSINTScan (Hybrid Engine)", "WhatsMyName Schema", "Sherlock Schema"],
    comparisonRows: [
      {
        dimension: "Rule Schema Structure",
        osintscan: "Unified eCode/eString + mCode/mString + WAF & soft-404 classifier",
        toolA: "Four-part schema (e_code, e_string, m_code, m_string)",
        toolB: "Single-polarity errorType (status_code, message, or response_url)",
      },
      {
        dimension: "False-Positive Resistance",
        osintscan: "High — requires positive body signature and absence of soft-404 markers",
        toolA: "High — explicitly validates both existence and missing strings",
        toolB: "Moderate — status_code rules can misclassify 200 OK error shells",
      },
      {
        dimension: "Platform Categorization",
        osintscan: "Social, Coding, Gaming, Video, Music, Forum, Finance, Business",
        toolA: "Categorized by industry/topic in wmn-data",
        toolB: "Flat alphabetical dictionary in standard data.json",
      },
      {
        dimension: "Interactive Web Filtering & Export",
        osintscan: "Live confidence filtering, category tabs, CSV/JSON export",
        toolA: "Community web mirrors vary in maintenance",
        toolB: "CLI output only",
      },
    ],
    sections: [
      {
        heading: "Why Dual-Polarity Fingerprints Matter in OSINT",
        body: [
          "The most common failure mode in automated username enumeration is the 'Soft 404': a web server returns HTTP 200 OK even when an account does not exist, rendering a generic 'User not found' template or an empty JavaScript application shell. Tools that rely solely on checking whether HTTP status equals 200 will falsely report that the target username exists on dozens of platforms.",
          "WhatsMyName pioneered the four-part rule specification: every platform defines both what a valid profile looks like (expected HTTP code e_code and expected body substring e_string) and what a missing account looks like (missing HTTP code m_code and missing body substring m_string). If a server returns HTTP 200 during a Cloudflare challenge or soft-404 page, the classifier sees that e_string is absent—or that m_string is present—and refuses to mark the account as FOUND.",
        ],
      },
      {
        heading: "How OSINTScan Combines Both Ecosystems",
        body: [
          "OSINTScan uses the four-part WhatsMyName fingerprint specification as its primary verification standard across 720 cataloged rules, while cross-validating results against Sherlock, Maigret, and Blackbird signatures. When multiple engines confirm the same canonical domain, OSINTScan merges the evidence into a single deduplicated card and elevates the match confidence.",
        ],
      },
    ],
    limitations: [
      "Platform HTML structures and API responses change frequently; any signature-based scanner requires continuous rule maintenance as websites update their frontend templates.",
      "A positive HTTP fingerprint proves that a handle is registered on a platform, not that the account belongs to the same real-world person across platforms.",
    ],
  },
  {
    slug: "username-osint-tools",
    title: "Public Username OSINT Tools Compared: Web Scanners vs. CLI Utilities",
    metaTitle: "Username OSINT Tools Compared — Web vs CLI Footprint Scanners | OSINTScan",
    metaDescription:
      "Objective comparison of public username OSINT tools including OSINTScan, WhatsMyName, Sherlock, Maigret, Blackbird, and brand availability checkers.",
    subtitle:
      "Evaluating when to use a zero-log browser OSINT scanner versus local command-line tools or brand handle checkers.",
    author: "OSINTScan Research",
    datePublished: "2026-09-22",
    dateUpdated: "2026-09-27",
    methodologySummary:
      "Compared public digital footprint tools across identifier support (username, email, phone), privacy architecture, false-positive controls, and mobile accessibility.",
    sampleSize: "5 major OSINT & username lookup tool categories",
    toolsCompared: ["OSINTScan", "CLI Scanners (Sherlock/Maigret/Blackbird)", "Brand Availability Checkers (Namechk)"],
    comparisonRows: [
      {
        dimension: "Primary Use Case",
        osintscan: "Public digital footprint auditing across username, email, and phone",
        toolA: "Deep technical username/email enumeration via local terminal",
        toolB: "Checking domain and social handle availability for new brands",
      },
      {
        dimension: "Setup & Accessibility",
        osintscan: "Instant on desktop and mobile browsers; no login or installation",
        toolA: "Requires Python 3, pip dependencies, and terminal familiarity",
        toolB: "Web browser interface",
      },
      {
        dimension: "Multi-Identifier Workflow",
        osintscan: "Unified workspace for Username Search, Email Lookup, and Phone Lookup",
        toolA: "Separate CLI tools required for username (Sherlock) vs email (Holehe) vs phone",
        toolB: "Username and domain TLD availability only",
      },
      {
        dimension: "Privacy Model",
        osintscan: "In-memory ephemeral processing; zero database storage of queries",
        toolA: "Runs locally on the investigator's machine",
        toolB: "Ad-supported or commercial registrar affiliate tracking",
      },
    ],
    sections: [
      {
        heading: "Choosing the Right Tool for Your Investigation",
        body: [
          "Not all username search tools solve the same problem. Brand availability checkers (such as Namechk or InstantUsername) are built for marketers registering a new company name; they prioritize checking whether a handle is free to register rather than verifying forensic profile metadata.",
          "Command-line OSINT utilities (Sherlock, Maigret, Blackbird, and Holehe) are built for security researchers who want to run automated scripts locally or route traffic through custom proxies. However, switching between four separate terminal tools for username, email, and phone checks slows down routine digital footprint audits.",
          "OSINTScan bridges this gap by bringing multi-engine username verification, reverse email service detection, breach exposure checks, and international phone number formatting into a single privacy-first web interface.",
        ],
      },
    ],
    limitations: [
      "Public OSINT tools only evaluate publicly reachable web endpoints and cannot access private profiles, deleted accounts, or non-public telecom subscriber records.",
    ],
  },
];

export function getComparisonBySlug(slug: string): ComparisonStudy | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}
