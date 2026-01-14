"use client";

import * as React from "react";
import { ArrowRight, ExternalLink } from "lucide-react";

import MobileFullBleedSnapSlider, {
  type SliderHandle,
} from "@/components/slider/MobileFullBleedSnapSlider";

import {
  DESIGN_DIFFERENCE_STORIES,
  type DesignDifferenceStory,
} from "@/data/landing/designDifferenceStories";

function StoryTile(item: DesignDifferenceStory) {
  const isDark = item.theme === "dark";

  const tileCls = isDark
    ? "bg-[#1d1d1f] text-white border-white/10"
    : "bg-[#f5f5f7] text-slate-900 border-black/10";

  const headlineCls = isDark ? "text-white" : "text-slate-900";
  const ctaCls = isDark
    ? "text-white/90 hover:text-white"
    : "text-slate-900 hover:text-slate-950";

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
      <a
        href={item.cta.href}
        target={item.cta.external ? "_blank" : undefined}
        rel={item.cta.external ? "nofollow noreferrer" : "noreferrer"}
        className="block h-full w-full"
        aria-label={`${item.cta.label} – ${item.headline.replace(/\n/g, " ")}`}
      >
        <div
          className={[
            "group relative h-full w-full rounded-[28px] border overflow-hidden select-none",
            "transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]",
            "hover:-translate-y-[2px] active:translate-y-0 will-change-transform",
            tileCls,
          ].join(" ")}
        >
          {/* Background media */}
          <div className="absolute inset-0">
            <img
              src={item.image.src}
              alt={item.image.alt}
              className={[
                "h-full w-full object-cover",
                "transition-transform duration-700 ease-out group-hover:scale-[1.02]",
                isDark ? "opacity-95" : "opacity-100",
              ].join(" ")}
              loading="lazy"
            />

            {/* Scrim (Apple-like): Bottom Scrim, klar sichtbar */}
            <div
              className={[
                "pointer-events-none absolute inset-x-0 bottom-0",
                "h-[70%]",
                item.withScrim
                  ? "bg-gradient-to-t from-black/90 via-black/30 to-transparent"
                  : "bg-gradient-to-t from-black/82 via-black/22 to-transparent",
              ].join(" ")}
            />

            {/* optional: leichte Vignette */}
            <div className="pointer-events-none absolute inset-0 bg-black/5" />
          </div>

          {/* Content: unten wie Apple */}
          <div className="relative z-10 flex h-full flex-col justify-end p-8">
            <div className="max-w-[36ch]">
              <p
                className={[
                  "font-semibold tracking-tight",
                  "text-[22px] leading-[1.1] sm:text-[24px] sm:leading-[1.1]",
                  headlineCls,
                ].join(" ")}
              >
                {item.headline}
              </p>

              <div className="mt-5">
                <span
                  className={[
                    "inline-flex items-center gap-2",
                    "text-[17px] font-medium tracking-tight",
                    "group-hover:underline underline-offset-4 decoration-current/40",
                    ctaCls,
                  ].join(" ")}
                >
                  {item.cta.label}
                  {item.cta.external ? (
                    <ExternalLink
                      className="h-4 w-4 opacity-90"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowRight className="h-4 w-4 opacity-90" aria-hidden="true" />
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Hover/Border + Shadow */}
          <div
            className={[
              "pointer-events-none absolute inset-0 rounded-[28px]",
              "transition duration-300",
              "group-hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)]",
              isDark ? "group-hover:border-white/20" : "group-hover:border-black/20",
            ].join(" ")}
          />
        </div>
      </a>
    </div>
  );
}

export default function Sektor04_DesignDifferenceSection() {
  const sliderRef = React.useRef<SliderHandle>(null);

  return (
    <section className="relative bg-[#f5f5f7]">
      <div className="mx-auto max-w-6xl px-6 pt-[56px] md:pt-[88px] pb-[88px] md:pb-[132px]">
        <h2 className="font-semibold tracking-tight text-slate-900 leading-[1.04] text-[clamp(28px,4.8vw,56px)]">
          Erlebe, wie barriere­freies Design den Unter­schied macht.
        </h2>

        <div className="h-3 md:h-5" />

        {/* Mobile: card-w berechnet für symmetrischen Peek
            Desktop (lg+): deine Wunschgröße 1111px
        */}
        <div
          className="
            [--peek:24px]
            [--card-w:min(372px,calc(100vw-2*var(--peek)))]
            [--card-h:555px]
            lg:[--card-w:1111px]
            lg:[--card-h:699px]
          "
        >
          <MobileFullBleedSnapSlider
            ref={sliderRef}
            scrollerPaddingX={24}
            align="centerMobileStartDesktop"
          >
            {DESIGN_DIFFERENCE_STORIES.map((item) => (
              <StoryTile key={item.id} {...item} />
            ))}
          </MobileFullBleedSnapSlider>
        </div>
      </div>
    </section>
  );
}
