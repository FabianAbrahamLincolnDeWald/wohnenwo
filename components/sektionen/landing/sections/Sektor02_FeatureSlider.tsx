"use client";

import * as React from "react";
import { Plus, ArrowRight } from "lucide-react";

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

  // Typo an Apple-Pattern angelehnt:
  // h3 = kleiner “eyebrow”, p = größer “eyebrow elevated”
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
              // Apple: Bild bleibt subtil im Hintergrund
              isDark ? "opacity-40" : "opacity-55",
              "transition-transform duration-700 ease-out group-hover:scale-[1.03]",
            ].join(" ")}
            loading="lazy"
          />
          <div
            className={[
              "absolute inset-0",
              // leichte “wash” wie bei Apple Tiles
              isDark
                ? "bg-gradient-to-b from-black/45 via-black/15 to-black/35"
                : "bg-gradient-to-b from-white/65 via-white/20 to-white/55",
            ].join(" ")}
          />
        </div>

        {/* Top copy */}
        <div className="relative z-10 p-7 sm:p-8">
          {/* h3: eyebrow */}
          <h3
            className={[
              "font-semibold tracking-tight",
              "text-[19px] leading-[1.12] sm:text-[20px] sm:leading-[1.12]",
              eyebrowCls,
            ].join(" ")}
          >
            {item.overlayTitle}
          </h3>

          {/* p: elevated eyebrow */}
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
            // Apple-like: kompakt, klarer Kreis
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
        headline={item.overlayHeadline}
        ariaLabel={item.overlayTitle}
        contentClassName="bg-white md:bg-white"
      >
        <OverlayBody paras={item.overlayParas} />
      </OverlayModal>
    </div>
  );
}

export default function Sektor02_FeatureSlider() {
  const sliderRef = React.useRef<SliderHandle>(null);

  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 pt-[56px] md:pt-[88px]">
        {/* Titel wie Apple: kein Eyebrow darüber */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="font-semibold tracking-tight text-slate-900 leading-[1.04] text-[clamp(28px,4.4vw,52px)]">
            Features, die du kennen solltest.
            <br className="hidden sm:block" />
            Für Sehvermögen, Hörvermögen, Sprache, Mobilität und kognitive
            Unterstützung.
          </h2>

          <a
            href="/features"
            className="inline-flex items-center gap-2 text-[17px] font-medium text-blue-600 hover:underline underline-offset-4  whitespace-nowrap shrink-0"
            aria-label="Alle Features ansehen"
          >
            Alle Features ansehen
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="h-6 md:h-10" />

        {/* Card sizes (Apple-nah, klarer Scale) */}
        <div
          className="sm:[--card-w:420px] sm:[--card-h:520px] lg:[--card-w:520px] lg:[--card-h:560px]"
          style={
            {
              ["--card-w" as any]: "355px",
              ["--card-h" as any]: "699px",
            } as React.CSSProperties
          }
        >
          <MobileFullBleedSnapSlider ref={sliderRef} scrollerPaddingX={16}>
            {FEATURE_HIGHLIGHTS.map((item) => (
              <FeatureCard key={item.id} {...item} />
            ))}
          </MobileFullBleedSnapSlider>
        </div>
      </div>
    </section>
  );
}
