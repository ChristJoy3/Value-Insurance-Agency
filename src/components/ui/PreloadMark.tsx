"use client";
/**
 * If the visitor lands on an inner page first, mark the session as "preloaded"
 * so navigating to the homepage later doesn't play the intro mid-visit.
 */
import { useEffect } from "react";
import { PRELOADED_KEY } from "@/lib/preloader";

export function PreloadMark() {
  useEffect(() => {
    if (window.location.pathname === "/") return;
    document.documentElement.setAttribute("data-preloaded", "");
    try {
      sessionStorage.setItem(PRELOADED_KEY, "1");
    } catch {}
  }, []);
  return null;
}
