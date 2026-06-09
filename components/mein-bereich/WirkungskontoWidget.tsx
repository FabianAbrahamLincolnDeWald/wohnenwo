"use client";

import * as React from "react";
import { Lock, Sparkles, ChevronDown, AlertTriangle, Zap } from "lucide-react";

export type WirkungskontoWidgetProps = {
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

  totalRevenue2024?: number;
  totalNetIncome2024?: number;
  reinvestmentRate?: number;
  expertRate?: number;
  avgProfitMargin?: number;
  clientDiversificationScore?: number;
  incomeStreamCount?: number;
  taxFilingStreak?: number;
  profileTier?: string;
  taxYearStatus?: string | null;
};

function fmtEUR(n: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtPct(n: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(n / 100);
}

export default function WirkungskontoWidget(props: WirkungskontoWidgetProps) {
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
    totalRevenue2024 = 0,
    totalNetIncome2024 = 0,
    reinvestmentRate = 0,
    expertRate = 0,
    clientDiversificationScore = 0,
    incomeStreamCount = 0,
    taxYearStatus,
  } = props;

  const [taxYearOpen, setTaxYearOpen] = React.useState(false);

  const hasTaxData = totalNetIncome2024 > 0;
  const progressPct = Math.max(0, Math.min(100, (wirkungEbene / Math.max(1, scaleMax)) * 100));
  const badgeCount = (hasFirstInvoice ? 1 : 0) + (hasImpact ? 1 : 0);

  return (
    <div className="h-full rounded-2xl border border-[#F5C842]/15 bg-[#111111]/80 backdrop-blur-xl shadow-[0_0_24px_rgba(245,200,66,0.06)] p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] tracking-[0.18em] uppercase text-white/35 mb-1">
            Wirkungskonto
          </p>
          <p className="text-[12px] text-white/50 leading-snug max-w-[200px]">
            {variant === "demo"
              ? "Lerne deinen Wirkungsraum kennen."
              : "Hier wächst die Wirkung deiner Investitionen."}
          </p>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="text-right">
            <p className="text-[12px] font-semibold text-white truncate max-w-[120px]">{name}</p>
            <p className="text-[11px] text-white/35 truncate max-w-[120px]">
              {email || (variant === "demo" ? "Gast-Zugang" : "Kein E-Mail")}
            </p>
          </div>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F5C842]/10 border border-[#F5C842]/20 text-[#F5C842] text-[13px] font-semibold shrink-0">
            {initials}
          </span>
        </div>
      </div>

      {/* Wirkungsebene Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-[#F5C842]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
              Wirkungsebene I
            </span>
          </div>
          <span className="text-[13px] font-semibold text-white tabular-nums">
            {wirkungEbene.toFixed(0)} <span className="text-white/30 font-normal">/ {scaleMax}</span>
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[#222222] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #F5C842, #00B4D8)",
            }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 py-2.5 space-y-0.5">
          <p className="text-[10px] text-white/35 uppercase tracking-[0.12em]">Investiert</p>
          <p className="text-[13px] font-semibold text-white tabular-nums">{fmtEUR(investedEUR)}</p>
        </div>
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 py-2.5 space-y-0.5">
          <p className="text-[10px] text-white/35 uppercase tracking-[0.12em]">Projekte</p>
          <p className="text-[13px] font-semibold text-white tabular-nums">{projectsCount}</p>
        </div>
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 py-2.5 space-y-0.5">
          <p className="text-[10px] text-white/35 uppercase tracking-[0.12em]">Wirkungsfonds</p>
          <p className="text-[13px] font-semibold text-[#F5C842] tabular-nums">{fmtEUR(impactEUR)}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/35">
            Wirkungsabzeichen
          </p>
          <p className="text-[10px] text-white/25">{badgeCount} / 5</p>
        </div>
        <div className="flex gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
            {hasFirstInvoice ? (
              <span className="text-[11px] font-semibold text-[#F5C842]">1</span>
            ) : (
              <Lock className="h-3 w-3 text-white/20" />
            )}
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
            {hasImpact ? (
              <Sparkles className="h-3.5 w-3.5 text-[#F5C842]" />
            ) : (
              <Lock className="h-3 w-3 text-white/20" />
            )}
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]"
            >
              <Lock className="h-3 w-3 text-white/20" />
            </div>
          ))}
        </div>
      </div>

      {/* Tax Year – expandable */}
      {hasTaxData && (
        <div className="pt-1 border-t border-white/[0.06] space-y-2">
          <button
            type="button"
            onClick={() => setTaxYearOpen((v) => !v)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/35">
                Steuerjahr 2024
              </p>
              {taxYearStatus && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-emerald-900/20 text-emerald-400 border border-emerald-800/40">
                  {taxYearStatus}
                </span>
              )}
            </div>
            <ChevronDown
              className={[
                "h-3.5 w-3.5 text-white/30 transition-transform duration-200",
                taxYearOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>

          {taxYearOpen && (
            <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] overflow-hidden">
              <div className="px-4 py-3 space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-white/35">Gesamtgewinn</span>
                  <span className="text-[14px] font-semibold text-[#F5C842] tabular-nums">
                    {fmtEUR(totalNetIncome2024)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-white/35">Gesamtumsatz</span>
                  <span className="text-[12px] font-medium text-white/55 tabular-nums">
                    {fmtEUR(totalRevenue2024)}
                  </span>
                </div>
              </div>
              <div className="h-px bg-white/[0.06]" />
              <div className="px-4 py-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/35">Reinvestitionsrate</span>
                  <span className="text-[12px] font-semibold text-[#F5C842] tabular-nums">
                    {fmtPct(reinvestmentRate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/35">Experteneinsatz</span>
                  <span className="text-[12px] font-medium text-white/55 tabular-nums">
                    {fmtPct(expertRate)}
                  </span>
                </div>
              </div>
              <div className="h-px bg-white/[0.06]" />
              <div className="px-4 py-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/35">Einkunftsarten</span>
                  <span className="text-[12px] font-medium text-white/55 tabular-nums">
                    {incomeStreamCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/35">Klumpenrisiko</span>
                  <div className="flex items-center gap-1">
                    <span
                      className={[
                        "text-[12px] font-medium tabular-nums",
                        clientDiversificationScore > 40 ? "text-amber-400" : "text-white/55",
                      ].join(" ")}
                    >
                      {fmtPct(clientDiversificationScore)}
                    </span>
                    {clientDiversificationScore > 40 && (
                      <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Next Step CTA */}
      {showNextStep && (
        <div className="mt-auto rounded-xl bg-[#F5C842]/8 border border-[#F5C842]/15 px-4 py-3 space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#F5C842]/60">
            Nächster Schritt
          </p>
          <p className="text-[12px] leading-snug text-white/70">
            Starte dein erstes Projekt, um Wirkungspunkte zu sammeln.
          </p>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-medium bg-[#F5C842] text-[#0A0A0A] hover:bg-[#C49A20] transition-colors duration-150 cursor-pointer"
          >
            Projekt anfragen
          </button>
        </div>
      )}
    </div>
  );
}
