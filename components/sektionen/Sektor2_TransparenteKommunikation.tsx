"use client";

import * as React from "react";
import {
  Users, UserSearch, UserStar, Gem, Scale, HeartHandshake, Earth, Trophy, RefreshCw,
  ScanEye, FolderOpen, HandCoins, WandSparkles, Sparkles, Plus,
} from "lucide-react";

import MobileFullBleedSnapSlider, { type SliderHandle } from "@/components/slider/MobileFullBleedSnapSlider";
import OverlayModal from "@/components/overlay/OverlayModal";
import { KOMMUNIKATION_CARDS, type KommunikationCard } from "@/data/kommunikationCards";

/* Helpers */
function splitLead(text: string): { lead: string; rest: string } {
  const idx = text.indexOf(".");
  if (idx === -1) return { lead: text, rest: "" };
  return { lead: text.slice(0, idx + 1), rest: text.slice(idx + 1).trim() };
}

/* Icons registry (ReactElement) */
const ICONS: Record<NonNullable<KommunikationCard["icon"]>, React.ReactElement> = {
  Users: <Users className="h-7 w-7 text-slate-700" />,
  UserSearch: <UserSearch className="h-7 w-7 text-slate-700" />,
  UserStar: <UserStar className="h-7 w-7 text-slate-700" />,
  Gem: <Gem className="h-7 w-7 text-slate-700" />,
  Scale: <Scale className="h-7 w-7 text-slate-700" />,
  HeartHandshake: <HeartHandshake className="h-7 w-7 text-slate-700" />,
  Earth: <Earth className="h-7 w-7 text-slate-700" />,
  Trophy: <Trophy className="h-7 w-7 text-slate-700" />,
  RefreshCw: <RefreshCw className="h-7 w-7 text-slate-700" />,
  FolderOpen: <FolderOpen className="h-7 w-7 text-slate-700" />,
  WandSparkles: <WandSparkles className="h-7 w-7 text-slate-700" />,
  Sparkles: <Sparkles className="h-7 w-7 text-slate-700" />,
  HandCoins: <HandCoins className="h-7 w-7 text-slate-700" />,
};

const SUB_ICONS: Record<NonNullable<KommunikationCard["subtitleIcon"]>, React.ReactElement> = {
  Users: <Users className="h-7 w-7" />,
  ScanEye: <ScanEye className="h-8 w-8" />,
  FolderOpen: <FolderOpen className="h-7 w-7" />,
  HandCoins: <HandCoins className="h-8 w-8" />,
  BrickWallShield: <HeartHandshake className="h-7 w-7" />,
  HandHeart: <HeartHandshake className="h-8 w-8" />,
  WandSparkles: <WandSparkles className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-7 w-7" />,
};

/* OverlayBody */
function OverlayBody({
  paras, card, link,
}: {
  paras: Array<string | React.ReactNode>;
  card?: { variant: "clickable" | "static"; text?: string; paras?: Array<string | React.ReactNode>; img?: { src: string; alt: string; imgClassName?: string }; href?: string; };
  link?: { href: string; label: string };
}) {
  return (
    <div>
      {paras.map((p, idx) => <p key={idx} className={idx ? "mt-4" : undefined}>{p}</p>)}
      {link && (
        <div className="mt-6">
          <a href={link.href} role="link" aria-label={link.label}
             className="inline-flex items-center gap-2 text-yellow-400 hover:underline decoration-yellow-400 decoration-2 underline-offset-4 cursor-pointer">
            <span>{link.label}</span>
          </a>
        </div>
      )}
      {card && (card.variant === "clickable" ? (
        <a href={card.href} aria-label="Mehr erfahren" className="group mt-6 block focus:outline-none">
          <div className="rounded-3xl bg-slate-200/90 ring-1 ring-black/10 p-5 md:p-6 pb-0 transition-all duration-200 hover:ring-black/20 hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-slate-400">
            {card.text && (() => { const { lead, rest } = splitLead(card.text!); return (
              <p className="text-[17px] md:text-[18px] leading-[1.35] text-slate-800">
                <span className="font-semibold text-slate-900">{lead}</span> {rest}
              </p> );})()}
            {card.paras?.map((tp, i) => <p key={i} className="mt-4 text-slate-800">{tp}</p>)}
            {card.img && (
              <div className="mt-4 -mx-5 md:-mx-6 -mb-5 md:-mb-6 overflow-hidden rounded-b-3xl">
                <img src={card.img.src} alt={card.img.alt}
                     className={`block w-full h-auto ${card.img.imgClassName ?? "rounded-3xl"}`} loading="lazy" />
              </div>
            )}
          </div>
        </a>
      ) : (
        <div className="mt-6 rounded-3xl bg-slate-200/90 ring-1 ring-black/10 p-5 md:p-6 pb-0">
          {card.text && (() => { const { lead, rest } = splitLead(card.text!); return (
            <p className="text-[17px] md:text-[18px] leading-[1.35] text-slate-800">
              <span className="font-semibold text-slate-900">{lead}</span> {rest}
            </p> );})()}
          {card.paras?.map((tp, i) => <p key={i} className="mt-4 text-slate-800">{tp}</p>)}
          {card.img && (
            <div className="mt-4 -mx-5 md:-mx-6 -mb-5 md:-mb-6 overflow-hidden rounded-b-3xl">
              <img src={card.img.src} alt={card.img.alt}
                   className={`block w-full h-auto ${card.img.imgClassName ?? "rounded-3xl"}`} loading="lazy" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* SetupCard */
function SetupCard({
  title, icon, subtitle, titleClassName, subtitleClassName, subtitleIcon, overlayTitle, overlayHeadline, overlayBody,
}: {
  title: string; icon: React.ReactNode; subtitle: React.ReactNode; titleClassName?: string; subtitleClassName?: string; subtitleIcon?: React.ReactNode;
  overlayTitle: string; overlayHeadline: string; overlayBody: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  // Mobile (260x314): exakt 25.5px / 16.5px; Subtext-Leading 22.6233px
  // Desktopwerte (md:) bleiben aus den Klassen/Props erhalten.
  const titleSize =
    `${titleClassName ?? "md:text-[30px] md:leading-[1.04]"} text-[25.5px] leading-[1.06]`;

  const subtitleSize =
    `${subtitleClassName ?? "md:text-[19px] md:leading-6"} text-[16.5px] leading-[22.6233px]`;

  const subIcon = React.isValidElement(subtitleIcon)
    ? React.cloneElement(subtitleIcon as any, {
        className: `${(subtitleIcon as any).props?.className ?? ""}`
          .replace(/text-[^ ]+/g, "")
          .trim() + " text-yellow-400",
      })
    : subtitleIcon;

  return (
    <>
      <div
        className="w-[260px] h-[314px] sm:w-[448px] sm:h-[282px]"
        style={{ ["--intent-top" as any]: "152px", ["--intent-top-mobile" as any]: "176px" } as React.CSSProperties}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpen(true)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } }}
          className="relative h-full rounded-3xl p-6 sm:p-8 pb-16 group select-none cursor-pointer transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-[2px] active:translate-y-0"
        >
          {/* Hintergrund */}
          <div className="absolute inset-0 rounded-3xl bg-white border border-slate-200 shadow-sm transition duration-300 will-change-transform md:group-hover:shadow-lg md:group-hover:border-slate-300" />
          {/* Inhalt */}
          <div className="relative z-10 h-full">
            <div className="grid gap-[clamp(12px,3vw,16px)] md:gap-4 pt-0">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                {icon ?? ICONS.Users}
              </div>
              <h3 className={[titleSize, "font-semibold tracking-tight text-slate-900"].join(" ")}>
                {title}
              </h3>
            </div>
            {/* Intent-Row */}
            <div className="absolute left-0 right-0 top-[var(--intent-top-mobile)] sm:left-6 sm:right-6 sm:top-[var(--intent-top)]">
              <div className="flex items-start gap-2">
                {subIcon && <span className="text-yellow-400">{subIcon}</span>}
                <p className={[subtitleSize, "text-slate-900 underline decoration-yellow-400 decoration-2 underline-offset-4"].join(" ")}>
                  {subtitle}
                </p>
              </div>
            </div>
          </div>
          {/* Plus-Button */}
          <button
            type="button"
            aria-label="Weitere Infos"
            onClick={() => setOpen(true)}
            className="group absolute z-10 bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow ring-1 ring-white/10 hover:bg-slate-700 hover:ring-white/40 cursor-pointer"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Overlay (gemeinsame Komponente mit Hysterese-Props) */}
      <OverlayModal
        open={open}
        onClose={() => setOpen(false)}
        title={overlayTitle}
        headline={overlayHeadline}
        ariaLabel={overlayTitle}
        dockRootMargin="-2px 0px 0px 0px"
        dockThreshold={0}
      >
        {overlayBody}
      </OverlayModal>
    </>
  );
}

/* Section */
export default function Sektor2_TransparenteKommunikation() {
  const sliderRef = React.useRef<SliderHandle>(null);

  return (
    <section id="kommunikation" className="relative bg-white">
      <div className="max-w-6xl mx-auto px-4 py-[44px]">
        {/* H2 ohne Unter-Padding */}
        <h2 className="text-[clamp(29px,8vw,55px)] md:text-[55px] font-semibold tracking-tight text-slate-900 leading-[1.05]">
          Warum wir offen miteinander reden.
        </h2>

        {/* fixer Abstand zwischen H2 und Slider */}
        <div className="h-6 md:h-8" />

        {/* Full-Bleed, Start exakt unter H2; Buttons/Slider liegen im eigenen Component */}
        <div className="relative overflow-visible">
          <MobileFullBleedSnapSlider
            ref={sliderRef}
            scrollerPaddingX={16} // passt zu px-4 der Section
          >
            {KOMMUNIKATION_CARDS.map((c, i) => (
              <SetupCard
                key={i}
                title={c.title}
                icon={ICONS[c.icon] ?? ICONS.Users}
                subtitle={c.subtitle}
                titleClassName={c.titleClassName}
                subtitleClassName={c.subtitleClassName}
                subtitleIcon={c.subtitleIcon ? SUB_ICONS[c.subtitleIcon] : undefined}
                overlayTitle={c.overlayTitle}
                overlayHeadline={c.overlayHeadline}
                overlayBody={
                  <OverlayBody paras={c.overlayParas} card={c.overlayCard} link={c.overlayLink} />
                }
              />
            ))}
          </MobileFullBleedSnapSlider>
        </div>
      </div>
    </section>
  );
}
