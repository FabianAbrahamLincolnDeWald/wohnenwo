// /Users/fabiandewald/Documents/wohnenwo/components/sektionen/Sektor2_TransparenteKommunikation.tsx
"use client";

import * as React from "react";
import {
  Users,
  UserSearch,
  UserStar,
  Gem,
  Scale,
  HeartHandshake,
  Earth,
  Trophy,
  RefreshCw,
  ScanEye,
  FolderOpen,
  HandCoins,
  WandSparkles,
  Sparkles,
  Plus,
  BrickWallShield,
  HandHeart,
} from "lucide-react";

import MobileFullBleedSnapSlider, {
  type SliderHandle,
} from "@/components/slider/MobileFullBleedSnapSlider";
import OverlayModal from "@/components/overlay/OverlayModal";
import OverlayBody from "@/components/overlay/OverlayBody";

import {
  KOMMUNIKATION_CARDS,
  type KommunikationCard,
} from "@/data/kommunikationCards";

/* Helpers */
function splitLead(text: string): { lead: string; rest: string } {
  const idx = text.indexOf(".");
  if (idx === -1) return { lead: text, rest: "" };
  return { lead: text.slice(0, idx + 1), rest: text.slice(idx + 1).trim() };
}

/* Icons registry (ReactElement) */
const ICONS: Record<
  NonNullable<KommunikationCard["icon"]>,
  React.ReactElement
> = {
  Users: <Users className="h-7 w-7 text-slate-700 dark:text-white/80" />,
  UserSearch: (
    <UserSearch className="h-7 w-7 text-slate-700 dark:text-white/80" />
  ),
  UserStar: <UserStar className="h-7 w-7 text-slate-700 dark:text-white/80" />,
  Gem: <Gem className="h-7 w-7 text-slate-700 dark:text-white/80" />,
  Scale: <Scale className="h-7 w-7 text-slate-700 dark:text-white/80" />,
  HeartHandshake: (
    <HeartHandshake className="h-7 w-7 text-slate-700 dark:text-white/80" />
  ),
  Earth: <Earth className="h-7 w-7 text-slate-700 dark:text-white/80" />,
  Trophy: <Trophy className="h-7 w-7 text-slate-700 dark:text-white/80" />,
  RefreshCw: (
    <RefreshCw className="h-7 w-7 text-slate-700 dark:text-white/80" />
  ),
  FolderOpen: (
    <FolderOpen className="h-7 w-7 text-slate-700 dark:text-white/80" />
  ),
  WandSparkles: (
    <WandSparkles className="h-7 w-7 text-slate-700 dark:text-white/80" />
  ),
  Sparkles: <Sparkles className="h-7 w-7 text-slate-700 dark:text-white/80" />,
  HandCoins: (
    <HandCoins className="h-7 w-7 text-slate-700 dark:text-white/80" />
  ),
  HandHeart: (
    <HandHeart className="h-7 w-7 text-slate-700 dark:text-white/80" />
  ),
  BrickWallShield: (
    <BrickWallShield className="h-7 w-7 text-slate-700 dark:text-white/80" />
  ),
};

const SUB_ICONS: Record<
  NonNullable<KommunikationCard["subtitleIcon"]>,
  React.ReactElement
> = {
  Users: <Users className="h-7 w-7" />,
  ScanEye: <ScanEye className="h-8 w-8" />,
  FolderOpen: <FolderOpen className="h-7 w-7" />,
  HandCoins: <HandCoins className="h-8 w-8" />,
  BrickWallShield: <BrickWallShield className="h-7 w-7" />,
  HandHeart: <HandHeart className="h-8 w-8" />,
  WandSparkles: <WandSparkles className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-7 w-7" />,
};

/* SetupCard */
function SetupCard({
  title,
  icon,
  subtitle,
  titleClassName,
  subtitleClassName,
  subtitleIcon,
  overlayTitle,
  overlayHeadline,
  overlayBody,
}: {
  title: string;
  icon: React.ReactNode;
  subtitle: React.ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
  subtitleIcon?: React.ReactNode;
  overlayTitle: string;
  overlayHeadline: string;
  overlayBody: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  const titleSize = `${
    titleClassName ?? "md:text-[30px] md:leading-[1.04]"
  } text-[25.5px] leading-[1.08]`;

  const subtitleSize = `${
    subtitleClassName ?? "md:text-[19px] md:leading-6"
  } text-[16.2px] leading-[22.22px]`;

  const subIcon = React.isValidElement(subtitleIcon)
    ? React.cloneElement(subtitleIcon as any, {
        className: `${(subtitleIcon as any).props?.className ?? ""}`
          .replace(/text-[^ ]+/g, "")
          .trim(),
      })
    : subtitleIcon;

  // ✅ Button-Farbe exakt wie in Sektor03_RessourcenSection:
  // Light: schwarz; Dark: schwarz (nicht weiß)
  const controlBtnCls =
    "bg-slate-900 text-white ring-1 ring-white/10 hover:bg-slate-800 " +
    "dark:bg-black dark:text-white dark:ring-1 dark:ring-black/10 dark:hover:bg-black/95";

  return (
    <>
      <div
        className="w-[260px] h-[314px] sm:w-[448px] sm:h-[282px]"
        style={
          {
            ["--intent-top" as any]: "152px",
            ["--intent-top-mobile" as any]: "172px",
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
            "relative h-full rounded-3xl p-6 sm:p-8 pb-16 group select-none cursor-pointer",
            "transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-[2px] active:translate-y-0",
          ].join(" ")}
        >
          {/* Hintergrund */}
          <div
            className={[
              "absolute inset-0 rounded-3xl border shadow-sm transition duration-300 will-change-transform",
              "bg-white border-slate-200 md:group-hover:shadow-lg md:group-hover:border-slate-300",
              "dark:bg-[#1d1d1f] dark:border-white/10 dark:md:group-hover:border-white/20",
            ].join(" ")}
          />

          {/* Inhalt */}
          <div className="relative z-10 h-full">
            <div className="grid gap-[clamp(12px,3vw,16px)] md:gap-4 pt-0">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/10">
                {icon ?? ICONS.Users}
              </div>

              <h3
                className={[
                  titleSize,
                  "font-semibold tracking-tight",
                  "text-slate-900 dark:text-white",
                ].join(" ")}
              >
                {title}
              </h3>
            </div>

            {/* Intent-Row */}
            <div className="absolute left-0 right-0 top-[var(--intent-top-mobile)] sm:left-6 sm:right-6 sm:top-[var(--intent-top)]">
              <div className="flex items-start gap-2">
                {subIcon && <span className="text-yellow-400">{subIcon}</span>}
                <p
                  className={[
                    subtitleSize,
                    "underline decoration-yellow-400 decoration-2 underline-offset-4",
                    "text-slate-900 dark:text-white",
                  ].join(" ")}
                >
                  {subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Plus-Button (unten rechts) – jetzt wie in Sektor03_RessourcenSection */}
          <button
            type="button"
            aria-label="Weitere Infos"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }}
            className={[
              "absolute z-10 bottom-4 right-4 inline-flex items-center justify-center rounded-full",
              "h-10 w-10",
              "transition duration-200 ease-[cubic-bezier(.2,.8,.2,1)] active:scale-[0.98]",
              "shadow ring-1 cursor-pointer",
              controlBtnCls,
            ].join(" ")}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Overlay */}
      <OverlayModal
        open={open}
        onClose={() => setOpen(false)}
        title={overlayTitle}
        headline={overlayHeadline}
        ariaLabel={overlayTitle}
        dockRootMargin="-2px 0px 0px 0px"
        dockThreshold={0}
        // ✅ (falls du das so behalten willst)
        contentClassName="bg-white text-slate-900 md:bg-white dark:bg-[#1d1d1f] dark:text-white"
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
    <section id="kommunikation" className="relative bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-[44px]">
        <h2 className="text-[clamp(29px,8vw,55px)] md:text-[55px] font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
          Warum wir offen miteinander reden.
        </h2>

        <div className="h-6 md:h-8" />

        <div className="relative overflow-visible">
          <MobileFullBleedSnapSlider ref={sliderRef} scrollerPaddingX={16}>
            {KOMMUNIKATION_CARDS.map((c, i) => (
              <SetupCard
                key={i}
                title={c.title}
                icon={ICONS[c.icon] ?? ICONS.Users}
                subtitle={c.subtitle}
                titleClassName={c.titleClassName}
                subtitleClassName={c.subtitleClassName}
                subtitleIcon={
                  c.subtitleIcon ? SUB_ICONS[c.subtitleIcon] : undefined
                }
                overlayTitle={c.overlayTitle}
                overlayHeadline={c.overlayHeadline}
                overlayBody={
                  <OverlayBody
                    paras={c.overlayParas}
                    card={c.overlayCard as any}
                    link={c.overlayLink}
                  />
                }
              />
            ))}
          </MobileFullBleedSnapSlider>
        </div>
      </div>
    </section>
  );
}
