"use client";
/**
 * Homepage preloader — the "draft → signed" overture:
 *   ruled ledger lines draw across → logo fades in → signature draws beneath
 *   → the page "turns" upward to reveal the hero.
 * Plays once per session. Skipped before first paint (inline script in the
 * layout sets html[data-preloaded]) for repeat visits and reduced motion.
 */
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markPreloaderDone, PRELOADED_KEY } from "@/lib/preloader";
import { Logo } from "./Logo";
import { SIGNATURE_PATH } from "./SignatureLine";

const RULES = 9;

export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const lenis = useLenis();

  // Scroll is locked for as long as the preloader is on screen.
  useEffect(() => {
    if (!lenis) return;
    if (gone) lenis.start();
    else lenis.stop();
  }, [lenis, gone]);

  useGSAP(
    () => {
      const root = document.documentElement;
      if (root.hasAttribute("data-preloaded")) {
        markPreloaderDone();
        setGone(true);
        return;
      }
      root.style.overflow = "hidden";
      const finish = () => {
        try {
          sessionStorage.setItem(PRELOADED_KEY, "1");
        } catch {}
        root.style.overflow = "";
        setGone(true);
      };

      // Phones get a shorter overture (≈1.6s vs ≈2.8s) — it's a doorway, not a wait.
      const quick = window.matchMedia("(max-width: 767px)").matches ? 0.6 : 1;
      // The logo is painted from the very first frame (no fade-in), so the page
      // has content immediately; the ledger and signature draw around it.
      gsap
        .timeline({ defaults: { ease: "expo.out" }, onComplete: finish })
        .timeScale(1 / quick)
        .from(".pl-rule", { scaleX: 0, transformOrigin: "left center", duration: 1.1, stagger: 0.05, ease: "power3.inOut" })
        .from(".pl-logo", { y: 10, duration: 1.1 }, 0.2)
        .fromTo(".pl-sign path", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1, ease: "power2.inOut" }, "-=0.6")
        .from(".pl-label", { opacity: 0, duration: 0.6 }, "-=0.5")
        .to(".pl-inner", { yPercent: -8, opacity: 0, duration: 0.8, ease: "power3.in" }, "+=0.25")
        .to(ref.current, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, "-=0.45")
        // let the hero start while the sheet is still lifting
        .add(markPreloaderDone, "-=0.7");
    },
    { scope: ref },
  );

  if (gone) return null;
  return (
    <div ref={ref} aria-hidden className="preloader bg-paper" style={{ clipPath: "inset(0 0 0% 0)" }}>
      <div className="absolute inset-0 flex flex-col justify-evenly px-4 md:px-10">
        {Array.from({ length: RULES }, (_, i) => (
          <span key={i} className="pl-rule block h-px w-full bg-rule" />
        ))}
      </div>
      <div className="pl-inner absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">
        <div className="pl-logo bg-paper px-4 py-2">
          <Logo width={260} priority className="w-[min(260px,68vw)]!" />
        </div>
        <svg className="pl-sign w-[min(280px,70vw)] text-ink" viewBox="0 0 600 56" fill="none">
          <path d={SIGNATURE_PATH} stroke="currentColor" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <p className="pl-label label text-ink-soft">Washington, DC • MD • VA</p>
      </div>
    </div>
  );
}
