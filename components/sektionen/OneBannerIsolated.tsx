"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Lock, Unlock, Plus, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * #############################################################
 *  Integrierte Version: Banner + Panel + Transparenz-Rechner
 *  - Banner als Toggle
 *  - Rechner rendert im Panel (nahtlos, gleicher Hintergrund)
 *  - Abstände: mobil 44px; Desktop 44px + Linie + 22px
 *  - Text linksbündig
 * #############################################################
 */

// Währungsformat
const eur = (n: number) =>
  n.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });

// Pfeil-Animation nach 5s automatisch stoppen
const useTemporaryBounce = () => {
  useEffect(() => {
    const el = document.querySelector(".temporary-bounce");
    if (el) {
      const timeout = setTimeout(() => {
        el.classList.remove("animate-bounce");
        el.classList.remove("temporary-bounce");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, []);
};

function DropdownSection({
  title,
  children,
  defaultOpen = true,
  forceClosed = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  forceClosed?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  useEffect(() => {
    if (forceClosed) setOpen(false);
    else setOpen(defaultOpen);
  }, [forceClosed, defaultOpen]);
  return (
    <div className="border rounded-xl bg-[#1c1c1d] border-slate-700">
      <button
        type="button"
        onClick={() => {
          if (!forceClosed) setOpen((o) => !o);
        }}
        disabled={forceClosed}
        className={`w-full text-left px-4 py-2 flex items-center justify-between ${
          forceClosed ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <span className="font-semibold text-sm text-slate-200">{title}</span>
        <span className="text-slate-400">{open ? "–" : "+"}</span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function OverflowChart({
  mode,
  fullColor,
  costColor,
  overflowColor,
  overflowSharePct = 0,
  showCenterPct = false,
  size = 160,
  stroke = 18,
  align = "start",
  pulseLevel = 0, // reserviert
  extraTopUpPct = 0,
}: {
  mode: "full" | "split";
  fullColor?: string;
  costColor?: string;
  overflowColor?: string;
  overflowSharePct?: number;
  showCenterPct?: boolean;
  size?: number;
  stroke?: number;
  align?: "start" | "center";
  pulseLevel?: number;
  extraTopUpPct?: number;
}) {
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const toRad = (deg: number) => (Math.PI / 180) * deg;
  const arc = (startDeg: number, endDeg: number) => {
    const start = { x: cx + r * Math.cos(toRad(startDeg)), y: cy + r * Math.sin(toRad(startDeg)) };
    const end = { x: cx + r * Math.cos(toRad(endDeg)), y: cy + r * Math.sin(toRad(endDeg)) };
    const largeArc = Math.abs(endDeg - startDeg) <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };
  const overflowDeg = Math.max(0, Math.min(360, 360 * (overflowSharePct / 100)));
  const costDeg = 360 - overflowDeg;

  // Ringe (sanfte Puls-Indikation ab 11/22/33%)
  const step = extraTopUpPct > 0 ? (extraTopUpPct >= 34 ? 33 : extraTopUpPct) : 0;
  let ringCount = 0;
  if (extraTopUpPct > 33 || step >= 33) ringCount = 3;
  else if (step >= 22) ringCount = 2;
  else if (step >= 11) ringCount = 1;
  else ringCount = 0;

  const baseT = extraTopUpPct > 33 || step >= 33 ? 16 : step >= 22 ? 12 : step >= 11 ? 10 : 0;
  const tInner = baseT;
  const tMid = baseT ? Math.max(2, baseT - 4) : 0;
  const tOuter = baseT ? Math.max(1, baseT - 8) : 0;
  const baseAlpha =
    extraTopUpPct > 33
      ? 0.65
      : step >= 33
      ? 0.65
      : step >= 22
      ? 0.5
      : step >= 11
      ? 0.35
      : 0;
  const extraAlpha =
    extraTopUpPct > 33
      ? Math.min(0.77, 0.65 + (Math.min(extraTopUpPct, 77) - 33) * (0.77 - 0.65) / (77 - 33))
      : baseAlpha;
  const col = (a: number) => `rgba(6,182,212,${a})`;

  return (
    <div className={`flex flex-col ${align === "start" ? "items-start" : "items-center"}`}>
      <div className="relative inline-block" style={{ width: size, height: size }}>
        {ringCount > 0 && (
          <>
            {ringCount >= 3 && (
              <span
                className="absolute inset-0 rounded-full animate-[ping_4s_ease-in-out_infinite]"
                style={{ borderWidth: tOuter, borderStyle: "solid", borderColor: col(extraAlpha * 0.35) }}
              />
            )}
            {ringCount >= 2 && (
              <span
                className="absolute inset-0 rounded-full animate-[ping_3s_ease-in-out_infinite]"
                style={{ borderWidth: tMid, borderStyle: "solid", borderColor: col(extraAlpha * 0.6) }}
              />
            )}
            <span
              className="absolute inset-0 rounded-full animate-[ping_2s_ease-in-out_infinite]"
              style={{ borderWidth: tInner, borderStyle: "solid", borderColor: col(extraAlpha) }}
            />
          </>
        )}

        <svg width={size} height={size} className="overflow-visible relative">
          <circle cx={cx} cy={cy} r={r} className="fill-none stroke-slate-700" strokeWidth={stroke} />
          {mode === "full" ? (
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={fullColor} strokeWidth={stroke} strokeLinecap="round" />
          ) : (
            <>
              <path d={arc(-90, -90 + costDeg)} fill="none" stroke={costColor} strokeWidth={stroke} strokeLinecap="round" />
              <path d={arc(-90 + costDeg, 270)} fill="none" stroke={overflowColor} strokeWidth={stroke} strokeLinecap="round" />
            </>
          )}
          <circle cx={cx} cy={cy} r={r - stroke / 2} fill="#161617" />
          {mode === "split" && showCenterPct && (
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-100 font-bold"
              style={{ fontSize: 20 }}
            >
              {Math.round(overflowSharePct)}%
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}

// --- Dev sanity check (nur in Development) ---
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  (function __testArc() {
    const size = 100,
      stroke = 10;
    const r = (size - stroke) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const toRad = (deg: number) => (Math.PI / 180) * deg;
    const arc = (startDeg: number, endDeg: number) => {
      const start = { x: cx + r * Math.cos(toRad(startDeg)), y: cy + r * Math.sin(toRad(startDeg)) };
      const end = { x: cx + r * Math.cos(toRad(endDeg)), y: cy + r * Math.sin(toRad(endDeg)) };
      const largeArc = Math.abs(endDeg - startDeg) <= 180 ? 0 : 1;
      return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
    };
    console.assert(arc(0, 90).startsWith("M "), "arc() should return an SVG path string");
    console.assert(/ 0 0 1 /.test(arc(0, 180)), "arc(0,180) should use largeArc=0");
    console.assert(/ 0 1 1 /.test(arc(0, 200)), "arc(0,200) should use largeArc=1");
  })();
}

// Helper: Text für den Schalter
export function getSwitchLabel(positiveFuture: boolean, fondsPct: number): string {
  if (!positiveFuture) return "Lass mich mitgestalten!";
  if (fondsPct >= 33) return "Neues Bewusstseinslevel erreicht";
  return "Wirkungsfonds aufbauen";
}

// Stage-Text
export function computeStageLabel(positiveFuture: boolean, fondsPct: number): string {
  if (!positiveFuture) return "";
  if (fondsPct < 10) return "Gemeinsam schaffen wir Vertrauen und Qualität – getragen von gegenseitigem Nutzen.";
  if (fondsPct < 22) return "Qualität und Rücklagen stabilisieren sich – ein transparentes System wächst.";
  if (fondsPct < 33) return `Fast geschafft – schon ${fondsPct.toFixed(1)} %, die absoluten Überfluss in Zukunft verwandeln.`;
  return `Jetzt wird es spannend:\nEine Vision wird zur gelebten Bewegung.`;
}

// Eingabe-Helper
export function parseAndClampWageField(v: string): number {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(15, Math.min(35, n)) : 15;
}

/**
 * Rechner-Komponente (isoliert) – wird im Panel gerendert
 */
function TransparencyCalculatorIsolated() {
  useTemporaryBounce();

  const [hourlyWage, setHourlyWage] = useState<number>(18);
  const [positiveFuture, setPositiveFuture] = useState<boolean>(false);
  const [fondsPct, setFondsPct] = useState<number>(0);
  const [extraTopUpPct, setExtraTopUpPct] = useState<number>(0);
  const [wageField, setWageField] = useState<string>(String(Math.round(18)));

  const agSozialPct = 21.5;
  const urlaubKrankPct = 10.3;
  const anSozialPct = 20.5;
  const steuerSchaetzungPct = 12;
  const overheadPct = 22;
  const travelPrepCoordPct = 8;
  const riskBufferPct = 10;
  const profitPct = 10;
  const markupsTotalPct = overheadPct + travelPrepCoordPct + riskBufferPct + profitPct;

  const agCostPerHour = useMemo(
    () => hourlyWage * (1 + (agSozialPct + urlaubKrankPct) / 100),
    [hourlyWage]
  );
  const clientRate = useMemo(
    () => agCostPerHour * (1 + markupsTotalPct / 100),
    [agCostPerHour]
  );

  const cappedFonds = Math.max(0, Math.min(fondsPct, 33.3333));
  const fondsForCalc = useMemo(
    () => (positiveFuture ? (fondsPct >= 33 ? 33.3333 : fondsPct) : 0),
    [fondsPct, positiveFuture]
  );
  const b2bEffective = useMemo(
    () => (positiveFuture ? 44.0 / (1 - fondsForCalc / 100) : clientRate),
    [positiveFuture, fondsForCalc, clientRate]
  );
  const b2bFinal = useMemo(
    () => b2bEffective * (1 + (positiveFuture && cappedFonds >= 33 ? extraTopUpPct : 0) / 100),
    [b2bEffective, positiveFuture, cappedFonds, extraTopUpPct]
  );
  const b2cFinal = useMemo(() => b2bFinal * 1.19, [b2bFinal]);

  const displayHourlyWage = useMemo(() => {
    if (positiveFuture && fondsPct >= 33 && extraTopUpPct > 0) {
      const baseB2B = 44.0 / (1 - 33.3333 / 100);
      const add = (baseB2B * (extraTopUpPct / 100)) / 3;
      return 22.22 + add;
    }
    if (positiveFuture) return 22.22;
    return hourlyWage;
  }, [positiveFuture, fondsPct, extraTopUpPct, hourlyWage]);

  const anSozialAmtDisplay = displayHourlyWage * (anSozialPct / 100);
  const steuerAmtDisplay = displayHourlyWage * (steuerSchaetzungPct / 100);
  const netHourlyDisplay = displayHourlyWage - anSozialAmtDisplay - steuerAmtDisplay;

  const agCostPerHourDisplay = useMemo(
    () => displayHourlyWage * (1 + (agSozialPct + urlaubKrankPct) / 100),
    [displayHourlyWage]
  );
  const agOverheadAmtDisplay = useMemo(
    () => displayHourlyWage * ((agSozialPct + urlaubKrankPct) / 100),
    [displayHourlyWage]
  );

  const goldRange = !positiveFuture && hourlyWage >= 25 && hourlyWage < 30;
  const blueRange = !positiveFuture && hourlyWage >= 30 && hourlyWage <= 35;

  const ringTitle = "Überfluss der Zukunft gestaltet:";
  const stageLabel = useMemo(
    () => computeStageLabel(positiveFuture, fondsPct),
    [positiveFuture, fondsPct]
  );

  const overflowSharePct = useMemo(
    () => (positiveFuture ? cappedFonds : 0),
    [positiveFuture, cappedFonds]
  );
  const THRESH_LOW = 33.33;
  const THRESH_GROWTH = 44.44;
  const status = useMemo(() => {
    if (b2bEffective < THRESH_LOW)
      return {
        label: "Qualität und Rücklagen sind ungesichert.",
        badgeClass:
          "inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs bg-red-900/30 text-red-300 border-red-700",
      };
    if (b2bEffective <= THRESH_GROWTH)
      return {
        label: "Qualität stabilisiert sich, Rücklagen wachsen.",
        badgeClass:
          "inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs bg-yellow-900/20 text-yellow-300 border-yellow-700",
      };
    return {
      label: "Ausbau von Qualität, Rücklagen und gemeinsamer Zukunft.",
      badgeClass:
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs bg-emerald-900/20 text-emerald-300 border-emerald-700",
    };
  }, [b2bEffective]);

  useEffect(() => {
    if (positiveFuture) setHourlyWage(22.22);
  }, [positiveFuture]);
  useEffect(() => {
    if (!positiveFuture || fondsPct < 33) setExtraTopUpPct(0);
  }, [positiveFuture, fondsPct]);
  useEffect(() => {
    if (!positiveFuture) setWageField(String(Math.round(hourlyWage)));
  }, [hourlyWage, positiveFuture]);

  // Schrittweise Anpassung per Buttons (clamped 15–35)
  const stepWage = (delta: number) => {
    if (positiveFuture) return;
    const base = Number.isFinite(Number(wageField)) ? Number(wageField) : hourlyWage;
    const next = Math.max(15, Math.min(35, Math.round(base + delta)));
    setHourlyWage(next);
    setWageField(String(next));
  };

  const splitDisplay = useMemo(() => {
    const base = agCostPerHourDisplay;
    const overhead = base * (overheadPct / 100);
    const travel = base * (travelPrepCoordPct / 100);
    const risk = base * (riskBufferPct / 100);
    const profit = base * (profitPct / 100);
    return { base, overhead, travel, risk, profit };
  }, [agCostPerHourDisplay, overheadPct, travelPrepCoordPct, riskBufferPct, profitPct]);

  const opsCostSumDisplay = useMemo(
    () => splitDisplay.overhead + splitDisplay.travel + splitDisplay.risk + splitDisplay.profit,
    [splitDisplay]
  );
  const companyOpsTotalDisplay = useMemo(
    () => agOverheadAmtDisplay + opsCostSumDisplay,
    [agOverheadAmtDisplay, opsCostSumDisplay]
  );

  const InactiveBadgeDescription = () => {
    if (positiveFuture) return null;
    if (hourlyWage >= 25 && hourlyWage < 30) {
      return null;
    }
    if (hourlyWage >= 30 && hourlyWage <= 35) {
      return null;
    }
    if (b2bEffective < THRESH_LOW) {
      return (
        <p className="text-xs mt-2 text-red-700">
          Die Basis für unternehmerisches Wachstum fehlt.
          <br />
          Die gesellschaftlich förderliche Wirkung bleibt aus.
        </p>
      );
    }
    if (b2bEffective <= THRESH_GROWTH) {
      return (
        <p className="text-xs mt-2 text-yellow-800">
          Eine solide Basis formt sich – die Aufbauphase eines Unternehmens, in der Chancen für
          Qualität und die Entfaltung seiner Dienstleistungen entstehen.
        </p>
      );
    }
    return (
      <p className="text-xs mt-2 text-[#008d39]">
        Wirkungsbereiter Überfluss ermöglicht Wachstum und Investitionen. Beiträge spiegeln Qualität
        und sichern den Vermögensaufbau. <strong>Eine Basis, die es erlaubt, über sich hinauszuwachsen – und eine gesellschaftlich förderliche Haltung einzunehmen.</strong>
      </p>
    );
  };

  const showSwitch = positiveFuture || hourlyWage >= 22.22;

  const HintText: React.FC = () => {
    if (!showSwitch) {
      return (
        <>Passe den Arbeitnehmer-Bruttolohn an und entdecke, was passiert, wenn Werte gerecht geteilt werden.</>
      );
    }
    if (!positiveFuture) {
      return <>Klick hier und erlebe, wie dein Beitrag die Zukunft nachhaltig gestaltet.</>;
    }
    if (fondsPct >= 33) {
      return (
        <>
          <strong>Herzlichen Glückwunsch 🎉</strong>
          <br />
          Du schwingst nun auf einer neuen Frequenz – einer Wellenlänge, die deine Vorstellung von
          Harmonie trägt und deine Umgebung, und damit deine Realität, formt.
        </>
      );
    }
    if (fondsPct >= 22) {
      return (
        <>
          <strong>Die Geldflüsse werden transparent und greifbar</strong> – du siehst, wie Zukunft
          durch gemeinsame Gestaltung entsteht, <strong>wenn Überfluss in Bewegung kommt.</strong>
        </>
      );
    }
    if (fondsPct >= 10) {
      return (
        <>
          So richtet sich das System neu aus – hin zu einer <strong>Haltung, die gesellschaftlich
          förderlich wirkt und über sich hinauswächst.</strong>
        </>
      );
    }
    return (
      <>
        Jetzt wird sichtbar, wie dein Beitrag wirkt – und wie du, durch Investition in Unternehmen
        mit deinen Werten, selbst zum Gestalter wirst.
      </>
    );
  };

  return (
    <section id="transparenz" className="pt-0 pb-12 text-slate-200 [scrollbar-gutter:stable] text-left">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Linke Spalte: Eingaben */}
        <Card className="bg-[#1c1c1d] border border-slate-700 text-slate-200 rounded-3xl">
          <CardHeader>
            <CardTitle>Eingaben</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm ${
                positiveFuture
                  ? "bg-[#d4a017]/15 text-[#d4a017] border-[#d4a017]/30"
                  : "bg-cyan-900/30 text-cyan-300 border-cyan-700"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span>
                  <HintText />
                </span>
                {!positiveFuture && showSwitch && (
                  <span className="inline-block animate-bounce temporary-bounce text-xl translate-y-3">
                    ↓
                  </span>
                )}
              </div>
            </div>

            {showSwitch && (
              <div className="flex items-center justify-between rounded-md border bg-[#1f2021] border-slate-700 px-3 py-2">
                <Label className="text-sm">
                  {getSwitchLabel(positiveFuture, fondsPct)}
                </Label>
                <input
                  type="checkbox"
                  checked={positiveFuture}
                  onChange={(e) => setPositiveFuture(e.target.checked)}
                  className="h-4 w-4 accent-[#d4a017]"
                />
              </div>
            )}

            {positiveFuture && (
              <div className="relative">
                <Label htmlFor="fonds">
                  {fondsPct >= 33
                    ? "Der Wirkungsfonds in voller Resonanz"
                    : "Der Wirkungsfonds für unsere Zukunft"}
                </Label>
                <input
                  id="fonds"
                  type="range"
                  min={0}
                  max={33}
                  step={0.5}
                  value={fondsPct}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    const snapped = Math.abs(v - 33) <= 0.5 ? 33 : v;
                    setFondsPct(snapped);
                  }}
                  className="w-full accent-[#d4a017]"
                />
                <div className="absolute top-1/2 -translate-y-1/2 w-px h-4 bg-slate-300" style={{ left: "33%" }} />
                <div className="text-xs text-slate-400 mt-1">
                  Zielmarke 33%/h für eine gemeinsame Wirkung
                </div>
              </div>
            )}

            {!positiveFuture && (
              <div>
                <Label htmlFor="wage">Arbeitnehmer-Brutto €/h</Label>
                <div className="flex items-stretch gap-2 w-full">
                  <Input
                    id="wage"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    value={wageField}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/[^0-9]/g, "");
                      setWageField(digits);
                    }}
                    onBlur={() => {
                      const n = Number(wageField);
                      const clamped = Number.isFinite(n)
                        ? Math.max(15, Math.min(35, n))
                        : 15;
                      setHourlyWage(clamped);
                      setWageField(String(Math.round(clamped)));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        stepWage(1);
                        return;
                      }
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        stepWage(-1);
                        return;
                      }
                      if (e.key === "Enter") {
                        const n = Number(wageField);
                        const clamped = Number.isFinite(n)
                          ? Math.max(15, Math.min(35, n))
                          : 15;
                        setHourlyWage(clamped);
                        setWageField(String(Math.round(clamped)));
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    disabled={positiveFuture}
                    readOnly={positiveFuture}
                    className={`h-10 flex-1 min-w-0 bg-slate-800 text-slate-200 border border-slate-700 ${
                      blueRange ? " ring-1 ring-cyan-700 text-cyan-200" : ""
                    } ${goldRange ? " bg-[#d4a017]/10" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    aria-label="Wert verringern"
                    className="h-10 w-11 bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 focus:ring-2 focus:ring-slate-600"
                    onClick={() => stepWage(-1)}
                  >
                    <Minus className="w-4 h-4" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    aria-label="Wert erhöhen"
                    className="h-10 w-11 bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 focus:ring-2 focus:ring-slate-600"
                    onClick={() => stepWage(1)}
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            )}

            {positiveFuture ? (
              <>
                <DropdownSection title="Arbeitnehmer-Brutto €/h" defaultOpen={!positiveFuture}>
                  <div>
                    <Input
                      type="text"
                      value={eur(displayHourlyWage)}
                      disabled
                      readOnly
                      className="bg-slate-800 text-slate-200 border-slate-700"
                    />
                  </div>
                </DropdownSection>
                <DropdownSection title="Unternehmer-Kosten €/h" defaultOpen={!positiveFuture}>
                  <div>
                    <Input
                      type="text"
                      value={eur(companyOpsTotalDisplay)}
                      disabled
                      readOnly
                      className="bg-slate-800 text-slate-200 border-slate-700"
                    />
                    <div className="mt-1 text-xs text-slate-500">
                      AG-Aufschlag + Betriebskosten (€/h)
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                    <div>
                      <Input
                        type="text"
                        value={eur(agOverheadAmtDisplay)}
                        disabled
                        readOnly
                        className="bg-slate-800 text-slate-200 border-slate-700"
                      />
                      <div className="mt-1 text-xs text-slate-500">AG-Aufschlag €/h</div>
                    </div>
                    <div>
                      <Input
                        type="text"
                        value={eur(opsCostSumDisplay)}
                        disabled
                        readOnly
                        className="bg-slate-800 text-slate-200 border-slate-700"
                      />
                      <div className="mt-1 text-xs text-slate-500">Betriebskosten €/h</div>
                    </div>
                  </div>
                </DropdownSection>

                {fondsPct >= 33 && (
                  <div className="w-full">
                    <Button
                      type="button"
                      className="w-full rounded-md px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white font-semibold shadow-lg shadow-cyan-700/20 border border-cyan-600"
                    >
                      Finde deinen passenden Experten!
                    </Button>
                  </div>
                )}

                <div
                  className={
                    fondsPct < 33
                      ? "inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs bg-[#d4a017]/90 text-white border-[#d4a017]"
                      : "inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs bg-cyan-900/30 text-cyan-300 border-cyan-700"
                  }
                >
                  {fondsPct >= 33 ? (
                    <span className="whitespace-pre-line">
                      Jetzt wird es spannend:
                      <br />
                      <strong>Eine Vision wird zur gelebten Bewegung.</strong>
                    </span>
                  ) : (
                    <span className={`whitespace-pre-line ${fondsPct < 33 ? "font-semibold" : ""}`}>
                      {stageLabel}
                    </span>
                  )}
                </div>

                {fondsPct < 10 ? (
                  <p className="text-xs mt-2" style={{ color: "#d4a017" }}>
                    Du siehst die erste faire Verteilung:
                    <br />
                    <strong>Team, Betrieb und Basisrücklagen.</strong>
                    <br />
                    Echte Transparenz statt bloßem Bauchgefühl – für eine Dienstleistung, die sich im
                    Sinne aller entfaltet.
                  </p>
                ) : fondsPct < 22 ? (
                  <p className="text-xs mt-2" style={{ color: "#d4a017" }}>
                    Du erlebst, wie wirkungsbereiter Überfluss Investitionen fließen lässt – zurück
                    in die Bewegung, die gemeinsames Wachstum trägt.{" "}
                    <strong>Eine Wirtschaft aus Wahrheit und Verantwortung.</strong>
                  </p>
                ) : fondsPct < 33 ? (
                  <p className="text-xs mt-2" style={{ color: "#d4a017" }}>
                    <strong>Du wirkst!</strong> – gemeinsam mit dem werteverbundenen Unternehmen, in
                    das du bewusst investierst.
                    <br />
                    <strong>
                      Es entsteht ein Wirkraum: eine Gemeinschaft, die auf gesellschaftlichen Wohlstand und gemeinsame Entwicklung baut.
                    </strong>
                  </p>
                ) : (
                  <p className="text-xs text-cyan-300 mt-2">
                    Du bist nun Träger von Informationen, die durch deinen Beitrag aktiv die Zukunft
                    gestalten. <strong>Das Fundament steht damit in Symbiose – ein Gleichgewicht aus
                    Geben, Nehmen und Wirken.</strong>
                  </p>
                )}
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="net">Arbeitnehmer-Netto €/h (Schätzung)</Label>
                  <Input
                    id="net"
                    type="text"
                    value={eur(netHourlyDisplay)}
                    disabled
                    readOnly
                    className="bg-slate-800 text-slate-200 border-slate-700"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Hinweis: Netto-Schätzung basiert auf Arbeitnehmer-Abgaben (Sozialversicherung ca.{" "}
                  {anSozialPct}%, Steuer-Schätzung ~{steuerSchaetzungPct}%).
                </p>
                <div>
                  <Label>AG-Kosten zur Realisierung des AN-Brutto €/h</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                    <div>
                      <Input
                        type="text"
                        value={eur(agOverheadAmtDisplay)}
                        disabled
                        readOnly
                        className="bg-slate-800 text-slate-200 border-slate-700"
                      />
                      <div className="mt-1 text-xs text-slate-500">AG-Aufschlag €/h</div>
                    </div>
                    <div>
                      <Input
                        type="text"
                        value={eur(agCostPerHourDisplay)}
                        disabled
                        readOnly
                        className="bg-slate-800 text-slate-200 border-slate-700"
                      />
                      <div className="mt-1 text-xs text-slate-500">AG-Kosten gesamt €/h</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!positiveFuture && (
              <>
                {goldRange || blueRange ? (
                  <div
                    className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs ${
                      blueRange
                        ? "bg-cyan-900/30 text-cyan-300 border-cyan-700"
                        : "bg-[#d4a017]/15 text-[#d4a017] border-[#d4a017]/30"
                    }`}
                  >
                    {blueRange ? (
                      <span className="whitespace-pre-line">
                        <strong>Sei mutig, sei kreativ!</strong>
                        <br />
                        Du bringst deine Werte in eine gemeinsame Ausrichtung – und darfst aussprechen, was dir wirklich wichtig ist.
                      </span>
                    ) : (
                      <div className="flex w-full items-center justify-between">
                        <span>
                          Du bist bereit die Zukunft aktiv mitzugestalten.{" "}
                          <strong>¡Aktiviere den Zukunftsmodus!</strong>
                        </span>
                        <span className="inline-block animate-bounce temporary-bounce text-xl self-start mt-1">
                          ↑
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={status.badgeClass}>{status.label}</div>
                )}
                <InactiveBadgeDescription />
              </>
            )}

            {positiveFuture && cappedFonds >= 33 && (
              <div className="flex flex-col gap-3">
                <div className="text-base md:text-xl font-extrabold text-cyan-700 leading-snug tracking-tight">
                  Direkt unterstützen
                  <br />
                  und ohne Schleier wirken
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {[11, 22, 33].map((p) => (
                    <button
                      key={p}
                      onClick={() => setExtraTopUpPct(p)}
                      className={`text-xs px-2.5 py-1 rounded-md border ${
                        extraTopUpPct === p
                          ? "bg-cyan-600 text-white border-cyan-600"
                          : "bg-cyan-900/30 text-cyan-300 border-cyan-700"
                      }`}
                    >
                      +{p}%
                    </button>
                  ))}
                  {extraTopUpPct > 0 && (
                    <button
                      onClick={() => setExtraTopUpPct(0)}
                      className="text-xs px-2.5 py-1 rounded-md border bg-cyan-900/30 text-cyan-300 border-cyan-700 hover:bg-cyan-800/40"
                    >
                      Zurücksetzen
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs whitespace-nowrap">Eigener Zusatz:</Label>
                  <input
                    type="range"
                    min={34}
                    max={100}
                    step={1}
                    value={Math.max(34, extraTopUpPct || 34)}
                    onChange={(e) => setExtraTopUpPct(Math.max(34, Math.round(Number(e.target.value) || 34)))}
                    className="w-40 accent-cyan-400"
                  />
                  <span className="text-xs text-cyan-300">
                    +{extraTopUpPct > 0 ? extraTopUpPct : 34}%
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rechte Spalte */}
        <Card className="md:col-span-2 bg-[#1c1c1d] border border-slate-700 text-slate-200 rounded-3xl">
          <CardHeader>
            <CardTitle>Aufteilung und Wirkung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-slate-400">B2B Partner-Stundensatz</div>
                <div className="text-3xl font-bold tracking-tight">{eur(b2cFinal / 1.19)}</div>
                <div className="mt-2 text-xs text-slate-400">
                  ohne Umsatzsteuer · enthält: Betrieb {overheadPct}% · Fahrt/Rüst/Koord. {travelPrepCoordPct}% · Risiko {riskBufferPct}% · Gewinn {profitPct}%
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">B2C Kunden-Stundensatz (inkl. 19% Umsatzsteuer)</div>
                <div className="text-4xl font-extrabold tracking-tight">{eur(b2cFinal)}</div>
              </div>
            </div>

            {positiveFuture && (
              <div className="mt-8 grid md:grid-cols-2 gap-6 items-start">
                <div className="flex justify-center">
                  <OverflowChart
                    mode="split"
                    costColor="#275a2a"
                    overflowColor="#d4a017"
                    overflowSharePct={overflowSharePct}
                    showCenterPct
                    size={180}
                    stroke={18}
                    align="center"
                    pulseLevel={0}
                    extraTopUpPct={extraTopUpPct}
                  />
                </div>
                <div>
                  <div className="mb-2 inline-flex items-center px-3 py-1.5 rounded-md bg-[#d4a017]/15 text-[#d4a017] font-semibold text-sm">
                    { "Überfluss der Zukunft gestaltet:" }
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div className="flex items-start gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full mt-0.5 flex-shrink-0"
                        style={{ backgroundColor: "#275a2a" }}
                      />
                      <span className="whitespace-pre-line">
                        Eine gesunde Kooperation auf Augenhöhe:
                        <br />
                        <strong>Geteilte Verantwortung, geteilter Ertrag – gemeinsamer Nutzen.</strong>
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full mt-0.5 flex-shrink-0"
                        style={{ backgroundColor: "#d4a017" }}
                      />
                      <span>
                        Ein transparenter Überfluss – getragen von Vertrauen, geteilt in Balance, und wirksam im Aufbau einer gemeinsamen Zukunft.
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="secondary">Mehr über Transparenz und Wirkung</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 md:flex md:items-start gap-6 space-y-4 md:space-y-0">
              <div className="w-full md:w-1/2">
                <DropdownSection title="Transparenter Rechenweg" defaultOpen={!positiveFuture}>
                  <div className="text-sm bg-[#1c1c1d] border border-slate-700 rounded-xl p-4 text-slate-200">
                    <div className="flex items-center justify-between">
                      <span>Arbeitnehmer-Brutto €/h</span>
                      <span className="font-medium">{eur(displayHourlyWage)}</span>
                    </div>
                    <div className="mt-2 text-slate-500">− Arbeitnehmer-Abzüge</div>
                    <ul className="ml-4 mt-1 list-disc text-xs text-slate-300 space-y-1">
                      <li>Sozialversicherung ca. {anSozialPct}% → {eur(anSozialAmtDisplay)}</li>
                      <li>Steuern (Schätzung) ~{steuerSchaetzungPct}% → {eur(steuerAmtDisplay)}</li>
                    </ul>
                    <div className="mt-2 flex items-center justify-between border-t pt-2">
                      <span>Arbeitnehmer-Netto €/h</span>
                      <span className="font-semibold">{eur(netHourlyDisplay)}</span>
                    </div>
                    <div className="mt-3 text-slate-500">→ Arbeitgeber-Kosten pro Stunde</div>
                    <ul className="ml-4 mt-1 list-disc text-xs text-slate-300 space-y-1">
                      <li>Arbeitnehmer-Brutto {eur(displayHourlyWage)}</li>
                      <li>+ Arbeitgeberbeiträge zur Sozialversicherung {anSozialPct}%</li>
                      <li>+ Urlaubs- und Krankheitszuschlag {urlaubKrankPct}%</li>
                    </ul>
                    <div className="mt-2 flex items-center justify-between border-t pt-2">
                      <span>Arbeitgeber-Kosten €/h</span>
                      <span className="font-semibold">{eur(agCostPerHourDisplay)}</span>
                    </div>
                  </div>
                </DropdownSection>
              </div>

              <div className="w-full md:w-1/2">
                <DropdownSection title="Aufteilung Betriebskosten" defaultOpen={!positiveFuture}>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 rounded-2xl bg-[#1f2021] border border-slate-700">
                      <div className="text-slate-400">Betrieb</div>
                      <div className="font-semibold">{eur(splitDisplay.overhead)}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#1f2021] border border-slate-700">
                      <div className="text-slate-400">Fahrt/Rüst/Koord.</div>
                      <div className="font-semibold">{eur(splitDisplay.travel)}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#1f2021] border border-slate-700">
                      <div className="text-slate-400">Risiko/Rücklagen</div>
                      <div className="font-semibold">{eur(splitDisplay.risk)}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#1f2021] border border-slate-700">
                      <div className="text-slate-500 break-words">
                        Gewinn/
                        <br />
                        Unternehmerlohn
                      </div>
                      <div className="font-semibold">{eur(splitDisplay.profit)}</div>
                    </div>
                  </div>
                </DropdownSection>
              </div>
            </div>

            {positiveFuture && cappedFonds >= 33 && (
              <div className="mt-8 border rounded-xl p-4 bg-cyan-900/20 border-slate-700">
                <div className="block w-full px-3 py-1.5 rounded-md bg-cyan-900/30 text-cyan-200 font-semibold leading-tight tracking-tight text-base sm:text-lg md:text-xl lg:text-2xl">
                  Und weil sich Wirkung automatisch vervielfacht, wird sie zum <strong className="font-extrabold">entscheidenden Faktor</strong> – für den Erfolg und den Ertrag des <em><u>Gebens und Nehmens.</u></em>
                </div>
                <div className="mt-3 grid md:grid-cols-2 gap-6 items-start">
                  <div className="text-xs text-slate-200 space-y-2">
                    <div className="flex items-start gap-2">
                      <span
                        className="relative inline-block mt-0.5 flex-shrink-0"
                        style={{ width: 28, height: 28 }}
                      >
                        <span className="absolute inset-0 rounded-full border-2 border-cyan-600" />
                        <span
                          className="absolute rounded-full border-2 border-cyan-400"
                          style={{ top: 5, right: 5, bottom: 5, left: 5, position: "absolute" }}
                        />
                      </span>
                      <span>
                        Mit deiner bewussten Unterstützung stärkst du nicht nur unsere Vision und den
                        Aufbau eines transparenten, fairen Wirtschaftssystems –<br />
                        du öffnest zugleich den Raum, in dem sich deine eigene Vorstellung von
                        Zukunft verwirklichen kann.
                        <br />
                        <br />
                        <strong>
                          Gemeinsam übersetzen wir Werte in Wirkung – Schritt für Schritt, bewusst und sichtbar.
                        </strong>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {extraTopUpPct === 0 ? (
                      <>
                        <div className="text-sm font-semibold italic">
                          <strong>Wirkung wird sichtbar, sobald du dich entscheidest, Teil des Wandels zu sein.</strong>
                        </div>
                        <Button variant="secondary" disabled className="inline-flex items-center gap-2">
                          <Lock className="w-7 h-7" aria-hidden="true" />
                          Einblicke für Unterstützer
                        </Button>
                        <div className="mt-2 text-xs text-slate-100 space-y-1">
                          <div>
                            Setze ein bewusstes Zeichen – unterstütze diese Bewegung, um Wirkung sichtbar zu machen.
                          </div>
                          <div className="flex items-start gap-1">
                            <Lock className="w-7 h-7 mt-[1px]" aria-hidden="true" />
                            <span>
                              Frühzeitige Einblicke in erweiterte Philosophie, Nutzen, ROI &amp; wirksame Handlungsansätze.
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-semibold italic">
                          <strong>Wirkung wird sichtbar, sobald du dich entscheidest, Teil des Wandels zu sein.</strong>
                        </div>
                        <Button className="inline-flex items-center gap-2 bg-cyan-200 text-slate-900 hover:bg-cyan-100 border border-cyan-300">
                          <Unlock className="w-7 h-7" aria-hidden="true" />
                          Einblicke für Unterstützer
                        </Button>
                        <div className="mt-2 text-xs text-slate-300 space-y-1">
                          <div>
                            Deine Unterstützung wird zur Bewegung – dieses Vertrauen trägt unsere Philosophie in die Welt.
                          </div>
                          <div className="flex items-start gap-1">
                            <Unlock className="w-7 h-7 mt-[1px] text-slate-100" aria-hidden="true" />
                            <span>
                              Frühzeitige Einblicke in erweiterte Philosophie, Nutzen, ROI &amp; wirksame Handlungsansätze.
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/**
 * Banner mit Toggle – bindet den Rechner unten nahtlos ein
 */
export default function OneBannerIsolated() {
  const [open, setOpen] = useState(false);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<string | number>(0);

  // Auto-Height Animation
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    if (open) {
      const h = el.scrollHeight;
      requestAnimationFrame(() => setHeight(h));
    } else {
      requestAnimationFrame(() => setHeight(0));
    }
  }, [open]);

  // Recalc on resize/content changes
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const ro = new ResizeObserver(() => {
      if (panelRef.current) setHeight(panelRef.current.scrollHeight);
    });
    ro.observe(panelRef.current);
    return () => ro.disconnect();
  }, [open]);

  return (
    <section className="relative bg-[#161617] text-white">
      <div className="max-w-6xl mx-auto px-4 py-[44px]">
        <div
          className={
            "text-slate-200" +
            (!open
              ? " rounded-3xl bg-[#1c1c1d] border border-slate-700 px-4 py-10 sm:px-4 sm:py-14 md:rounded-none md:bg-transparent md:border-0 md:px-0 md:py-0"
              : " px-0 py-0")
          }
        >
          {/* Zeile: Icon One + Text + Button */}
          <div className="my-0 flex flex-col md:flex-row items-center md:items-center md:justify-between gap-5 md:gap-8">
            {/* Linker Block: Schritt EINS */}
            <div className="inline-flex items-baseline gap-3 shrink-0">
              <div className="font-semibold tracking-tight text-[36px] sm:text-[40px] md:text-[44px]">
                Schritt{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                  EINS
                </span>
              </div>
            </div>

            {/* Text */}
            {open ? (
              <p className="text-[20px] sm:text-[22px] leading-snug font-semibold text-center md:text-center">
                Mit dem{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-cyan-500 to-cyan-300 bg-clip-text text-transparent font-extrabold">
                  TRANSPARENZ
                </span>
                -Rechner zeigen wir
                <br className="hidden md:block" /> dir, wie es wirklich hinter den Zahlen aussieht.
              </p>
            ) : (
              <p className="text-[20px] sm:text-[22px] leading-snug font-semibold text-center md:text-center">
                Sieh live, wie deine Entscheidung <br className="hidden md:block" /> den Unterschied
                macht.
              </p>
            )}

            {/* Button */}
            <button
              type="button"
              aria-expanded={open}
              aria-controls="transparenz-rechner-panel"
              onClick={() => setOpen((v) => !v)}
              data-testid="toggle-rechner"
              className="inline-flex items-center justify-center rounded-full bg-[#1c1c1d] text-slate-200 border border-slate-700 px-6 py-3 text-[15px] font-medium hover:bg-[#2a2a2b] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
            >
              {open ? "Transparenz-Rechner schließen" : "Transparenz-Rechner öffnen"}
            </button>
          </div>

          {/* Kollapsbereich */}
          <div
            id="transparenz-rechner-panel"
            style={{ height, transition: "height 360ms ease" }}
            className="overflow-hidden"
            data-testid="rechner-panel"
          >
            <div ref={panelRef} className="pt-[44px]">
              {/* Dezente Trennlinie nur Desktop */}
              <div className="hidden md:block border-t border-slate-700/60" />
              {/* Top-Padding des Rechners: mobil 0px, Desktop 22px */}
              <div className="pt-0 md:pt-[22px]">
                <TransparencyCalculatorIsolated />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
