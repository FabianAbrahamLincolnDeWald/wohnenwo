"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ecosystemSections } from "./ecosystem-config";

type EcosystemFlyoutProps = {
  /** Extra Klassen für den Wrapper, z.B. um das Ding im Layout zu positionieren */
  className?: string;
  /** Breite des Panels (Default 640px) – für Sidebar kannst du z.B. 520px nehmen */
  panelWidthClassName?: string;
  /** Optional: andere Logo-Quelle, wenn du mal variieren willst */
  logoSrc?: string;
  logoAlt?: string;
};

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function EcosystemFlyout({
  className,
  panelWidthClassName = "w-[640px]",
  logoSrc = "https://wohnenwo.vercel.app/images/brand/logos/ww-badge-dark.svg",
  logoAlt = "Orbit Logo",
}: EcosystemFlyoutProps) {
  const [open, setOpen] = React.useState(false);

  const toggle = () => setOpen((v) => !v);

  return (
    <div
      className={classNames("relative inline-flex items-center", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger-Button */}
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Ecosystem Dropdown"
        onClick={toggle}
        className="border border-slate-200/80 rounded-md p-1 flex items-center justify-center shadow-sm ring-1 ring-black/5 bg-white"
      >
        <span className="inline-flex h-5.5 w-6.5 items-center justify-center">
          <img
            src={logoSrc}
            alt={logoAlt}
            className="h-5.5 w-5.5 object-contain"
          />
        </span>

        <span
          aria-hidden="true"
          className={classNames(
            "inline-flex h-5 w-4 items-center justify-center text-slate-800 transition-transform",
            open && "rotate-180"
          )}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </span>
      </button>

      {/* Flyout-Panel Desktop */}
      {open && (
        <>
          {/* Hover-Brücke */}
          <div
            className={classNames(
              "absolute left-0 top-full h-2",
              panelWidthClassName
            )}
          />

          <div
            className={classNames(
              "absolute left-0 mt-2 rounded-3xl overflow-hidden z-40",
              panelWidthClassName
            )}
          >
            <div className="relative rounded-[inherit] bg-white border border-slate-200/80 shadow-[0_22px_60px_rgba(15,23,42,0.25)]">
              {/* Apple Glass Layer */}
              <div
                className="absolute inset-0 rounded-[inherit] backdrop-blur-[1.5px]"
                style={{
                  filter: "url(#lensFilter) saturate(1.05) brightness(1.03)",
                }}
              />
              <div className="absolute inset-0 rounded-[inherit] bg-white/20" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45),inset_0_0_0_1px_rgba(0,0,0,0.06)]" />
              <div className="absolute inset-0 rounded-[inherit] ring-1 ring-white/20 ring-offset-1 ring-offset-white/30" />

              {/* Inhalt */}
              <div className="relative z-10 flex text-sm text-slate-700">
                {/* Linke Hälfte: Handeln + Entdecken (Sections 0 & 1) */}
                <div className="flex w-1/2 flex-col border-r border-slate-200">
                  {ecosystemSections
                    .filter((s) => s.id === "handeln" || s.id === "entdecken")
                    .map((section, index) => (
                      <React.Fragment key={section.id}>
                        {index === 1 && (
                          <div className="h-px w-full bg-slate-200/70" />
                        )}
                        <div
                          className={classNames(
                            "px-5 space-y-3",
                            section.id === "handeln"
                              ? "py-4"
                              : "pb-4 pt-2"
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
                      </React.Fragment>
                    ))}
                </div>

                {/* Rechte Hälfte: Wirken */}
                <div className="w-1/2 px-5 py-4 space-y-3">
                  {ecosystemSections
                    .filter((s) => s.id === "wirken")
                    .map((section) => (
                      <React.Fragment key={section.id}>
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
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** Kleiner Helper: rendert den jeweiligen Badge-Typ */
function BadgeRenderer({
  badge,
}: {
  badge?: {
    type: "circle" | "square" | "logo";
    text?: string;
    imgSrc?: string;
    imgAlt?: string;
  };
}) {
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

  // circle
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
