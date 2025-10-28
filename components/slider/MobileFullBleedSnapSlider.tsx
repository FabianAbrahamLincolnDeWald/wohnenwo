"use client";

import * as React from "react";

export type SliderHandle = { next: () => void; prev: () => void };

type SliderProps = {
  children: React.ReactNode[] | React.ReactNode;
  /** horizontaler Innenabstand (px) der Scroller-Edges, Default 16 */
  scrollerPaddingX?: number;
};

const MobileFullBleedSnapSlider = React.forwardRef<SliderHandle, SliderProps>(
  function MobileFullBleedSnapSlider(
    { children, scrollerPaddingX = 16 },
    ref
  ) {
    const items = React.Children.toArray(children) as React.ReactNode[];
    const scrollerRef = React.useRef<HTMLUListElement>(null);
    const [index, setIndex] = React.useState(0);
    const isProgrammaticRef = React.useRef(false);
    const animTimerRef = React.useRef<number | null>(null);

    const getPadLeft = React.useCallback((): number => {
      const el = scrollerRef.current;
      if (!el) return 0;
      const cs = getComputedStyle(el);
      const pad = parseFloat(cs.paddingLeft || "0");
      return Number.isFinite(pad) ? pad : 0;
    }, []);

    // Scroll -> aktiven Index bestimmen (strict-safe)
    React.useEffect(() => {
      const el = scrollerRef.current;
      if (!el) return;

      const onScroll = () => {
        if (isProgrammaticRef.current) return;
        const el2 = scrollerRef.current;
        if (!el2) return;

        const padL = getPadLeft();
        const kids = Array.from(el2.children) as HTMLElement[];
        if (!kids.length) return;

        const sl = el2.scrollLeft;
        let nearest = 0;
        let min = Infinity;

        for (let i = 0; i < kids.length; i++) {
          const li = kids[i];
          if (!li) continue; // TS strict guard
          const target = Math.max(0, li.offsetLeft - padL);
          const d = Math.abs(target - sl);
          if (d < min) {
            min = d;
            nearest = i;
          }
        }
        setIndex(nearest);
      };

      el.addEventListener("scroll", onScroll, { passive: true });
      // initial bestimmen
      onScroll();

      return () => el.removeEventListener("scroll", onScroll);
    }, [getPadLeft]);

    // Timer aufräumen
    React.useEffect(
      () => () => {
        if (animTimerRef.current) window.clearTimeout(animTimerRef.current);
      },
      []
    );

    const scrollToIndex = (i: number) => {
      const el = scrollerRef.current;
      if (!el) return;

      const li = el.children[i] as HTMLElement | undefined;
      if (!li) return;

      const padL = getPadLeft();
      const left = Math.max(0, li.offsetLeft - padL);

      if (animTimerRef.current) {
        window.clearTimeout(animTimerRef.current);
        animTimerRef.current = null;
      }

      isProgrammaticRef.current = true;
      el.scrollTo({ left, behavior: "smooth" });
      animTimerRef.current = window.setTimeout(() => {
        isProgrammaticRef.current = false;
      }, 350);
    };

    const next = () => {
      const i = Math.min(index + 1, items.length - 1);
      scrollToIndex(i);
      setIndex(i);
    };
    const prev = () => {
      const i = Math.max(index - 1, 0);
      scrollToIndex(i);
      setIndex(i);
    };

    React.useImperativeHandle(ref, () => ({ next, prev }), [index, items.length, getPadLeft]);

    return (
      <section className="w-full">
        <div className="relative w-full">
          <ul
            ref={scrollerRef}
            role="list"
            className="flex flex-nowrap snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-6 py-[2px] mt-[var(--y-gap)] [--gap:16px] md:[--gap:24px] pl-[calc((100vw-min(100vw,72rem))/2+16px)] pr-[calc((100vw-min(100vw,72rem))/2+16px)]"
            style={
              {
                gap: "var(--gap)",
                scrollPaddingLeft: `calc((100vw - min(100vw, 72rem))/2 + ${scrollerPaddingX}px)`,
                scrollPaddingRight: `calc((100vw - min(100vw, 72rem))/2 + ${scrollerPaddingX}px)`,
              } as React.CSSProperties
            }
          >
            {items.map((child, i) => (
              <li
                key={i}
                className="snap-start shrink-0"
                style={{ width: "max-content" }}
              >
                {child}
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
);

MobileFullBleedSnapSlider.displayName = "MobileFullBleedSnapSlider";
export default MobileFullBleedSnapSlider;
