"use client";
/**
 * Client wrapper that choreographs the hero's non-text pieces once the
 * preloader lifts: ledger + columns draw in, meta/copy/CTAs rise into place.
 * (Headline, signature and seal schedule themselves.)
 */
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { whenPreloaderDone } from "@/lib/preloader";

export function HeroIntro({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tl = gsap
          .timeline({ paused: true })
          .from(".hero-ledger", { clipPath: "inset(0 100% 0 0)", duration: 1.8, ease: "power3.inOut" })
          .from(".hero-columns", { clipPath: "inset(0 0 100% 0)", duration: 1.8, ease: "power3.inOut" }, 0)
          .from(".hero-meta > *", { y: 14, opacity: 0, stagger: 0.08, duration: 1 }, 0.2)
          .from(".hero-eyebrow", { y: 14, opacity: 0, duration: 1 }, 0.3)
          .from(".hero-copy", { y: 24, opacity: 0, duration: 1.2 }, 0.9)
          .from(".hero-ctas > *", { y: 24, opacity: 0, stagger: 0.1, duration: 1.2 }, 1)
          .from(".hero-foot", { opacity: 0, duration: 1 }, 1.3);
        const off = whenPreloaderDone(() => tl.play());
        // gentle parallax: the ledger drifts slower than the page
        gsap.to(".hero-ledger", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
        return off;
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return <div ref={ref}>{children}</div>;
}
