# OSINTScan — Full URL Inventory & Route Audit (`SEO_ROUTE_AUDIT.md`)

**Audit Date:** 2026-09-27  
**Domain:** `https://www.osintscan.app/`  
**Total Cataloged Application Routes:** 761  

---

## 1. Executive Summary of Indexation Audit

Google Search Console reported **~215 indexed URLs** and **~540 non-indexed URLs (`Discovered - currently not indexed`)**.  
Root-cause inspection revealed two structural causes:
1. **Programmatic Platform Bloat (690+ URLs):** Dumping all 720 `/platforms/[slug]` rules (including obscure forums, non-English/Cyrillic handles, and adult/NSFW sites) into `sitemap.xml` exhausted Googlebot's crawl budget for the new domain.
2. **Duplicate Intent Doorway Pages (13 URLs):** Multiple near-identical tool routes (`/username-search`, `/username-lookup`, `/username-osint`, `/find-accounts-by-username`, `/reverse-email-lookup`, `/email-osint`, `/phone-number-lookup`, etc.) competed for the same search intent.

---

## 2. Route Classification Matrix

| Route / Pattern | Page Type | Canonical Target | Robots State | Sitemap | Action | Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | Homepage | `/` | `index, follow` | Yes | **INDEX** | Primary brand entity (`OSINTScan`) & multi-identifier search hub (`Search your public digital footprint.`). |
| `/username-search` | Primary Tool | `/username-search` | `index, follow` | Yes | **INDEX** | Primary canonical destination for the entire username-search intent cluster. |
| `/username-lookup` | Duplicate Doorway | `/username-search` | `301 Redirect` | No | **REDIRECT** | 301 permanent redirect to `/username-search` (`next.config.mjs`). |
| `/username-osint` | Duplicate Doorway | `/username-search` | `301 Redirect` | No | **REDIRECT** | 301 permanent redirect to `/username-search` (`next.config.mjs`). |
| `/find-accounts-by-username` | Duplicate Doorway | `/username-search` | `301 Redirect` | No | **REDIRECT** | 301 permanent redirect to `/username-search` (`next.config.mjs`). |
| `/social-media-username-search` | Duplicate Doorway | `/username-search` | `301 Redirect` | No | **REDIRECT** | 301 permanent redirect to `/username-search` (`next.config.mjs`). |
| `/check-username-across-platforms` | Duplicate Doorway | `/username-search` | `301 Redirect` | No | **REDIRECT** | 301 permanent redirect to `/username-search` (`next.config.mjs`). |
| `/username-availability-checker` | Duplicate Doorway | `/username-search` | `301 Redirect` | No | **REDIRECT** | 301 permanent redirect to `/username-search` (`next.config.mjs`). |
| `/email-lookup` | Primary Tool | `/email-lookup` | `index, follow` | Yes | **INDEX** | Primary canonical destination for reverse email lookup & service registration discovery. |
| `/reverse-email-lookup` | Duplicate Doorway | `/email-lookup` | `301 Redirect` | No | **REDIRECT** | 301 permanent redirect to `/email-lookup` (`next.config.mjs`). |
| `/email-osint` | Duplicate Doorway | `/email-lookup` | `301 Redirect` | No | **REDIRECT** | 301 permanent redirect to `/email-lookup` (`next.config.mjs`). |
| `/email-footprint` | Duplicate Doorway | `/email-lookup` | `301 Redirect` | No | **REDIRECT** | 301 permanent redirect to `/email-lookup` (`next.config.mjs`). |
| `/email-breach-check` | Focused Tool | `/email-breach-check` | `index, follow` | Yes | **INDEX** | Distinct breach exposure & credential disclosure check intent. |
| `/phone-lookup` | Primary Tool | `/phone-lookup` | `index, follow` | Yes | **INDEX** | Primary canonical destination for phone number lookup, E.164 formatting & carrier/VoIP analysis. |
| `/reverse-phone-lookup` | Duplicate Doorway | `/phone-lookup` | `301 Redirect` | No | **REDIRECT** | 301 permanent redirect to `/phone-lookup` (`next.config.mjs`). |
| `/phone-number-lookup` | Duplicate Doorway | `/phone-lookup` | `301 Redirect` | No | **REDIRECT** | 301 permanent redirect to `/phone-lookup` (`next.config.mjs`). |
| `/phone-osint` | Duplicate Doorway | `/phone-lookup` | `301 Redirect` | No | **REDIRECT** | 301 permanent redirect to `/phone-lookup` (`next.config.mjs`). |
| `/phone-number-information` | Duplicate Doorway | `/phone-lookup` | `301 Redirect` | No | **REDIRECT** | 301 permanent redirect to `/phone-lookup` (`next.config.mjs`). |
| `/digital-footprint-check` | Primary Tool | `/digital-footprint-check` | `index, follow` | Yes | **INDEX** | Comprehensive digital footprint audit hub combining username, email, and phone hygiene. |
| `/how-it-works` | Methodology | `/how-it-works` | `index, follow` | Yes | **INDEX** | Explains HTTP fingerprinting, soft-404 suppression, and ephemeral RAM architecture. |
| `/platforms` | Directory Hub | `/platforms` | `index, follow` | Yes | **INDEX** | Searchable & filterable directory of all 720 supported platforms. |
| `/platforms/[slug]` (30 Tier-1 Sites) | Platform Detail | `/platforms/[slug]` | `index, follow` | Yes | **INDEX** | Recognizable platforms with genuine search demand (Instagram, YouTube, TikTok, X, Reddit, Spotify, GitHub, etc.). |
| `/platforms/[slug]` (690 Minor Sites) | Platform Detail | `/platforms/[slug]` | `noindex, follow` | No | **NOINDEX** | Accessible in product directory for users, but excluded from Google index & XML sitemap to eliminate crawl bloat. |
| `/guides` & `/guides/[slug]` (10 Guides) | Educational Content | `/guides/[slug]` | `index, follow` | Yes | **INDEX** | In-depth educational guides with `Article` + `BreadcrumbList` schema and `OSINTScan Research` byline. |
| `/comparisons` & `/comparisons/[slug]` (3 Studies) | Original Research | `/comparisons/[slug]` | `index, follow` | Yes | **INDEX** | First-party technical benchmarks (`sherlock-vs-maigret`, `whatsmyname-vs-sherlock`, `username-osint-tools`). |
| `/faq`, `/about`, `/open-source`, `/privacy`, `/terms` | Brand & Legal | Self-canonical | `index, follow` | Yes | **INDEX** | Core trust, entity disambiguation (`method-security/osintscan`), open-source attribution, and privacy guarantees. |
