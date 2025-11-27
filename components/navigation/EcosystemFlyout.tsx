"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  ecosystemSections,
  type EcosystemSection,
} from "@/components/navigation/ecosystem-config";

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type EcosystemFlyoutProps = {
  className?: string;
  panelWidth?: number; // px – z.B. 520 oder 640
};

export default function EcosystemFlyout({
  className,
  panelWidth = 520,
}: EcosystemFlyoutProps) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const triggerRef = React.useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = React.useRef<number | null>(null);

  const handeln = ecosystemSections.find((s) => s.id === "handeln");
  const entdecken = ecosystemSections.find((s) => s.id === "entdecken");
  const wirken = ecosystemSections.find((s) => s.id === "wirken");

  const GAP = 8; // etwas größere Brücke zwischen Button und Panel
  const CLOSE_DELAY = 120;
  const H_OFFSET = -12; // dein manueller Offset

  const computePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + GAP,
      left: rect.left + H_OFFSET,
    });
  };

  const openFlyout = () => {
    window.clearTimeout(closeTimeoutRef.current ?? undefined);
    computePosition();
    setOpen(true);
  };

  const scheduleClose = () => {
    window.clearTimeout(closeTimeoutRef.current ?? undefined);
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, CLOSE_DELAY);
  };

  const cancelClose = () => {
    window.clearTimeout(closeTimeoutRef.current ?? undefined);
    closeTimeoutRef.current = null;
  };

  const toggleFlyout = () => {
    if (open) {
      setOpen(false);
      return;
    }
    openFlyout();
  };

  React.useEffect(() => {
    if (!open) return;

    const handler = () => {
      computePosition();
    };

    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler);
    };
  }, [open]);

  return (
    <>
      {/* Trigger-Wrapper: nur so breit wie der Button */}
      <div
        ref={triggerRef}
        className={cx("inline-flex items-center", className)}
        onMouseEnter={openFlyout}
        onMouseLeave={scheduleClose}
      >
        <button
          type="button"
          aria-haspopup="true"
          aria-expanded={open}
          aria-label="Ecosystem Dropdown"
          onClick={toggleFlyout}
          className="border border-slate-200/80 rounded-md p-1 flex items-center justify-center shadow-sm ring-1 ring-black/5 bg-white"
        >
          {/* Brand Orbit-Icon */}
          <span className="inline-flex h-5.5 w-6.5 items-center justify-center">
            <img
              src="https://wohnenwo.vercel.app/images/brand/logos/ww-badge-dark.svg"
              alt="Orbit Logo"
              className="h-5.5 w-5.5 object-contain"
            />
          </span>

          <span
            aria-hidden="true"
            className={cx(
              "inline-flex h-5 w-4 items-center justify-center text-slate-800 transition-transform",
              open && "rotate-180"
            )}
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>

      {/* Panel – fixed, eigene Hover-Zone (Brücke via GAP) */}
      {open && (
        <div
          className="fixed z-[999]"
          style={{
            // Wrapper startet GAP höher → unsichtbare Brücke
            top: pos.top - GAP,
            left: pos.left,
            width: panelWidth, // in der Sidebar: 640
          }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {/* Sichtbares Panel rutscht optisch an den Button */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ marginTop: GAP }}
          >
            <div className="relative rounded-[inherit] bg-white border border-slate-200/80 shadow-[0_18px_45px_rgba(15,23,42,0.25)]">
              {/* Kein Glas-Effekt mehr */}
              <div className="relative z-10 flex text-[13px] text-slate-700">
                {/* Linke Spalte: Handeln + Entdecken */}
                <div className="flex w-1/2 flex-col border-r border-slate-200">
                  {handeln && (
                    <SectionBlock section={handeln} variant="top" />
                  )}

                  {handeln && entdecken && (
                    <div className="h-px w-full bg-slate-200/70" />
                  )}

                  {entdecken && (
                    <SectionBlock section={entdecken} variant="bottom" />
                  )}
                </div>

                {/* Rechte Spalte: Wirken */}
                <div className="w-1/2 px-4 py-3 space-y-3">
                  {wirken && (
                    <>
                      <h3 className="text-[14px] font-semibold tracking-tight">
                        {wirken.title}
                      </h3>
                      <ul className="space-y-2 text-[13px]">
                        {wirken.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="flex items-center gap-3 rounded-md px-2.5 py-2 hover:bg-slate-100"
                            >
                              <BadgeRenderer badge={link.badge} />
                              <span>{link.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* --- Hilfs-Komponenten --- */

function SectionBlock({
  section,
  variant,
}: {
  section: EcosystemSection;
  variant: "top" | "bottom";
}) {
  return (
    <div
      className={cx(
        "px-4 space-y-3",
        variant === "top" ? "py-3" : "pb-3 pt-2"
      )}
    >
      <h3 className="text-[14px] font-semibold tracking-tight">
        {section.title}
      </h3>
      <ul className="space-y-2 text-[13px]">
        {section.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex items-center gap-3 rounded-md px-2.5 py-2 hover:bg-slate-100"
            >
              <BadgeRenderer badge={link.badge} />
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Badge = NonNullable<EcosystemSection["links"][number]["badge"]>;

function BadgeRenderer({ badge }: { badge?: Badge }) {
  if (!badge) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
        <span className="h-3.5 w-3.5 rounded-full bg-white/80" />
      </span>
    );
  }

  if (badge.type === "logo" && badge.imgSrc) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center">
        <img
          src={badge.imgSrc}
          alt={badge.imgAlt ?? ""}
          className="h-6 w-6 object-contain"
        />
      </span>
    );
  }

  if (badge.type === "square") {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] bg-white text-[10px] font-black text-slate-900">
        {badge.text ?? "€"}
      </span>
    );
  }

  if (badge.text) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-900 text-[12px] font-semibold">
        {badge.text}
      </span>
    );
  }

  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
      <span className="h-3.5 w-3.5 rounded-full bg-white/80" />
    </span>
  );
}
