/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      // Consolidate duplicate Username doorway routes into canonical /username-search
      { source: "/username-lookup", destination: "/username-search", permanent: true },
      { source: "/username-osint", destination: "/username-search", permanent: true },
      { source: "/find-accounts-by-username", destination: "/username-search", permanent: true },
      { source: "/social-media-username-search", destination: "/username-search", permanent: true },
      { source: "/check-username-across-platforms", destination: "/username-search", permanent: true },
      { source: "/username-availability-checker", destination: "/username-search", permanent: true },

      // Consolidate duplicate Email doorway routes into canonical /email-lookup
      { source: "/reverse-email-lookup", destination: "/email-lookup", permanent: true },
      { source: "/email-osint", destination: "/email-lookup", permanent: true },
      { source: "/email-footprint", destination: "/email-lookup", permanent: true },

      // Consolidate duplicate Phone doorway routes into canonical /phone-lookup
      { source: "/reverse-phone-lookup", destination: "/phone-lookup", permanent: true },
      { source: "/phone-number-lookup", destination: "/phone-lookup", permanent: true },
      { source: "/phone-osint", destination: "/phone-lookup", permanent: true },
      { source: "/phone-number-information", destination: "/phone-lookup", permanent: true },

      // Redirect comparison guide URLs to canonical /comparisons studies
      { source: "/guides/sherlock-vs-maigret-vs-osintscan", destination: "/comparisons/sherlock-vs-maigret", permanent: true },
      { source: "/guides/whatsmyname-vs-osintscan", destination: "/comparisons/whatsmyname-vs-sherlock", permanent: true },
    ];
  },
};

export default nextConfig;
