"use client";
/**
 * Masked line reveal (SplitText). Character stagger is reserved for big
 * headlines on desktop; tablet/mobile always get the lighter line reveal.
 * Any `.hl` marks inside are swept in right after the lines land
 * ("review" step). Re-splits on resize/font load without replaying.
 * Splitting is lazy: it happens only as the element nears the viewport, so
 * page load doesn't pay for every headline below the fold.
 */
import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, ScrollTrigger } from "@/lib/gsap";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { MQ, ENTER } from "@/lib/motion";
import { hlSizes } from "@/lib/highlight";
import { whenPreloaderDone } from "@/lib/preloader";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  /** "chars" only applies ≥1280px */
  type?: "lines" | "chars";
  delay?: number;
  /** wait for the homepage preloader instead of a scroll trigger */
  afterPreloader?: boolean;
  /** false: render statically on phones (use for the page's LCP heading) */
  animateOnMobile?: boolean;
  start?: string;
};

export function RevealText({
  as: Tag = "div",
  children,
  className,
  id,
  type = "lines",
  delay = 0,
  afterPreloader = false,
  animateOnMobile = true,
  start = ENTER,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useIdleGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile, motion: MQ.motion }, (ctx) => {
        const { desktop, mobile, motion } = ctx.conditions as Record<string, boolean>;
        if (!motion || (mobile && !animateOnMobile)) return;
        const chars = type === "chars" && desktop;
        let played = false;
        let trigger: ScrollTrigger | undefined;
        let unsubscribe = () => {};
        let armed = false;
        const isHeading = /^H[1-6]$/.test(el.tagName);

        const arm = () => {
          if (armed) return;
          armed = true;
          ctx.add(() =>
            SplitText.create(el, {
              // words keep characters together so lines only break between words
              type: chars ? "lines,words,chars" : "lines,words",
              mask: "lines",
              // aria-label is only valid on headings; other elements keep their real text readable
              aria: isHeading ? "auto" : "none",
              autoSplit: true,
              onSplit(self) {
                if (played) return;
                const tl = gsap.timeline({ paused: true, delay, onComplete: () => void (played = true) });
                tl.from(chars ? self.chars : self.lines, {
                  yPercent: 115,
                  duration: chars ? 1.25 : 1.3,
                  stagger: chars ? 0.016 : 0.1,
                  ease: "expo.out",
                });
                const marks = el.querySelectorAll(".hl");
                if (marks.length) {
                  const { from, to } = hlSizes(marks[0]);
                  tl.fromTo(marks, { backgroundSize: from }, { backgroundSize: to, duration: 1, ease: "power2.inOut", stagger: 0.12 }, "-=0.55");
                }
                trigger?.kill();
                unsubscribe();
                if (afterPreloader) unsubscribe = whenPreloaderDone(() => tl.play());
                else trigger = ScrollTrigger.create({ trigger: el, start, onEnter: () => tl.play() });
                return tl;
              },
            }),
          );
        };

        let lazy: ScrollTrigger | undefined;
        if (afterPreloader) arm();
        else
          lazy = ScrollTrigger.create({
            trigger: el,
            start: "top bottom+=60%",
            // deferred a frame: never create triggers from inside another trigger's refresh
            onEnter: () => requestAnimationFrame(arm),
          });
        return () => {
          lazy?.kill();
          trigger?.kill();
          unsubscribe();
        };
      });
      return () => mm.revert();
    },
    { immediate: afterPreloader, scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
