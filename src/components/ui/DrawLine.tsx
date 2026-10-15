"use client";
/**
 * A hairline rule that "draws" across the page (transform: scaleX/scaleY only).
 * The "draft" stage of the motion story: ledger lines and column rules.
 */
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { MQ, ENTER } from "@/lib/motion";

type Props = {
  orientation?: "horizontal" | "vertical";
  className?: string;
  delay?: number;
  /** scrub with scroll instead of playing once */
  scrub?: boolean;
  /** draw from the end instead of the start */
  reverse?: boolean;
};

export function DrawLine({ orientation = "horizontal", className = "", delay = 0, scrub = false, reverse = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const horizontal = orientation === "horizontal";

  useIdleGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(ref.current, {
          [horizontal ? "scaleX" : "scaleY"]: 0,
          transformOrigin: reverse ? (horizontal ? "right center" : "center bottom") : horizontal ? "left center" : "center top",
          duration: 1.6,
          delay,
          ease: scrub ? "none" : "power3.inOut",
          scrollTrigger: scrub
            ? { trigger: ref.current, start: "top 90%", end: "bottom 40%", scrub: 0.6 }
            : { trigger: ref.current, start: ENTER },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className={`${horizontal ? "h-px w-full" : "h-full w-px"} bg-current opacity-20 ${className}`}
    />
  );
}
