"use client";
/**
 * Number that counts up when it scrolls into view.
 * `initial` is computed at build time (static HTML); `since` lets the client
 * recompute the live value (e.g. years since 1989) so a static export never
 * goes stale. No hydration mismatch: the live value is applied after mount.
 */
import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { MQ, ENTER } from "@/lib/motion";
import { yearsSince, type YearMonth } from "@/lib/years";

type Props = { initial: number; since?: YearMonth; className?: string; suffix?: string };

export function CountUp({ initial, since, className, suffix = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useIdleGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const target = since ? yearsSince(since) : initial;
      const render = (n: number) => (el.textContent = `${Math.round(n)}${suffix}`);
      render(target);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const counter = { n: 0 };
        render(0);
        const st = ScrollTrigger.create({
          trigger: el,
          start: ENTER,
          onEnter: () => gsap.to(counter, { n: target, duration: 2, ease: "power3.out", onUpdate: () => render(counter.n) }),
        });
        return () => {
          st.kill();
          render(target);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {initial}
      {suffix}
    </span>
  );
}
