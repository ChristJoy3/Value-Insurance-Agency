"use client";
/**
 * The "signed" moment: a pen-stroke flourish that draws itself under a major
 * statement (DrawSVG = stroke-dashoffset under the hood).
 */
import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { MQ, ENTER } from "@/lib/motion";
import { whenPreloaderDone } from "@/lib/preloader";

export const SIGNATURE_PATH =
  "M4 40 C 34 14, 62 54, 96 32 S 150 6, 186 30 S 246 52, 286 30 S 352 4, 396 28 S 470 50, 520 26 C 545 15, 572 14, 596 22";

type Props = {
  className?: string;
  delay?: number;
  afterPreloader?: boolean;
  strokeWidth?: number;
};

export function SignatureLine({ className = "", delay = 0, afterPreloader = false, strokeWidth = 2 }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useIdleGSAP(
    () => {
      const path = ref.current?.querySelector("path");
      if (!path) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tween = gsap.fromTo(
          path,
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 1.6, delay, ease: "power2.inOut", paused: true },
        );
        if (afterPreloader) return whenPreloaderDone(() => tween.play());
        ScrollTrigger.create({ trigger: ref.current, start: ENTER, onEnter: () => tween.play() });
      });
      return () => mm.revert();
    },
    { immediate: afterPreloader, scope: ref },
  );

  return (
    <svg ref={ref} viewBox="0 0 600 56" fill="none" aria-hidden className={`overflow-visible ${className}`}>
      <path d={SIGNATURE_PATH} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
