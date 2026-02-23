"use client";

import * as React from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import WirkungsfondsInfoButton from "@/components/impact/WirkungsfondsInfoButton";
import {
  FileText,
  Layers,
  Sparkles,
  Info,
  Factory,
  Briefcase,
  Scale,
  Wrench,
  EyeOff,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────
  Supabase Client (Browser)
────────────────────────────────────────────────────────────── */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ──────────────────────────────────────────────────────────────
  Types
────────────────────────────────────────────────────────────── */

type InvoiceRow = {
  id: string;
  invoice_number: string | null;
  title: string | null;
  date: string | null;
  service_date: string | null;
  status: string | null;
  vat_rate: string | number | null;

  labor_minutes: number | null;
  hourly_rate_net: string | number | null;

  pricing_divisor: string | number | null;

  impact_service_pct: string | number | null;
  impact_social_pct: string | number | null;
  impact_future_pct: string | number | null;

  public_enabled: boolean | null;
  public_token: string | null;

  customer_id: string | null;

  // ✅ neu: frei formulierbarer Mittelteil für den Satz "Ihr Auftrag sorgt dafür, dass ..."
  customer_story: string | null;
};

type ParticipantRow = {
  id: string;
  invoice_id: string;
  participant_id: string;
  label: string;
  description: string | null;
  role: string | null;
  icon_key: string | null;
  sort_order: number;
  is_clickable: boolean;

  purchase_net: string | number | null;
  pricing_divisor: string | number | null;
};

type DocumentRow = {
  id: string;
  invoice_id: string;
  participant_id: string;
  doc_type: string;
  page_index: number;
  storage_bucket: string;
  storage_path: string;
  mime_type: string | null;
};

type DocWithUrl = DocumentRow & { signedUrl?: string | null };

// Optional: Arbeits-Etappen (für die Lohnkosten-Tabelle)
type LaborStepRow = {
  id: string;
  invoice_id: string;
  label: string;
  description: string | null;
  minutes: number;
  sort_order: number;
};

/* ──────────────────────────────────────────────────────────────
  Money helpers (in Cents – stabil gegen Rundungsfehler)
────────────────────────────────────────────────────────────── */

function toNumber(v: unknown): number {
  if (v === null || v === undefined) return 0;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

function toCents(v: unknown): number {
  return Math.round(toNumber(v) * 100);
}

function centsToEUR(cents: number): number {
  return cents / 100;
}

function fmtEURFromCents(cents: number): string {
  const n = centsToEUR(cents);
  return (
    new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n) + " €"
  );
}

function fmtPct(v: unknown): string {
  const n = toNumber(v);
  return new Intl.NumberFormat("de-DE", {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(n);
}

/** DD.MM.YYYY (immer 2-stellig) */
function formatDateDE8(dateISO: string | null | undefined) {
  if (!dateISO) return "–";
  const d = new Date(dateISO);
  if (Number.isNaN(d.getTime())) return String(dateISO);
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

const TEASER_PREVIEW_PAGES = [
  "/images/teaser/invoice-page-1.jpg",
  "/images/teaser/invoice-page-2.jpg",
  "/images/teaser/invoice-page-3.jpg",
  "/images/teaser/invoice-page-4.jpg",
] as const;

const SERVICE_PROVIDER_TEASER = TEASER_PREVIEW_PAGES[0]!;
const OTHER_TEASERS = [
  TEASER_PREVIEW_PAGES[1]!,
  TEASER_PREVIEW_PAGES[2]!,
  TEASER_PREVIEW_PAGES[3]!,
] as const;

// exakt wie im Teaser (FNV-1a 32-bit)
function hashStringToUInt(str: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// exakt wie im Teaser: wohnenwo => page1, sonst stabile Rotation page2-4
function teaserUrlForParticipant(participantId: string, tokenSeed: string): string {
  if (participantId === "wohnenwo") return SERVICE_PROVIDER_TEASER;
  const h = hashStringToUInt(`${tokenSeed}:${participantId}`);
  const idx = h % OTHER_TEASERS.length;
  return OTHER_TEASERS[idx] ?? SERVICE_PROVIDER_TEASER;
}

/* ──────────────────────────────────────────────────────────────
  Modell-Konstanten
────────────────────────────────────────────────────────────── */

const WORKER_SOCIAL_RATE = 0.215;
const WORKER_TAX_RATE = 0.12;

const EMPLOYER_SOCIAL_RATE = 0.215;

const VACATION_SICK_RATE = 0.103;

const PROFIT_TAX_RATE = 0.30;

const COST_WEIGHTS = {
  betrieb: 22,
  fahrt: 8,
  risiko: 10,
  gewinn: 10,
};

const INPUT_VAT_BETRIEB = 0.14;
const INPUT_VAT_FAHRT = 0.159;

/** minimal angepasst, damit Beispielwerte sauber in Cents aufgehen */
const SUPPLYCHAIN_ABGABEN_RATE = 0.33002;

/* ──────────────────────────────────────────────────────────────
  Split Helpers
────────────────────────────────────────────────────────────── */

type SplitMode = "labor" | "markup";

/**
 * Drittel-Aufteilung in Cents mit festem „Rest-Cent“-Verteilprinzip.
 * - labor: Rest zuerst auf Impact
 * - markup: Rest zuerst auf Worker
 */
function splitIntoThirdsCents(totalCents: number, mode: SplitMode) {
  const base = Math.floor(totalCents / 3);
  const remainder = totalCents - base * 3;

  let worker = base;
  let entrepreneur = base;
  let impact = base;

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

function splitNetNoVat_Cents(netCents: number, mode: SplitMode) {
  const thirds = splitIntoThirdsCents(netCents, mode);
  const workerBase = thirds.worker;
  const entBase = thirds.entrepreneur;
  const impactBase = thirds.impact;

  const workerAbgaben = Math.round(
    workerBase * (WORKER_SOCIAL_RATE + WORKER_TAX_RATE)
  );
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

  // Vorsteuer: als Gesamtsumme runden
  const vorsteuer = Math.round(
    blocks.betrieb * INPUT_VAT_BETRIEB + blocks.fahrt * INPUT_VAT_FAHRT
  );

  const entrepreneurNet =
    vacation +
    blocks.betrieb +
    blocks.fahrt +
    blocks.risiko +
    profitNet +
    vorsteuer;

  const abgaben = Math.max(
    0,
    workerAbgaben + employerSocial + profitTax - vorsteuer
  );

  const impact = impactBase;
  const inSystem = workerNet + entrepreneurNet + impact;

  return {
    workerNet,
    entrepreneurNet,
    impact,
    abgaben,
    inSystem,
    workerAbgaben,
    employerSocial,
    vacation,
    blocks,
    profitTax,
    vorsteuer,
  };
}

function splitLaborNetToGross_Cents(laborNetCents: number, vatRate: number) {
  const vatOut = Math.round(laborNetCents * vatRate);
  const gross = laborNetCents + vatOut;

  const split = splitNetNoVat_Cents(laborNetCents, "labor");

  const vatPayable = Math.max(0, vatOut - split.vorsteuer);

  const stateTotalBase =
    split.workerAbgaben + split.employerSocial + split.profitTax + vatPayable;

  const sum =
    split.workerNet + split.entrepreneurNet + split.impact + stateTotalBase;

  const delta = gross - sum;
  const stateTotal = stateTotalBase + delta;

  return {
    laborNetCents,
    vatOut,
    vatPayable,
    gross,
    workerNet: split.workerNet,
    entrepreneurNet: split.entrepreneurNet,
    impact: split.impact,
    stateTotal,
    inSystem: gross - stateTotal,
  };
}

/* ──────────────────────────────────────────────────────────────
  Dokument-Komponenten (Supabase Signed URLs)
────────────────────────────────────────────────────────────── */

function DocsLocked() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[600px] aspect-210/297 rounded-lg border border-dashed border-slate-300 bg-white flex items-center justify-center">
        <div className="text-center px-8">
          <EyeOff className="mx-auto mb-3 h-8 w-8 text-slate-300" />
          <p className="text-[13px] font-medium text-slate-800">
            Dokumente privat
          </p>
          <p className="mt-1 text-[12px] text-slate-500 leading-snug">
            Nur Besitzer:in sieht Originale.
          </p>
        </div>
      </div>
    </div>
  );
}


function DocsBlurPreview({ src }: { src: string | null }) {
  const fallback = TEASER_PREVIEW_PAGES[0] ?? "/images/teaser/invoice-page-1.jpg";
  const used = src ?? fallback;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[600px] aspect-210/297 overflow-hidden rounded-lg shadow-sm">
        {/* Background fills the whole container */}
        <img
          src={used}
          alt="Dokumentvorschau"
          className="absolute inset-0 h-full w-full object-contain blur-md opacity-95 select-none pointer-events-none"
          loading="lazy"
        />

        {/* This makes the whole container feel “milky/blurred”, not just the image */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />

        {/* Foreground message (not blurred) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-8">
            <EyeOff className="mx-auto mb-3 h-8 w-8 text-slate-300" />
            <p className="text-[13px] font-medium text-slate-800">
              Dokumente privat
            </p>
            <p className="mt-1 text-[12px] text-slate-500 leading-snug">
              Originale nur für Berechtigte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopDocuments({
  participantLabel,
  docs,
  locked,
  previewSrc,
}: {
  participantLabel: string;
  docs: DocWithUrl[];
  locked: boolean;
  previewSrc?: string | null;
}) {
  if (locked) return <DocsBlurPreview src={previewSrc ?? null} />;

  if (docs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[600px] aspect-210/297 rounded-lg border border-dashed border-slate-300 bg-white flex items-center justify-center">
            <div className="text-center px-8">
              <FileText className="mx-auto mb-3 h-8 w-8 text-slate-300" />
              <p className="text-[13px] font-medium text-slate-800">
                Keine Dokumente hinterlegt
              </p>
              <p className="mt-1 text-[12px] text-slate-500 leading-snug">
                Für diesen Schritt der Wertschöpfung wurden noch keine
                Rechnungen, Belege oder Nachweise hinzugefügt.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const missing = docs.some((d) => !d.signedUrl);
  if (missing) return <DocsLocked />;

  return (
    <div className="space-y-6">
      {docs
        .slice()
        .sort((a, b) => a.page_index - b.page_index)
        .map((d) => (
          <div key={d.id} className="flex flex-col items-center">
            <img
              src={d.signedUrl!}
              alt={`${participantLabel} Dokument ${d.page_index}`}
              className="w-full max-w-[600px] rounded-lg shadow-sm"
              loading="lazy"
            />
          </div>
        ))}
    </div>
  );
}

function MobileDocumentsCard({
  participantLabel,
  docs,
  locked,
  previewSrc,
}: {
  participantLabel: string;
  docs: DocWithUrl[];
  locked: boolean;
  previewSrc?: string | null;
}) {
  if (locked) {
    return (
      <section className="rounded-2xl bg-white border border-slate-200 px-4 py-4 shadow-sm">
        <DocsBlurPreview src={previewSrc ?? null} />
      </section>
    );
  }

  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const sorted = React.useMemo(
    () => docs.slice().sort((a, b) => a.page_index - b.page_index),
    [docs]
  );

  React.useEffect(() => {
    setActiveIndex(0);
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: 0 });
  }, [participantLabel]);

  const pageCount = sorted.length;

  if (pageCount === 0) {
    return (
      <section className="rounded-2xl bg-white border border-slate-200 px-4 py-4 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="w-full h-[56vh] rounded-lg border border-dashed border-slate-300 bg-white flex items-center justify-center">
            <div className="text-center px-8">
              <FileText className="mx-auto mb-3 h-8 w-8 text-slate-300" />
              <p className="text-[13px] font-medium text-slate-800">
                Keine Dokumente hinterlegt
              </p>
              <p className="mt-1 text-[12px] text-slate-500 leading-snug">
                Für diesen Schritt der Wertschöpfung wurden noch keine
                Rechnungen, Belege oder Nachweise hinzugefügt.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const missing = sorted.some((d) => !d.signedUrl);
  if (missing) {
    return (
      <section className="rounded-2xl bg-white border border-slate-200 px-4 py-4 shadow-sm">
        <DocsLocked />
      </section>
    );
  }

  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollTo({ left: i * w, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.clientWidth || 1;
    const next = Math.round(el.scrollLeft / w);
    setActiveIndex((prev) => (prev === next ? prev : next));
  };

  return (
    <section className="rounded-2xl bg-white border border-slate-200 px-4 py-4 shadow-sm">
      {pageCount === 1 ? (
        <div className="flex flex-col items-center">
          <img
            src={sorted[0]!.signedUrl!}
            alt={`${participantLabel} Dokument 1`}
            className="w-full rounded-lg shadow-sm"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className={[
              "overflow-x-auto scroll-smooth",
              "flex snap-x snap-mandatory",
              "[-ms-overflow-style:none] [scrollbar-width:none]",
              "[&::-webkit-scrollbar]:hidden",
            ].join(" ")}
          >
            {sorted.map((d, idx) => (
              <div
                key={d.id}
                className="shrink-0 w-full snap-center"
                aria-label={`Dokumentseite ${idx + 1}`}
              >
                <img
                  src={d.signedUrl!}
                  alt={`${participantLabel} Dokument ${d.page_index}`}
                  className="w-full rounded-lg shadow-sm"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            {sorted.map((_, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  aria-label={`Zu Seite ${idx + 1} springen`}
                  className={[
                    "h-2.5 w-2.5 rounded-full transition",
                    active ? "bg-slate-900" : "bg-slate-300 hover:bg-slate-400",
                  ].join(" ")}
                />
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
  UI helpers
────────────────────────────────────────────────────────────── */

function iconForParticipant(participantId: string) {
  if (participantId === "staat") return <Scale className="h-4 w-4" />;
  if (participantId === "wohnenwo") return <Briefcase className="h-4 w-4" />;
  return <Factory className="h-4 w-4" />;
}

function Row(props: { label: string; value: React.ReactNode }) {
  const { label, value } = props;
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[12px] text-slate-600">{label}</span>
      <span className="text-[12px] font-medium text-slate-900 text-right">
        {value ?? "–"}
      </span>
    </div>
  );
}

function fmtOrDashEUR(cents: number) {
  if (!cents) return "– €";
  return fmtEURFromCents(cents);
}

/** Nutzt invoice.customer_story als Mittelteil (ohne leading/trailing Komma) */
function storyMiddle(invoice: InvoiceRow): string {
  const s = (invoice.customer_story ?? "").trim();
  if (s.length > 0) return s;
  // Fallback (neutral, gefällt dir)
  return "Ihr Anliegen erfolgreich umgesetzt ist";
}

/* ──────────────────────────────────────────────────────────────
  Main Page
────────────────────────────────────────────────────────────── */

export default function RechnungDetailPage() {
  const params = useParams<{ id: string }>();

  const invoiceId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : undefined;

  if (!invoiceId || invoiceId === "undefined") {
    return (
      <div className="h-full flex items-center justify-center text-slate-600 text-sm">
        Fehlende oder ungültige Invoice-ID in der URL.
      </div>
    );
  }

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [invoice, setInvoice] = React.useState<InvoiceRow | null>(null);
  const [participants, setParticipants] = React.useState<ParticipantRow[]>([]);
  const [docs, setDocs] = React.useState<DocWithUrl[]>([]);
  const [laborSteps, setLaborSteps] = React.useState<LaborStepRow[]>([]);
  const [activeParticipantId, setActiveParticipantId] =
    React.useState<string>("");
  const [canViewDocs, setCanViewDocs] = React.useState(false);
  const [authTick, setAuthTick] = React.useState(0);

  React.useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "INITIAL_SESSION" ||
        event === "SIGNED_OUT"
      ) {
        setAuthTick((t) => t + 1);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      setError(null);

      // 1) Invoice
      const invRes = await supabase
        .from("invoices")
        .select("*")
        .eq("id", invoiceId)
        .single();

      if (invRes.error) {
        if (!mounted) return;
        setError(invRes.error.message);
        setLoading(false);
        return;
      }

      // 2) Participants
      const partRes = await supabase
        .from("invoice_participants")
        .select("*")
        .eq("invoice_id", invoiceId)
        .order("sort_order", { ascending: true });

      if (partRes.error) {
        if (!mounted) return;
        setError(partRes.error.message);
        setLoading(false);
        return;
      }

      // 3) Documents
      const docRes = await supabase
        .from("invoice_documents")
        .select("*")
        .eq("invoice_id", invoiceId)
        .order("participant_id", { ascending: true })
        .order("page_index", { ascending: true });

      if (docRes.error) {
        if (!mounted) return;
        setError(docRes.error.message);
        setLoading(false);
        return;
      }

      // 4) Optional: Labor Steps
      let steps: LaborStepRow[] = [];
      try {
        const stepsRes = await supabase
          .from("invoice_labor_steps")
          .select("*")
          .eq("invoice_id", invoiceId)
          .order("sort_order", { ascending: true });

        if (!stepsRes.error) {
          steps = (stepsRes.data ?? []) as LaborStepRow[];
        }
      } catch {
        // ignore
      }

      // 5) Signed URLs + Zugriff (Owner-Check)
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id ?? null;

      const inv = invRes.data as InvoiceRow;

      // ✅ nur Owner darf Docs sehen (dein Claim schreibt customer_id = auth.uid())
      const canView = !!userId && inv.customer_id === userId;

      const docsRaw = (docRes.data ?? []) as DocumentRow[];
      let docsWithUrls: DocWithUrl[] = docsRaw.map((d) => ({ ...d, signedUrl: null }));

      if (canView) {
        docsWithUrls = await Promise.all(
          docsRaw.map(async (d) => {
            const { data, error } = await supabase.storage
              .from(d.storage_bucket)
              .createSignedUrl(d.storage_path, 60 * 60);

            return { ...d, signedUrl: error ? null : data?.signedUrl ?? null };
          })
        );
      }

      if (!mounted) return;

      setInvoice(inv);
      setCanViewDocs(canView);
      setParticipants((partRes.data ?? []) as ParticipantRow[]);
      setDocs(docsWithUrls);
      setLaborSteps(steps);

      const firstClickable =
        (partRes.data as ParticipantRow[]).find((p) => p.is_clickable)
          ?.participant_id ??
        (partRes.data as ParticipantRow[])[0]?.participant_id ??
        "";
      setActiveParticipantId(firstClickable);

      setLoading(false);
    }

    run();
    return () => {
      mounted = false;
    };
  }, [invoiceId, authTick]);

  const docsByParticipant = React.useMemo(() => {
    const map = new Map<string, DocWithUrl[]>();
    for (const d of docs) {
      const arr = map.get(d.participant_id) ?? [];
      arr.push(d);
      map.set(d.participant_id, arr);
    }
    return map;
  }, [docs]);

  const computed = React.useMemo(() => {
    if (!invoice) return null;

    const vatRate = toNumber(invoice.vat_rate ?? 0.19) || 0.19;

    // ✅ Labor minutes: immer aus Steps, wenn vorhanden
    const minutesFromSteps =
      laborSteps.length > 0
        ? laborSteps.reduce((a, s) => a + (s.minutes ?? 0), 0)
        : null;

    const minutes = minutesFromSteps ?? invoice.labor_minutes ?? 0;

    const hourlyRateNetCents = toCents(invoice.hourly_rate_net);
    const laborNetCents = Math.round((hourlyRateNetCents * minutes) / 60);

    // USt Labor separat runden
    const laborVatOutCents = Math.round(laborNetCents * vatRate);
    const laborGrossCents = laborNetCents + laborVatOutCents;

    const laborSplit = splitLaborNetToGross_Cents(laborNetCents, vatRate);

    // Materials
    const materials = participants
      .filter((p) => p.purchase_net !== null && p.participant_id !== "staat")
      .map((p) => {
        const purchaseNetCents = toCents(p.purchase_net);

        const divisor = toNumber(
          p.pricing_divisor ?? invoice.pricing_divisor ?? 0.6666666667
        );
        const safeDiv = divisor || 0.6666666667;

        // ✅ stabil für 2/3 (wenn praktisch 0.666666...)
        const saleNetCents =
          Math.abs(safeDiv - 2 / 3) < 0.000001
            ? Math.round((purchaseNetCents * 3) / 2)
            : Math.round(purchaseNetCents / safeDiv);

        const markupNetCents = saleNetCents - purchaseNetCents;

        const vatCents = Math.round(saleNetCents * vatRate);
        const grossCents = saleNetCents + vatCents;

        const prodAbgabenCents = Math.round(
          purchaseNetCents * SUPPLYCHAIN_ABGABEN_RATE
        );
        const bauteilCents = purchaseNetCents - prodAbgabenCents;

        const markupSplit = splitNetNoVat_Cents(markupNetCents, "markup");

        const stateTotalMaterialCents =
          vatCents + markupSplit.abgaben + prodAbgabenCents;

        return {
          participant_id: p.participant_id,
          label: p.label,
          description: p.description,
          purchaseNetCents,
          divisor: safeDiv,
          saleNetCents,
          markupNetCents,
          vatCents,
          grossCents,
          prodAbgabenCents,
          bauteilCents,
          markupSplit,
          stateTotalMaterialCents,
        };
      });

    // ✅ Header totals: Summe der Positionen
    const totalMaterialsNetCents = materials.reduce(
      (a, m) => a + m.saleNetCents,
      0
    );
    const totalMaterialsVatCents = materials.reduce((a, m) => a + m.vatCents, 0);
    const totalMaterialsGrossCents = materials.reduce(
      (a, m) => a + m.grossCents,
      0
    );

    const totalNetCents = laborNetCents + totalMaterialsNetCents;
    const totalVatCents = Math.round(totalNetCents * vatRate);
    const totalGrossCents = totalNetCents + totalVatCents;

    const laborInSystemCents = laborSplit.inSystem;
    const markupInSystemTotalCents = materials.reduce(
      (a, m) => a + m.markupSplit.inSystem,
      0
    );
    const serviceMehrwertCents = laborInSystemCents + markupInSystemTotalCents;

    const workerTotalCents =
      laborSplit.workerNet +
      materials.reduce((a, m) => a + m.markupSplit.workerNet, 0);

    const entrepreneurTotalCents =
      laborSplit.entrepreneurNet +
      materials.reduce((a, m) => a + m.markupSplit.entrepreneurNet, 0);

    const impactTotalCents =
      laborSplit.impact +
      materials.reduce((a, m) => a + m.markupSplit.impact, 0);

    const stateTotalModelCents =
      laborSplit.stateTotal +
      materials.reduce((a, m) => a + m.stateTotalMaterialCents, 0);

    // ✅ Cent-Diff ausgleichen (Brutto muss exakt = Service + Bauteile + Staat)
    const bauteilSumCents = materials.reduce((a, m) => a + m.bauteilCents, 0);
    const deltaToGross =
      totalGrossCents - (serviceMehrwertCents + bauteilSumCents + stateTotalModelCents);

    const stateTotalAdjustedCents = stateTotalModelCents + deltaToGross;

    // Impact Allocation
    const impactServicePct = toNumber(invoice.impact_service_pct);
    const impactSocialPct = toNumber(invoice.impact_social_pct);

    const impactServiceCents = Math.round(impactTotalCents * impactServicePct);
    const impactSocialCents = Math.round(impactTotalCents * impactSocialPct);
    const impactFutureCents = Math.max(
      0,
      impactTotalCents - impactServiceCents - impactSocialCents
    );

    return {
      vatRate,
      minutes,
      hourlyRateNetCents,
      laborNetCents,
      laborVatOutCents,
      laborGrossCents,
      laborSplit,

      materials,

      totalNetCents,
      totalVatCents,
      totalGrossCents,

      serviceMehrwertCents,
      laborInSystemCents,
      markupInSystemTotalCents,

      workerTotalCents,
      entrepreneurTotalCents,
      impactTotalCents,

      // Modell + Delta
      stateTotalModelCents,
      stateTotalAdjustedCents,

      // For tabs sum
      bauteilSumCents,
      deltaToGross,

      impactServiceCents,
      impactSocialCents,
      impactFutureCents,
    };
  }, [invoice, participants, laborSteps]);

  const uiParticipants = React.useMemo(() => {
    if (!invoice || !computed) return [];

    const byId = new Map(computed.materials.map((m) => [m.participant_id, m]));

    return participants
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((p) => {
        const isState = p.participant_id === "staat";
        const isMain = p.participant_id === "wohnenwo";
        const mat = byId.get(p.participant_id);

        let valueCents: number | null = null;

        // ✅ Tabs exakt, aber fachlich sauber:
        // - WohnenWo: Service-Mehrwert (im System)
        // - Hersteller: Bauteil
        // - Staat: Modellwert + Cent-Delta
        if (isState) valueCents = computed.stateTotalAdjustedCents;
        else if (isMain) valueCents = computed.serviceMehrwertCents;
        else if (mat) valueCents = mat.bauteilCents;

        const docs = docsByParticipant.get(p.participant_id) ?? [];

        return {
          id: p.participant_id,
          label: p.label,
          description: p.description ?? "",
          role: p.role ?? "",
          isClickable: p.is_clickable,
          icon: iconForParticipant(p.participant_id),
          valueCents,
          docs,
        };
      });
  }, [participants, docsByParticipant, invoice, computed]);

  const active = React.useMemo(() => {
    if (!uiParticipants.length) return null;
    return (
      uiParticipants.find((p) => p.id === activeParticipantId) ??
      uiParticipants[0]!
    );
  }, [uiParticipants, activeParticipantId]);

// ✅ Preview-Bild für den aktuell aktiven Tab (Rotation wie Teaser)
// Seed pro Rechnung stabil halten (public_token falls vorhanden, sonst invoice.id)
const previewSrc = React.useMemo(() => {
  if (!active || !invoice) return null;
  const seed = String(invoice.public_token ?? invoice.id);
  return teaserUrlForParticipant(active.id, seed);
}, [active?.id, invoice?.id, invoice?.public_token]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 text-sm">
        Lade Rechnung…
      </div>
    );
  }

  if (error || !invoice || !computed || !active) {
    return (
      <div className="h-full flex items-center justify-center text-slate-600 text-sm">
        {error ?? "Rechnung nicht gefunden."}
      </div>
    );
  }

  const isWohnenwo = active.id === "wohnenwo";
  const isGrohe = active.id === "grohe";
  const isHansgrohe = active.id === "hansgrohe";

  const activeMaterial =
    computed.materials.find((m) => m.participant_id === active.id) ?? null;

  const statusLabel = (invoice.status ?? "open").toLowerCase();
  const statusPill =
    statusLabel === "paid" || statusLabel === "bezahlt" ? (
      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700 border border-green-500">
        Bezahlt
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-0.5 text-[10px] font-medium text-yellow-700 border border-yellow-500">
        Offen
      </span>
    );

  return (
    <div className="h-full">
      <div className="flex h-full flex-col lg:flex-row">
        {/* LEFT: Docs (Desktop) */}
        <section className="hidden lg:block flex-1 min-w-0 border-r border-slate-200 bg-white">
          <div className="h-full overflow-y-auto">
            <div className="px-6 py-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 md:px-6 py-4 md:py-5">
                <DesktopDocuments
                  participantLabel={active.label}
                  docs={active.docs}
                  locked={!canViewDocs}
                  previewSrc={!canViewDocs ? previewSrc : null}
                />
              </div>
              <div className="h-20" />
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <aside className="w-full lg:w-[320px] xl:w-[400px] bg-slate-50">
          <div className="h-full overflow-y-auto border-l border-slate-200 px-5 py-5 space-y-5">
            {/* Top */}
            <section className="rounded-2xl bg-white border border-slate-200 px-4 py-4 space-y-3 shadow-sm">
              <div className="space-y-1">
                <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                  Rechnung · Detailansicht
                </p>

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[13px] font-semibold text-slate-900 leading-snug">
                      {invoice.title ?? "–"}
                    </p>
                    <p className="text-[12px] font-medium text-black mt-2">
                      Rechnungs-Nr.:{" "}
                      <span className="font-mono">
                        {invoice.invoice_number ?? "–"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-600">
                  <div className="space-y-0.5">
                    <p className="text-slate-500">Rechnungsdatum</p>
                    <p className="font-medium text-slate-800">
                      {formatDateDE8(invoice.date)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-500">Leistungszeitraum</p>
                    <p className="font-medium text-slate-800">
                      {formatDateDE8(invoice.service_date)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-500">Netto-Betrag</p>
                    <p className="font-medium text-slate-800">
                      {fmtEURFromCents(computed.totalNetCents)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-500">
                      Umsatzsteuer ({fmtPct(computed.vatRate)})
                    </p>
                    <p className="font-medium text-slate-800">
                      {fmtEURFromCents(computed.totalVatCents)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[12px] font-medium text-slate-800">
                      Brutto-Betrag
                    </p>
                    <p className="text-[14px] font-semibold text-black">
                      {fmtEURFromCents(computed.totalGrossCents)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[12px] font-medium text-slate-800">
                      Zahlungsstand
                    </p>
                    <div className="flex flex-col items-start gap-1">
                      {statusPill}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 mb-3" />

              {/* Tabs */}
              <div className="space-y-3">
                <header className="space-y-0.5">
                  <p className="text-[13px] font-semibold text-slate-900">
                    Wie sich der Rechnungswert verteilt
                  </p>
                </header>

                <div className="space-y-2">
                  {uiParticipants.map((p) => {
                    const isState = p.id === "staat";
                    const isActive = p.id === activeParticipantId;

                    if (isState) {
                      return (
                        <div
                          key={p.id}
                          className="w-full rounded-lg px-3 py-2.5 text-[12px] flex items-center gap-3 border bg-slate-500/80 border-slate-400 text-white shadow-sm"
                          title={
                            computed.deltaToGross !== 0
                              ? `Rundungsausgleich: ${computed.deltaToGross} Cent`
                              : undefined
                          }
                        >
                          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                            {p.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-semibold truncate">
                              {p.label}
                            </p>
                            <p className="text-[11px] truncate text-slate-200">
                              {p.description}
                            </p>
                          </div>
                          {p.valueCents !== null && (
                            <span className="text-[14px] font-semibold tabular-nums text-white">
                              {fmtEURFromCents(p.valueCents)}
                            </span>
                          )}
                        </div>
                      );
                    }

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActiveParticipantId(p.id)}
                        className={[
                          "w-full text-left rounded-lg px-3 py-2.5 text-[12px] flex items-center gap-3 transition border",
                          isActive
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                            : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "inline-flex h-8 w-8 items-center justify-center rounded-full shrink-0",
                            isActive
                              ? "bg-white/10 text-white"
                              : "bg-slate-900 text-white",
                          ].join(" ")}
                        >
                          {p.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={[
                              "text-[14px] font-semibold truncate",
                              isActive ? "text-white" : "text-slate-900",
                            ].join(" ")}
                          >
                            {p.label}
                          </p>
                          <p
                            className={[
                              "text-[11px] truncate",
                              isActive ? "text-slate-200" : "text-slate-500",
                            ].join(" ")}
                          >
                            {p.description}
                          </p>
                        </div>

                        {p.valueCents !== null && (
                          <span
                            className={[
                              "text-[14px] font-semibold tabular-nums",
                              isActive ? "text-white" : "text-slate-900",
                            ].join(" ")}
                          >
                            {fmtEURFromCents(p.valueCents)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-1 text-[11px] leading-snug text-slate-600">
                  Tippe auf einen Mitwirkenden: Die linke Dokumentenvorschau
                  springt automatisch zu den Unterlagen, die diesen Schritt der
                  Wertschöpfung dokumentieren. Angezeigt werden die Netto-Anteile
                  nach Steuern und Abgaben.
                </p>
              </div>
            </section>

            {/* MOBILE docs: außer bei WohnenWo */}
            <div className="lg:hidden">
              {!isWohnenwo && (
                <MobileDocumentsCard
                  participantLabel={active.label}
                  docs={active.docs}
                  locked={!canViewDocs}
                  previewSrc={!canViewDocs ? previewSrc : null}
                />
              )}
            </div>

            {/* Wirkungs-Badge (WohnenWo) */}
            {isWohnenwo && (
              <div className="rounded-xl border border-slate-200 bg-cyan-600 text-white px-3 py-2 shadow-sm">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>

                  <p className="text-[14px] leading-snug text-slate-100">
                    Mit Ihrem Auftrag fließen{" "}
                    <span className="font-semibold">
                      {fmtEURFromCents(computed.impactTotalCents)}
                    </span>{" "}
                    in den Ausbau transparenter Wirtschaftskulturen (Plattform,
                    Technologie &amp; faire Prozesse).
                  </p>
                </div>
              </div>
            )}

            {/* MOBILE docs: WohnenWo unter Badge */}
            <div className="lg:hidden">
              {isWohnenwo && (
                <MobileDocumentsCard
                  participantLabel={active.label}
                  docs={active.docs}
                  locked={!canViewDocs}
                  previewSrc={!canViewDocs ? previewSrc : null}
                />
              )}
            </div>

            {/* ────────────────────────── WOHNENWO ────────────────────────── */}
            {isWohnenwo && (
              <>
                {/* Lohnkosten */}
                <section className="rounded-2xl bg-white border border-slate-200 px-4 py-4 space-y-3 shadow-sm">
                  <header className="space-y-0.5">
                    <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                      Lohnkosten
                    </p>
                    <p className="text-[13px] font-semibold text-slate-900">
                      Zeit &amp; Einsatz für Ihren Auftrag
                    </p>
                  </header>

                  <table className="w-full border-collapse text-[11px] table-fixed">
                    <colgroup>
                      <col className="w-[40%]" />
                      <col className="w-[40%]" />
                      <col className="w-[20%]" />
                    </colgroup>
                    <thead>
                      <tr className="text-slate-700">
                        <th className="py-1 text-left font-medium">Tätigkeit</th>
                        <th className="py-1 text-left font-medium">Einordnung</th>
                        <th className="py-1 text-right font-medium">Zeit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laborSteps.length > 0 ? (
                        <>
                          {laborSteps.map((s) => (
                            <tr key={s.id} className="border-t border-slate-200">
                              <td className="py-1 text-slate-700">{s.label}</td>
                              <td className="py-1 text-slate-500">
                                {s.description ?? "–"}
                              </td>
                              <td className="py-1 text-right text-slate-700">
                                {s.minutes} min
                              </td>
                            </tr>
                          ))}

                          <tr className="border-t border-slate-300">
                            <td className="py-1.5 font-semibold text-slate-800">
                              Gesamtzeit
                            </td>
                            <td />
                            <td className="py-1.5 text-right font-semibold text-slate-800">
                              {computed.minutes} min
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr className="border-t border-slate-300">
                          <td className="py-1.5 font-semibold text-slate-800">
                            Gesamtzeit
                          </td>
                          <td className="text-slate-500 py-1.5">
                            (noch keine Etappen hinterlegt)
                          </td>
                          <td className="py-1.5 text-right font-semibold text-slate-800">
                            {computed.minutes} min
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <p className="text-[11px] leading-snug text-slate-600">
                    Abgerechnet werden{" "}
                    <span className="font-medium">{computed.minutes} Minuten</span>{" "}
                    zu einem Stundensatz von{" "}
                    <span className="font-medium">
                      {fmtEURFromCents(computed.hourlyRateNetCents)} netto
                    </span>
                    .
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-0.5 text-[11px] text-slate-600">
                    <div className="flex justify-between">
                      <span>Arbeitslohn (netto)</span>
                      <span className="font-medium text-slate-800">
                        {fmtEURFromCents(computed.laborNetCents)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Umsatzsteuer ({fmtPct(computed.vatRate)})</span>
                      <span className="font-medium text-slate-800">
                        {fmtEURFromCents(computed.laborVatOutCents)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-[14px] font-bold text-slate-800">
                        Arbeitswert (brutto)
                      </span>
                      <span className="text-[14px] font-bold text-slate-900">
                        {fmtEURFromCents(computed.laborGrossCents)}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Verantwortung & Gewinn */}
                <section className="rounded-2xl bg-white border border-slate-200 px-4 py-5 space-y-5 shadow-sm">
                  <header className="space-y-0.5">
                    <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                      Verantwortung &amp; Gewinn
                    </p>
                    <p className="text-[13px] font-semibold text-slate-900">
                      Wie sich der Arbeitswert zusammensetzt
                    </p>
                  </header>

                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="bg-slate-800 text-white px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                          <Wrench className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-[14px] font-semibold text-slate-100">
                          Arbeitswert (brutto)
                        </span>
                      </div>
                      <span className="text-[14px] font-semibold">
                        {fmtEURFromCents(computed.laborGrossCents)}
                      </span>
                    </div>

                    <div className="bg-slate-50 px-3 py-3 space-y-1 text-[12px] text-slate-600">
                      <Row
                        label="Arbeitnehmer:in · Netto"
                        value={fmtEURFromCents(computed.laborSplit.workerNet)}
                      />
                      <Row
                        label="Unternehmerische Struktur · Netto"
                        value={fmtEURFromCents(
                          computed.laborSplit.entrepreneurNet
                        )}
                      />
                      <Row
                        label="Wirkungsfonds"
                        value={fmtEURFromCents(computed.laborSplit.impact)}
                      />
                      <Row
                        label="Staat & Sozialkassen"
                        value={fmtEURFromCents(computed.laborSplit.stateTotal)}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <header className="space-y-0.5">
                      <p className="text-[13px] font-semibold text-slate-900">
                        Welcher Service-Mehrwert entstanden ist
                      </p>
                    </header>

                    <div className="overflow-hidden rounded-xl border border-slate-200">
                      <div className="bg-slate-800 text-white px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                            <Layers className="h-3.5 w-3.5 text-white" />
                          </div>
                          <span className="text-[14px] font-semibold text-slate-100">
                            Service-Mehrwert (netto)
                          </span>
                        </div>
                        <span className="text-[14px] font-semibold">
                          {fmtEURFromCents(computed.serviceMehrwertCents)}
                        </span>
                      </div>

                      <div className="px-3 py-3 space-y-1 text-[12px] text-slate-600">
                        <Row
                          label="Arbeitswert (netto)"
                          value={fmtEURFromCents(computed.laborInSystemCents)}
                        />
                        <Row
                          label="Materialaufschlag (netto)"
                          value={fmtEURFromCents(
                            computed.markupInSystemTotalCents
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <header className="space-y-0.5">
                        <p className="text-[13px] font-semibold text-slate-900">
                          Wie sich der Service-Mehrwert verteilt
                        </p>
                      </header>

                      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-300">
                            <Wrench className="h-3.5 w-3.5 text-white" />
                          </div>
                          <span className="text-[12px] font-medium text-slate-700">
                            Arbeitnehmer:in
                          </span>
                        </div>
                        <span className="text-[12px] font-semibold text-slate-800">
                          {fmtEURFromCents(computed.workerTotalCents)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-300">
                            <Briefcase className="h-3.5 w-3.5 text-white" />
                          </div>
                          <span className="text-[12px] font-medium text-slate-700">
                            Unternehmerische Struktur
                          </span>
                        </div>
                        <span className="text-[12px] font-semibold text-slate-800">
                          {fmtEURFromCents(computed.entrepreneurTotalCents)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-300">
                            <Sparkles className="h-3.5 w-3.5 text-white" />
                          </div>
                          <span className="text-[12px] font-medium text-slate-700">
                            Wirkungsfonds
                          </span>
                        </div>
                        <span className="text-[12px] font-semibold text-slate-800">
                          {fmtEURFromCents(computed.impactTotalCents)}
                        </span>
                      </div>
                    </div>

                    <p className="pt-2 text-[11px] leading-snug text-slate-500 border-t border-slate-100">
                      Das sind die Anteile, die innerhalb unseres Systems verteilt
                      werden. Geringfügige Abweichungen sind möglich und werden
                      erst mit Abschluss des Kalenderjahres exakt bestimmt.
                    </p>
                  </div>
                </section>

                {/* Überfluss & Wirkung (2 Absätze bleiben) */}
                <section className="rounded-2xl bg-slate-50 text-slate-900 px-4 py-5 space-y-4 shadow-sm border border-slate-200">
                  <header className="space-y-0.5">
                    <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                      Überfluss &amp; Wirkung
                    </p>
                    <p className="text-[13px] font-semibold text-slate-900">
                      Was ist der Wirkungsfonds?
                    </p>
                  </header>

                  {/* Absatz 1: Mittelteil aus customer_story */}
                  <p className="text-[12px] leading-snug text-slate-800">
                    Ihr Auftrag sorgt dafür, dass{" "}
                    <span className="font-semibold">{storyMiddle(invoice)}</span>
                    , gleichzeitig fließen aus Lohn und Materialaufschlag zusammen rund{" "}
                    <span className="font-semibold">
                      {fmtEURFromCents(computed.impactTotalCents)}
                    </span>{" "}
                    in den Wirkungsfonds.
                  </p>

                  {/* Absatz 2: unverändert */}
                  <p className="text-[12px] leading-snug text-slate-800">
                    <span className="font-semibold">
                      Mit Ihrer Wahl des Dienstleisters entscheiden Sie indirekt,
                      welche Werte gestärkt werden
                    </span>{" "}
                    – ob mehr in Qualität und Serviceausbau fließt, in soziale
                    Wirkung oder in den Ausbau eines transparenten
                    Wirtschaftssystems. Sie müssen nichts extra tun: <br />
                    <span className="font-semibold">
                      Ihre Entscheidung ist bereits die Handlung.
                    </span>
                  </p>

                  <div className="grid grid-cols-1 gap-2">
                    <header className="space-y-0.5">
                      <p className="text-[13px] font-semibold text-slate-900">
                        Wirkung, die Sie mit Ihrem Auftrag auslösen
                      </p>
                    </header>

                    <div className="overflow-hidden rounded-xl border border-slate-200 mb-2">
                      <div className="bg-slate-800 text-white px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                            <Sparkles className="h-3.5 w-3.5 text-white" />
                          </div>
                          <span className="text-[14px] font-semibold text-slate-100">
                            Wirkungsfonds
                          </span>
                        </div>
                        <span className="text-[14px] font-semibold">
                          {fmtEURFromCents(computed.impactTotalCents)}
                        </span>
                      </div>

                      <div className="px-3 py-3 space-y-1 text-[12px] text-slate-600">
                        <Row
                          label="Service & Qualität (netto)"
                          value={fmtOrDashEUR(computed.impactServiceCents)}
                        />
                        <Row
                          label="Sozial & Lokal (netto)"
                          value={fmtOrDashEUR(computed.impactSocialCents)}
                        />
                        <Row
                          label="Zukunft & System (netto)"
                          value={fmtEURFromCents(computed.impactFutureCents)}
                        />
                      </div>
                    </div>

                    <p className="pt-2 text-[12px] leading-snug text-slate-800 border-t border-slate-200">
                      Der Wirkungsfonds ist unser gemeinsamer Zukunfts-Topf. Er
                      entsteht aus einem fest definierten Anteil deiner Rechnung –
                      transparent und nachvollziehbar.
                    </p>
                    <WirkungsfondsInfoButton />
                  </div>
                </section>

                {/* Transparenz Hinweis */}
                <section className="rounded-2xl bg-white border border-slate-200 px-4 py-4 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <Info className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-[12px] font-medium text-slate-900">
                      Transparenz-Hinweis
                    </p>
                  </div>
                  <p className="text-[11px] leading-snug text-slate-600">
                    Persönliche Daten von Auftraggeber:innen werden in der online
                    sichtbaren Version datenschutzkonform reduziert. Die
                    vollständige Original-Rechnung bleibt ausschließlich dir
                    vorbehalten. Du entscheidest später selbst, welche Details du
                    für andere sichtbar machen möchtest.
                  </p>
                </section>
              </>
            )}

            {/* ────────────────────────── MATERIAL (Grohe / Hansgrohe) ────────────────────────── */}
            {(isGrohe || isHansgrohe) && activeMaterial && (
              <>
                <section className="rounded-2xl bg-white border border-slate-200 px-4 py-4 space-y-3 shadow-sm">
                  <header className="space-y-0.5">
                    <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                      Materialkosten
                    </p>
                    <p className="text-[13px] font-semibold text-slate-900">
                      Wie sich der Materialpreis errechnet
                    </p>
                  </header>

                  <table className="w-full border-collapse text-[11px] table-fixed">
                    <colgroup>
                      <col className="w-[40%]" />
                      <col className="w-[40%]" />
                      <col className="w-[20%]" />
                    </colgroup>
                    <thead>
                      <tr className="text-slate-700">
                        <th className="py-1 text-left font-medium">Position</th>
                        <th className="py-1 text-left font-medium">Einordnung</th>
                        <th className="py-1 text-right font-medium">Betrag</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-slate-200">
                        <td className="py-1 text-slate-700">Einkaufspreis (netto)</td>
                        <td className="py-1 text-slate-500">
                          {activeMaterial.label} · Industrie
                        </td>
                        <td className="py-1 text-right text-slate-700">
                          {fmtEURFromCents(activeMaterial.purchaseNetCents)}
                        </td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td className="py-1 text-slate-700">Materialaufschlag</td>
                        <td className="py-1 text-slate-500">Dienstleister</td>
                        <td className="py-1 text-right text-slate-700">
                          {fmtEURFromCents(activeMaterial.markupNetCents)}
                        </td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td className="py-1 text-slate-700">
                          Umsatzsteuer ({fmtPct(computed.vatRate)})
                        </td>
                        <td className="py-1 text-slate-500">Staat</td>
                        <td className="py-1 text-right text-slate-700">
                          {fmtEURFromCents(activeMaterial.vatCents)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-2 border-t border-slate-300 space-y-0.5 text-[11px] text-slate-600">
                    <div className="flex justify-between pt-1">
                      <span className="text-[14px] font-bold text-slate-800">
                        Materialpreis (brutto)
                      </span>
                      <span className="text-[14px] font-bold text-slate-900">
                        {fmtEURFromCents(activeMaterial.grossCents)}
                      </span>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl bg-white border border-slate-200 px-4 py-5 space-y-5 shadow-sm">
                  <header className="space-y-0.5">
                    <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                      Materialherkunft &amp; Wertstrom
                    </p>
                    <p className="text-[13px] font-semibold text-slate-900">
                      Wie sich der Wert dieses Bauteils verteilt
                    </p>
                  </header>

                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="bg-slate-800 text-white px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                          <Scale className="h-4 w-4" />
                        </div>
                        <span className="text-[14px] font-semibold">
                          Staat &amp; Sozialkassen
                        </span>
                      </div>
                      <span className="text-[14px] font-semibold">
                        {fmtEURFromCents(activeMaterial.stateTotalMaterialCents)}
                      </span>
                    </div>

                    <div className="px-3 py-3 space-y-1 text-[12px] text-slate-600">
                      <Row
                        label="Umsatzsteuer (Endkunde)"
                        value={fmtEURFromCents(activeMaterial.vatCents)}
                      />
                      <Row
                        label="Abgaben aus Materialaufschlag"
                        value={fmtEURFromCents(activeMaterial.markupSplit.abgaben)}
                      />
                      <Row
                        label="Abgaben aus Produktion & Handel"
                        value={fmtEURFromCents(activeMaterial.prodAbgabenCents)}
                      />
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="bg-slate-800 text-white px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <span className="text-[14px] font-semibold">
                          Materialaufschlag
                        </span>
                      </div>
                      <span className="text-[14px] font-semibold">
                        {fmtEURFromCents(activeMaterial.markupSplit.inSystem)}
                      </span>
                    </div>

                    <div className="bg-slate-50 px-3 py-3 space-y-1 text-[12px] text-slate-600">
                      <Row
                        label="Arbeitnehmer:in · Netto"
                        value={fmtEURFromCents(activeMaterial.markupSplit.workerNet)}
                      />
                      <Row
                        label="Unternehmerische Struktur · Netto"
                        value={fmtEURFromCents(
                          activeMaterial.markupSplit.entrepreneurNet
                        )}
                      />
                      <Row
                        label="Wirkungsfonds"
                        value={fmtEURFromCents(activeMaterial.markupSplit.impact)}
                      />
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="bg-slate-800 text-white px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                          <Factory className="h-4 w-4" />
                        </div>
                        <span className="text-[14px] font-semibold">
                          Bauteil · {activeMaterial.label}
                        </span>
                      </div>
                      <span className="text-[14px] font-semibold">
                        {fmtEURFromCents(activeMaterial.bauteilCents)}
                      </span>
                    </div>

                    <div className="bg-white px-3 py-3 space-y-1 text-[12px] text-slate-600">
                      <p className="text-[12px] font-medium text-slate-800">
                        Was dieser Betrag abbildet
                      </p>
                      <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                        <li>Produktion des Bauteils</li>
                        <li>Logistik, Lagerung &amp; Distribution</li>
                        <li>Handel &amp; Plattformabwicklung</li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 border-t border-dashed border-slate-300" />
                      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        Transparenz-Grenze
                      </span>
                      <div className="flex-1 border-t border-dashed border-slate-300" />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 space-y-2">
                    <p className="text-[12px] font-medium text-slate-700">
                      Außerhalb unseres Einblicks
                    </p>
                    <p className="text-[11px] leading-snug text-slate-600">
                      Wie dieser Betrag innerhalb der industriellen Lieferkette
                      zwischen Unternehmen, Mitarbeitenden, Investitionen und
                      Rücklagen verteilt wird, liegt außerhalb unseres Wissens-
                      und Einflussbereichs.
                    </p>
                  </div>

                  <p className="pt-2 text-[11px] leading-snug text-slate-500 border-t border-slate-100">
                    Staat &amp; Sozialkassen Beiträge sind geschätzte Anteile
                    basieren auf branchenüblichen Näherungen. Hersteller- und
                    lieferkettenabhängige Abweichungen sind möglich.
                  </p>
                </section>
              </>
            )}

            <div className="h-10" />
          </div>
        </aside>
      </div>
    </div>
  );
}
