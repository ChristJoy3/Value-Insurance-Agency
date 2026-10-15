"use client";
/**
 * Last-resort forwarding for legacy URLs that reach the 404 page
 * (e.g. /category.aspx?id=AUTO on hosts without query-string redirect rules).
 */
import { useEffect } from "react";
import { coverages } from "@/data/content";
import { routes } from "@/lib/routes";

export function LegacyRedirect() {
  useEffect(() => {
    const here = window.location.pathname.replace(/\/$/, "") + window.location.search;
    const lower = here.toLowerCase();
    const hit = coverages.find((c) => c.legacyPaths.some((p) => p.replace(/\/$/, "").toLowerCase() === lower));
    if (hit) window.location.replace(routes.coverage(hit.slug));
  }, []);
  return null;
}
