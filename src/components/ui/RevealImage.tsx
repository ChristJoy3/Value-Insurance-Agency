"use client";
/**
 * Clean mask reveal for images/figures (clip-path) with a subtle inner
 * parallax on tablet/desktop.
 */
import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { MQ, ENTER } from "@/lib/motion";

export function RevealImage({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useIdleGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          ref.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: ref.current, start: ENTER } },
        );
        gsap.from(".ri-inner", { scale: 1.15, duration: 2, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: ENTER } });
      });
      mm.add(`${MQ.notMobile} and ${MQ.motion}`, () => {
        gsap.to(".ri-inner", { yPercent: -6, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div className="ri-inner size-full">{children}</div>
    </div>
  );
}
