"use client";
/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis
 * share one RAF loop.
 * - Touch devices keep native scrolling (syncTouch: false).
 * - Reduced motion: wheel smoothing is turned off entirely.
 * - ScrollTrigger is refreshed once web fonts and images have loaded, since
 *   both change layout heights after first paint.
 * - Deep links (/#about): pinned sections add scroll distance after the
 *   browser's initial jump, so we re-align to the hash after each refresh.
 */

/** Scroll (instantly) to the element named by location.hash, below the fixed navbar. */
function alignToHash(lenis?: { scrollTo: (t: HTMLElement, o: object) => void }) {
  const hash = window.location.hash;
  if (hash.length < 2) return;
  let el: HTMLElement | null = null;
  try {
    el = document.querySelector<HTMLElement>(hash);
  } catch {
    return; // not a valid selector (e.g. "#a" on glossary is fine, odd hashes are ignored)
  }
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { immediate: true, force: true }); // honours CSS scroll-padding-top
  else el.scrollIntoView();
}
import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";

function ScrollTriggerSync() {
  // Every Lenis scroll tick updates ScrollTrigger positions.
  useLenis(ScrollTrigger.update);
  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const reduced = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    const tick = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => {
      ScrollTrigger.refresh();
      alignToHash(lenisRef.current?.lenis);
    };
    // One refresh once BOTH fonts and images are in (each refresh re-measures every trigger).
    const loaded = new Promise<void>((resolve) =>
      document.readyState === "complete" ? resolve() : window.addEventListener("load", () => resolve(), { once: true }),
    );
    let alive = true;
    Promise.all([document.fonts?.ready, loaded]).then(() => alive && refresh());
    // Orientation changes are real layout changes (unlike URL-bar resizes).
    const onOrientation = () => setTimeout(refresh, 300);
    screen.orientation?.addEventListener("change", onOrientation);

    return () => {
      alive = false;
      gsap.ticker.remove(tick);
      screen.orientation?.removeEventListener("change", onOrientation);
    };
  }, []);

  // Client-side navigation to "/#section": align once the new page's triggers exist.
  // (Skipped on first load — the fonts/load refresh above handles that.)
  const firstRoute = useRef(true);
  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        alignToHash(lenisRef.current?.lenis);
      }),
    );
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: !reduced,
        syncTouch: false,
        anchors: true,
      }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
