"use client";
/**
 * useGSAP, but the setup runs when the browser is idle instead of inside
 * React's hydration commit. Each component becomes its own small task, which
 * keeps the main thread responsive during load (Total Blocking Time).
 *
 * Safe because every animated element's FINAL state lives in CSS: until the
 * setup runs, content is simply visible and static.
 * Pass `immediate: true` for above-the-fold / preloader-synced animations.
 */
import { gsap, useGSAP } from "@/lib/gsap";
import type { RefObject } from "react";

type Cleanup = void | (() => void);

function onIdle(cb: () => void, timeout = 1200): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(cb, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, 1);
  return () => window.clearTimeout(id);
}

export function useIdleGSAP(
  setup: () => Cleanup,
  {
    scope,
    dependencies = [],
    revertOnUpdate = false,
    immediate = false,
  }: { scope: RefObject<Element | null>; dependencies?: unknown[]; revertOnUpdate?: boolean; immediate?: boolean },
) {
  useGSAP(
    (_ctx, contextSafe) => {
      let cleanup: Cleanup;
      // contextSafe: anything created later is still recorded in this component's gsap context
      const run = contextSafe!(() => {
        cleanup = setup();
      });
      if (immediate) {
        run();
        return () => cleanup?.();
      }
      const cancel = onIdle(run);
      return () => {
        cancel();
        cleanup?.();
      };
    },
    { scope, dependencies, revertOnUpdate },
  );
}

export { gsap };
