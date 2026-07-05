import type { MetadataRoute } from "next";

// File convention: served at /sitemap.xml. One entry for now — add
// routes here if the site grows (e.g. /blog/[slug] pages).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://about.seanoreilly.dev",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
