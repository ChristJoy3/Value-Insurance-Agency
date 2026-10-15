"use client";
/**
 * "Review" highlight: an aqua marker band swept behind a key phrase as it
 * scrolls into view — like an advisor marking up the fine print for you.
 * Final state lives in CSS (.hl), so no-JS and reduced-motion users see it.
 */
import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { MQ } from "@/lib/motion";
import { hlSizes } from "@/lib/highlight";

export function HighlightSweep({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  useIdleGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const { from, to } = hlSizes(el);
        gsap.fromTo(
          el,
          { backgroundSize: from },
          {
            backgroundSize: to,
            duration: 1.2,
            delay,
            ease: "power2.inOut",
            scrollTrigger: { trigger: el, start: "top 78%" },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <mark ref={ref} className="hl bg-transparent text-inherit">
      {children}
    </mark>
  );
}
