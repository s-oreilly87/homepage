import type { MetadataRoute } from "next";

// File convention: Next.js serves this at /robots.txt at build time.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://about.seanoreilly.dev/sitemap.xml",
  };
}
