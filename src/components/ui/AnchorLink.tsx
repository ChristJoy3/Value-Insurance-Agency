"use client";
/**
 * Link to a homepage section ("/#coverage"). On the homepage it scrolls
 * smoothly with Lenis; from any other page it navigates to "/" + hash.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import type { ComponentProps, MouseEvent } from "react";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export function AnchorLink({ href, onClick, ...rest }: Props) {
  const pathname = usePathname();
  const lenis = useLenis();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    const hash = href.slice(href.indexOf("#"));
    if (pathname !== "/" || !hash.startsWith("#") || e.defaultPrevented) return;
    e.preventDefault();
    const target = document.querySelector(hash);
    if (!target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (lenis) lenis.scrollTo(target as HTMLElement, { immediate: reduced, duration: 1.4 }); // offset comes from CSS scroll-padding-top
    else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    history.replaceState(null, "", hash);
    // move keyboard focus to the section for screen-reader / keyboard users
    (target as HTMLElement).focus?.({ preventScroll: true });
  };

  return <Link href={href} onClick={handle} {...rest} />;
}
