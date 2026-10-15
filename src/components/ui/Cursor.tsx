"use client";
/**
 * Custom cursor (desktop fine pointers only): a small ink dot that opens into
 * a "pen nib" ring over links and buttons. Uses mix-blend difference so it
 * reads on both paper and ink sections. Native cursor is kept for text fields.
 */
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function Cursor() {
  const enabled = useMediaQuery(`${MQ.finePointer} and ${MQ.motion}`);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.15, ease: "power3.out" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.15, ease: "power3.out" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3.out" });
    let visible = false;

    const move = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to(dot.current, { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as Element).closest("a, button, [role='button'], summary, label[for]");
      const isField = (e.target as Element).closest("input, textarea, select");
      gsap.to(ring.current, { scale: el && !isField ? 1 : 0, opacity: el && !isField ? 1 : 0, duration: 0.45, ease: "expo.out" });
      gsap.to(dot.current, { scale: isField ? 0 : el ? 0.5 : 1, duration: 0.3 });
    };
    const leave = () => {
      visible = false;
      gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 });
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] mix-blend-difference">
      <div ref={dot} className="absolute left-0 top-0 -ml-1 -mt-1 size-2 rounded-full bg-paper opacity-0" />
      <div ref={ring} className="absolute left-0 top-0 -ml-6 -mt-6 size-12 scale-0 rounded-full border border-paper opacity-0">
        {/* pen-nib tick */}
        <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 rotate-45 bg-paper" />
      </div>
    </div>
  );
}
