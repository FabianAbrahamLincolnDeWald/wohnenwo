"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type SliderHandle = { next: () => void; prev: () => void };

type SliderProps = {
  children: React.ReactNode[] | React.ReactNode;
  /** linker/rechter Innenabstand der Scroller-Padding-Zone (px) */
  scrollerPaddingX?: number; // default 16
  /** vertikale Lücke über/unter dem Slider (CSS var --y-gap) */
  yGapPx?: number; // default 16 (mobil), 24 (md)
  className?: string;
};

const MobileFullBleedSnapSlider = React.forwardRef<SliderHandle, SliderProps>(
  function MobileFullBleedSnapSlider(
    { children, scrollerPaddingX = 16, yGapPx = 16, className },
    ref
  ) {
    const items = React.Children.toArray(children) as React.ReactNode[];
    const scrollerRef = React.useRef<HTMLUListElement>(null);
    const [index, setIndex] = React.useState(0);
    const isProgrammaticRef = React.useRef(false);
    const animTimerRef = React.useRef<number | null>(null);

    const getPadLeft = React.useCallback(() => {
      const el = scrollerRef.current;
      if (!el) return 0;
      const cs = getComputedStyle(el);
      const pad = parseFloat(cs.paddingLeft || "0");
      return Number.isFinite(pad) ? pad : 0;
    }, []);

    React.useEffect(() => {
      const el = scrollerRef.current;
      if (!el) return;

      const onScroll = () => {
        if (isProgrammaticRef.current) return;
        const sc = scrollerRef.current;
        if (!sc) return;
        const padL = getPadLeft();
        const kids = Array.from(sc.children) as HTMLElement[];
        if (!kids.length) return;
        const sl = sc.scrollLeft;
        let nearest = 0;
        let min = Infinity;
        for (let i = 0; i < kids.length; i++) {
          const target = Math.max(0, kids[i].offsetLeft - padL);
          const d = Math.abs(target - sl);
          if (d < min) {
            min = d;
            nearest = i;
          }
        }
        setIndex(nearest);
      };

      el.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => el.removeEventListener("scroll", onScroll);
    }, [getPadLeft]);

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

    React.useImperativeHandle(ref, () => ({ next, prev }), [index]);

    return (
      <section
        className={["w-full", className].filter(Boolean).join(" ")}
        style={
          {
            ["--y-gap" as any]: `${yGapPx}px`,
          } as React.CSSProperties
        }
      >
        <div className="relative w-full">
          <ul
            ref={scrollerRef}
            role="list"
            className="flex flex-nowrap snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-6 py-[2px] mt-[var(--y-gap)] [--gap:16px] md:[--gap:24px] pl-[calc((100vw-min(100vw,72rem))/2+16px)] pr-[calc((100vw-min(100vw,72rem))/2+16px)]"
            style={
              {
                gap: `var(--gap)`,
                scrollPaddingLeft: `calc((100vw - min(100vw, 72rem))/2 + ${scrollerPaddingX}px)`,
                scrollPaddingRight: `calc((100vw - min(100vw, 72rem))/2 + ${scrollerPaddingX}px)`,
              } as React.CSSProperties
            }
          >
            {items.map((child, i) => (
              <li key={i} className="snap-start shrink-0" style={{ width: "max-content" }}>
                {child}
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-24 flex items-center gap-2 justify-end mt-[var(--y-gap)] pb-2">
          <button
            type="button"
            aria-label="Zurück"
            onClick={prev}
            className="h-10 w-10 rounded-full border border-slate-300 flex items-center justify-center bg-white/80 backdrop-blur hover:bg-white hover:shadow-md hover:border-slate-300 active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed transition duration-200 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none cursor-pointer"
            disabled={index === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Weiter"
            onClick={next}
            className="h-10 w-10 rounded-full border border-slate-300 flex items-center justify-center bg-white/80 backdrop-blur hover:bg-white hover:shadow-md hover:border-slate-300 active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed transition duration-200 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none cursor-pointer"
            disabled={index === items.length - 1}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    );
  }
);

MobileFullBleedSnapSlider.displayName = "MobileFullBleedSnapSlider";
export default MobileFullBleedSnapSlider;
