"use client";
/**
 * 04 Coverage Index — the 16 coverage lines typeset like a table of contents.
 * Desktop (fine pointer ≥1280): a card follows the cursor, drawing the line
 * icon + one-line summary of the hovered row.
 * Touch / tablet / mobile: each row has a tap-to-expand panel (accessible
 * disclosure) with the summary and a link through.
 */
import Link from "next/link";
import { useRef, useState } from "react";
import { coverages, home } from "@/data/content";
import { routes } from "@/lib/routes";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { MQ } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { LineIcon } from "@/components/ui/LineIcon";
import { RevealText } from "@/components/ui/RevealText";

export function CoverageIndex() {
  const ref = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [openRow, setOpenRow] = useState<number | null>(null);

  useIdleGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // rows "draft" in: rule draws, then number + name rise — one batched trigger for all 16 rows
        const rows = gsap.utils.toArray<HTMLElement>(".ci-row");
        gsap.set(rows.map((r) => r.querySelector(".ci-rule")), { scaleX: 0, transformOrigin: "left center" });
        gsap.set(rows.flatMap((r) => [...r.querySelectorAll(".ci-rise")]), { yPercent: 100, opacity: 0 });
        ScrollTrigger.batch(rows, {
          start: "top 92%",
          onEnter: (batch) =>
            batch.forEach((row, i) =>
              gsap
                .timeline({ delay: i * 0.08 })
                .to(row.querySelector(".ci-rule"), { scaleX: 1, duration: 1.2, ease: "power3.inOut" })
                .to(row.querySelectorAll(".ci-rise"), { yPercent: 0, opacity: 1, duration: 1, stagger: 0.06 }, "-=0.8"),
            ),
        });
      });
      mm.add(`${MQ.finePointer} and ${MQ.desktop} and ${MQ.motion}`, () => {
        const card = preview.current;
        const list = ref.current?.querySelector(".ci-list");
        if (!card || !list) return;
        const xTo = gsap.quickTo(card, "x", { duration: 0.7, ease: "power3.out" });
        const yTo = gsap.quickTo(card, "y", { duration: 0.7, ease: "power3.out" });
        const move = (e: Event) => {
          const p = e as PointerEvent;
          xTo(p.clientX + 28);
          yTo(p.clientY - 90);
        };
        const enter = () => gsap.to(card, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "expo.out" });
        const leave = () => {
          gsap.to(card, { autoAlpha: 0, scale: 0.92, duration: 0.4 });
          setActive(null);
        };
        list.addEventListener("pointermove", move);
        list.addEventListener("pointerenter", enter);
        list.addEventListener("pointerleave", leave);
        return () => {
          list.removeEventListener("pointermove", move);
          list.removeEventListener("pointerenter", enter);
          list.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const current = active !== null ? coverages[active] : null;

  return (
    <section ref={ref} id="coverage" tabIndex={-1} aria-labelledby="coverage-title" className="relative py-24 outline-none md:py-32">
      <div className="shell">
        <SectionLabel n="03" title="Coverage index" aside={`${coverages.length} lines of coverage`} />
        <div className="mt-10 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
          <RevealText as="h2" id="coverage-title" className="text-h2">
            Every business has <mark className="hl bg-transparent text-inherit">different needs.</mark>
          </RevealText>
          <p className="text-lead text-ink-soft">{home.suite}</p>
        </div>

        <ol className="ci-list mt-14 md:mt-20">
          {coverages.map((c, i) => {
            const open = openRow === i;
            const panelId = `ci-panel-${c.slug}`;
            return (
              <li key={c.slug} className="ci-row relative" onPointerEnter={() => setActive(i)}>
                <div className="ci-rule h-px w-full bg-rule" />
                <div className="group flex items-center gap-4 md:gap-8">
                  <Link
                    href={routes.coverage(c.slug)}
                    className="flex min-h-16 flex-1 items-center gap-4 overflow-hidden py-4 md:min-h-24 md:gap-8 md:py-6"
                  >
                    <span className="ci-rise label w-8 shrink-0 text-ink-faint md:w-12">{c.number}</span>
                    <span className="ci-rise font-serif text-[clamp(1.5rem,1rem+2.6vw,3.75rem)] leading-[1.05] tracking-[-0.02em] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3">
                      {c.name}
                    </span>
                    {/* dotted leader + summary (desktop) */}
                    <span aria-hidden className="ci-rise hidden h-px flex-1 border-b border-dotted border-ink-faint xl:block" />
                    <span className="ci-rise hidden max-w-[28ch] text-right text-[0.9375rem] leading-snug text-ink-soft xl:block">{c.summary}</span>
                    <span aria-hidden className="ci-rise hidden text-xl transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-1 md:inline xl:ml-2">→</span>
                  </Link>
                  {/* tap-to-expand toggle: shown below 1280px */}
                  <button
                    type="button"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border border-rule xl:hidden"
                    aria-expanded={open}
                    aria-controls={panelId}
                    aria-label={`${open ? "Hide" : "Show"} summary of ${c.name}`}
                    onClick={() => setOpenRow(open ? null : i)}
                  >
                    <span aria-hidden className={`text-lg leading-none transition-transform duration-500 ${open ? "rotate-45" : ""}`}>+</span>
                  </button>
                </div>
                <div
                  id={panelId}
                  hidden={!open}
                  className="pb-6 pl-12 xl:hidden"
                >
                  <div className="flex items-start gap-4">
                    {open && <LineIcon slug={c.slug} animate="mount" className="size-12 shrink-0 text-ink" />}
                    <div>
                      <p className="text-ink-soft">{c.summary}</p>
                      <Link href={routes.coverage(c.slug)} className="pen-link pen-link-static mt-3 inline-block font-medium">
                        Read about {c.name}
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          <li aria-hidden className="h-px w-full bg-rule" />
        </ol>
      </div>

      {/* cursor-following preview card (desktop fine pointer only) */}
      <div
        ref={preview}
        aria-hidden
        className="coverage-preview pointer-events-none fixed left-0 top-0 z-30 w-64 border border-ink bg-paper p-5 opacity-0"
        style={{ visibility: "hidden" }}
      >
        {current && (
          <>
            <div className="label flex justify-between text-ink-faint">
              <span>{current.number} / 16</span>
              <span>Fine print</span>
            </div>
            <LineIcon slug={current.slug} animate="mount" drawKey={current.slug} className="my-5 size-20 text-ink" strokeWidth={1.25} />
            <p className="text-[0.9375rem] leading-snug">{current.summary}</p>
          </>
        )}
      </div>
    </section>
  );
}
