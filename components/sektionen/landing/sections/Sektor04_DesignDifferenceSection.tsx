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

  // Apple-ish: Statement groß, CTA kleiner
  const headlineCls = isDark ? "text-white" : "text-slate-900";
  const ctaCls = isDark ? "text-white/90 hover:text-white" : "text-slate-900 hover:text-slate-950";

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
                isDark ? "opacity-85" : "opacity-95",
              ].join(" ")}
              loading="lazy"
            />

            {/* Bottom scrim (Apple: gradient von unten für Lesbarkeit) */}
            <div
              className={[
                "absolute inset-0",
                item.withScrim
                  ? "bg-gradient-to-t from-black/70 via-black/20 to-black/0"
                  : "bg-gradient-to-t from-black/55 via-black/10 to-black/0",
              ].join(" ")}
            />
          </div>

          {/* Content: unten, wie Apple vertical-align-bottom */}
          <div className="relative z-10 flex h-full flex-col justify-end p-8">
            <div className="max-w-[34ch]">
              <p
                className={[
                  // Apple: typography-stories-headline (Statement-Paragraph)
                  "font-semibold tracking-tight",
                  "text-[22px] leading-[1.08] sm:text-[24px] sm:leading-[1.08]",
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
                    ctaCls,
                  ].join(" ")}
                >
                  {item.cta.label}
                  {item.cta.external ? (
                    <ExternalLink className="h-4 w-4 opacity-90" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-4 w-4 opacity-90" aria-hidden="true" />
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Soft hover shadow */}
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
      <div className="mx-auto max-w-6xl px-4 pt-[56px] md:pt-[88px] pb-[88px] md:pb-[132px]">
        <h2 className="font-semibold tracking-tight text-slate-900 leading-[1.04] text-[clamp(28px,4.4vw,52px)]">
          Erlebe, wie barriere­freies Design den Unter­schied macht.
        </h2>

        <div className="h-6 md:h-10" />

        {/* Gleichmäßige Tile-Größe, slider-kompatibel wie Sektor 2 */}
        <div
          className="sm:[--card-w:372px] sm:[--card-h:712px] lg:[--card-w:372px] lg:[--card-h:712px]"
          style={
            {
              ["--card-w" as any]: "1111px",
              ["--card-h" as any]: "699px",
            } as React.CSSProperties
          }
        >
          <MobileFullBleedSnapSlider ref={sliderRef} scrollerPaddingX={16}>
            {DESIGN_DIFFERENCE_STORIES.map((item) => (
              <StoryTile key={item.id} {...item} />
            ))}
          </MobileFullBleedSnapSlider>
        </div>
      </div>
    </section>
  );
}
