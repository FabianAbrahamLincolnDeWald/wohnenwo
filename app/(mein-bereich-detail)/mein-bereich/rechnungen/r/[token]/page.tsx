// /Users/fabiandewald/Documents/wohnenwo/app/(mein-bereich-detail)/mein-bereich/rechnungen/r/[token]/page.tsx
"use client";

/* eslint-disable @next/next/no-img-element */

import * as React from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import AuthOverlay, { AuthMode } from "@/components/auth/AuthOverlay";
import {
  Layers,
  Sparkles,
  Info,
  Factory,
  Briefcase,
  Scale,
  Wrench,
  Lock,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────
  Supabase Client (Browser, Public Teaser)
────────────────────────────────────────────────────────────── */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Feature Flag: sobald du Supabase "Confirm email" aktivierst, stellst du dies hier auf "true" (via .env)
const REQUIRE_EMAIL_VERIFICATION =
  process.env.NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION === "true";

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

  customer_id: string | null; // im Teaser nicht anzeigen
  customer_story: string | null; // ✅ wie Logged-in
};

type ParticipantRow = {
  id: string;
  invoice_id: string;
  participant_id: string; // wohnenwo | hansgrohe | grohe | staat
  label: string;
  description: string | null;
  role: string | null;
  icon_key: string | null;
  sort_order: number;
  is_clickable: boolean;

  purchase_net: string | number | null; // nur Hersteller
  pricing_divisor: string | number | null; // optional override
};

type LaborStepRow = {
  id: string;
  label: string;
  description: string | null;
  minutes: number;
  sort_order: number;
};

/* ──────────────────────────────────────────────────────────────
  Helpers (Money / Format)
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

function fmtOrDashEUR(cents: number) {
  if (!cents) return "– €";
  return fmtEURFromCents(cents);
}

/* ──────────────────────────────────────────────────────────────
  Modell-Konstanten (wie Logged-in)
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

const SUPPLYCHAIN_ABGABEN_RATE = 0.33002;

/* ──────────────────────────────────────────────────────────────
  Split Helpers (wie Logged-in)
────────────────────────────────────────────────────────────── */

type SplitMode = "labor" | "markup";

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
  Teaser Pages (4 JPGs)
  - Page 1 immer bei WohnenWo (Dienstleister)
  - Pages 2–4 pseudo-random für alle anderen Tabs (stabil je token+participant)
────────────────────────────────────────────────────────────── */

const TEASER_PAGES = [
  "/images/teaser/invoice-page-1.jpg",
  "/images/teaser/invoice-page-2.jpg",
  "/images/teaser/invoice-page-3.jpg",
  "/images/teaser/invoice-page-4.jpg",
] as const;

// `!` (non-null assertion) ist hier ok, weil das Array literal immer 4 Einträge hat.
const SERVICE_PROVIDER_TEASER = TEASER_PAGES[0]!;

const OTHER_TEASERS = [
  TEASER_PAGES[1]!,
  TEASER_PAGES[2]!,
  TEASER_PAGES[3]!,
] as const;

function hashStringToUInt(str: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function teaserUrlForParticipant(participantId: string, token: string): string {
  if (participantId === "wohnenwo") return SERVICE_PROVIDER_TEASER;

  const h = hashStringToUInt(`${token}:${participantId}`);
  const idx = h % OTHER_TEASERS.length;

  // Mit noUncheckedIndexedAccess ist OTHER_TEASERS[idx] => string | undefined,
  // daher fallback (oder `!`).
  return OTHER_TEASERS[idx] ?? SERVICE_PROVIDER_TEASER;
}

/* ──────────────────────────────────────────────────────────────
  Claim Overlay (öffnet AuthOverlay & claimed danach via RPC)
────────────────────────────────────────────────────────────── */

function ClaimOverlay({
  onClaim,
  loading,
  errorMsg,
}: {
  onClaim: () => void;
  loading?: boolean;
  errorMsg?: string | null;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] rounded-2xl bg-white/95 backdrop-blur-sm shadow-xl ring-1 ring-black/5">
        <div className="p-6 text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Lock className="h-7 w-7" />
          </div>

          <p className="mt-3 text-[22px] font-semibold leading-tight text-slate-900">
            Deine Rechnung?
          </p>

          <p className="mt-2 text-[12px] leading-snug text-slate-600">
            Verbinde dein Konto, um Originaldokumente freizuschalten und dauerhaft
            zu speichern.
          </p>

          <button
            type="button"
            onClick={onClaim}
            disabled={!!loading}
            className={[
              "mt-5 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-[13px] font-semibold uppercase tracking-wide",
              "bg-slate-900 text-white hover:bg-slate-800",
              "disabled:opacity-60 disabled:cursor-not-allowed",
            ].join(" ")}
          >
            {loading ? "Wird verbunden…" : "Jetzt verbinden"}
          </button>

          {errorMsg && (
            <p className="mt-3 text-[12px] leading-snug text-red-600">
              {errorMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function DesktopDocumentsTeaser({
  participantLabel,
  teaserUrl,
  onClaim,
  claiming,
  claimError,
}: {
  participantLabel: string;
  teaserUrl: string;
  onClaim: () => void;
  claiming: boolean;
  claimError: string | null;
}) {
  return (
    <div className="relative flex flex-col items-center">
      <img
        src={teaserUrl}
        alt={`${participantLabel} Dokument`}
        className="w-full max-w-[600px] rounded-lg shadow-sm blur-md opacity-95 select-none pointer-events-none"
        loading="lazy"
      />
      <ClaimOverlay onClaim={onClaim} loading={claiming} errorMsg={claimError} />
    </div>
  );
}

function MobileDocumentsCardTeaser({
  participantLabel,
  teaserUrl,
  onClaim,
  claiming,
  claimError,
}: {
  participantLabel: string;
  teaserUrl: string;
  onClaim: () => void;
  claiming: boolean;
  claimError: string | null;
}) {
  return (
    <section className="rounded-2xl bg-white border border-slate-200 px-4 py-4 shadow-sm">
      <div className="relative flex flex-col items-center">
        <img
          src={teaserUrl}
          alt={`${participantLabel} Dokument`}
          className="w-full rounded-lg shadow-sm blur-md opacity-95 select-none pointer-events-none"
          loading="lazy"
        />
        <ClaimOverlay onClaim={onClaim} loading={claiming} errorMsg={claimError} />
      </div>
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

/** Teaser: personenbezogene Labels entfernen */
function publicLabel(p: ParticipantRow) {
  if (p.participant_id === "wohnenwo") return "WohnenWo";
  return p.label;
}

/** Nutzt invoice.customer_story als Mittelteil (ohne leading/trailing Komma) */
function storyMiddle(invoice: InvoiceRow): string {
  const s = (invoice.customer_story ?? "").trim();
  if (s.length > 0) return s;
  return "Ihr Anliegen erfolgreich umgesetzt ist";
}

/* ──────────────────────────────────────────────────────────────
  Page
────────────────────────────────────────────────────────────── */

export default function RechnungTeaserPage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();

  const searchParams = useSearchParams();
  const autoclaim = searchParams.get("autoclaim") === "1";

  // ... ab hier Token lesen
  const tokenParam = params?.token;
  const token =
    typeof tokenParam === "string"
      ? tokenParam
      : Array.isArray(tokenParam)
        ? tokenParam[0]
        : undefined;

  if (typeof token !== "string" || token === "undefined" || token.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-600 text-sm">
        Fehlender oder ungültiger Public Token in der URL.
      </div>
    );
  }

  const safeToken = token;

  // verhindert mehrfaches Autoclaim (Rerenders / INITIAL_SESSION)
  const autoClaimHandledRef = React.useRef(false);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [invoice, setInvoice] = React.useState<InvoiceRow | null>(null);
  const [participants, setParticipants] = React.useState<ParticipantRow[]>([]);
  const [laborSteps, setLaborSteps] = React.useState<LaborStepRow[]>([]);
  const [activeParticipantId, setActiveParticipantId] =
    React.useState<string>("");

  const [teaserByParticipant, setTeaserByParticipant] = React.useState<
    Record<string, string>
  >({});

  // ✅ Claim flow state
  const [authMode, setAuthMode] = React.useState<AuthMode | null>(null);
  const [claiming, setClaiming] = React.useState(false);
  const [claimError, setClaimError] = React.useState<string | null>(null);

  // ✅ Schritt B: Pending-Claim persistieren (wichtig für OAuth Redirect)
  const PENDING_KEY = "ww_pending_claim";

  function setPendingClaim(claimCode: string) {
    try {
      localStorage.setItem(
        PENDING_KEY,
        JSON.stringify({ claimCode, createdAt: Date.now() })
      );
    } catch { }
  }

  function clearPendingClaim() {
    try {
      localStorage.removeItem(PENDING_KEY);
    } catch { }
  }

  // Claim nur, wenn User aktiv "Jetzt verbinden" geklickt hat
  const [claimRequested, setClaimRequested] = React.useState(false);

  // Refs gegen Doppeltrigger (Auth-Events / Rerenders)
  const claimRequestedRef = React.useRef(false);
  const claimingRef = React.useRef(false);

  React.useEffect(() => {
    claimRequestedRef.current = claimRequested;
  }, [claimRequested]);

  React.useEffect(() => {
    claimingRef.current = claiming;
  }, [claiming]);

  async function doClaim() {
    try {
      // Sofortige Sperre gegen Doppeltrigger (Ref wirkt sofort)
      if (claimingRef.current) return;
      claimingRef.current = true;

      setClaimError(null);
      setClaiming(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        // User ist (noch) nicht eingeloggt → Overlay öffnen, aber Claim "angefordert" lassen
        setClaiming(false);
        claimingRef.current = false;
        setAuthMode("signin");
        return;
      }

      // Optional (Feature-Flag): bei aktivierter E-Mail-Verifikation nur fortfahren, wenn bestätigt
      if (REQUIRE_EMAIL_VERIFICATION) {
        const u: any = session.user;
        const confirmed = !!(u?.email_confirmed_at || u?.confirmed_at);
        if (!confirmed) {
          setClaimError(
            "Bitte bestätige zuerst deine E-Mail-Adresse (Link im Postfach). Danach kannst du die Rechnung verbinden."
          );
          setClaiming(false);
          claimingRef.current = false;
          // claimRequested bleibt TRUE → sobald der User nach Verifizierung wirklich eingeloggt ist, kann automatisch erneut versucht werden
          return;
        }
      }

      const res = await supabase.rpc("claim_invoice", { p_claim_code: safeToken });

      if (res.error) {
        const msg = String(res.error.message ?? "").toLowerCase();

        let human = "Verbindung nicht möglich. Bitte erneut versuchen.";

        if (msg.includes("invoice_already_linked")) {
          human = "Diese Rechnung ist bereits mit einem Konto verbunden.";
        } else if (msg.includes("invoice_not_found")) {
          human = "Rechnung nicht gefunden oder nicht freigegeben.";
        } else if (msg.includes("not_authenticated")) {
          human = "Bitte anmelden, um fortzufahren.";
          setAuthMode("signin");
        } else if (
          msg.includes("wrong_email") ||
          msg.includes("email_mismatch") ||
          msg.includes("recipient_email_mismatch")
        ) {
          human =
            "Bitte melde dich mit der E-Mail-Adresse an, an die diese Rechnung gesendet wurde.";
        }

        console.error("[claim_invoice]", res.error);
        setClaimError(human);

        setClaiming(false);
        claimingRef.current = false;
        setClaimRequested(false);
        return;
      }

      // res.data ist direkt die invoice_id (uuid)
      const invoiceId = res.data as string | null;

      if (!invoiceId) {
        setClaimError(
          "Verbindung ausgeführt, aber die Rechnungs-ID fehlt. Bitte melde dich kurz bei uns."
        );
        setClaiming(false);
        claimingRef.current = false;
        setClaimRequested(false);
        return;
      }

      // ✅ Erfolgreich → Flags runter, weiterleiten
      setClaiming(false);
      claimingRef.current = false;
      setClaimRequested(false);
      setAuthMode(null);

      clearPendingClaim();
      router.push(`/mein-bereich/rechnungen/${invoiceId}`);
    } catch (e) {
      console.error(e);
      setClaimError(
        "Die Verbindung konnte nicht hergestellt werden. Bitte versuche es erneut."
      );
      setClaiming(false);
      claimingRef.current = false;
      setClaimRequested(false);
    }
  }

  async function handleClaimClick() {
    setClaimError(null);

    // ✅ WICHTIG: bevor OAuth startet, Token persistieren
    setPendingClaim(safeToken);

    setClaimRequested(true);
    claimRequestedRef.current = true;

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setAuthMode("signin");
      return;
    }

    await doClaim();
  }

  // ✅ Wenn die Seite mit ?autoclaim=1 geladen wird (OAuth/Email-Confirm Redirect),
  // dann automatisch claimen – ohne Klick auf "Jetzt verbinden"
  React.useEffect(() => {
    if (!autoclaim) return;
    if (autoClaimHandledRef.current) return;

    autoClaimHandledRef.current = true;

    setClaimRequested(true);
    claimRequestedRef.current = true;

    void doClaim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoclaim, safeToken]);

  // ✅ Wenn User nach Login/Verifizierung zurückkommt: Claim automatisch ausführen (nur wenn zuvor angefordert)
  React.useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!claimRequestedRef.current) return;
      if (!session) return;
      if (claimingRef.current) return;

      // INITIAL_SESSION kann beim Zurückkommen über Bestätigungslink auftreten
      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "INITIAL_SESSION"
      ) {
        setAuthMode(null);
        void doClaim();
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
    // safeToken ist pro Page stabil; doClaim nutzt safeToken/router aus der aktuellen Instanz
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeToken]);

  React.useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      setError(null);

      // 1) Invoice (public_token) robust
      const invRes = await supabase
        .from("invoices")
        .select("*")
        .eq("public_token", safeToken)
        .eq("public_enabled", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (invRes.error) {
        if (!mounted) return;
        setError(invRes.error.message);
        setLoading(false);
        return;
      }

      const inv = (invRes.data?.[0] ?? null) as InvoiceRow | null;

      if (!inv) {
        if (!mounted) return;
        setError("Rechnung nicht gefunden oder nicht öffentlich.");
        setLoading(false);
        return;
      }

      // 2) Participants
      const partRes = await supabase
        .from("invoice_participants")
        .select("*")
        .eq("invoice_id", inv.id)
        .order("sort_order", { ascending: true });

      if (partRes.error) {
        if (!mounted) return;
        setError(partRes.error.message);
        setLoading(false);
        return;
      }

      // 3) Labor Steps (optional)
      let steps: LaborStepRow[] = [];
      try {
        const stepsRes = await supabase
          .from("invoice_labor_steps")
          .select("id,label,description,minutes,sort_order")
          .eq("invoice_id", inv.id)
          .order("sort_order", { ascending: true });

        if (!stepsRes.error) steps = (stepsRes.data ?? []) as LaborStepRow[];
      } catch {
        // ignore
      }

      if (!mounted) return;

      const parts = (partRes.data ?? []) as ParticipantRow[];

      const teaserMap: Record<string, string> = {};
      for (const p of parts) {
        teaserMap[p.participant_id] = teaserUrlForParticipant(
          p.participant_id,
          safeToken
        );
      }

      setInvoice(inv);
      setParticipants(parts);
      setLaborSteps(steps);
      setTeaserByParticipant(teaserMap);

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
  }, [safeToken]);

  const computed = React.useMemo(() => {
    if (!invoice) return null;

    const vatRate = toNumber(invoice.vat_rate ?? 0.19) || 0.19;

    const minutesFromSteps =
      laborSteps.length > 0
        ? laborSteps.reduce((a, s) => a + (s.minutes ?? 0), 0)
        : null;

    const minutes = minutesFromSteps ?? invoice.labor_minutes ?? 0;

    const hourlyRateNetCents = toCents(invoice.hourly_rate_net);
    const laborNetCents = Math.round((hourlyRateNetCents * minutes) / 60);

    const laborVatOutCents = Math.round(laborNetCents * vatRate);
    const laborGrossCents = laborNetCents + laborVatOutCents;

    const laborSplit = splitLaborNetToGross_Cents(laborNetCents, vatRate);

    const materials = participants
      .filter((p) => p.purchase_net !== null && p.participant_id !== "staat")
      .map((p) => {
        const purchaseNetCents = toCents(p.purchase_net);

        const divisor = toNumber(
          p.pricing_divisor ?? invoice.pricing_divisor ?? 0.6666666667
        );
        const safeDiv = divisor || 0.6666666667;

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

    const totalMaterialsNetCents = materials.reduce(
      (a, m) => a + m.saleNetCents,
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
      laborSplit.impact + materials.reduce((a, m) => a + m.markupSplit.impact, 0);

    const stateTotalModelCents =
      laborSplit.stateTotal +
      materials.reduce((a, m) => a + m.stateTotalMaterialCents, 0);

    const bauteilSumCents = materials.reduce((a, m) => a + m.bauteilCents, 0);
    const deltaToGross =
      totalGrossCents -
      (serviceMehrwertCents + bauteilSumCents + stateTotalModelCents);

    const stateTotalAdjustedCents = stateTotalModelCents + deltaToGross;

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

      stateTotalModelCents,
      stateTotalAdjustedCents,

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
        if (isState) valueCents = computed.stateTotalAdjustedCents;
        else if (isMain) valueCents = computed.serviceMehrwertCents;
        else if (mat) valueCents = mat.bauteilCents;

        return {
          id: p.participant_id,
          label: publicLabel(p),
          description: p.description ?? "",
          role: p.role ?? "",
          isClickable: p.is_clickable,
          icon: iconForParticipant(p.participant_id),
          valueCents,
        };
      });
  }, [participants, invoice, computed]);

  const active = React.useMemo(() => {
    if (!uiParticipants.length) return null;
    return (
      uiParticipants.find((p) => p.id === activeParticipantId) ?? uiParticipants[0]!
    );
  }, [uiParticipants, activeParticipantId]);

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
        {error ?? "Rechnung nicht gefunden oder nicht öffentlich."}
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

  const activeTeaserUrl =
    teaserByParticipant[active.id] ?? "/images/teaser/invoice-page-1.jpg";

  return (
    <div className="h-full">
      {/* ✅ AuthOverlay liegt über dem Teaser-Hintergrund */}
      <AuthOverlay
        mode={authMode}
        onClose={() => {
          clearPendingClaim();
          setAuthMode(null);
          setClaimRequested(false);
          setClaiming(false);
          claimingRef.current = false;
        }}
        onSwitchMode={(m) => setAuthMode(m)}
        onAuthed={() => {
          setAuthMode(null);
          setClaimRequested(true);
          claimRequestedRef.current = true;
          void doClaim();
        }}
      />

      <div className="flex h-full flex-col lg:flex-row">
        {/* LEFT: Docs (Desktop) – als Blur-Teaser */}
        <section className="hidden lg:block flex-1 min-w-0 border-r border-slate-200 bg-white">
          <div className="h-full overflow-y-auto">
            <div className="px-6 py-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 md:px-6 py-4 md:py-5">
                <DesktopDocumentsTeaser
                  participantLabel={active.label}
                  teaserUrl={activeTeaserUrl}
                  onClaim={handleClaimClick}
                  claiming={claiming}
                  claimError={claimError}
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
                  Tippe auf einen Mitwirkenden: Die linke Dokumentenvorschau ist
                  im Teaser ausgeblendet. Verbinde die Rechnung, um die Originale
                  freizuschalten.
                </p>
              </div>
            </section>

            {/* MOBILE docs: außer bei WohnenWo */}
            <div className="lg:hidden">
              {!isWohnenwo && (
                <MobileDocumentsCardTeaser
                  participantLabel={active.label}
                  teaserUrl={activeTeaserUrl}
                  onClaim={handleClaimClick}
                  claiming={claiming}
                  claimError={claimError}
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
                <MobileDocumentsCardTeaser
                  participantLabel={active.label}
                  teaserUrl={activeTeaserUrl}
                  onClaim={handleClaimClick}
                  claiming={claiming}
                  claimError={claimError}
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
                        value={fmtEURFromCents(computed.laborSplit.entrepreneurNet)}
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
                          value={fmtEURFromCents(computed.markupInSystemTotalCents)}
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

                {/* Überfluss & Wirkung */}
                <section className="rounded-2xl bg-slate-50 text-slate-900 px-4 py-5 space-y-4 shadow-sm border border-slate-200">
                  <header className="space-y-0.5">
                    <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                      Überfluss &amp; Wirkung
                    </p>
                    <p className="text-[13px] font-semibold text-slate-900">
                      Was ist der Wirkungsfonds?
                    </p>
                  </header>

                  <p className="text-[12px] leading-snug text-slate-800">
                    Ihr Auftrag sorgt dafür, dass{" "}
                    <span className="font-semibold">{storyMiddle(invoice)}</span>,
                    gleichzeitig fließen aus Lohn und Materialaufschlag zusammen rund{" "}
                    <span className="font-semibold">
                      {fmtEURFromCents(computed.impactTotalCents)}
                    </span>{" "}
                    in den Wirkungsfonds.
                  </p>

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
                    In der öffentlich einsehbaren Version werden Originaldokumente
                    nicht angezeigt. Verbinde die Rechnung, um sie dauerhaft deinem
                    Konto zuzuordnen und freizuschalten.
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
                        value={fmtEURFromCents(activeMaterial.markupSplit.entrepreneurNet)}
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
