"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Fundament Karten – isolierter Karten-Sektor
 *
 * Ersetzt das ursprüngliche Glas-Panel durch fünf Karten
 * unterhalb des Dividers.
 *
 * Desktop (>= lg): 5 Karten im Grid (volle Breite mit gap-4).
 * Tablet/Mobile (< lg): gleicher Inhalt im horizontalen Slider mit Snap.
 */

type FundamentCardData = {
  title: string;
  image: string;
};

const CARD_DATA: FundamentCardData[] = [
  {
    title: "Investoren",
    image: "https://wohnenwo.vercel.app/images/orbit/cards/vi-card-glow.svg",
  },
  {
    title: "Architektur",
    image: "/images/cards/card-2.jpg",
  },
  {
    title: "Karte 3",
    image: "/images/cards/card-3.jpg",
  },
  {
    title: "Karte 4",
    image: "/images/cards/card-4.jpg",
  },
  {
    title: "Karte 5",
    image: "/images/cards/card-5.jpg",
  },
];

const BTN_CLS =
  "h-9 w-9 rounded-full border border-slate-300 flex items-center justify-center " +
  "bg-white/80 backdrop-blur hover:bg-white hover:shadow-md hover:border-slate-300 " +
  "active:scale-[0.98] disabled:opacity-35 disabled:cursor-default " +
  "transition duration-200 ease-[cubic-bezier(.2,.8,.2,1)] cursor-pointer";

type CardSliderProps = {
  children: React.ReactNode[];
};

function CardSlider({ children }: CardSliderProps) {
  const items = React.Children.toArray(children);
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = React.useState(0);
  const isProgrammaticRef = React.useRef(false);
  const animTimerRef = React.useRef<number | null>(null);

  // Index beim nativen Scrollen mitlesen
  React.useEffect(() => {
    const s = scrollerRef.current;
    if (!s) return;

    const onScroll = () => {
      if (isProgrammaticRef.current) return;
      const kids = Array.from(s.children) as HTMLElement[];
      if (!kids.length) return;
      const sl = s.scrollLeft;
      let nearest = 0;
      let min = Infinity;
      for (let i = 0; i < kids.length; i++) {
        const k = kids[i];
        const target = k?.offsetLeft ?? 0;
        const d = Math.abs(target - sl);
        if (d < min) {
          min = d;
          nearest = i;
        }
      }
      setIndex(nearest);
    };

    s.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => s.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    return () => {
      if (animTimerRef.current) window.clearTimeout(animTimerRef.current);
    };
  }, []);

  const scrollToIndex = (i: number) => {
    const s = scrollerRef.current;
    if (!s) return;
    const kids = Array.from(s.children) as HTMLElement[];
    const k = kids[i];
    if (!k) return;
    const left = k.offsetLeft;

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

  return (
    <div className="w-full">
      <div
        ref={scrollerRef}
        className="flex flex-nowrap gap-4 overflow-x-auto overflow-y-visible snap-x snap-mandatory
                   [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-2"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {items.map((child, i) => (
          <div
            key={i}
            className="snap-start shrink-0 overflow-visible will-change-transform"
            style={{ width: "202px" }}
          >
            <div className="relative overflow-visible transform-gpu">{child}</div>
          </div>
        ))}
      </div>

      {/* Navigation unterhalb des Sliders, rechtsbündig */}
      <div className="flex items-center justify-end gap-2 mt-3 pr-1">
        <button
          type="button"
          aria-label="Zurück"
          onClick={prev}
          disabled={index === 0}
          className={BTN_CLS}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Weiter"
          onClick={next}
          disabled={index === items.length - 1}
          className={BTN_CLS}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function FundamentCard({ card }: { card: FundamentCardData }) {
  return (
    <div
      className="relative flex items-center justify-center aspect-square rounded-xl overflow-hidden
      bg-white/12 backdrop-blur-xl border border-white/60 shadow-md
      cursor-pointer transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]
      hover:-translate-y-[2px] active:translate-y-0"
    >
      {/* Hintergrundbild pro Karte */}
      <img
        src={card.image}
        alt={card.title}
        className="absolute inset-0 h-full w-full object-cover -z-10"
      />

      {/* Farbiger Rahmen wie im App-Store-Beispiel */}
      <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-black" />

      {/* Rahmen-Label oben links – nutzt den Karten-Titel */}
      <div className="absolute left-0 top-0">
        <div className="rounded-tl-lg rounded-br-lg bg-black px-2.5 py-1 text-xs font-semibold tracking-wide text-white uppercase">
          {card.title}
        </div>
      </div>
    </div>
  );
}

export default function FundamentKarten() {
  return (
    <section
      aria-label="fundament-karten"
      className="relative z-10 mt-12 md:mt-16 lg:mt-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Divider in Panel-Breite */}
        <div className="h-[2px] w-full bg-black mb-2" />

        {/* kurzer Satz direkt unter dem Divider */}
        <p className="text-sm font-semibold text-slate-900 mb-2">
          Wir stellen vor
        </p>

        {/* Desktop / große Screens: 5 Karten, volle Breite mit gap-4 */}
        <div className="hidden lg:flex gap-4 mt-2">
          {CARD_DATA.map((card) => (
            <div
              key={card.title}
              className="flex-shrink-0"
              style={{ width: "calc((100% - 64px)/5)" }}
            >
              <FundamentCard card={card} />
            </div>
          ))}
        </div>

        {/* Mobile / Tablet: Slider mit Snap-Effekt */}
        <div className="lg:hidden mt-2">
          <CardSlider>
            {CARD_DATA.map((card) => (
              <FundamentCard key={card.title} card={card} />
            ))}
          </CardSlider>
        </div>
      </div>
    </section>
  );
}
