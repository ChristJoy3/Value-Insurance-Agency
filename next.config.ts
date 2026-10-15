import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS/JS to `out/`.
  output: "export",
  // `/about/arthur-lander/` → `out/about/arthur-lander/index.html`, which every
  // static host serves without rewrite rules (and matches the legacy folder URLs).
  trailingSlash: true,
  // No image optimization server in a static export; images are pre-optimized by scripts/images.mjs.
  images: { unoptimized: true },
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
