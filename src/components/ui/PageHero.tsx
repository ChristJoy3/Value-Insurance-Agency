import Link from "next/link";
import type { ReactNode } from "react";
import { RevealText } from "./RevealText";
import { SignatureLine } from "./SignatureLine";
import { DrawLine } from "./DrawLine";

type Crumb = { label: string; href?: string };

/** Shared inner-page hero: breadcrumb "document header", huge serif title, signature. */
export function PageHero({
  crumbs,
  title,
  kicker,
  aside,
  children,
}: {
  crumbs: Crumb[];
  title: ReactNode;
  kicker?: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden pt-28 md:pt-36">
      <div aria-hidden className="ledger absolute inset-0 -z-10 opacity-50" />
      <div className="shell">
        <nav aria-label="Breadcrumb" className="label text-ink-faint">
          <ol className="flex flex-wrap items-center gap-2">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                {c.href ? (
                  <Link href={c.href} className="pen-link text-ink-soft">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <span aria-hidden>/</span>}
              </li>
            ))}
          </ol>
        </nav>
        <DrawLine className="mt-4 opacity-30!" />
        <div className="grid gap-10 pb-14 pt-12 md:grid-cols-[1fr_auto] md:items-end md:pb-20 md:pt-16">
          <div>
            {kicker && <p className="label mb-6 text-ink-soft">{kicker}</p>}
            <RevealText as="h1" type="chars" animateOnMobile={false} className="max-w-[16ch] text-h1">
              {title}
            </RevealText>
            <SignatureLine delay={0.6} className="mt-4 w-[min(420px,75vw)] text-ink" />
            {children}
          </div>
          {aside}
        </div>
      </div>
    </header>
  );
}
