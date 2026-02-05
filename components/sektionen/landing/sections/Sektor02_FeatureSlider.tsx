"use client";

import * as React from "react";
import {
  Plus,
  ArrowRight,
  Layers,
  Handshake,
  ShieldCheck,
  Ruler,
} from "lucide-react";

import MobileFullBleedSnapSlider, {
  type SliderHandle,
} from "@/components/slider/MobileFullBleedSnapSlider";
import OverlayModal from "@/components/overlay/OverlayModal";
import OverlayBody from "@/components/overlay/OverlayBody";

import {
  FEATURE_HIGHLIGHTS,
  type FeatureHighlight,
} from "@/data/landing/featureHighlights";

function FeatureCard(item: FeatureHighlight) {
  const [open, setOpen] = React.useState(false);
  const isDark = item.surface === "dark";

  const plusBtnCls = isDark
    ? "bg-white text-slate-900 ring-1 ring-black/10 hover:bg-white/95"
    : "bg-slate-900 text-white ring-1 ring-white/10 hover:bg-slate-800";

  const cardSurfaceCls = isDark
    ? "bg-[#1d1d1f] text-white border-white/10"
    : "bg-white text-slate-900 border-slate-200";

  const eyebrowCls = isDark ? "text-white/90" : "text-slate-900";
  const elevatedCls = isDark ? "text-white" : "text-slate-900";

  return (
    <div
      className="shrink-0"
      style={
        {
          width: "var(--card-w)",
          height: "var(--card-h)",
        } as React.CSSProperties
      }
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={[
          "group relative h-full w-full rounded-[28px] border overflow-hidden select-none",
          "transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]",
          "hover:-translate-y-[2px] active:translate-y-0 will-change-transform",
          cardSurfaceCls,
        ].join(" ")}
      >
        {/* Background media */}
        <div className="absolute inset-0">
          <img
            src={item.image.src}
            alt={item.image.alt}
            className={[
              "h-full w-full object-cover",
              isDark ? "opacity-100" : "opacity-100",
              "transition-transform duration-700 ease-out group-hover:scale-[1.03]",
            ].join(" ")}
            loading="lazy"
          />
          <div
            className={[
              "absolute inset-0",
              isDark
                ? "bg-gradient-to-b from-black/85 via-black/0 to-black/35"
                : "bg-gradient-to-b from-white/95 via-white/0 to-white/55",
            ].join(" ")}
          />
        </div>

        {/* Top copy */}
        <div className="relative z-10 p-7 sm:p-8">
          <h3
            className={[
              "font-semibold tracking-tight",
              "text-[19px] leading-[1.12] sm:text-[20px] sm:leading-[1.12]",
              eyebrowCls,
            ].join(" ")}
          >
            {item.overlayTitle}
          </h3>

          <p
            className={[
              "mt-2 font-semibold tracking-tight",
              "text-[24px] leading-[1.08] sm:text-[28px] sm:leading-[1.06]",
              "max-w-[22ch]",
              elevatedCls,
            ].join(" ")}
          >
            {item.overlayHeadline}
          </p>
        </div>

        {/* Modal trigger button */}
        <button
          type="button"
          aria-label={`Weitere Infos zu ${item.overlayTitle}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          className={[
            "absolute z-10 bottom-5 right-5 inline-flex items-center justify-center rounded-full",
            "h-11 w-11 sm:h-12 sm:w-12",
            "transition duration-200 ease-[cubic-bezier(.2,.8,.2,1)] active:scale-[0.98]",
            plusBtnCls,
          ].join(" ")}
        >
          <Plus className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
        </button>

        {/* Hover/Focus elevation */}
        <div
          className={[
            "pointer-events-none absolute inset-0 rounded-[28px]",
            "transition duration-300",
            isDark
              ? "group-hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)] group-hover:border-white/20"
              : "group-hover:shadow-[0_18px_50px_rgba(15,23,42,0.18)] group-hover:border-slate-300",
          ].join(" ")}
        />
      </div>

      <OverlayModal
        open={open}
        onClose={() => setOpen(false)}
        title={item.overlayTitle}
        headline={item.overlayModalHeadline ?? item.overlayHeadline}
        ariaLabel={item.overlayTitle}
      >
        <FeatureOverlayContent item={item} />
      </OverlayModal>
    </div>
  );
}

function FeatureOverlayContent({ item }: { item: any }) {
  if (item.overlayCards?.length) {
    return (
      <div className="space-y-4">
        {item.overlayCards.map((block: any, idx: number) => {
          // ✅ Tiles-Block: NICHT in einer Karte, Text direkt unter der Headline
          if (block.kind === "tiles") {
            return (
              <div key={idx} className="space-y-4">
                <p className="text-[17px] leading-[1.45] font-medium text-slate-800 dark:text-white/85">
                  {block.text}
                </p>

                {block.kicker ? (
                  <h4 className="text-slate-900 dark:text-white font-bold tracking-tight text-[18px] md:text-[20px] leading-[1.2]">
                    {block.kicker}
                  </h4>
                ) : null}

                <OverlayTileGrid tiles={block.tiles} />

                {block.bridge ? (
                  <p className="text-slate-900 dark:text-white font-bold tracking-tight text-[18px] md:text-[20px] leading-[1.2]">
                    {block.bridge}
                  </p>
                ) : null}
              </div>
            );
          }

          return (
            <OverlayAppleCard key={idx}>
              <p className="text-[17px] leading-[1.45] font-medium text-slate-800 dark:text-white/85">
                {block.text}
              </p>

              {block.kind === "bars" && (
                <div className="mt-4">
                  <ValueBars bars={block.bars} />
                  {block.note && (
                    <p className="mt-3 text-[13px] leading-[1.35] text-slate-600 dark:text-white/60">
                      {block.note}
                    </p>
                  )}
                </div>
              )}

              {block.kind === "image" && (
                <div className="mt-4 overflow-hidden rounded-2xl bg-white/70 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                  <img
                    src={block.img.src}
                    alt={block.img.alt}
                    className="h-auto w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </OverlayAppleCard>
          );
        })}

        {item.overlayMoreTitle && item.overlayMoreItems?.length ? (
          <div className="pt-0">
            <h4 className="text-slate-900 dark:text-white font-bold tracking-tight text-[18px] md:text-[20px] leading-[1.15] mt-6 mb-3">
              {item.overlayMoreTitle}
            </h4>

            {/* ✅ Slider sitzt jetzt in einer Karte (wie die anderen Blöcke) */}
            <OverlayAppleCard>
              <div className="[--mini-w:240px] [--mini-h:220px] sm:[--mini-w:280px] sm:[--mini-h:240px]">
                <OverlayDotSnapSlider>
                  {item.overlayMoreItems.map((s: any) => (
                    <OverlayMiniSlide key={s.id} item={s} />
                  ))}
                </OverlayDotSnapSlider>
              </div>
            </OverlayAppleCard>
          </div>
        ) : null}
      </div>
    );
  }

  // 2) Fallback wie bisher
  return <OverlayBody paras={item.overlayParas} />;
}

/* -------------------------------------------------------
   ✅ Neuer Slider: Snap + Punkte (keine Pfeile)
   - bleibt in der Karte
   - Punkte mittig unter dem Slider
-------------------------------------------------------- */

function OverlayDotSnapSlider({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children);
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = React.useState(0);

  const scrollToIndex = React.useCallback((i: number) => {
    const s = scrollerRef.current;
    if (!s) return;

    const kids = Array.from(s.children) as HTMLElement[];
    const k = kids[i];
    if (!k) return;

    // Bei full-width Slides brauchen wir kein Padding-Offset – wir scrollen zur Card-Kante
    const max = Math.max(0, s.scrollWidth - s.clientWidth);
    const rawLeft = k.offsetLeft ?? 0;
    const left = Math.min(max, Math.max(0, rawLeft));

    s.scrollTo({ left, behavior: "smooth" });
    setIndex(i);
  }, []);

  React.useEffect(() => {
    const s = scrollerRef.current;
    if (!s) return;

    const onScroll = () => {
      const kids = Array.from(s.children) as HTMLElement[];
      if (!kids.length) return;

      const sl = s.scrollLeft;

      let nearest = 0;
      let min = Infinity;

      for (let i = 0; i < kids.length; i++) {
        const k = kids[i]!;
        const target = k.offsetLeft ?? 0;
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

    const ro = new ResizeObserver(() => requestAnimationFrame(onScroll));
    ro.observe(s);

    return () => {
      s.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const showDots = items.length > 1;

  return (
    <div className="w-full">
      {/* Scroll-Container */}
      <div
        ref={scrollerRef}
        className={[
          "flex flex-nowrap",
          "snap-x snap-mandatory overflow-x-auto",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "scroll-smooth",
          // ✅ wichtig: kein gap → sonst sind die Slides nicht exakt full width
          // ✅ padding 0 → Cards liegen bündig in der OverlayAppleCard
          "p-0",
        ].join(" ")}
        style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        {items.map((child, i) => (
          <div
            key={i}
            className={[
              "snap-start shrink-0",
              // ✅ jede Slide nimmt die volle Breite des Viewports innerhalb der Karte
              "w-full",
            ].join(" ")}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Punkte-Navigation */}
      {showDots ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {items.map((_, i) => {
            const active = i === index;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1} von ${items.length}`}
                onClick={() => scrollToIndex(i)}
                className={[
                  "h-2.5 w-2.5 rounded-full transition",
                  "ring-1 ring-black/10 dark:ring-white/15",
                  active
                    ? "bg-slate-900 dark:bg-white"
                    : "bg-slate-300/80 dark:bg-white/20 hover:bg-slate-400/90 dark:hover:bg-white/30",
                ].join(" ")}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function OverlayAppleCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={[
        "rounded-2xl p-5 sm:p-6",
        "bg-slate-100/80 dark:bg-white/5",
        "ring-1 ring-black/5 dark:ring-white/10",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function ValueBars({ bars }: { bars: { label: string; value: number }[] }) {
  return (
    <div className="space-y-3">
      {bars.map((b) => {
        const v = Math.max(0, Math.min(10, b.value));
        const pct = (v / 10) * 100;

        return (
          <div key={b.label}>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-slate-700 dark:text-white/75">
                {b.label}
              </span>
            </div>

            <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-slate-900/85 dark:bg-white/80"
                style={{ width: `${pct}%` }}
                aria-hidden
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OverlayMiniSlide({
  item,
}: {
  item: { title: string; image: { src: string; alt: string } };
}) {
  return (
    <div className="w-full">
      {/* ✅ angenehmes Höhenverhältnis für Mobile */}
      <div
        className={[
          "relative w-full overflow-hidden",
          "rounded-2xl",
          "ring-1 ring-black/5 dark:ring-white/10",
          "bg-black",
          // Mobile: etwas höher
          "aspect-[1/1]",
          // iPad/kleines Desktop: etwas flacher
          "sm:aspect-[1/1]",
        ].join(" ")}
      >
        <img
          src={item.image.src}
          alt={item.image.alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/55" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[13px] font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm">
            {item.title}
          </div>
        </div>
      </div>
    </div>
  );
}

type OverlayTile = {
  icon: "korpus" | "service" | "hygiene" | "ergonomie";
  title: string;
  text: string;
};

const TILE_ICONS = {
  korpus: Layers,
  service: Handshake,
  hygiene: ShieldCheck,
  ergonomie: Ruler,
} as const;

function OverlayTileGrid({ tiles }: { tiles: OverlayTile[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {tiles.map((t) => {
        const Icon = TILE_ICONS[t.icon];
        return (
          <div
            key={t.title}
            className={[
              "aspect-square rounded-2xl p-4 sm:p-5",
              "bg-white/70 dark:bg-white/5",
              "ring-1 ring-black/5 dark:ring-white/10",
              "flex flex-col justify-between",
            ].join(" ")}
          >
            <Icon className="h-12 w-12 sm:h-15 sm:w-15 text-slate-900 dark:text-white" />

            {/* Textblock: am Boden */}
            <div className="pt-4">
              <div className="text-[16px] sm:text-[17px] font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                {t.title}
              </div>

              <div className="mt-2 text-[11px] sm:text-[14px] leading-[1.35] text-slate-700 dark:text-white/75">
                {t.text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Sektor02_FeatureSlider() {
  const sliderRef = React.useRef<SliderHandle>(null);

  return (
    <section className="relative dark:bg-black">
      <div className="mx-auto max-w-6xl px-6 pt-[56px] md:pt-[88px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.04] text-[clamp(28px,4.4vw,52px)]">
            Hersteller, die zu dir passen.{" "}
            <br className="hidden sm:block" />
            Finde die Küchemarke, deren Haltung sich für dich richtig anfühlt.
          </h2>

          {/* ✅ Light exakt wie vorher; Dark nur Override */}
          <a
            href="/Marken"
            className="inline-flex items-center gap-2 text-[17px] font-medium text-blue-600 dark:text-[#2997ff] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            aria-label="Alle Marken ansehen"
          >
            Alle Marken ansehen
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="h-3 md:h-5" />

        <div className="[--card-w:277px] [--card-h:505px] sm:[--card-w:350px] sm:[--card-h:680px] lg:[--card-w:350px] lg:[--card-h:680px]">
          <MobileFullBleedSnapSlider ref={sliderRef} scrollerPaddingX={24}>
            {FEATURE_HIGHLIGHTS.map((item) => (
              <FeatureCard key={item.id} {...item} />
            ))}
          </MobileFullBleedSnapSlider>
        </div>
      </div>
    </section>
  );
}
