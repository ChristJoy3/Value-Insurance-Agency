"use client";
/**
 * A coverage line icon that draws itself (single continuous stroke).
 * `drawKey` — change it to replay the draw (e.g. on hover of another row).
 */
import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { MQ, ENTER } from "@/lib/motion";
import { ICONS } from "./icons";

type Props = {
  slug: string;
  className?: string;
  strokeWidth?: number;
  /** "inview": draw on scroll into view; "mount": draw immediately; "none": static */
  animate?: "inview" | "mount" | "none";
  drawKey?: string | number;
  title?: string;
};

export function LineIcon({ slug, className = "", strokeWidth = 1.5, animate = "inview", drawKey, title }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const d = ICONS[slug] ?? ICONS["business-insurance"];

  useIdleGSAP(
    () => {
      if (animate === "none") return;
      const path = ref.current?.querySelector("path");
      if (!path) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tween = gsap.fromTo(path, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.5, ease: "power2.inOut", paused: true });
        if (animate === "mount") tween.play();
        else ScrollTrigger.create({ trigger: ref.current, start: ENTER, onEnter: () => tween.play() });
      });
      return () => mm.revert();
    },
    { immediate: animate === "mount", scope: ref, dependencies: [slug, drawKey, animate], revertOnUpdate: true },
  );

  return (
    <svg ref={ref} viewBox="0 0 48 48" fill="none" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d={d} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
