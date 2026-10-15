"use client";
import { useSyncExternalStore } from "react";
import { MQ } from "@/lib/motion";

/**
 * Subscribe to a media query. Returns `serverValue` during SSR/hydration so
 * markup always matches, then the real value after mount.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useReducedMotion = () => useMediaQuery(MQ.reduce);
export const useIsMobile = () => useMediaQuery(MQ.mobile);
export const useFinePointer = () => useMediaQuery(MQ.finePointer);
