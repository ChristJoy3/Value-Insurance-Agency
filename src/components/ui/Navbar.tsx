"use client";
/**
 * Minimal sticky navbar: hides on scroll down, returns on scroll up.
 * Gains a paper background + hairline once the page has scrolled.
 */
import Link from "next/link";
import { useState } from "react";
import { useLenis } from "lenis/react";
import { agency } from "@/data/content";
import { navLinks } from "@/lib/routes";
import { Logo } from "./Logo";
import { AnchorLink } from "./AnchorLink";
import { MenuOverlay } from "./MenuOverlay";

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useLenis(({ scroll, direction }) => {
    setScrolled(scroll > 24);
    if (scroll < 120) setHidden(false);
    else if (direction === 1) setHidden(true);
    else if (direction === -1) setHidden(false);
  });

  return (
    <>
      <a href="#main" className="label sr-only z-[110] bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-700 ease-[var(--ease-expo)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${scrolled ? "bg-paper shadow-[0_1px_0_var(--color-rule)]" : "bg-transparent"}`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="shell flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
          <Link href="/" aria-label="Value Insurance Agency Inc. — home" className="shrink-0 py-2">
            <Logo width={150} priority className="md:w-[168px]!" />
          </Link>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-8">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <AnchorLink href={l.href} className="pen-link text-[0.9375rem] font-medium">
                    {l.label}
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a href={agency.phone.href} className="label pen-link hidden md:inline-block xl:hidden">
              {agency.phone.display}
            </a>
            <a href={agency.quoteUrl} target="_blank" rel="noopener" className="btn btn-ink hidden min-h-11! px-5! text-[0.9375rem]! md:inline-flex">
              Get a Free Quote
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group flex min-h-11 min-w-11 items-center justify-center gap-3 rounded-full px-2"
            >
              <span className="label hidden sm:inline">Menu</span>
              <span aria-hidden className="flex w-7 flex-col gap-[7px]">
                <span className="h-px w-full bg-ink transition-transform duration-500 group-hover:scale-x-75 origin-right" />
                <span className="h-px w-full bg-ink" />
              </span>
              <span className="sr-only sm:hidden">Open menu</span>
            </button>
          </div>
        </div>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
