"use client";
/**
 * 07 How It Works — four steps joined by one line that draws as you scroll
 * (horizontal on desktop, vertical on tablet/mobile). Generic, accurate copy.
 */
import { useRef } from "react";
import { howItWorks } from "@/data/content";
import { gsap } from "@/lib/gsap";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { MQ } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  useIdleGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(".hiw-line", {
          scaleX: () => (window.matchMedia(MQ.desktop).matches ? 0 : 1),
          scaleY: () => (window.matchMedia(MQ.desktop).matches ? 1 : 0),
          transformOrigin: "left top",
          ease: "none",
          scrollTrigger: { trigger: ".hiw-steps", start: "top 75%", end: "bottom 60%", scrub: 0.6, invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>(".hiw-step").forEach((step) => {
          gsap
            .timeline({ scrollTrigger: { trigger: step, start: "top 78%" } })
            .from(step.querySelector(".hiw-dot"), { scale: 0, duration: 0.6, ease: "back.out(2.5)" })
            .from(step.querySelectorAll(".hiw-rise"), { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, "-=0.3");
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="how-it-works" tabIndex={-1} aria-labelledby="hiw-title" className="py-24 outline-none md:py-32">
      <div className="shell">
        <SectionLabel n="06" title="How it works" aside="Four steps" />
        <RevealText as="h2" id="hiw-title" className="mt-10 max-w-[18ch] text-h2">
          From your first call to the <mark className="hl bg-transparent text-inherit">right</mark>{" "}
          <span className="whitespace-nowrap">
            <mark className="hl bg-transparent text-inherit">policy</mark>.
          </span>
        </RevealText>

        <ol className="hiw-steps relative mt-16 grid gap-12 pl-10 md:mt-20 xl:grid-cols-4 xl:gap-10 xl:pl-0 xl:pt-14">
          {/* connecting line: vertical below xl, horizontal at xl */}
          <span aria-hidden className="hiw-line absolute bottom-2 left-[7px] top-2 w-px bg-ink xl:bottom-auto xl:left-0 xl:right-0 xl:top-[7px] xl:h-px xl:w-auto" />
          {howItWorks.map((s, i) => (
            <li key={s.title} className="hiw-step relative">
              <span aria-hidden className="hiw-dot absolute -left-10 top-1 size-[15px] rounded-full border border-ink bg-paper xl:-top-14 xl:left-0">
                <span className="absolute inset-[4px] rounded-full bg-aqua" />
              </span>
              <p className="hiw-rise label text-ink-faint">Step {String(i + 1).padStart(2, "0")}</p>
              <h3 className="hiw-rise mt-3 text-h3">{s.title}</h3>
              <p className="hiw-rise mt-3 max-w-[34ch] text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
