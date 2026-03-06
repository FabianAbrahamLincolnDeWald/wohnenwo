"use client";

import * as React from "react";
import { Lock, Sparkles } from "lucide-react";

function formatCurrency(amount: number, currency: string) {
  if (Number.isNaN(amount)) return "–";
  try {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: currency || "EUR",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency || "€"}`;
  }
}

function formatNumberDE(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export type WirkungskontoPanelProps = {
  variant: "demo" | "authed";
  name: string;
  email?: string | null;
  initials: string;

  wirkungEbene: number;
  scaleMax: number;
  investedEUR: number;
  impactEUR: number;
  projectsCount?: number;

  hasFirstInvoice: boolean;
  hasImpact: boolean;

  showNextStep: boolean;
};

export default function WirkungskontoPanel(props: WirkungskontoPanelProps) {
  const {
    variant,
    name,
    email,
    initials,
    wirkungEbene,
    scaleMax,
    investedEUR,
    impactEUR,
    projectsCount = 0,
    hasFirstInvoice,
    hasImpact,
    showNextStep,
  } = props;

  const progressPct = Math.max(
    0,
    Math.min(100, (wirkungEbene / Math.max(1, scaleMax)) * 100)
  );

  const badgeCount = (hasFirstInvoice ? 1 : 0) + (hasImpact ? 1 : 0);

  return (
    <aside
      className="
        hidden lg:block
        w-[300px]
        lg:pl-8
        lg:border-l lg:border-slate-200/80
        dark:lg:border-white/10
        lg:sticky lg:top-24
        self-start
      "
    >
      <div className="space-y-5">
        <section
          className="
            rounded-2xl
            bg-white/80 backdrop-blur
            border border-slate-200/80
            px-4 py-5 space-y-5 shadow-sm

            dark:bg-[#1d1d1f]
            dark:border-white/10
          "
        >
          <header className="space-y-1">
            <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500 dark:text-white/40">
              Dein Wirkungskonto
            </p>
            <p className="text-[13px] leading-snug text-slate-700 dark:text-white/60">
              {variant === "demo"
                ? "Lerne deinen Wirkungsraum kennen – ganz ohne Verpflichtung."
                : "Schön, dass du da bist. Hier wächst die Wirkung deiner Investitionen."}
            </p>
          </header>

          {/* Avatar + Name */}
          <div className="flex items-center gap-3">
            <span
              className="
                inline-flex h-9 w-9 items-center justify-center rounded-full
                bg-slate-900 text-white text-[13px] font-semibold
                dark:bg-white dark:text-slate-900
              "
            >
              {initials}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-900 truncate dark:text-white">
                {name}
              </p>
              <p className="text-[12px] text-slate-500 truncate dark:text-white/40">
                {email || (variant === "demo" ? "Gast-Zugang" : "Ohne E-Mail hinterlegt")}
              </p>
            </div>
          </div>

          {/* Next step */}
          {showNextStep && (
            <div
              className="
                rounded-xl px-4 py-3 space-y-2
                bg-slate-900 text-slate-50
                dark:bg-white/8 dark:text-white dark:border dark:border-white/10
              "
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300 dark:text-white/50">
                Nächster Schritt
              </p>
              <p className="text-[13px] leading-snug text-slate-50 dark:text-white/80">
                Starte dein erstes Projekt, um Wirkungspunkte zu sammeln und dein Konto zu füllen.
              </p>
              <button
                type="button"
                className="
                  mt-1 inline-flex items-center justify-center rounded-full px-3 py-1
                  text-[12px] font-medium
                  bg-white/90 text-slate-900
                  dark:bg-white dark:text-slate-900 dark:hover:bg-white/90
                "
              >
                Projekt anfragen
              </button>
            </div>
          )}

          {/* Abzeichen */}
          <div className="pt-2 border-t border-slate-100/80 space-y-2 dark:border-white/10">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-white/40">
                Wirkungsabzeichen
              </p>
              <p className="text-[11px] text-slate-400 dark:text-white/30">
                {badgeCount} / 5
              </p>
            </div>

            <div className="flex gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
                {hasFirstInvoice ? (
                  <span className="text-[11px] font-semibold text-slate-800 dark:text-white/80">
                    1
                  </span>
                ) : (
                  <Lock className="h-3.5 w-3.5 text-slate-300 dark:text-white/25" />
                )}
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
                {hasImpact ? (
                  <Sparkles className="h-4 w-4 text-slate-700 dark:text-white" />
                ) : (
                  <Lock className="h-3.5 w-3.5 text-slate-300 dark:text-white/25" />
                )}
              </div>

              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5"
                >
                  <Lock className="h-3.5 w-3.5 text-slate-300 dark:text-white/25" />
                </div>
              ))}
            </div>
          </div>

          {/* Kennzahlen */}
          <div className="space-y-3 text-[12px] text-slate-600 dark:text-white/60">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span>Wirkungsebene I</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatNumberDE(wirkungEbene)} / {scaleMax}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Projekte</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {projectsCount}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Investiertes Volumen</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {formatCurrency(investedEUR, "EUR")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Wirkungsfonds-Anteil</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {formatCurrency(impactEUR, "EUR")}
              </span>
            </div>
          </div>

          {/* Schluss-Text */}
          {showNextStep && (
            <p className="text-[11px] leading-snug text-slate-500 dark:text-white/40">
              Mit deiner ersten Rechnung wird aus dieser Vorschau dein echtes Wirkungskonto – mit
              jedem Projekt wächst deine sichtbare Wirkung.
            </p>
          )}
        </section>
      </div>
    </aside>
  );
}