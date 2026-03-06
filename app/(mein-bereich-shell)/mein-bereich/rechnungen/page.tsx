"use client";

/* eslint-disable @next/next/no-img-element */

import * as React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import WirkungskontoPanel from "@/components/mein-bereich/WirkungskontoPanel";
import { useWirkungskontoStats } from "@/lib/useWirkungskontoStats";
import { FileText } from "lucide-react";

/* ──────────────────────────────────────────────────────────────
  Types
────────────────────────────────────────────────────────────── */

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  kundenummer: string | null;
};

type ViewState = "loading" | "demo" | "user" | "kunde";

type InvoiceStatus = "open" | "paid" | "canceled";

type Invoice = {
  id: string;
  number: string; // invoice_number
  date: string | null;
  totalAmount: number | null;
  currency: string; // "EUR"
  status: InvoiceStatus;
  projectName: string | null; // title
  previewUrl: string | null; // wohnenwo page1
};

type InvoiceRow = {
  id: string;
  invoice_number: string | null;
  date: string | null;
  total_amount: number | string | null;
  status: string | null;
  title: string | null;
  created_at: string | null;
};

type DocumentRow = {
  id: string;
  invoice_id: string;
  participant_id: string;
  doc_type: string;
  page_index: number;
  storage_bucket: string;
  storage_path: string;
};

/* ──────────────────────────────────────────────────────────────
  Helpers
────────────────────────────────────────────────────────────── */

function toNumber(v: unknown): number {
  if (v === null || v === undefined) return 0;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

function mapInvoiceStatus(s: unknown): InvoiceStatus {
  const v = String(s ?? "open").toLowerCase();
  if (v === "paid") return "paid";
  if (v === "canceled") return "canceled";
  return "open";
}

function getInitialsFromProfile(profile: Profile | null): string {
  if (!profile) return "G";
  if (profile.full_name && profile.full_name.trim().length > 0) {
    const parts = profile.full_name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
    return `${parts[0]!.charAt(0)}${parts[1]!.charAt(0)}`.toUpperCase();
  }
  if (profile.email) return profile.email.charAt(0).toUpperCase();
  return "G";
}

function formatCurrency(amount: number | null, currency: string) {
  if (amount === null || Number.isNaN(amount)) return "–";
  try {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: currency || "EUR",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${Number(amount || 0).toFixed(2)} ${currency || "€"}`;
  }
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "–";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "–";
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const label =
    status === "paid" ? "Bezahlt" : status === "open" ? "Offen" : "Storniert";

  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border";

  const style =
    status === "paid"
      ? [
          "bg-emerald-50 text-emerald-700 border-emerald-100",
          "dark:bg-emerald-900/25 dark:text-emerald-300 dark:border-emerald-800/40",
        ].join(" ")
      : status === "open"
        ? [
            "bg-amber-50 text-amber-700 border-amber-100",
            "dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/40",
          ].join(" ")
        : [
            "bg-slate-50 text-slate-600 border-slate-200",
            "dark:bg-white/5 dark:text-white/55 dark:border-white/12",
          ].join(" ");

  return <span className={`${base} ${style}`}>{label}</span>;
}

/* ──────────────────────────────────────────────────────────────
  Page
────────────────────────────────────────────────────────────── */

export default function RechnungenPage() {
  const [view, setView] = useState<ViewState>("loading");
  const [profile, setProfile] = useState<Profile | null>(null);

  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  // ✅ zentrale Wirkungskonto-Stats
  const isAuthed = view !== "demo";
  const { investedEUR, impactEUR, invoiceCount } = useWirkungskontoStats(
    isAuthed ? profile?.id ?? null : null
  );

  useEffect(() => {
    let active = true;

    async function load() {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) {
        if (!active) return;
        setView("demo");
        setProfile(null);
        setInvoices([]);
        setLoadingInvoices(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, kundenummer")
        .eq("id", user.id)
        .single();

      if (!active) return;

      if (error || !data) {
        console.error("Profil konnte nicht geladen werden:", error);
        setView("user");
      } else {
        setProfile(data);
        const role = (data.role || "user") as string;
        setView(role === "kunde" ? "kunde" : "user");
      }

      try {
        setLoadingInvoices(true);

        // ✅ Rechnungenliste (für Grid)
        const { data: invoiceData, error: invoiceError } = await supabase
          .from("invoices")
          .select("id, invoice_number, date, total_amount, status, title, created_at")
          .eq("customer_id", user.id)
          .order("date", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false });

        if (!active) return;

        if (invoiceError) {
          console.error("Rechnungen konnten nicht geladen werden:", invoiceError);
          setInvoices([]);
          return;
        }

        const invRows = (invoiceData ?? []) as InvoiceRow[];

        const base: Invoice[] =
          invRows.map((row) => ({
            id: row.id,
            number: row.invoice_number ?? "–",
            date: row.date ?? null,
            totalAmount:
              typeof row.total_amount === "number"
                ? row.total_amount
                : row.total_amount != null
                  ? Number(row.total_amount)
                  : null,
            currency: "EUR",
            status: mapInvoiceStatus(row.status),
            projectName: row.title ?? null,
            previewUrl: null,
          })) ?? [];

        const invoiceIds = base.map((b) => b.id).filter(Boolean);
        if (invoiceIds.length === 0) {
          setInvoices(base);
          return;
        }

        // ✅ Page1 vom Dienstleister (wohnenwo) → signed urls
        const { data: docRows, error: docErr } = await supabase
          .from("invoice_documents")
          .select(
            "id, invoice_id, participant_id, doc_type, page_index, storage_bucket, storage_path"
          )
          .in("invoice_id", invoiceIds)
          .eq("participant_id", "wohnenwo")
          .eq("doc_type", "rechnung")
          .eq("page_index", 1);

        if (!active) return;

        if (docErr) {
          console.error("invoice_documents konnte nicht geladen werden:", docErr);
          setInvoices(base);
          return;
        }

        const docs = (docRows ?? []) as DocumentRow[];
        const docByInvoice = new Map<string, DocumentRow>();
        for (const d of docs) {
          if (!docByInvoice.has(d.invoice_id)) docByInvoice.set(d.invoice_id, d);
        }

        const signedByInvoice: Record<string, string | null> = {};
        await Promise.all(
          invoiceIds.map(async (invId) => {
            const doc = docByInvoice.get(invId);
            if (!doc) {
              signedByInvoice[invId] = null;
              return;
            }
            const { data, error } = await supabase.storage
              .from(doc.storage_bucket)
              .createSignedUrl(doc.storage_path, 60 * 30);
            signedByInvoice[invId] = error ? null : data?.signedUrl ?? null;
          })
        );

        const merged = base.map((b) => ({
          ...b,
          previewUrl: signedByInvoice[b.id] ?? null,
        }));

        setInvoices(merged);
      } catch (e) {
        console.error("Unbekannter Fehler beim Laden der Rechnungen:", e);
        setInvoices([]);
      } finally {
        if (active) setLoadingInvoices(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  const isDemo = view === "demo";
  const isKunde = view === "kunde";

  const name =
    profile?.full_name ||
    profile?.email?.split("@")[0] ||
    (isDemo ? "Gast" : "Willkommen zurück");

  const initials = getInitialsFromProfile(profile);

  const eyebrow = isDemo
    ? "Vorschau"
    : isKunde
      ? "Rechnungen · Persönlicher Wirkungsraum"
      : "Rechnungen";

  const headline = isDemo
    ? "So sehen deine Rechnungen in WohnenWo aus."
    : "Rechnungen im Überblick";

  const subline = isDemo
    ? "In deinem echten Zugang findest du hier alle Rechnungen – aufgeschlüsselt nach Material, Handwerk, Planung und Wirkungsfonds."
    : "Hier bündeln wir deine ausgestellten Rechnungen. Jede Rechnung wird in ihre Bestandteile aufgeschlüsselt und mit deinem Wirkungskonto verknüpft.";

  const hasInvoices = !!invoices && invoices.length > 0;

  // ✅ Panel-Logik (konsistent mit Startseite)
  const SCALE_MAX = 100;
  const wirkungEbene = impactEUR;

  const hasFirstInvoice = isAuthed && invoiceCount > 0;
  const hasImpact = isAuthed && impactEUR > 0.0001;

  const hasAnyRealData = hasFirstInvoice || false; // Projekte später

  if (view === "loading") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pt-20 pb-10 dark:bg-[#111113]">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[minmax(0,1.9fr)_minmax(260px,1fr)]">
          <div className="space-y-4">
            <div className="h-6 w-40 rounded bg-slate-200 animate-pulse dark:bg-white/10" />
            <div className="h-4 w-64 rounded bg-slate-200 animate-pulse dark:bg-white/10" />
            <div className="h-64 w-full rounded-xl bg-slate-100 animate-pulse dark:bg-white/5" />
          </div>
          <aside className="hidden lg:block">
            <div className="h-48 w-full rounded-2xl bg-slate-100 animate-pulse dark:bg-white/5" />
          </aside>
        </div>
      </main>
    );
  }

  // mindestens 2 Reihen à 3 Karten
  const MIN_SLOTS = 6;
  const totalSlots = Math.max(hasInvoices ? invoices!.length : 0, MIN_SLOTS);

  return (
    <main className="min-h-screen bg-slate-50 px-6 pt-20 pb-10 dark:bg-[#111113]">
      <div className="mx-auto max-w-7xl lg:flex lg:items-start lg:gap-10">
        {/* Linke Spalte: Rechnungs-Galerie */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Header */}
          <header className="space-y-3">
            <p className="text-[11px] tracking-[0.24em] uppercase text-slate-500 dark:text-white/40">
              {eyebrow}
            </p>
            <h1 className="text-[24px] md:text-[28px] font-semibold tracking-tight text-slate-900 dark:text-white">
              {headline}
            </h1>
            <p className="max-w-2xl text-sm md:text-[15px] text-slate-600 dark:text-white/60">
              {subline}
            </p>
            {isKunde && profile?.kundenummer && (
              <p className="text-[12px] text-slate-500 dark:text-white/40">
                Kundennummer: {profile.kundenummer}
              </p>
            )}
          </header>

          {/* Grid-Sektion */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-[16px] md:text-[17px] font-semibold text-slate-900 leading-tight dark:text-white">
                  Rechnungs-Galerie
                </h2>
                <p className="text-[12px] text-slate-500 mt-0.5 dark:text-white/40">
                  {hasInvoices
                    ? `${invoices!.length} Rechnung${invoices!.length === 1 ? "" : "en"}`
                    : "Noch keine Rechnungen hinterlegt – die Slots warten auf deine ersten Projekte."}
                </p>
              </div>
            </div>

            {loadingInvoices ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {Array.from({ length: MIN_SLOTS }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-white border border-slate-200 p-3 dark:bg-[#1d1d1f] dark:border-white/10"
                  >
                    <div className="w-full aspect-210/297 rounded-lg bg-slate-100 animate-pulse dark:bg-white/5" />
                    <div className="mt-3 h-3 w-2/3 rounded bg-slate-100 animate-pulse dark:bg-white/10" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-slate-100 animate-pulse dark:bg-white/10" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {Array.from({ length: totalSlots }).map((_, index) => {
                  const invoice =
                    hasInvoices && index < invoices!.length ? invoices![index] : null;

                  if (invoice)
                    return <InvoiceGridCard key={invoice.id} invoice={invoice} />;

                  const isFirstPlaceholder = !hasInvoices && index === 0;
                  return (
                    <InvoicePlaceholderCard
                      key={`placeholder-${index}`}
                      highlight={isFirstPlaceholder}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Rechte Spalte: Wirkungskonto */}
        <WirkungskontoPanel
          variant={isDemo ? "demo" : "authed"}
          name={name}
          email={profile?.email}
          initials={initials}
          wirkungEbene={wirkungEbene}
          scaleMax={SCALE_MAX}
          investedEUR={investedEUR}
          impactEUR={impactEUR}
          projectsCount={0}
          hasFirstInvoice={hasFirstInvoice}
          hasImpact={hasImpact}
          showNextStep={!hasAnyRealData}
        />
      </div>
    </main>
  );
}

/* ───────────── Karten im Grid ───────────── */

function InvoiceGridCard({ invoice }: { invoice: Invoice }) {
  return (
    <article className="w-full">
      <Link href={`/mein-bereich/rechnungen/${invoice.id}`} className="block group">
        <div
          className={[
            "rounded-2xl border border-slate-200 bg-white p-3 shadow-sm",
            "transition duration-300 ease-out",
            "group-hover:-translate-y-px group-hover:shadow-md group-hover:border-slate-300",
            "dark:bg-[#1d1d1f] dark:border-white/10 dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
            "dark:group-hover:border-white/15",
          ].join(" ")}
        >
          <div
            className={[
              "w-full aspect-210/297 overflow-hidden rounded-lg border border-slate-200",
              "bg-slate-100/80 group-hover:bg-white",
              "transition-colors duration-300 ease-out",
              "dark:border-white/10 dark:bg-white/5 dark:group-hover:bg-white/7",
            ].join(" ")}
          >
            {invoice.previewUrl ? (
              <img
                src={invoice.previewUrl}
                alt={`Rechnung ${invoice.number} · Seite 1`}
                className={[
                  "h-full w-full object-cover",
                  "transition duration-300 ease-out",
                  "group-hover:brightness-[1.02] group-hover:contrast-[1.02]",
                  "dark:opacity-[0.95] dark:group-hover:opacity-100",
                ].join(" ")}
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <FileText className="h-10 w-10 text-slate-300 dark:text-white/25" />
              </div>
            )}
          </div>

          <div className="mt-3 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[12px] font-semibold text-slate-900 truncate dark:text-white">
                Rechnung {invoice.number}
              </p>
              <StatusBadge status={invoice.status} />
            </div>

            <p className="text-[11px] text-slate-500 truncate dark:text-white/45">
              {invoice.projectName || "Ohne Titel"}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 dark:text-white/45">
              <span>{formatDate(invoice.date)}</span>
              <span className="text-[13px] font-semibold text-slate-900 dark:text-white">
                {formatCurrency(invoice.totalAmount, invoice.currency)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function InvoicePlaceholderCard({ highlight }: { highlight?: boolean }) {
  return (
    <article className="w-full">
      <div
        className={[
          "group rounded-2xl border-2 border-dashed border-slate-200",
          "bg-slate-50 p-3 shadow-sm",
          "transition duration-300 ease-out",
          "hover:border-slate-300 hover:-translate-y-px",
          "dark:bg-white/5 dark:border-white/12 dark:hover:border-white/20",
        ].join(" ")}
      >
        <div
          className={[
            "w-full aspect-210/297 rounded-lg border border-slate-200",
            "bg-slate-100/80 group-hover:bg-white",
            "transition-colors duration-300 ease-out",
            "flex items-center justify-center",
            "dark:border-white/10 dark:bg-white/5 dark:group-hover:bg-white/7",
          ].join(" ")}
        >
          <FileText className="h-10 w-10 text-slate-300 dark:text-white/25" />
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-[12px] font-medium text-slate-900 dark:text-white">
            {highlight ? "Noch keine Rechnungen hinterlegt" : "Freier Rechnungsslot"}
          </p>
          <p className="text-[11px] text-slate-500 leading-snug dark:text-white/45">
            {highlight
              ? "Sobald deine erste Projekt-Rechnung vorliegt, erscheint sie hier."
              : "Platz für weitere Rechnungen in deinem Wirkungsbereich."}
          </p>
        </div>
      </div>
    </article>
  );
}