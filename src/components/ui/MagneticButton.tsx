"use client";
/**
 * Gently pulls its child toward the pointer (desktop fine pointers only).
 * Wrap any button/link: <MagneticButton><a className="btn …">…</a></MagneticButton>
 */
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";

export function MagneticButton({ children, strength = 0.35, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const wrap = ref.current;
      const target = wrap?.firstElementChild as HTMLElement | null;
      if (!wrap || !target) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.finePointer} and ${MQ.motion}`, () => {
        const xTo = gsap.quickTo(target, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
        const yTo = gsap.quickTo(target, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
        const move = (e: PointerEvent) => {
          const r = wrap.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * strength);
          yTo((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        wrap.addEventListener("pointermove", move);
        wrap.addEventListener("pointerleave", leave);
        return () => {
          wrap.removeEventListener("pointermove", move);
          wrap.removeEventListener("pointerleave", leave);
          gsap.set(target, { x: 0, y: 0 });
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  // padding enlarges the "pull" zone without changing layout
  return (
    <span ref={ref} className={`-m-4 inline-flex p-4 ${className}`}>
      {children}
    </span>
  );
}
