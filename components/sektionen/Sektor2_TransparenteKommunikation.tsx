"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  Users, UserSearch, UserStar, Gem, Scale, HeartHandshake, Earth, Trophy, RefreshCw,
  ScanEye, FolderOpen, HandCoins, WandSparkles, Sparkles, Plus, X,
} from "lucide-react";

import MobileFullBleedSnapSlider, { type SliderHandle } from "@/components/slider/MobileFullBleedSnapSlider";
import { KOMMUNIKATION_CARDS, type KommunikationCard } from "@/data/kommunikationCards";

/* Helpers */
function splitLead(text: string): { lead: string; rest: string } {
  const idx = text.indexOf(".");
  if (idx === -1) return { lead: text, rest: "" };
  return { lead: text.slice(0, idx + 1), rest: text.slice(idx + 1).trim() };
}

/* Icons registry */
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

/* CloseDock */
function CloseDock({
  sheetRef, onClose, active = true,
}: { sheetRef: React.RefObject<HTMLElement | null>; onClose: () => void; active?: boolean; }) {
  const [docked, setDocked] = React.useState(false);
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const [rightOffset, setRightOffset] = React.useState<number>(16);

  const measure = React.useCallback(() => {
    const el = sheetRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ro = Math.max(16, window.innerWidth - rect.right + 16);
    setRightOffset(ro);
  }, [sheetRef]);

  React.useEffect(() => {
    if (!active) return;
    const s = sentinelRef.current;
    if (!s) return;
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const shouldDock = !entry.isIntersecting;
      if (shouldDock) measure();
      setDocked(shouldDock);
    }, { root: null, threshold: 0, rootMargin: "-6px 0px 0px 0px" });

    io.observe(s);
    return () => io.disconnect();
  }, [measure, active]);

  React.useEffect(() => { if (!active) setDocked(false); }, [active]);

  React.useEffect(() => {
    if (!docked || !active) return;
    let raf = 0;
    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(() => measure());
    if (sheetRef.current) ro.observe(sheetRef.current as Element);
    return () => { window.removeEventListener("resize", onResize); ro.disconnect(); cancelAnimationFrame(raf); };
  }, [docked, active, measure, sheetRef]);

  const styleAbs: React.CSSProperties = { position: "absolute", top: 16, right: 16, zIndex: 10 };
  const styleFix: React.CSSProperties = { position: "fixed", top: `calc(env(safe-area-inset-top, 0px) + 16px)`, right: rightOffset, zIndex: 1100 };
  const renderDocked = (btn: React.ReactElement) => (typeof window === "undefined" ? btn : createPortal(btn, document.body));

  return (
    <>
      <div ref={sentinelRef} aria-hidden style={{ position: "absolute", top: 0, left: 0, height: 1, width: 1 }} />
      {!docked && active && (
        <button type="button" aria-label="Overlay schließen" onClick={onClose} style={styleAbs}
          className="group inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-md ring-1 ring-white/10 hover:bg-slate-800 hover:shadow-lg hover:ring-white/30 active:scale-[0.98] transition-transform duration-200 ease-[cubic-bezier(.2,.8,.2,1)]">
          <X className="h-5 w-5" />
        </button>
      )}
      {docked && active && renderDocked(
        <button type="button" aria-label="Overlay schließen" onClick={onClose} style={styleFix}
          className="group inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-md ring-1 ring-white/10 hover:bg-slate-800 hover:shadow-lg hover:ring-white/30 active:scale-[0.98] transition-transform duration-200 ease-[cubic-bezier(.2,.8,.2,1)]">
          <X className="h-5 w-5" />
        </button>
      )}
    </>
  );
}

/* OverlayModal */
type OverlayModalProps = {
  open: boolean; onClose: () => void; ariaLabel?: string; title?: string; headline?: string; children?: React.ReactNode;
  durationMs?: number; topGapMobile?: number; topGapMobileSm?: number;
};

function OverlayModal({
  open, onClose, ariaLabel, title, headline, children, durationMs = 400, topGapMobile = 16, topGapMobileSm = 24,
}: OverlayModalProps) {
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [open]);

  if (!mounted) return null;
  const computedAriaLabel = ariaLabel || headline || title || "Overlay";

  return createPortal(
    <div className={["fixed inset-0 z-[1000] transition-[opacity]", open ? "opacity-100" : "opacity-0 pointer-events-none"].join(" ")} aria-hidden={!open}>
      <div ref={overlayRef}
        className="absolute inset-0 bg-black/45 backdrop-blur-md flex justify-center overflow-y-auto p-0 pt-[var(--overlay-top-gap,16px)] sm:pt-[var(--overlay-top-gap-sm,24px)] md:py-12"
        onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}>
        <div ref={contentRef}
          role="dialog" aria-modal="true" aria-label={computedAriaLabel}
          className="relative mx-0 my-0 w-screen md:w-[min(96vw,680px)] rounded-t-3xl md:rounded-3xl bg-white shadow-xl ring-1 ring-black/5 min-h-[calc(100vh-var(--overlay-top-gap,16px))] pb-[env(safe-area-inset-bottom)] overflow-visible">
          <CloseDock sheetRef={contentRef as unknown as React.RefObject<HTMLElement>} active={open} onClose={onClose} />
          <div className="px-6 sm:px-8 md:px-[66px] py-[66px] md:py-[99px]">
            {(title || headline) && (
              <h3 className="space-y-2">
                {title && <span className="block font-semibold text-slate-700 text-[17px] md:text-[18px]">{title}</span>}
                {headline && <span className="block font-semibold tracking-tight text-slate-900 text-[33px] md:text-[56px]">{headline}</span>}
              </h3>
            )}
            {children && <div className="mt-4 text-[17px] md:text-[18px] text-slate-700 leading-[1.3] md:leading-[1.35]">{children}</div>}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

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
          <a href={link.href} className="inline-flex items-center gap-2 text-yellow-400 hover:underline decoration-yellow-400 decoration-2 underline-offset-4">
            <span>{link.label}</span>
          </a>
        </div>
      )}
      {card && (
        <div className="mt-6 rounded-3xl bg-slate-200/90 ring-1 ring-black/10 p-5 md:p-6 pb-0">
          {card.text && (() => { const { lead, rest } = splitLead(card.text!); return (
            <p className="text-[17px] md:text-[18px] text-slate-800 leading-[1.35]">
              <span className="font-semibold text-slate-900">{lead}</span> {rest}
            </p> );})()}
          {card.paras?.map((tp, i) => <p key={i} className="mt-4 text-slate-800">{tp}</p>)}
          {card.img && (
            <div className="mt-4 -mx-5 md:-mx-6 -mb-5 md:-mb-6 overflow-hidden rounded-b-3xl">
              <img src={card.img.src} alt={card.img.alt} className={`block w-full h-auto ${card.img.imgClassName ?? "rounded-3xl"}`} loading="lazy" />
            </div>
          )}
        </div>
      )}
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

  const titleSize =
    `${titleClassName ?? "md:text-[30px] md:leading-[1.04]"} ` +
    "!text-[25.5px] leading-[1.06]";

  const subtitleSize =
    `${subtitleClassName ?? "md:text-[19px] md:leading-6"} ` +
    "!text-[16.5px] !leading-[22.6233px]";

  const subIcon = React.isValidElement(subtitleIcon)
    ? React.cloneElement(subtitleIcon as any, {
        className: `${(subtitleIcon as any).props?.className ?? ""}`.trim() + " text-yellow-400",
      })
    : subtitleIcon;

  return (
    <>
      <div className="w-[260px] h-[314px] sm:w-[448px] sm:h-[282px]" style={{ ["--intent-top" as any]: "152px", ["--intent-top-mobile" as any]: "176px" } as React.CSSProperties}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpen(true)}
          className="relative h-full rounded-3xl p-6 sm:p-8 pb-16 group cursor-pointer transition-transform duration-300 hover:-translate-y-[2px]"
        >
          <div className="absolute inset-0 rounded-3xl bg-white border border-slate-200 shadow-sm transition md:group-hover:shadow-lg md:group-hover:border-slate-300" />
          <div className="relative z-10 h-full">
            <div className="grid gap-[clamp(12px,3vw,16px)] md:gap-4">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                {icon ?? ICONS.Users}
              </div>
              <h3 className={[titleSize, "font-semibold tracking-tight text-slate-900"].join(" ")}>{title}</h3>
            </div>
            <div className="absolute left-0 right-0 top-[var(--intent-top-mobile)] sm:left-6 sm:right-6 sm:top-[var(--intent-top)]">
              <div className="flex items-start gap-2">
                {subIcon && <span className="text-yellow-400">{subIcon}</span>}
                <p className={[subtitleSize, "text-slate-900 underline decoration-yellow-400 decoration-2 underline-offset-4"].join(" ")}>{subtitle}</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Weitere Infos"
            onClick={() => setOpen(true)}
            className="group absolute z-10 bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow ring-1 ring-white/10 hover:bg-slate-700"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <OverlayModal open={open} onClose={() => setOpen(false)} title={overlayTitle} headline={overlayHeadline} ariaLabel={overlayTitle}>
        {overlayBody}
      </OverlayModal>
    </>
  );
}

/* Section */
export default function Sektor2_TransparenteKommunikation() {
  const sliderRef = React.useRef<SliderHandle>(null);

  return (
    <section className="relative bg-white">
      <div className="max-w-6xl mx-auto px-4 py-[44px]">
        {/* Überschrift ohne unteres Padding */}
        <h2 className="text-[clamp(29px,8vw,55px)] md:text-[55px] font-semibold tracking-tight text-slate-900 leading-[1.05] pb-0">
          Warum wir offen miteinander reden.
        </h2>

        {/* Fester Y-Gap von 44px */}
        <div className="relative [--y-gap:44px] overflow-visible">
          <MobileFullBleedSnapSlider ref={sliderRef} scrollerPaddingX={16}>
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
                overlayBody={<OverlayBody paras={c.overlayParas} card={c.overlayCard} link={c.overlayLink} />}
              />
            ))}
          </MobileFullBleedSnapSlider>
        </div>
      </div>
    </section>
  );
}
