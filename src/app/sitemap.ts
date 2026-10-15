import type { MetadataRoute } from "next";
import { coverages } from "@/data/content";
import { routes } from "@/lib/routes";
import { abs } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    ...coverages.map((c) => ({ path: routes.coverage(c.slug), priority: 0.8 })),
    { path: routes.arthur, priority: 0.6 },
    { path: routes.glossary, priority: 0.5 },
    { path: routes.refer, priority: 0.3 },
    { path: routes.newsletter, priority: 0.3 },
    { path: routes.privacy, priority: 0.1 },
  ];
  return pages.map((p) => ({ url: abs(p.path), priority: p.priority }));
}
