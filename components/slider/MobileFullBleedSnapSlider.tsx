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

    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const scrollerRef = React.useRef<HTMLDivElement | null>(null);

    const [index, setIndex] = React.useState(0);

    // NEW: robust nav state (fixes "extra click until disabled")
    const [canScroll, setCanScroll] = React.useState(true);
    const [atStart, setAtStart] = React.useState(true);
    const [atEnd, setAtEnd] = React.useState(false);

    const isProgrammaticRef = React.useRef(false);
    const animTimerRef = React.useRef<number | null>(null);

    // SSR-stabile Initialwerte per CSS-Var; echte calc(...) erst NACH Mount setzen
    React.useEffect(() => {
      const el = wrapperRef.current;
      if (!el) return;

      const applySidePad = () => {
        const calcExpr = `calc((100vw - min(100vw, 72rem)) / 2 + ${scrollerPaddingX}px)`;
        el.style.setProperty("--side-pad", calcExpr);
      };

      applySidePad();

      let raf = 0;
      const onResize = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(applySidePad);
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(raf);
      };
    }, [scrollerPaddingX]);

    const getPadLeft = React.useCallback(() => {
      const s = scrollerRef.current;
      if (!s) return 0;
      const cs = getComputedStyle(s);
      const pad = parseFloat(cs.paddingLeft || "0");
      return Number.isFinite(pad) ? pad : 0;
    }, []);

    // NEW: measure edges + whether we can scroll (tolerance for subpixels)
    const measure = React.useCallback(() => {
      const s = scrollerRef.current;
      if (!s) return;

      const max = Math.max(0, s.scrollWidth - s.clientWidth);
      const x = s.scrollLeft;

      // if content doesn't exceed viewport, treat as static
      const can = max > 2;
      setCanScroll(can);

      // tolerance avoids "one extra click" due to rounding/paddingRight
      setAtStart(x <= 2);
      setAtEnd(x >= max - 2);

      // clamp stale index if items change
      if (items.length === 0) {
        setIndex(0);
      } else if (index > items.length - 1) {
        setIndex(items.length - 1);
      }
    }, [index, items.length]);

    // Index-Erkennung beim nativen Scrollen (edges IMMER messen)
    React.useEffect(() => {
      const s = scrollerRef.current;
      if (!s) return;

      const onScroll = () => {
        // ALWAYS update edge state (even for programmatic scroll)
        measure();

        // only compute nearest index for user-driven scrolling
        if (isProgrammaticRef.current) return;

        const kids = Array.from(s.children) as HTMLElement[];
        if (!kids.length) return;

        const padL = getPadLeft();
        const sl = s.scrollLeft;

        let nearest = 0;
        let min = Infinity;
        for (let i = 0; i < kids.length; i++) {
          const k = kids[i];
          const target = Math.max(0, (k?.offsetLeft ?? 0) - padL);
          const d = Math.abs(target - sl);
          if (d < min) {
            min = d;
            nearest = i;
          }
        }
        setIndex(nearest);
      };

      s.addEventListener("scroll", onScroll, { passive: true });
      // initial
      onScroll();

      return () => s.removeEventListener("scroll", onScroll);
    }, [getPadLeft, measure]);

    // NEW: keep canScroll/edges correct when layout or images load (ResizeObserver)
    React.useEffect(() => {
      const s = scrollerRef.current;
      if (!s) return;

      const ro = new ResizeObserver(() => {
        // rAF avoids layout thrash
        requestAnimationFrame(() => measure());
      });
      ro.observe(s);

      // also observe wrapper (full-bleed layout changes)
      if (wrapperRef.current) ro.observe(wrapperRef.current);

      // run once after mount
      measure();

      return () => ro.disconnect();
    }, [measure]);

    React.useEffect(
      () => () => {
        if (animTimerRef.current) window.clearTimeout(animTimerRef.current);
      },
      []
    );

    // Programmatisches Scrollen (Padding + max clamp berücksichtigen)
    const scrollToIndex = (i: number) => {
      const s = scrollerRef.current;
      if (!s) return;

      const kids = Array.from(s.children) as HTMLElement[];
      const k = kids[i];
      if (!k) return;

      const padL = getPadLeft();
      const max = Math.max(0, s.scrollWidth - s.clientWidth);

      const rawLeft = Math.max(0, (k?.offsetLeft ?? 0) - padL);
      const left = Math.min(max, rawLeft); // IMPORTANT: clamp to max

      if (animTimerRef.current) {
        window.clearTimeout(animTimerRef.current);
        animTimerRef.current = null;
      }

      isProgrammaticRef.current = true;
      s.scrollTo({ left, behavior: "smooth" });

      // allow snap/scroll settle; edges still update via onScroll (we don't block measure)
      animTimerRef.current = window.setTimeout(() => {
        isProgrammaticRef.current = false;
        // final measure in case scroll event is throttled
        measure();
      }, 420);
    };

    const next = () => {
      if (!canScroll) return;
      const i = Math.min(index + 1, items.length - 1);
      scrollToIndex(i);
      setIndex(i);
    };

    const prev = () => {
      if (!canScroll) return;
      const i = Math.max(index - 1, 0);
      scrollToIndex(i);
      setIndex(i);
    };

    React.useImperativeHandle(ref, () => ({ next, prev }), [index, items.length, canScroll]);

    return (
      <section className="relative w-full overflow-visible">
        {/* Full-bleed Wrapper */}
        <div
          ref={wrapperRef}
          className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-visible
                     [--slider-gap:16px] md:[--slider-gap:24px]
                     [--y-gap:16px] [--lift:44px]"
          style={{ ["--side-pad" as any]: `${scrollerPaddingX}px` } as React.CSSProperties}
        >
          {/* Scroll-Container: overflow, Snap & Padding */}
          <div
            ref={scrollerRef}
            className="flex flex-nowrap snap-x snap-mandatory overflow-x-auto overflow-y-visible
                       [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                       py-[var(--y-gap)] mt-[var(--y-gap)]
                       pb-[var(--lift)] -mb-[var(--lift)] pt-[var(--lift)] -mt-[var(--lift)]"
            style={
              {
                gap: "var(--slider-gap)",
                paddingLeft: "var(--side-pad)",
                paddingRight: "var(--side-pad)",
                scrollPaddingLeft: "var(--side-pad)",
                scrollPaddingRight: "var(--side-pad)",
                WebkitOverflowScrolling: "touch",
              } as React.CSSProperties
            }
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

        {/* Navigation (space stays constant even when slider becomes static) */}
        <div className="max-w-6xl mx-auto px-4 md:px-24 flex items-center gap-2 justify-end mt-[44px] pb-[44px]">
          {canScroll ? (
            <>
              <button
                type="button"
                aria-label="Zurück"
                onClick={prev}
                disabled={atStart}
                className={BTN_CLS}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                aria-label="Weiter"
                onClick={next}
                disabled={atEnd}
                className={BTN_CLS}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : (
            // Placeholder: keeps vertical height identical (prevents next section "jump")
            <div aria-hidden className="h-10 w-[84px]" />
          )}
        </div>
      </section>
    );
  }
);

MobileFullBleedSnapSlider.displayName = "MobileFullBleedSnapSlider";
export default MobileFullBleedSnapSlider;
