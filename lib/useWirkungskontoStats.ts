"use client";

import * as React from "react";
import { supabase } from "@/lib/supabaseClient";

type InvoiceRow = {
  id: string;
  total_amount: number | string | null;
  labor_minutes: number | null;
  hourly_rate_net: number | string | null;
  pricing_divisor: number | string | null;
};

type ParticipantRow = {
  invoice_id: string;
  participant_id: string;
  purchase_net: number | string | null;
  pricing_divisor: number | string | null;
};

type LaborStepRow = {
  invoice_id: string;
  minutes: number;
};

/* --- Helpers --- */
function toNumber(v: unknown): number {
  if (v === null || v === undefined) return 0;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}
function toCents(v: unknown): number {
  return Math.round(toNumber(v) * 100);
}

/* --- Modell-Konstanten (wie bei dir) --- */
const WORKER_SOCIAL_RATE = 0.215;
const WORKER_TAX_RATE = 0.12;
const EMPLOYER_SOCIAL_RATE = 0.215;
const VACATION_SICK_RATE = 0.103;
const PROFIT_TAX_RATE = 0.3;

const COST_WEIGHTS = { betrieb: 22, fahrt: 8, risiko: 10, gewinn: 10 };
const INPUT_VAT_BETRIEB = 0.14;
const INPUT_VAT_FAHRT = 0.159;
const SUPPLYCHAIN_ABGABEN_RATE = 0.33002;

function splitIntoThirdsCents(totalCents: number, mode: "labor" | "markup") {
  const base = Math.floor(totalCents / 3);
  const remainder = totalCents - base * 3;
  let worker = base, entrepreneur = base, impact = base;
  if (mode === "labor") {
    if (remainder >= 1) impact += 1;
    if (remainder >= 2) entrepreneur += 1;
  } else {
    if (remainder >= 1) worker += 1;
    if (remainder >= 2) impact += 1;
  }
  return { worker, entrepreneur, impact };
}

function allocByWeights(totalCents: number, weights: Record<string, number>) {
  const keys = Object.keys(weights);
  const sum = keys.reduce((a, k) => a + (weights[k] ?? 0), 0);
  const raw = keys.map((k) => ({
    key: k,
    value: (totalCents * (weights[k] ?? 0)) / sum,
  }));
  const floored = raw.map((r) => ({
    key: r.key,
    cents: Math.floor(r.value),
    frac: r.value - Math.floor(r.value),
  }));
  let used = floored.reduce((a, r) => a + r.cents, 0);
  let rest = totalCents - used;
  floored.sort((a, b) => b.frac - a.frac);
  for (let i = 0; i < floored.length && rest > 0; i++) {
    floored[i]!.cents += 1;
    rest -= 1;
  }
  const result: Record<string, number> = {};
  for (const f of floored) result[f.key] = f.cents;
  return result;
}

function splitNetNoVat_Cents(netCents: number, mode: "labor" | "markup") {
  const thirds = splitIntoThirdsCents(netCents, mode);
  const workerBase = thirds.worker;
  const entBase = thirds.entrepreneur;
  const impactBase = thirds.impact;

  const workerAbgaben = Math.round(workerBase * (WORKER_SOCIAL_RATE + WORKER_TAX_RATE));
  const workerNet = workerBase - workerAbgaben;

  const employerSocial = Math.round(entBase * EMPLOYER_SOCIAL_RATE);
  const vacation = Math.round(entBase * VACATION_SICK_RATE);

  const restForBlocks = entBase - employerSocial - vacation;
  const blocksRaw = allocByWeights(restForBlocks, COST_WEIGHTS);

  const blocks = {
    betrieb: blocksRaw.betrieb ?? 0,
    fahrt: blocksRaw.fahrt ?? 0,
    risiko: blocksRaw.risiko ?? 0,
    gewinn: blocksRaw.gewinn ?? 0,
  };

  const profitTax = Math.round(blocks.gewinn * PROFIT_TAX_RATE);
  const profitNet = blocks.gewinn - profitTax;

  const vorsteuer = Math.round(blocks.betrieb * INPUT_VAT_BETRIEB + blocks.fahrt * INPUT_VAT_FAHRT);

  // entrepreneurNet nicht gebraucht für impact, aber konsistent lassen:
  void (vacation + blocks.betrieb + blocks.fahrt + blocks.risiko + profitNet + vorsteuer);
  void workerNet;
  void workerAbgaben;
  void employerSocial;
  void profitTax;

  return { impact: impactBase };
}

function computeImpactForInvoiceCents(
  inv: InvoiceRow,
  parts: ParticipantRow[],
  laborStepsMinutes: number | null
) {
  const minutes = (laborStepsMinutes ?? null) ?? inv.labor_minutes ?? 0;
  const hourlyRateNetCents = toCents(inv.hourly_rate_net);
  const laborNetCents = Math.round((hourlyRateNetCents * minutes) / 60);

  const laborSplit = splitNetNoVat_Cents(laborNetCents, "labor");

  const materialsImpact = parts
    .filter((p) => p.purchase_net !== null && p.participant_id !== "staat")
    .reduce((a, p) => {
      const purchaseNetCents = toCents(p.purchase_net);
      const divisor = toNumber(p.pricing_divisor ?? inv.pricing_divisor ?? 0.6666666667);
      const safeDiv = divisor || 0.6666666667;

      const saleNetCents =
        Math.abs(safeDiv - 2 / 3) < 0.000001
          ? Math.round((purchaseNetCents * 3) / 2)
          : Math.round(purchaseNetCents / safeDiv);

      const markupNetCents = saleNetCents - purchaseNetCents;

      void Math.round(purchaseNetCents * SUPPLYCHAIN_ABGABEN_RATE);

      const markupSplit = splitNetNoVat_Cents(markupNetCents, "markup");
      return a + (markupSplit.impact ?? 0);
    }, 0);

  return (laborSplit.impact ?? 0) + materialsImpact;
}

export function useWirkungskontoStats(customerId: string | null) {
  const [loading, setLoading] = React.useState(false);
  const [investedEUR, setInvestedEUR] = React.useState(0);
  const [impactEUR, setImpactEUR] = React.useState(0);
  const [invoiceCount, setInvoiceCount] = React.useState(0);

  React.useEffect(() => {
    let alive = true;

    async function run() {
      if (!customerId) {
        if (!alive) return;
        setInvestedEUR(0);
        setImpactEUR(0);
        setInvoiceCount(0);
        return;
      }

      setLoading(true);
      try {
        const { data: invData, error: invErr } = await supabase
          .from("invoices")
          .select("id, total_amount, labor_minutes, hourly_rate_net, pricing_divisor")
          .eq("customer_id", customerId);

        if (invErr) throw invErr;

        const invoices = (invData ?? []) as InvoiceRow[];
        if (!alive) return;

        setInvoiceCount(invoices.length);

        const invested = invoices.reduce((a, r) => a + toNumber(r.total_amount), 0);
        setInvestedEUR(invested);

        const ids = invoices.map((i) => i.id);
        if (ids.length === 0) {
          setImpactEUR(0);
          return;
        }

        // optional labor steps
        let stepsAll: LaborStepRow[] = [];
        try {
          const { data: stepsData } = await supabase
            .from("invoice_labor_steps")
            .select("invoice_id, minutes")
            .in("invoice_id", ids);
          stepsAll = (stepsData ?? []) as LaborStepRow[];
        } catch {
          // ignore
        }

        const minutesByInvoice = new Map<string, number>();
        for (const s of stepsAll) {
          minutesByInvoice.set(s.invoice_id, (minutesByInvoice.get(s.invoice_id) ?? 0) + (s.minutes ?? 0));
        }

        // participants
        let partsAll: ParticipantRow[] = [];
        const { data: partsData } = await supabase
          .from("invoice_participants")
          .select("invoice_id, participant_id, purchase_net, pricing_divisor")
          .in("invoice_id", ids);

        partsAll = (partsData ?? []) as ParticipantRow[];

        const partsByInvoice = new Map<string, ParticipantRow[]>();
        for (const p of partsAll) {
          const arr = partsByInvoice.get(p.invoice_id) ?? [];
          arr.push(p);
          partsByInvoice.set(p.invoice_id, arr);
        }

        const impactCentsTotal = invoices.reduce((a, inv) => {
          const parts = partsByInvoice.get(inv.id) ?? [];
          const minSteps = minutesByInvoice.has(inv.id) ? (minutesByInvoice.get(inv.id) ?? 0) : null;
          return a + computeImpactForInvoiceCents(inv, parts, minSteps);
        }, 0);

        setImpactEUR(impactCentsTotal / 100);
      } catch (e) {
        console.error("useWirkungskontoStats error:", e);
        if (!alive) return;
        setInvestedEUR(0);
        setImpactEUR(0);
        setInvoiceCount(0);
      } finally {
        if (alive) setLoading(false);
      }
    }

    void run();
    return () => {
      alive = false;
    };
  }, [customerId]);

  return { loading, investedEUR, impactEUR, invoiceCount };
}