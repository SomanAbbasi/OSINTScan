export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  publishedAt: string;
  category: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string[];
    }[];
    conclusion: string;
  };
}

export const GUIDES: GuideArticle[] = [
  {
    slug: "how-to-check-your-digital-footprint",
    title: "How to Check Your Public Digital Footprint Step-by-Step",
    description: "A practical guide to uncovering abandoned profiles, old forum accounts, and public handles to minimize your exposure.",
    readTime: "6 min read",
    publishedAt: "2026-09-01",
    category: "Privacy Hygiene",
    content: {
      intro: "Your digital footprint is the trail of public accounts, registered emails, phone metadata, and personal identifiers left behind through years of internet usage. Auditing it periodically is essential for cybersecurity hygiene and privacy defense.",
      sections: [
        {
          heading: "1. Inventory Your Known Historical Aliases",
          body: [
            "Start by listing all historical handles, gaming tags, and email prefixes you have used across the past 5 to 15 years.",
            "Most users unknowingly reuse the same core handle across diverse forums, developer communities, and early social networks.",
          ],
        },
        {
          heading: "2. Run an Automated In-Memory Public Footprint Scan",
          body: [
            "Use OSINTScan to evaluate your handles across 700+ public sources, developer communities, and creative networks in parallel.",
            "Record every active URL flagged as a positive public match. Because OSINTScan operates strictly in memory without storing audit records, your scan queries leave no trace in our systems.",
          ],
        },
        {
          heading: "3. Corroborate Public Profile Links",
          body: [
            "Visit each detected profile to verify whether it is genuinely yours or an unrelated account registered by someone else using the same username.",
            "Check registration dates, public bios, avatar images, and linked websites for confirmation.",
          ],
        },
        {
          heading: "4. Reclaim or Request Deletion for Dormant Profiles",
          body: [
            "Log into forgotten accounts to delete outdated bios, location tags, and linked personal phone numbers.",
            "Where platforms provide account deletion or GDPR/CCPA erasure mechanisms, submit formal requests to permanently close abandoned profiles.",
          ],
        },
      ],
      conclusion: "Routine digital footprint audits significantly reduce your attack surface against credential stuffing, impersonation, and social engineering.",
    },
  },
  {
    slug: "how-to-find-social-media-accounts-by-username",
    title: "How to Find Social Media Accounts by Username Accurately",
    description: "Discover public social media profiles and online accounts linked to a handle without falling victim to false positives.",
    readTime: "7 min read",
    publishedAt: "2026-08-28",
    category: "OSINT Fundamentals",
    content: {
      intro: "Finding public social media accounts using an online handle is one of the most fundamental OSINT investigative workflows. However, accurate attribution requires careful methodology.",
      sections: [
        {
          heading: "1. Handle Permutations and Common Variants",
          body: [
            "When popular handles are taken, users frequently add underscores, numbers, or location suffixes (e.g., 'johndoe_dev' or 'johndoe99').",
            "Always search both the exact handle and logical variants when investigating digital footprints.",
          ],
        },
        {
          heading: "2. Distinguishing Active Accounts from Squatted Names",
          body: [
            "Many usernames exist on platforms purely as squatters, suspended placeholders, or automated bots with zero human activity.",
            "Check for recent posts, follower interactions, or linked external portfolios to confirm an account is genuinely active.",
          ],
        },
        {
          heading: "3. Cross-Referencing Reciprocal Social Links",
          body: [
            "If a GitHub profile links to a Twitter/X handle, and that Twitter/X handle links back to the same personal domain, confidence of shared identity is exceptionally high.",
            "Never conclude two accounts belong to the same person without corroborating evidence beyond the username itself.",
          ],
        },
      ],
      conclusion: "Username searches provide valuable investigative leads, but true identity verification always requires contextual validation across multiple sources.",
    },
  },
  {
    slug: "how-reverse-email-lookup-works",
    title: "How Reverse Email Lookup Works: Technical OSINT Explained",
    description: "Understand the mechanics of reverse email OSINT, account existence verification, and how services check registration states.",
    readTime: "8 min read",
    publishedAt: "2026-08-22",
    category: "Technical OSINT",
    content: {
      intro: "Reverse email lookups allow security analysts and privacy-conscious users to discover which online platforms have registered accounts tied to a specific email address.",
      sections: [
        {
          heading: "1. Account Recovery & Password Reset Signals",
          body: [
            "Many online platforms inadvertently expose whether an email address is registered through their login or password recovery workflows.",
            "If a service returns 'A reset link has been sent' versus 'No account found with this email', it confirms the email's presence in that platform's user directory.",
          ],
        },
        {
          heading: "2. Public Gravatar and Avatar Hashes",
          body: [
            "Services like Gravatar generate public MD5 or SHA-256 hashes of email addresses to serve profile avatars.",
            "Querying these public avatar endpoints reveals associated usernames, display names, and public bios without touching any private data.",
          ],
        },
        {
          heading: "3. Limitations and Anti-Enumeration Protections",
          body: [
            "Modern platforms increasingly adopt generic responses (e.g., 'If an account exists, an email was sent') to prevent automated enumeration.",
            "Reverse email lookup tools only capture signals from platforms that still exhibit distinguishable responses.",
          ],
        },
      ],
      conclusion: "Reverse email queries provide visibility into where an email address has been registered across the web without accessing private communications.",
    },
  },
  {
    slug: "how-reverse-phone-lookup-works",
    title: "How Reverse Phone Lookup Works: Carrier & Footprint Signals",
    description: "Learn how phone number intelligence works, including ITU-T E.164 parsing, carrier identification, VoIP detection, and public registers.",
    readTime: "7 min read",
    publishedAt: "2026-08-18",
    category: "Technical OSINT",
    content: {
      intro: "Reverse phone lookups examine international phone numbers using public telecommunications registries, carrier routing tables, and open web signals.",
      sections: [
        {
          heading: "1. Number Standardization (E.164 Format)",
          body: [
            "Every phone lookup begins by normalizing the number into the international E.164 format, which includes the country dial code, national destination code, and subscriber number.",
            "This standardization allows accurate routing queries regardless of local formatting conventions.",
          ],
        },
        {
          heading: "2. Carrier Routing & VoIP vs. Mobile Detection",
          body: [
            "Public telecom registers reveal whether a number belongs to a traditional mobile network operator, a landline provider, or a Virtual Local Exchange Carrier (VoIP).",
            "VoIP numbers (such as Google Voice, Twilio, or Skype) are often temporary or non-fixed, providing important context during security audits.",
          ],
        },
        {
          heading: "3. Public Social Registration Signals",
          body: [
            "Certain messaging platforms and services indicate whether a phone number is registered for SMS two-factor authentication or account recovery.",
            "OSINTScan checks these public indicators to assist in personal footprint auditing while respecting privacy.",
          ],
        },
      ],
      conclusion: "Phone OSINT helps identify carrier infrastructure and potential exposure risks without accessing call logs or private subscriber records.",
    },
  },
  {
    slug: "how-to-check-email-breach-exposure",
    title: "How to Check Email Breach Exposure & Protect Your Accounts",
    description: "Understand how publicly disclosed data breaches occur, how to audit your email exposure, and what to do when your data is leaked.",
    readTime: "6 min read",
    publishedAt: "2026-08-14",
    category: "Security Hygiene",
    content: {
      intro: "Data breaches occur when corporate databases containing customer information are improperly secured or stolen by malicious actors. Checking whether your email has been exposed is critical for modern digital hygiene.",
      sections: [
        {
          heading: "1. What Is Contained in Public Breach Dumps?",
          body: [
            "Data breaches often contain usernames, email addresses, salted password hashes, physical addresses, and occasionally phone numbers.",
            "Even if passwords are encrypted or hashed, attackers can use exposed emails for credential stuffing attacks against other websites.",
          ],
        },
        {
          heading: "2. Auditing Known Public Disclosures",
          body: [
            "OSINTScan checks public breach intelligence indexes to identify whether your email address has appeared in publicly known compromises.",
            "These checks reveal the names of affected services and the categories of compromised data without exposing any confidential records.",
          ],
        },
        {
          heading: "3. Immediate Remediation Steps",
          body: [
            "If your email appears in a breach, immediately change passwords on any accounts that shared the compromised credentials.",
            "Enable hardware security keys (FIDO2) or authenticator app 2FA across all critical services to prevent unauthorized access.",
          ],
        },
      ],
      conclusion: "Regularly auditing breach records allows you to stay ahead of automated credential stuffing campaigns.",
    },
  },
  {
    slug: "how-to-reduce-your-digital-footprint",
    title: "How to Reduce Your Digital Footprint: Practical Privacy Guide",
    description: "A concrete checklist for removing personal information from Google search results, data brokers, and abandoned accounts.",
    readTime: "9 min read",
    publishedAt: "2026-08-10",
    category: "Privacy Hygiene",
    content: {
      intro: "Minimizing your digital footprint reduces the amount of public information available to data brokers, automated scrapers, and malicious actors.",
      sections: [
        {
          heading: "1. Delete Dormant and Abandoned Accounts",
          body: [
            "Use OSINTScan to locate every public profile associated with your common handles.",
            "Log into each service and utilize formal account deletion options to permanently purge your data from public indexing.",
          ],
        },
        {
          heading: "2. Remove Outdated Google Search Results",
          body: [
            "After deleting a profile, search Google for your name and username. If deleted pages still appear in cache, use Google's 'Remove Outdated Content' tool to request cache refresh.",
            "You can also submit removal requests for personally identifiable information (PII) such as personal phone numbers and home addresses under Google's personal content policies.",
          ],
        },
        {
          heading: "3. Opt Out of People-Search Data Brokers",
          body: [
            "Public record aggregators compile phone numbers, addresses, and family connections from government records and commercial marketing databases.",
            "Submit opt-out requests directly to major data brokers or use privacy services to continuously maintain removals.",
          ],
        },
        {
          heading: "4. Segregate Online Identifiers Going Forward",
          body: [
            "Adopt unique usernames for separate areas of your digital life (e.g. professional, gaming, and personal browsing).",
            "Use email alias forwarding services to keep your primary personal email private from public registrations.",
          ],
        },
      ],
      conclusion: "Privacy is an ongoing process of reducing exposure surface area rather than achieving total anonymity.",
    },
  },
  {
    slug: "osint-methodology",
    title: "OSINT Investigation Methodology: Ethics, Verification & Rigor",
    description: "A comprehensive framework for lawful open-source intelligence research, source verification, and bias mitigation.",
    readTime: "10 min read",
    publishedAt: "2026-08-04",
    category: "OSINT Fundamentals",
    content: {
      intro: "Open-source intelligence (OSINT) is the collection and analysis of information that is publicly accessible to anyone. Performing OSINT responsibly requires a structured methodology to ensure accuracy and respect privacy.",
      sections: [
        {
          heading: "1. The OSINT Intelligence Cycle",
          body: [
            "The cycle consists of: Direction (defining the scope), Collection (gathering public data), Processing (structuring and filtering), Analysis (synthesizing evidence), and Dissemination (reporting findings).",
            "Starting with a clear scope prevents cognitive bias and prevents unintentional scope creep into irrelevant private domains.",
          ],
        },
        {
          heading: "2. The Rule of Corroboration",
          body: [
            "A single data point is never sufficient to establish a fact. Always seek at least two independent corroborating sources before attributing an account to an individual.",
            "Evaluate source reliability, timestamp consistency, and platform behavioral nuances.",
          ],
        },
        {
          heading: "3. Ethical Boundaries and Responsible Conduct",
          body: [
            "Lawful OSINT strictly respects the boundaries of publicly accessible data. Never attempt to bypass authentication mechanisms, exploit vulnerabilities, or violate platform terms of service.",
            "OSINTScan is designed specifically to uphold these principles through non-invasive, public HTTP signals.",
          ],
        },
      ],
      conclusion: "Rigor, skepticism, and strict adherence to ethics are the hallmarks of professional open-source intelligence.",
    },
  },
  {
    slug: "username-osint",
    title: "Username OSINT: Techniques for Handle Discovery & Profiling",
    description: "Deep dive into username enumeration, avatar analysis, bio cross-linking, and common handle attribution challenges.",
    readTime: "7 min read",
    publishedAt: "2026-07-30",
    category: "OSINT Fundamentals",
    content: {
      intro: "Usernames are among the most persistent digital identifiers across the web. Analyzing how handles are created and reused allows security analysts to map digital footprints efficiently.",
      sections: [
        {
          heading: "1. Naming Conventions & Predictable Patterns",
          body: [
            "Individuals frequently follow predictable patterns when generating handles: combining first name and surname, incorporating birth years, or appending role tags like 'dev' or 'official'.",
            "Mapping these patterns helps uncover secondary handles used across different platforms.",
          ],
        },
        {
          heading: "2. Temporal and Historical Analysis",
          body: [
            "Reviewing when an account was created provides critical timeline context. An account registered in 2008 has very different investigative implications than one created yesterday.",
            "Archival snapshots via the Wayback Machine can reveal past usernames, historical bios, and deleted links.",
          ],
        },
        {
          heading: "3. Handling Common Name Collisions",
          body: [
            "Common handles like 'alex' or 'developer' are registered by thousands of unrelated individuals worldwide.",
            "When auditing generic handles, automated tools will yield high false-positive attribution rates unless paired with geographic and biographical verification.",
          ],
        },
      ],
      conclusion: "Username OSINT provides rapid discovery of online footprints when combined with careful evidence corroboration.",
    },
  },
  {
    slug: "email-osint",
    title: "Email OSINT: Discovery, Verification & Footprint Mapping",
    description: "Explore advanced techniques for analyzing email domains, MX records, avatar lookups, and account registration indicators.",
    readTime: "8 min read",
    publishedAt: "2026-07-24",
    category: "Technical OSINT",
    content: {
      intro: "Email addresses are universal digital anchors. Discovering how email addresses are linked to online accounts helps security researchers evaluate compromise risk and exposure.",
      sections: [
        {
          heading: "1. Domain and MX Record Analysis",
          body: [
            "Before querying individual accounts, analyze the email domain. Is it a major free webmail provider (Gmail, Outlook), a corporate domain, or a disposable temporary inbox provider?",
            "Examining MX, SPF, and DMARC records provides technical insight into the domain's email infrastructure.",
          ],
        },
        {
          heading: "2. Account Enumeration and Footprint Verification",
          body: [
            "Security tools evaluate whether an email address is registered on major public platforms by inspecting public endpoints.",
            "This highlights whether an identity has active accounts on developer hubs, creative networks, or social media platforms.",
          ],
        },
        {
          heading: "3. Defensive Applications for Personal Security",
          body: [
            "Running an email audit on your personal address allows you to spot forgotten subscriptions, exposed newsletter accounts, and legacy accounts needing closure.",
          ],
        },
      ],
      conclusion: "Email OSINT is an indispensable component of any thorough personal or organizational digital footprint audit.",
    },
  },
  {
    slug: "phone-osint",
    title: "Phone OSINT: Number Analysis, Telecom Routing & Footprint Auditing",
    description: "Learn how phone numbers can be audited for carrier information, geographic origin, VoIP classification, and public exposure.",
    readTime: "7 min read",
    publishedAt: "2026-07-18",
    category: "Technical OSINT",
    content: {
      intro: "Phone numbers are tightly regulated identifiers linked to national telecommunication frameworks. Auditing phone numbers reveals technical carrier routing and public footprint signals.",
      sections: [
        {
          heading: "1. ITU National Destination Codes and Geographic Allocation",
          body: [
            "Every phone number adheres to international allocation standards, which dictate the country code, regional area code, and mobile network operator prefix.",
            "This reveals the nominal geographic region and original issuing carrier.",
          ],
        },
        {
          heading: "2. Local Number Portability (LNP)",
          body: [
            "Because consumers can port phone numbers between carriers, the original prefix may not reflect the active carrier today.",
            "Real-time routing queries examine current Mobile Network Operator (MNO) routing to determine if a number has been ported or transferred to VoIP.",
          ],
        },
        {
          heading: "3. Mitigating SIM-Swap and Smishing Risks",
          body: [
            "If your phone number is broadly exposed on public forums or marketing directories, you face heightened risk of targeted phishing and SIM-swap attempts.",
            "Auditing your phone's public presence helps you decide whether to transition critical accounts to app-based multi-factor authentication.",
          ],
        },
      ],
      conclusion: "Phone OSINT clarifies telecommunication footprints and underscores the importance of protecting primary phone numbers.",
    },
  },
  {
    slug: "username-search-vs-username-availability",
    title: "Username Search vs. Username Availability: Key Differences",
    description: "Understand why checking whether a username exists is fundamentally different from checking whether it can be registered.",
    readTime: "5 min read",
    publishedAt: "2026-07-10",
    category: "OSINT Fundamentals",
    content: {
      intro: "While they sound similar, a 'Username Search' tool and a 'Username Availability Checker' serve different technical purposes and encounter different limitations.",
      sections: [
        {
          heading: "1. What a Username Search Tests",
          body: [
            "A username search checks whether a publicly accessible profile exists right now at a given URL (e.g. returns HTTP 200).",
            "Its goal is public footprint discovery and online presence mapping.",
          ],
        },
        {
          heading: "2. What Availability Checking Involves",
          body: [
            "Availability checking determines whether a new registration form will accept the handle.",
            "A name might show as 'Not Found' on a public URL because it is suspended, shadowbanned, or reserved by the platform, yet still be unavailable for registration.",
          ],
        },
      ],
      conclusion: "Always distinguish between public existence and registration eligibility when planning brand claims or investigating accounts.",
    },
  },
  {
    slug: "why-username-search-results-can-be-wrong",
    title: "Why Username Search Results Can Be Wrong: False Positives Explained",
    description: "Learn how dynamic JavaScript, soft-404 redirects, and anti-bot challenges cause false positives and false negatives.",
    readTime: "7 min read",
    publishedAt: "2026-07-02",
    category: "Technical OSINT",
    content: {
      intro: "Automated HTTP username enumeration is powerful, but it is never 100% infallible. Understanding platform response quirks prevents misleading conclusions.",
      sections: [
        {
          heading: "1. The 'Soft 404' Dilemma",
          body: [
            "Many modern web applications return HTTP 200 OK for every URL, only displaying 'User Not Found' in client-rendered JavaScript.",
            "If a detection rule only checks status codes without inspecting the body text, it will trigger a false positive.",
          ],
        },
        {
          heading: "2. Bot Challenges and Cloudflare Barriers",
          body: [
            "When security firewalls challenge an automated request with a CAPTCHA or 'Just a moment...' page, the status code may be 403 or 503.",
            "OSINTScan classifies these as 'BLOCKED' rather than assuming the user does not exist.",
          ],
        },
        {
          heading: "3. Handle Collisions",
          body: [
            "Just because a profile named 'alexdev' exists on both GitHub and Steam does not mean they belong to the same human being.",
            "Never assume identity ownership without corroborating email, PGP keys, or cross-linked profiles.",
          ],
        },
      ],
      conclusion: "Always treat automated scan results as investigative leads that require human verification.",
    },
  },
];

export function getGuideBySlug(slug: string): GuideArticle | null {
  const target = slug.toLowerCase();
  // Support aliases
  if (target === "how-to-audit-your-digital-footprint") {
    return GUIDES.find((g) => g.slug === "how-to-check-your-digital-footprint") || null;
  }
  return GUIDES.find((g) => g.slug.toLowerCase() === target) || null;
}
