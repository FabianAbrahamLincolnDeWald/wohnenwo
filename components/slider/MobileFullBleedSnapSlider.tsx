"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type SliderHandle = { next: () => void; prev: () => void };

type SliderProps = {
  children: React.ReactNode[];
  /** Innen-Padding links/rechts im Scroller, damit die erste Karte exakt unter dem Titel startet */
  scrollerPaddingX?: number; // default 16
};

const BTN_CLS =
  "h-10 w-10 rounded-full border border-slate-300 flex items-center justify-center " +
  "bg-white/80 backdrop-blur hover:bg-white hover:shadow-md hover:border-slate-300 " +
  "active:scale-[0.98] disabled:opacity-35 disabled:cursor-default " +
  "transition duration-200 ease-[cubic-bezier(.2,.8,.2,1)] cursor-pointer";

const MobileFullBleedSnapSlider = React.forwardRef<SliderHandle, SliderProps>(
  function MobileFullBleedSnapSlider({ children, scrollerPaddingX = 16 }, ref) {
    const items = React.Children.toArray(children);
    const scrollerRef = React.useRef<HTMLDivElement | null>(null);
    const [index, setIndex] = React.useState(0);
    const isProgrammaticRef = React.useRef(false);
    const animTimerRef = React.useRef<number | null>(null);

    const sidePad = `calc((100vw - min(100vw, 72rem)) / 2 + ${scrollerPaddingX}px)`;

    const getPadLeft = React.useCallback(() => {
      const s = scrollerRef.current;
      if (!s) return 0;
      const cs = getComputedStyle(s);
      const pad = parseFloat(cs.paddingLeft || "0");
      return Number.isFinite(pad) ? pad : 0;
    }, []);

    React.useEffect(() => {
      const s = scrollerRef.current;
      if (!s) return;

      const onScroll = () => {
        if (isProgrammaticRef.current) return;
        const kids = Array.from(s.children) as HTMLElement[];
        if (!kids.length) return;
        const padL = getPadLeft();
        const sl = s.scrollLeft;
        let nearest = 0;
        let min = Infinity;
        for (let i = 0; i < kids.length; i++) {
          const target = Math.max(0, kids[i].offsetLeft - padL);
          const d = Math.abs(target - sl);
          if (d < min) { min = d; nearest = i; }
        }
        setIndex(nearest);
      };

      s.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => s.removeEventListener("scroll", onScroll);
    }, [getPadLeft]);

    React.useEffect(() => () => {
      if (animTimerRef.current) window.clearTimeout(animTimerRef.current);
    }, []);

    const scrollToIndex = (i: number) => {
      const s = scrollerRef.current;
      if (!s) return;
      const kids = Array.from(s.children) as HTMLElement[];
      const k = kids[i];
      if (!k) return;
      const padL = getPadLeft();
      const left = Math.max(0, k.offsetLeft - padL);

      if (animTimerRef.current) {
        window.clearTimeout(animTimerRef.current);
        animTimerRef.current = null;
      }
      isProgrammaticRef.current = true;
      s.scrollTo({ left, behavior: "smooth" });
      animTimerRef.current = window.setTimeout(() => {
        isProgrammaticRef.current = false;
      }, 380);
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

    React.useImperativeHandle(ref, () => ({ next, prev }), [index, items.length]);

    return (
      <section className="relative w-full overflow-visible" suppressHydrationWarning>
        {/* Full-bleed Wrapper */}
        <div
          className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-visible
                     [--slider-gap:16px] md:[--slider-gap:24px]
                     [--y-gap:16px] [--lift:44px]"
          style={{ paddingLeft: 0, paddingRight: 0 } as React.CSSProperties}
          suppressHydrationWarning
        >
          {/* Scroller */}
          <div
            ref={scrollerRef}
            className="flex flex-nowrap snap-x snap-mandatory overflow-x-auto overflow-y-visible
                       [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                       py-[var(--y-gap)] mt-[var(--y-gap)]
                       pb-[var(--lift)] -mb-[var(--lift)] pt-[var(--lift)] -mt-[var(--lift)]"
            style={{
              gap: "var(--slider-gap)",
              paddingLeft: sidePad,
              paddingRight: sidePad,
              scrollPaddingLeft: sidePad,
              scrollPaddingRight: sidePad,
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x",
            } as React.CSSProperties}
            suppressHydrationWarning
          >
            {items.map((child, i) => (
              <div
                key={i}
                className="snap-start shrink-0 overflow-visible will-change-transform"
                style={{ width: "max-content" }}
              >
                <div className="relative overflow-visible transform-gpu">{child}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-6xl mx-auto px-4 md:px-24 flex items-center gap-2 justify-end mt-[var(--y-gap)] pb-[var(--y-gap)]" suppressHydrationWarning>
          <button type="button" aria-label="Zurück" onClick={prev} disabled={index === 0} className={BTN_CLS}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Weiter" onClick={next} disabled={index === items.length - 1} className={BTN_CLS}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    );
  }
);

MobileFullBleedSnapSlider.displayName = "MobileFullBleedSnapSlider";
export default MobileFullBleedSnapSlider;
