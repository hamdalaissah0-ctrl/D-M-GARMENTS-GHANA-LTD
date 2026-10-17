import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  /* config options here */
  // Content is CMS-backed and must reflect admin edits immediately, so pages
  // render dynamically per request rather than opting into Next 16's
  // Cache Components (which requires explicit "use cache" directives).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "otscslkmvhunzlxfrqse.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // No SENTRY_AUTH_TOKEN yet, so source map upload is skipped (stack traces
  // in the Sentry dashboard will be minified until that's added) — error
  // capture itself works regardless. See docs/DECISIONS.md ADR-013.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
});
