/**
 * Motion system constants. The site's story is draft → review → signed → sealed;
 * every animation uses one of these eases/durations so the rhythm stays consistent.
 */
export const EASE = {
  /** reveals, masks, page transitions */
  reveal: "expo.out",
  /** line drawing (signatures, ledger rules) */
  draw: "power3.inOut",
  /** seal stamp */
  stamp: "back.out(1.6)",
  /** scrubbed scroll animations */
  scrub: "none",
} as const;

export const DUR = {
  fast: 0.6,
  base: 1.1,
  slow: 1.6,
  draw: 1.4,
} as const;

/** Breakpoints for gsap.matchMedia — mobile ≤767, tablet 768–1279, desktop ≥1280. */
export const MQ = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1279px)",
  desktop: "(min-width: 1280px)",
  notMobile: "(min-width: 768px)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

/** Standard ScrollTrigger start for "element enters the reading zone". */
export const ENTER = "top 82%";
