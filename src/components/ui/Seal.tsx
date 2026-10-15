"use client";
/**
 * The "sealed" moment: a minimal embossed seal that stamps in beside key CTAs.
 * Purely typographic (rings + ring text + a check stroke) — deliberately NOT
 * a redraw of the VIA logo.
 */
import { useId, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { MQ } from "@/lib/motion";
import { whenPreloaderDone } from "@/lib/preloader";

type Props = {
  className?: string;
  /** "ink" for paper backgrounds, "aqua" for ink backgrounds */
  tone?: "ink" | "aqua";
  afterPreloader?: boolean;
  delay?: number;
  text?: string;
};

export function Seal({
  className = "",
  tone = "ink",
  afterPreloader = false,
  delay = 0,
  text = "Value Insurance Agency • DC • MD • VA • ",
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g, "");

  useIdleGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ paused: true, delay });
        tl.fromTo(svg, { scale: 1.7, opacity: 0, rotate: -28 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.9, ease: "back.out(1.6)" })
          .fromTo(svg.querySelector(".seal-check"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, ease: "power2.out" }, "-=0.35");
        if (afterPreloader) return whenPreloaderDone(() => tl.play());
        const st = ScrollTrigger.create({ trigger: svg, start: "top 90%", onEnter: () => tl.play() });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { immediate: afterPreloader, scope: ref },
  );

  const color = tone === "aqua" ? "var(--color-aqua)" : "var(--color-ink)";
  return (
    <svg ref={ref} viewBox="0 0 120 120" aria-hidden className={`shrink-0 ${className}`} style={{ color }}>
      <defs>
        <path id={`seal-${id}`} d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="60" cy="60" r="53" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <circle cx="60" cy="60" r="34" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="1.5 3" />
      <g className="seal-ring-text">
        <text fill="currentColor" style={{ font: "500 7.6px var(--font-mono)", textTransform: "uppercase" }}>
          <textPath href={`#seal-${id}`} textLength={272} lengthAdjust="spacing">
            {text.toUpperCase()}
          </textPath>
        </text>
      </g>
      <path className="seal-check" d="M45 61 l10 10 l21 -24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
