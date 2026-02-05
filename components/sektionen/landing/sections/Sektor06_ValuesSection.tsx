"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import MobileFullBleedSnapSlider, {
  type SliderHandle,
} from "@/components/slider/MobileFullBleedSnapSlider";

import {
  ACCESSIBILITY_VALUES,
  type AccessibilityValue,
} from "@/data/landing/accessibilityValues";

function ValueCard(item: AccessibilityValue) {
  const router = useRouter();
  const isDarkTile = item.surface === "dark";
  const Icon = item.icon;

  const href = item.href;
  const target = item.external ? "_blank" : undefined;
  const rel = item.external ? "nofollow noreferrer" : "noreferrer";

  const open = React.useCallback(() => {
    if (!href) return;
    if (item.external) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    router.push(href);
  }, [href, item.external, router]);

  // ✅ Light bleibt exakt; Dark nur Override (auch für "light"-Tiles)
  const cardSurfaceCls = isDarkTile
    ? "bg-[#1d1d1f] text-white border-white/10"
    : "bg-[#f5f5f7] text-slate-900 border-black/10 dark:bg-[#1d1d1f] dark:text-white dark:border-white/10";

  const iconCls = isDarkTile
    ? "text-white"
    : "text-slate-900 dark:text-white";

  const descCls = isDarkTile
    ? "text-white/85"
    : "text-slate-700 dark:text-white/85";

  const linkColorCls = isDarkTile
    ? "text-[#2997ff] hover:text-[#46a8ff]"
    : "text-[#0066cc] hover:text-[#0071e3] dark:text-[#2997ff] dark:hover:text-[#46a8ff]";

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
        role="link"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        }}
        aria-label={item.title}
        className={[
          "group relative h-full w-full rounded-[28px] border overflow-hidden select-none",
          "transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]",
          "hover:-translate-y-[2px] active:translate-y-0 will-change-transform",
          cardSurfaceCls,
        ].join(" ")}
      >
        <div className="relative z-10 p-8 h-full">
          <div className="flex flex-col gap-5 h-full">
            <div className="h-14 w-14 flex items-center justify-start pointer-events-none">
              <Icon className={["h-14 w-14", iconCls].join(" ")} />
            </div>

            <div className="space-y-3">
              <h3
                className={[
                  "font-semibold tracking-tight",
                  "text-[24px] leading-[1.06]",
                  "whitespace-pre-line",
                  "pointer-events-none",
                ].join(" ")}
              >
                {item.title}
              </h3>

              <p
                className={[
                  "text-[17px] leading-[1.35]",
                  descCls,
                  "max-w-[40ch]",
                  "pointer-events-none",
                ].join(" ")}
              >
                {item.description}
              </p>

              <p className="text-[17px] leading-[1.35]">
                <span className="pointer-events-auto">
                  <a
                    href={href}
                    target={target}
                    rel={rel}
                    className={[
                      "inline-flex items-center gap-2 font-medium tracking-tight",
                      linkColorCls,
                    ].join(" ")}
                    aria-label={`Weitere Infos zu ${item.title.replace(/\n/g, " ")}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="hover:underline underline-offset-4 decoration-current/50">
                      Weitere Infos
                    </span>
                    <span aria-hidden="true" className="no-underline">
                      ›
                    </span>
                  </a>
                </span>
              </p>
            </div>

            <div className="flex-1" />
          </div>
        </div>

        <div
          className={[
            "pointer-events-none absolute inset-0 rounded-[28px]",
            "transition duration-300",
            isDarkTile
              ? "group-hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)] group-hover:border-white/20"
              : "group-hover:shadow-[0_18px_50px_rgba(15,23,42,0.14)] group-hover:border-black/20 dark:group-hover:border-white/20",
          ].join(" ")}
        />
      </div>
    </div>
  );
}

export default function Sektor06_ValuesSection() {
  const sliderRef = React.useRef<SliderHandle>(null);

  return (
    <section className="relative dark:bg-black">
      <div className="mx-auto max-w-6xl px-6 pt-[56px] md:pt-[88px] pb-[72px] md:pb-[120px]">
        <h2 className="font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.04] text-[clamp(28px,4.4vw,52px)]">
          Unsere Werte geben den&nbsp;Weg&nbsp;vor.
        </h2>

        <div className="h-3 md:h-5" />

        <div className="[--card-w:277px] [--card-h:360px] sm:[--card-w:350px] sm:[--card-h:390px] lg:[--card-w:350px] lg:[--card-h:390px]">
          <MobileFullBleedSnapSlider ref={sliderRef} scrollerPaddingX={24}>
            {ACCESSIBILITY_VALUES.map((item) => (
              <ValueCard key={item.id} {...item} />
            ))}
          </MobileFullBleedSnapSlider>
        </div>
      </div>
    </section>
  );
}
