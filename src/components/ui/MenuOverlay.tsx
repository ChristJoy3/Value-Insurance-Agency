"use client";
/**
 * Fullscreen menu: ink sheet that wipes down, big serif links stagger in.
 * Accessible: dialog semantics, focus trap, Esc to close, focus restored,
 * background scroll locked (Lenis stopped + html overflow hidden).
 * One-thumb on phones: the CTAs sit at the bottom of the sheet.
 */
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { agency, coverages } from "@/data/content";
import { routes, sections } from "@/lib/routes";
import { AnchorLink } from "./AnchorLink";
import { LogoChip } from "./Logo";

const PRIMARY = [
  { label: "Coverage index", href: sections.coverage, n: "01" },
  { label: "Why independent", href: sections.independent, n: "02" },
  { label: "Meet Arthur Lander", href: sections.about, n: "03" },
  { label: "How it works", href: sections.process, n: "04" },
  { label: "Resources", href: sections.resources, n: "05" },
  { label: "Contact", href: sections.contact, n: "06" },
];

export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      tl.current = gsap
        .timeline({ paused: true })
        .set(ref.current, { visibility: "visible" })
        .fromTo(ref.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: reduced ? 0.01 : 0.9, ease: "expo.inOut" })
        .from(".menu-item", { yPercent: 110, duration: reduced ? 0.01 : 1, stagger: 0.06, ease: "expo.out" }, "-=0.35")
        .from(".menu-fade", { opacity: 0, y: 12, duration: reduced ? 0.01 : 0.8, stagger: 0.05 }, "<0.2");
    },
    { scope: ref },
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    const html = document.documentElement;
    if (open) {
      lastFocus.current = document.activeElement as HTMLElement;
      lenis?.stop();
      html.style.overflow = "hidden";
      t.timeScale(1).play();
      requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus());
    } else if (t.progress() > 0) {
      t.timeScale(1.6).reverse();
      lenis?.start();
      html.style.overflow = "";
      lastFocus.current?.focus?.();
    }
  }, [open, lenis]);

  // Esc + focus trap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !ref.current) return;
      const f = ref.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={ref}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
      className="on-ink invisible fixed inset-0 z-[80] flex flex-col bg-ink text-paper"
      style={{ clipPath: "inset(0 0 100% 0)" }}
    >
      <div className="shell flex h-16 shrink-0 items-center justify-between md:h-[4.5rem]" style={{ marginTop: "env(safe-area-inset-top)" }}>
        <Link href="/" onClick={onClose} aria-label="Home" className="menu-fade">
          <LogoChip width={128} className="px-3! py-2!" />
        </Link>
        <button type="button" onClick={onClose} data-autofocus className="menu-fade flex min-h-11 min-w-11 items-center gap-3 px-2">
          <span className="label">Close</span>
          <span aria-hidden className="relative block size-6">
            <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-paper" />
            <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-paper" />
          </span>
        </button>
      </div>

      <div className="shell grid min-h-0 flex-1 gap-10 overflow-y-auto py-8 xl:grid-cols-[1.4fr_1fr] xl:py-14" data-lenis-prevent>
        <nav aria-label="Menu">
          <ul className="space-y-1 md:space-y-2">
            {PRIMARY.map((l) => (
              <li key={l.href} className="overflow-hidden border-b border-paper-rule">
                <AnchorLink href={l.href} onClick={onClose} className="menu-item group flex items-baseline gap-4 py-3 md:gap-6">
                  <span className="label text-paper-soft">{l.n}</span>
                  <span className="font-serif text-[clamp(2rem,1.2rem+3.4vw,4.25rem)] leading-[1.05] tracking-[-0.02em] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3">
                    {l.label}
                  </span>
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu-fade hidden xl:block">
          <p className="label mb-5 text-paper-soft">16 lines of coverage</p>
          <ul className="columns-2 gap-8 text-[0.9375rem] leading-8">
            {coverages.map((c) => (
              <li key={c.slug}>
                <Link href={routes.coverage(c.slug)} onClick={onClose} className="pen-link">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 space-y-1 text-paper-soft">
            <p>{agency.address.street}, {agency.address.city}, {agency.address.region} {agency.address.postalCode}</p>
            <p className="label">Licensed in {agency.licensedInShort.join(" • ")}</p>
          </div>
        </div>
      </div>

      <div className="shell menu-fade grid shrink-0 grid-cols-2 gap-3 border-t border-paper-rule py-4 md:flex md:justify-end" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        <a href={agency.quoteUrl} target="_blank" rel="noopener" className="btn btn-aqua">Get a Free Quote</a>
        <a href={agency.phone.href} className="btn btn-line-paper">Call {agency.phone.display}</a>
      </div>
    </div>
  );
}
