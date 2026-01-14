"use client";

import * as React from "react";
import { Plus, ArrowRight } from "lucide-react";

import MobileFullBleedSnapSlider, {
  type SliderHandle,
} from "@/components/slider/MobileFullBleedSnapSlider";
import OverlayModal from "@/components/overlay/OverlayModal";
import OverlayBody from "@/components/overlay/OverlayBody";

import {
  ACCESSIBILITY_RESOURCES,
  type AccessibilityResource,
} from "@/data/landing/accessibilityResources";

function ResourceCard(item: AccessibilityResource) {
  const [open, setOpen] = React.useState(false);

  const isDark = item.surface === "dark";

  // Apple-like: gleichmäßiges Grau als Card-Surface
  const cardSurfaceCls = isDark
    ? "bg-[#1d1d1f] text-white border-white/10"
    : "bg-[#f5f5f7] text-slate-900 border-black/10";

  // Buttons wie Sector 2 (Plus/Arrow), nur Farbe passend zur Surface
  const controlBtnCls = isDark
    ? "bg-white text-slate-900 ring-1 ring-black/10 hover:bg-white/95"
    : "bg-slate-900 text-white ring-1 ring-white/10 hover:bg-slate-800";

  const Icon = item.icon;

  const isLink = item.kind === "link" && !!item.href;

  const openOverlay = () => setOpen(true);

  const onCardClick = () => {
    if (isLink) return;
    openOverlay();
  };

  const onCardKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (isLink) return;
    openOverlay();
  };

  // Link-Card soll sich wie ein Link verhalten, aber die Kachel bleibt pointer-events-none innen (wie Apple)
  const CardInner = (
    <div
      className={[
        "group relative h-full w-full rounded-[28px] border overflow-hidden select-none",
        "transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]",
        "hover:-translate-y-[2px] active:translate-y-0 will-change-transform",
        cardSurfaceCls,
      ].join(" ")}
    >
      {/* Content */}
      <div className="relative z-10 p-8">
        <div className="flex flex-col gap-5">
          {/* Icon */}
          <div className="h-14 w-14 flex items-center justify-start">
            <Icon
              className={[
                "h-14 w-14",
                isDark ? "text-white" : "text-slate-900",
              ].join(" ")}
            />
          </div>

          {/* Copy: links, unter Icon */}
          <div className="space-y-3">
            <h3
              className={[
                "font-semibold tracking-tight",
                "text-[24px] leading-[1.06]",
                "whitespace-pre-line",
              ].join(" ")}
            >
              {item.title}
            </h3>
            <p
              className={[
                "text-[17px] leading-[1.35]",
                isDark ? "text-white/85" : "text-slate-700",
                "max-w-[34ch]",
              ].join(" ")}
            >
              {item.description}
            </p>
          </div>
        </div>
      </div>

      {/* Control button (unten rechts) */}
      <button
        type="button"
        aria-label={
          isLink
            ? `Link öffnen: ${item.title.replace(/\n/g, " ")}`
            : `Weitere Infos zu ${item.title.replace(/\n/g, " ")}`
        }
        onClick={(e) => {
          // Wichtig: Button klickbar, aber Card click/Link nicht doppelt auslösen
          e.preventDefault();
          e.stopPropagation();
          if (isLink) {
            window.open(item.href!, "_blank", "noopener,noreferrer");
            return;
          }
          openOverlay();
        }}
        className={[
          "absolute z-10 bottom-5 right-5 inline-flex items-center justify-center rounded-full",
          "h-12 w-12",
          "transition duration-200 ease-[cubic-bezier(.2,.8,.2,1)] active:scale-[0.98]",
          controlBtnCls,
        ].join(" ")}
      >
        {isLink ? (
          <ArrowRight className="h-[22px] w-[22px]" />
        ) : (
          <Plus className="h-[22px] w-[22px]" />
        )}
      </button>

      {/* Hover/Focus elevation */}
      <div
        className={[
          "pointer-events-none absolute inset-0 rounded-[28px]",
          "transition duration-300",
          isDark
            ? "group-hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)] group-hover:border-white/20"
            : "group-hover:shadow-[0_18px_50px_rgba(15,23,42,0.14)] group-hover:border-black/20",
        ].join(" ")}
      />
    </div>
  );

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
      {isLink ? (
        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className="block h-full w-full"
          aria-label={`Ressource öffnen: ${item.title.replace(/\n/g, " ")}`}
        >
          {CardInner}
        </a>
      ) : (
        <>
          <div
            role="button"
            tabIndex={0}
            onClick={onCardClick}
            onKeyDown={onCardKeyDown}
            className="h-full w-full"
          >
            {CardInner}
          </div>

          <OverlayModal
            open={open}
            onClose={() => setOpen(false)}
            title={item.overlayTitle ?? item.title.replace(/\n/g, " ")}
            headline={item.overlayHeadline ?? item.description}
            ariaLabel={item.overlayTitle ?? item.title.replace(/\n/g, " ")}
            contentClassName="bg-white md:bg-white"
          >
            <OverlayBody
              paras={
                item.overlayParas ?? [
                  "Platzhaltertext – hier kannst du später den Inhalt ergänzen.",
                ]
              }
            />
          </OverlayModal>
        </>
      )}
    </div>
  );
}

export default function Sektor03_RessourcenSection() {
  const sliderRef = React.useRef<SliderHandle>(null);

  return (
    <section className="relative">
      {/* ✅ Hier: Bottom-Padding erhöht */}
      <div className="mx-auto max-w-6xl px-4 pt-[56px] md:pt-[88px] pb-[72px] md:pb-[120px]">
        <h2 className="font-semibold tracking-tight text-slate-900 leading-[1.04] text-[clamp(28px,4.4vw,52px)]">
          Sieh dir unsere Lösungen für barrierefreie Kommunikation an.
        </h2>

        <div className="h-6 md:h-10" />

        {/* Einheitliche Card Size (statisch, Apple-like) */}
        <div
          className="sm:[--card-w:372px] sm:[--card-h:420px] lg:[--card-w:372px] lg:[--card-h:420px]"
          style={
            {
              ["--card-w" as any]: "355px",
              ["--card-h" as any]: "333px",
            } as React.CSSProperties
          }
        >
          <MobileFullBleedSnapSlider ref={sliderRef} scrollerPaddingX={16}>
            {ACCESSIBILITY_RESOURCES.map((item) => (
              <ResourceCard key={item.id} {...item} />
            ))}
          </MobileFullBleedSnapSlider>
        </div>
      </div>
    </section>
  );
}
