const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://osintscan.org";

export function getWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "OSINTScan",
    "url": SITE_URL,
    "applicationCategory": "SecurityApplication",
    "operatingSystem": "All",
    "description":
      "Privacy-first public digital footprint intelligence. Search usernames, email addresses, and phone numbers across publicly accessible sources.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Public profile detection across 700+ websites",
      "Reverse email presence verification",
      "International phone carrier & telecom metadata lookup",
      "In-memory ephemeral execution with zero database storage",
      "Real-time streaming scan progress",
      "Exportable CSV and JSON reports",
    ],
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "OSINTScan",
    "url": SITE_URL,
    "description":
      "Public digital footprint search for usernames, email addresses, and phone numbers.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/username-search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "OSINTScan",
    "url": SITE_URL,
    "logo": `${SITE_URL}/icon-512.png`,
    "description": "Privacy-conscious public digital footprint auditing and security intelligence.",
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => {
      const fullUrl = item.url.startsWith("http")
        ? item.url
        : `${SITE_URL}${item.url.startsWith("/") ? item.url : `/${item.url}`}`;
      return {
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": fullUrl,
      };
    }),
  };
}

export function getArticleSchema({
  title,
  description,
  url,
  datePublished,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
}) {
  const fullUrl = url.startsWith("http")
    ? url
    : `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": fullUrl,
    "datePublished": datePublished,
    "dateModified": datePublished,
    "author": {
      "@type": "Organization",
      "name": "OSINTScan Research Team",
      "url": SITE_URL,
    },
    "publisher": {
      "@type": "Organization",
      "name": "OSINTScan",
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/icon-512.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl,
    },
  };
}
