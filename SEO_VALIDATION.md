# OSINTScan — Technical SEO Validation Checklist (`SEO_VALIDATION.md`)

## 1. Core Readiness Verification
- [x] **Homepage Status (`/`):** Returns HTTP 200 Server-Rendered HTML with title `OSINTScan — Username, Email & Phone Lookup` and H1 `Search your public digital footprint.`.
- [x] **Sitemap Status (`/sitemap.xml`):** Dynamically generated via `frontend/app/sitemap.ts`. Contains **58 canonical indexable URLs** (15 core pages, 10 guides, 3 comparison benchmarks, 30 Tier-1 platform pages). Zero `noindex` pages and zero `301` redirect URLs are present in the XML sitemap.
- [x] **Robots Status (`/robots.txt`):** Allows all public SEO routes, CSS, JS, and images (`Allow: /`); disallows `/api/`, `/scans/`, `/results`, and personal search query parameters (`/*?*username=*`, `/*?*email=*`, `/*?*phone=*`, `/*?*target=*`, `/*?*q=*`).
- [x] **Canonical Tags:** Every indexable route outputs a self-referencing canonical URL under `https://www.osintscan.app`.
- [x] **301 Doorway Consolidation (`frontend/next.config.mjs`):**
  - `/username-lookup`, `/username-osint`, `/find-accounts-by-username`, `/social-media-username-search`, `/check-username-across-platforms`, `/username-availability-checker` → `301` to `/username-search`
  - `/reverse-email-lookup`, `/email-osint`, `/email-footprint` → `301` to `/email-lookup`
  - `/reverse-phone-lookup`, `/phone-number-lookup`, `/phone-osint`, `/phone-number-information` → `301` to `/phone-lookup`
- [x] **Platform Indexability Policy (`frontend/lib/platforms.ts` & `frontend/app/platforms/[slug]/page.tsx`):**
  - 30 recognizable Tier-1 platforms (`instagram`, `tiktok`, `youtube-channel`, `youtube-user2`, `x`, `reddit`, `spotify`, `github-user`, `gitlab`, `telegram`, `snapchat`, `pinterest`, `twitch`, `steam`, `roblox`, `medium`, `substack`, `linktree`, `patreon`, `soundcloud`, `vimeo`, `quora`, `behance`, `dribbble`, `deviantart`, `chesscom`, `huggingface`, `leetcode`, `kaggle`, `duolingo`) are statically generated (`generateStaticParams`) and marked `index, follow`.
  - 690 minor/regional/niche platform detail pages remain accessible inside the interactive platform directory for users, but output `<meta name="robots" content="noindex, follow">` and are excluded from `/sitemap.xml`.
- [x] **Structured Data (`frontend/lib/structured-data.ts`):**
  - Homepage: `WebSite` (with `name: "OSINTScan"`, `alternateName: ["OSINT Scan", "osintscan.app"]`), `Organization` (`sameAs: ["https://github.com/SomanAbbasi/OSINTScan"]`), `WebApplication`, `FAQPage`.
  - Guides & Comparisons: `Article` (`author: "OSINTScan Research"`) + `BreadcrumbList`.
  - Platform Pages: `BreadcrumbList` only (no artificial `FAQPage` spam).
- [x] **Scanner / SEO Separation:** Personal search queries execute via `POST /api/v1/scans` and SSE streams in memory; no personal search results are ever server-rendered into indexable URLs.
- [x] **Zero Orphan Pages:** Every indexable route is reachable within 2 clicks from `/` via the header, canonical module bar, `/platforms`, `/guides`, `/comparisons`, or footer navigation.

## 2. Post-Deployment Search Console Steps (Manual Verification)
1. In Google Search Console → **Sitemaps**, submit `https://www.osintscan.app/sitemap.xml` and verify that the discovered URL count drops from ~755 to **58** canonical URLs.
2. Monitor **Pages → Discovered - currently not indexed (539 pages)** over the next 7–14 days as Googlebot processes the `301` redirects on the 13 doorway pages and the `noindex, follow` directives on the 690 minor platform pages.
3. Use **URL Inspection** to verify live HTML rendering on:
   - `https://www.osintscan.app/`
   - `https://www.osintscan.app/username-search`
   - `https://www.osintscan.app/email-lookup`
   - `https://www.osintscan.app/phone-lookup`
   - `https://www.osintscan.app/digital-footprint-check`
   - `https://www.osintscan.app/comparisons`
