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
  panelWidthClassName?: string; // z.B. "w-[640px]" oder "w-[520px]"
};

export default function EcosystemFlyout({
  className,
  panelWidthClassName = "w-[640px]",
}: EcosystemFlyoutProps) {
  const [open, setOpen] = React.useState(false);

  const handeln = ecosystemSections.find((s) => s.id === "handeln");
  const entdecken = ecosystemSections.find((s) => s.id === "entdecken");
  const wirken = ecosystemSections.find((s) => s.id === "wirken");

  const toggleFlyout = () => setOpen((v) => !v);

  return (
    <div
      className={cx("relative inline-flex items-center", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger-Button – identisch zum ErlebnisseNavbar-Flyout */}
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

      {/* Flyout-Panel – Fab.com-Stil + Apple-Glass-Effekt */}
      {open && (
        <>
          {/* Unsichtbare Hover-Brücke – exakt so breit wie das Flyout */}
          <div
            className={cx(
              "absolute left-0 top-full h-2 w-full", // Brücke direkt unter dem Button
              panelWidthClassName
            )}
          />

          <div
            className={cx(
              "absolute left-0 mt-2 rounded-3xl overflow-hidden z-40",
              panelWidthClassName
            )}
          >
            <div className="relative rounded-[inherit] bg-white border border-slate-200/80 shadow-[0_22px_60px_rgba(15,23,42,0.25)]">
              {/* --- APPLE GLASS EFFECT --- */}
              <div
                className="absolute inset-0 rounded-[inherit] backdrop-blur-[1.5px]"
                style={{
                  filter:
                    "url(#lensFilter) saturate(1.05) brightness(1.03)",
                }}
              />
              <div className="absolute inset-0 rounded-[inherit] bg-white/20" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45),inset_0_0_0_1px_rgba(0,0,0,0.06)]" />
              <div className="absolute inset-0 rounded-[inherit] ring-1 ring-white/20 ring-offset-1 ring-offset-white/30" />
              {/* --- END APPLE GLASS EFFECT --- */}

              {/* Inhalt – Fab.com Layout */}
              <div className="relative z-10 flex text-sm text-slate-700">
                {/* Linke Spalte: Handeln + Entdecken */}
                <div className="flex w-1/2 flex-col border-r border-slate-200">
                  {/* Handeln */}
                  {handeln && (
                    <SectionBlock
                      section={handeln}
                      variant="top"
                    />
                  )}

                  {/* Divider zwischen Handeln & Entdecken */}
                  {handeln && entdecken && (
                    <div className="h-px w-full bg-slate-200/70" />
                  )}

                  {/* Entdecken */}
                  {entdecken && (
                    <SectionBlock
                      section={entdecken}
                      variant="bottom"
                    />
                  )}
                </div>

                {/* Rechte Spalte: Wirken */}
                <div className="w-1/2 px-5 py-4 space-y-3">
                  {wirken && (
                    <>
                      <h3 className="text-base font-semibold tracking-tight">
                        {wirken.title}
                      </h3>
                      <ul className="space-y-2 text-[14px]">
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
        </>
      )}
    </div>
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
        "px-5 space-y-3",
        variant === "top" ? "py-4" : "pb-4 pt-2"
      )}
    >
      <h3 className="text-base font-semibold tracking-tight">
        {section.title}
      </h3>
      <ul className="space-y-2 text-[14px]">
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

type Badge = NonNullable<
  EcosystemSection["links"][number]["badge"]
>;

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
