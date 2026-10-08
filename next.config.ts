import type { NextConfig } from "next";

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
};

export default nextConfig;
