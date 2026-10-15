"use client";
/**
 * 02 Independent vs Captive — the signature explainer.
 * Left: your business → one line → "1 company". Right: your business fans out
 * to many carriers. Tablet/desktop: pinned and scrubbed with scroll.
 * Mobile: a vertical flow; each diagram draws once as it enters.
 * Copy is the legacy site's independent-agency explanation.
 */
import { useRef } from "react";
import { about } from "@/data/content";
import { gsap } from "@/lib/gsap";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { MQ, ENTER } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SignatureLine } from "@/components/ui/SignatureLine";

const W = 400;
const H = 340;
const ORIGIN = { x: 200, y: 296 };
// carriers sit on a gentle arc; deliberately unnamed (no carriers verified)
const CARRIERS = Array.from({ length: 6 }, (_, i) => {
  const t = i / 5;
  return { x: 36 + t * 328, y: 96 - Math.sin(t * Math.PI) * 40 };
});

function Node({ x, y, label, wide = false, strong = false }: { x: number; y: number; label: string; wide?: boolean; strong?: boolean }) {
  const w = wide ? 132 : 58;
  return (
    <g className="ivc-node" transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-15} width={w} height={30} rx={15} fill={strong ? "var(--color-ink)" : "var(--color-paper)"} stroke="var(--color-ink)" strokeWidth={1} />
      <text textAnchor="middle" dy="0.35em" fill={strong ? "var(--color-paper)" : "var(--color-ink)"} style={{ font: `500 ${wide ? 10 : 8.5}px var(--font-mono)`, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {label}
      </text>
    </g>
  );
}

function curve(to: { x: number; y: number }) {
  const midY = (ORIGIN.y + to.y) / 2;
  return `M${ORIGIN.x} ${ORIGIN.y - 15} C ${ORIGIN.x} ${midY}, ${to.x} ${midY + 30}, ${to.x} ${to.y + 15}`;
}

export function IndependentVsCaptive() {
  const ref = useRef<HTMLElement>(null);

  useIdleGSAP(
    () => {
      const mm = gsap.matchMedia();
      const build = (tl: gsap.core.Timeline) =>
        tl
          .from(".ivc-captive .ivc-path", { drawSVG: "0%", duration: 1, ease: "power2.inOut" })
          .from(".ivc-captive .ivc-node", { scale: 0.6, opacity: 0, transformOrigin: "center", duration: 0.6, stagger: 0.2 }, "<0.1")
          .from(".ivc-captive-copy", { opacity: 0, y: 20, duration: 0.8 }, "<0.3")
          .from(".ivc-indep .ivc-path", { drawSVG: "0%", duration: 1.4, stagger: 0.08, ease: "power2.inOut" }, "+=0.2")
          .from(".ivc-indep .ivc-node", { scale: 0.6, opacity: 0, duration: 0.6, stagger: 0.06, ease: "back.out(2)" }, "<0.5")
          .from(".ivc-indep-copy", { opacity: 0, y: 20, duration: 0.8 }, "<0.3")
          .from(".ivc-final", { opacity: 0, y: 30, duration: 1 }, "+=0.1");

      // pin only where the whole diagram fits on screen (tablet portrait/desktop)
      mm.add({ big: `${MQ.notMobile} and (min-height: 700px)`, motion: MQ.motion }, (ctx) => {
        const { big, motion } = ctx.conditions as Record<string, boolean>;
        if (!motion) return;
        if (big) {
          build(
            gsap.timeline({
              defaults: { ease: "expo.out" },
              scrollTrigger: { trigger: ".ivc-pin", start: "top top+=72", end: "+=140%", pin: true, scrub: 0.8, anticipatePin: 1 },
            }),
          );
        } else {
          // mobile: two short timelines, no pinning
          gsap.timeline({ scrollTrigger: { trigger: ".ivc-captive", start: ENTER } })
            .from(".ivc-captive .ivc-path", { drawSVG: "0%", duration: 1, ease: "power2.inOut" })
            .from(".ivc-captive .ivc-node", { opacity: 0, duration: 0.5, stagger: 0.15 }, "<0.2");
          gsap.timeline({ scrollTrigger: { trigger: ".ivc-indep", start: ENTER } })
            .from(".ivc-indep .ivc-path", { drawSVG: "0%", duration: 1.2, stagger: 0.06, ease: "power2.inOut" })
            .from(".ivc-indep .ivc-node", { opacity: 0, duration: 0.5, stagger: 0.05 }, "<0.4");
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="independent" tabIndex={-1} aria-labelledby="ivc-title" className="relative py-20 outline-none md:py-0">
      <div className="ivc-pin shell flex min-h-[calc(100svh-72px)] flex-col justify-center md:py-12">
        <SectionLabel n="02" title="Independent vs. captive" />
        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-[1fr_auto] md:items-end">
          <h2 id="ivc-title" className="max-w-[18ch] text-h2">
            One company, or a <mark className="hl bg-transparent text-inherit">choice</mark> of many.
          </h2>
          <p className="label max-w-[34ch] text-ink-soft">{about.whatIsIndependent.heading}</p>
        </div>

        <div className="mt-8 grid gap-12 md:mt-8 md:grid-cols-2 md:gap-0">
          {/* Captive */}
          <figure className="ivc-captive md:border-r md:border-rule md:pr-10">
            <figcaption className="label mb-4 flex justify-between text-ink-soft">
              <span>Captive agent</span>
              <span className="text-ink">1 company</span>
            </figcaption>
            <svg viewBox={`0 0 ${W} ${H}`} className="ivc-svg" role="img" aria-label="A captive agent connects your business to a single insurance company.">
              <path className="ivc-path" d={curve({ x: 200, y: 64 })} stroke="var(--color-ink)" strokeWidth={1.25} fill="none" />
              <Node x={200} y={64} label="1 company" wide />
              <Node x={ORIGIN.x} y={ORIGIN.y} label="Your business" wide strong />
            </svg>
            <p className="ivc-captive-copy mt-4 max-w-[42ch] text-ink-soft">{about.whatIsIndependent.paragraphs[1].split(". ")[0]}.</p>
          </figure>

          {/* Independent */}
          <figure className="ivc-indep md:pl-10">
            <figcaption className="label mb-4 flex justify-between text-ink-soft">
              <span>Independent agent</span>
              <span className="text-ink">Many carriers</span>
            </figcaption>
            <svg viewBox={`0 0 ${W} ${H}`} className="ivc-svg" role="img" aria-label="An independent agent connects your business to many insurance carriers.">
              {CARRIERS.map((c, i) => (
                <path key={i} className="ivc-path" d={curve(c)} stroke="var(--color-ink)" strokeWidth={1.25} fill="none" />
              ))}
              {CARRIERS.map((c, i) => (
                <Node key={i} x={c.x} y={c.y} label="Carrier" />
              ))}
              <Node x={ORIGIN.x} y={ORIGIN.y} label="Your business" wide strong />
            </svg>
            <p className="ivc-indep-copy mt-4 max-w-[46ch] text-ink-soft">{about.whatIsIndependent.paragraphs[0]}</p>
          </figure>
        </div>

        <div className="ivc-final mt-10 md:mt-8">
          <p className="font-serif text-h3">
            <mark className="hl bg-transparent text-inherit">Independent agencies give you choice.</mark>
          </p>
          <SignatureLine className="mt-3 w-[min(340px,70vw)] text-ink" />
        </div>
      </div>
    </section>
  );
}
