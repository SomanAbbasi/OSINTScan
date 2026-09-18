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
    slug: "how-to-audit-your-digital-footprint",
    title: "How to Audit Your Public Digital Footprint Step-by-Step",
    description: "A practical guide to uncovering abandoned profiles, old forum accounts, and public handles to minimize your exposure.",
    readTime: "6 min read",
    publishedAt: "2026-09-01",
    category: "Privacy Hygiene",
    content: {
      intro: "Your digital footprint is the trail of data, public accounts, and personal identifiers left behind through years of internet use. Auditing it periodically is essential for cybersecurity hygiene.",
      sections: [
        {
          heading: "1. Inventory Your Known Aliases",
          body: [
            "Start by listing all historical handles, gamer tags, and email prefixes you have used over the past 5 to 15 years.",
            "Many people unknowingly reuse the same handle across diverse forums and developer communities.",
          ],
        },
        {
          heading: "2. Run an Automated Public Handle Audit",
          body: [
            "Use HandleScope to run high-speed checks across 700+ websites. Record every active URL flagged as a possible match.",
            "Remember that automated tools only identify public pages; manual inspection of account creation dates and bio text is crucial.",
          ],
        },
        {
          heading: "3. Reclaim or Permanently Delete Dormant Accounts",
          body: [
            "Log into forgotten accounts to delete personal identifiers, phone numbers, and location details.",
            "If the platform provides an account deletion option under GDPR or CCPA, submit a formal erasure request.",
          ],
        },
      ],
      conclusion: "Routine digital footprint audits significantly reduce your attack surface against credential stuffing and social engineering.",
    },
  },
  {
    slug: "username-search-vs-username-availability",
    title: "Username Search vs. Username Availability: Key Differences",
    description: "Understand why checking whether a username exists is fundamentally different from checking whether it can be registered.",
    readTime: "5 min read",
    publishedAt: "2026-08-20",
    category: "OSINT Fundamentals",
    content: {
      intro: "While they may sound similar, a 'Username Search' tool and a 'Username Availability Checker' serve different technical purposes and encounter different limitations.",
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
    publishedAt: "2026-08-15",
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
            "HandleScope classifies these as 'BLOCKED' rather than assuming the user does not exist.",
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
  {
    slug: "how-to-find-your-old-online-accounts",
    title: "How to Find Your Old Online Accounts (And What to Do With Them)",
    description: "Proven strategies for rediscovering abandoned social profiles, forum memberships, and forgotten web services.",
    readTime: "5 min read",
    publishedAt: "2026-08-05",
    category: "Privacy Hygiene",
    content: {
      intro: "Old accounts are a favorite target for credential stuffing attacks. Here is how to locate and secure your legacy web presence.",
      sections: [
        {
          heading: "1. Search Your Email Inbox Archives",
          body: [
            "Search keywords like 'Welcome to', 'Verify your email', 'Account created', or 'Confirm registration' across your old email accounts.",
            "This often surfaces accounts created a decade ago.",
          ],
        },
        {
          heading: "2. Scan Your Known Handles with HandleScope",
          body: [
            "Run your primary and secondary nicknames through HandleScope's 700+ platform database.",
            "Review 'High Confidence' matches first to spot forgotten community profiles.",
          ],
        },
      ],
      conclusion: "Taking an afternoon to clean up abandoned accounts closes doors to social engineering and credential reuse attacks.",
    },
  },
  {
    slug: "how-to-check-a-brand-username",
    title: "How to Check a Brand Username Across Hundreds of Platforms",
    description: "A creator and startup guide to trademark defense, handle reservation, and preventing cybersquatting.",
    readTime: "6 min read",
    publishedAt: "2026-07-28",
    category: "Brand Protection",
    content: {
      intro: "Brand consistency across platforms is vital for user trust, marketing, and preventing fraudulent impersonation.",
      sections: [
        {
          heading: "1. Audit Early Before Public Launch",
          body: [
            "Before publicly announcing a project or company name, audit the handle across major repositories and social hubs.",
            "Look for active accounts that might cause confusion or trademark conflicts.",
          ],
        },
        {
          heading: "2. Detect Impersonation and Squatting",
          body: [
            "If your brand is already established, periodic handle scans can alert you to copycat accounts using your identity to mislead customers.",
          ],
        },
      ],
      conclusion: "Proactive brand handle monitoring protects your reputation and intellectual property.",
    },
  },
  {
    slug: "how-to-verify-a-public-profile",
    title: "How to Verify a Public Profile Manually After an OSINT Match",
    description: "Step-by-step techniques to confirm whether an automated username match genuinely belongs to your subject.",
    readTime: "7 min read",
    publishedAt: "2026-07-15",
    category: "OSINT Fundamentals",
    content: {
      intro: "Automated tools find candidate URLs. Human analysis confirms whether those accounts actually correlate. Here is how to verify matches rigorously.",
      sections: [
        {
          heading: "1. Check Cross-Referenced Links",
          body: [
            "Look for links in bios: personal portfolio sites, verified GitHub links, Twitter/X handles, or Discord usernames.",
            "If multiple platforms reciprocally link to each other, confidence of shared ownership rises dramatically.",
          ],
        },
        {
          heading: "2. Analyze Avatar and Profile Metadata",
          body: [
            "Use reverse image search on profile pictures. Check account registration years against your timeline of the subject.",
            "Watch out for default avatars or inactive placeholders.",
          ],
        },
        {
          heading: "3. Writing Style and Vocabulary",
          body: [
            "Observe timezone markers, language nuances, and specialized terminology used in posts or commit messages.",
          ],
        },
      ],
      conclusion: "Responsible OSINT depends on corroborating multiple independent signals before drawing conclusions.",
    },
  },
];

export function getGuideBySlug(slug: string): GuideArticle | null {
  return GUIDES.find((g) => g.slug === slug) || null;
}
