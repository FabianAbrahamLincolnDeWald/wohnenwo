// app/mein-bereich/rechnungen/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FileText, Lock } from "lucide-react";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  kundenummer: string | null;
};

type ViewState = "loading" | "demo" | "user" | "kunde";

type InvoiceStatus = "offen" | "bezahlt" | "entwurf";

type Invoice = {
  id: string;
  number: string;
  date: string | null; // ISO-String oder null
  totalAmount: number;
  currency: string;
  status: InvoiceStatus;
  projectName: string | null;
};

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
    status === "bezahlt"
      ? "Bezahlt"
      : status === "offen"
      ? "Offen"
      : "Entwurf";

  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium";

  const style =
    status === "bezahlt"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
      : status === "offen"
      ? "bg-amber-50 text-amber-700 border border-amber-100"
      : "bg-slate-50 text-slate-600 border border-slate-200";

  return <span className={`${base} ${style}`}>{label}</span>;
}

export default function RechnungenPage() {
  const [view, setView] = useState<ViewState>("loading");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      // 1. Auth prüfen
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

      // 2. Profil laden
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
        if (role === "kunde") {
          setView("kunde");
        } else {
          setView("user");
        }
      }

      // 3. Rechnungen laden (Spalten ggf. an dein Schema anpassen)
      try {
        const { data: invoiceData, error: invoiceError } = await supabase
          .from("invoices")
          .select(
            "id, number, date, total_amount, currency, status, project_name"
          )
          .eq("user_id", user.id)
          .order("date", { ascending: false });

        if (!active) return;

        if (invoiceError) {
          console.error("Rechnungen konnten nicht geladen werden:", invoiceError);
          setInvoices([]);
        } else {
          const mapped: Invoice[] =
            invoiceData?.map((row: any) => ({
              id: row.id,
              number: row.number ?? "–",
              date: row.date ?? null,
              totalAmount: Number(row.total_amount) || 0,
              currency: row.currency || "EUR",
              status: (row.status as InvoiceStatus) || "entwurf",
              projectName: row.project_name ?? null,
            })) ?? [];

          setInvoices(mapped);
        }
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
    (view === "demo" ? "Gast" : "Willkommen zurück");

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

  // mindestens 2 Reihen à 3 Karten
  const MIN_SLOTS = 6;
  const totalSlots = Math.max(hasInvoices ? invoices!.length : 0, MIN_SLOTS);

  // Gesamt-Loading (Skeleton)
  if (view === "loading") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pt-20 pb-10">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[minmax(0,1.9fr)_minmax(260px,1fr)]">
          <div className="space-y-4">
            <div className="h-6 w-40 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-64 rounded bg-slate-200 animate-pulse" />
            <div className="h-64 w-full rounded-xl bg-slate-100 animate-pulse" />
          </div>
          <aside className="hidden lg:block">
            <div className="h-48 w-full rounded-2xl bg-slate-100 animate-pulse" />
          </aside>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 pt-20 pb-10">
      <div className="mx-auto max-w-7xl lg:flex lg:items-start lg:gap-10">
        {/* Linke Spalte: Rechnungs-Galerie */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Header */}
          <header className="space-y-3">
            <p className="text-[11px] tracking-[0.24em] uppercase text-slate-500">
              {eyebrow}
            </p>
            <h1 className="text-[24px] md:text-[28px] font-semibold tracking-tight text-slate-900">
              {headline}
            </h1>
            <p className="max-w-2xl text-sm md:text-[15px] text-slate-600">
              {subline}
            </p>
            {isKunde && profile?.kundenummer && (
              <p className="text-[12px] text-slate-500">
                Kundennummer: {profile.kundenummer}
              </p>
            )}
          </header>

          {/* Grid-Sektion */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-[16px] md:text-[17px] font-semibold text-slate-900 leading-tight">
                  Rechnungs-Galerie
                </h2>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  {hasInvoices
                    ? `${invoices!.length} Rechnung${
                        invoices!.length === 1 ? "" : "en"
                      } · visuell angeordnet in deinem Wirkungsraum`
                    : "Noch keine Rechnungen hinterlegt – die Slots warten auf deine ersten Projekte."}
                </p>
              </div>
            </div>

            {loadingInvoices ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {Array.from({ length: MIN_SLOTS }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[260px] sm:h-[280px] rounded-2xl bg-slate-100 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {Array.from({ length: totalSlots }).map((_, index) => {
                  const invoice =
                    hasInvoices && index < invoices!.length
                      ? invoices![index]
                      : null;

                  if (invoice) {
                    return <InvoiceGridCard key={invoice.id} invoice={invoice} />;
                  }

                  // Platzhalter-Slots – erste Karte „Noch keine Rechnungen“
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

        {/* Rechte Spalte: sticky Wirkungskonto mit Divider – 1:1 aus MeinBereichPage */}
        <aside
          className="
            hidden lg:block
            w-[300px]
            lg:pl-8
            lg:border-l lg:border-slate-200/80
            lg:sticky lg:top-24
            self-start
          "
        >
          <div className="space-y-5">
            {/* Wirkungskonto / Profil-Panel */}
            <section className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200/80 px-4 py-5 space-y-5 shadow-sm">
              {/* Eyebrow + lockerer Introtext */}
              <header className="space-y-1">
                <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                  Dein Wirkungskonto
                </p>
                <p className="text-[13px] leading-snug text-slate-700">
                  {isDemo
                    ? "Lerne deinen Wirkungsraum kennen – ganz ohne Verpflichtung."
                    : "Schön, dass du da bist. Hier wächst die Wirkung deiner Investitionen."}
                </p>
              </header>

              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex h-9 w-9 items-center justify-center
                             rounded-full bg-slate-900 text-white
                             text-[13px] font-semibold"
                >
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-slate-900 truncate">
                    {name}
                  </p>
                  <p className="text-[12px] text-slate-500 truncate">
                    {profile?.email ||
                      (isDemo ? "Gast-Zugang" : "Ohne E-Mail hinterlegt")}
                  </p>
                </div>
              </div>

              {/* Highlight-Block – „Reward“-Gefühl */}
              <div className="rounded-xl bg-slate-900 text-slate-50 px-4 py-3 space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300">
                  Nächster Schritt
                </p>
                <p className="text-[13px] leading-snug">
                  Starte dein erstes Projekt, um Wirkungspunkte zu sammeln und
                  dein Konto zu füllen.
                </p>
                <button
                  type="button"
                  className="mt-1 inline-flex items-center justify-center rounded-full
                             bg-white/90 px-3 py-1 text-[12px] font-medium text-slate-900"
                >
                  Projekt anfragen
                </button>
              </div>

              {/* Wirkungsabzeichen */}
              <div className="pt-2 border-t border-slate-100/80 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                    Wirkungsabzeichen
                  </p>
                  <p className="text-[11px] text-slate-400">0 / 5</p>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50"
                    >
                      <Lock className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Kennzahlen – locker gesetzt */}
              <div className="space-y-3 text-[12px] text-slate-600">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Wirkungspunkte</span>
                    <span className="font-semibold text-slate-900">
                      0&nbsp;px
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-0 rounded-full bg-emerald-500" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span>Projekte</span>
                  <span className="font-semibold text-slate-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Investiertes Volumen</span>
                  <span className="font-semibold text-slate-900">
                    0&nbsp;€
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Wirkungsfonds-Anteil</span>
                  <span className="font-semibold text-slate-900">
                    0&nbsp;€
                  </span>
                </div>
              </div>

              <p className="text-[11px] leading-snug text-slate-500">
                Mit deiner ersten Rechnung wird aus dieser Vorschau dein echtes
                Wirkungskonto – mit jedem Projekt wächst deine sichtbare Wirkung.
              </p>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}

/* ───────────── Karten im Grid – analog zu InvoiceSlotCard aus der Übersicht ───────────── */

function InvoiceGridCard({ invoice }: { invoice: Invoice }) {
  return (
    <article className="w-full">
      <Link
        href={`/mein-bereich/rechnungen/${invoice.id}`}
        className="block group"
      >
        <div className="relative flex h-[260px] sm:h-[280px] flex-col rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition duration-300 ease-out group-hover:border-slate-300 group-hover:-translate-y-px">
          <div className="m-3 flex-1 rounded-xl border border-slate-200 bg-slate-100/80 group-hover:bg-white transition-colors duration-300 ease-out px-3 py-3 flex flex-col justify-between overflow-hidden">
            {/* Icon im Hintergrund */}
            <div className="pointer-events-none absolute inset-3 flex items-center justify-center opacity-20">
              <div className="rounded-full border border-slate-200/80 p-4">
                <div className="text-slate-300">
                  <FileText className="h-10 w-10" />
                </div>
              </div>
            </div>

            {/* Inhalt */}
            <div className="relative z-10 space-y-2">
              <div className="space-y-0.5">
                <p className="text-[12px] font-semibold text-slate-900 truncate">
                  Rechnung {invoice.number}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {invoice.projectName || "Ohne Projektnamen"}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 space-y-0.5">
                <p>Ausgestellt am {formatDate(invoice.date)}</p>
              </div>
            </div>

            {/* Footer: Betrag + Status */}
            <div className="relative z-10 mt-3 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-500">Betrag</span>
                <span className="text-[13px] font-semibold text-slate-900">
                  {formatCurrency(invoice.totalAmount, invoice.currency)}
                </span>
              </div>
              <StatusBadge status={invoice.status} />
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
      <div className="group relative flex h-[260px] sm:h-[280px] flex-col rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition duration-300 ease-out">
        <div className="m-3 flex-1 rounded-xl border border-slate-200 bg-slate-100/80 group-hover:bg-white transition-colors duration-300 ease-out px-3 py-3 flex flex-col justify-between overflow-hidden">
          {/* Icon im Hintergrund */}
          <div className="pointer-events-none absolute inset-3 flex items-center justify-center opacity-25">
            <div className="rounded-full border border-slate-200/80 p-4">
              <div className="text-slate-300">
                <FileText className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* Inhalt */}
          <div className="relative z-10 space-y-2">
            {highlight ? (
              <p className="text-[12px] font-medium text-slate-900">
                Noch keine Rechnungen hinterlegt
              </p>
            ) : (
              <p className="text-[12px] font-medium text-slate-900">
                Freier Rechnungsslot
              </p>
            )}
            <p className="text-[11px] text-slate-500 leading-snug">
              {highlight
                ? "Sobald deine erste Projekt-Rechnung vorliegt, erscheint sie hier vollständig aufgeschlüsselt."
                : "Platz für weitere Rechnungen in deinem Wirkungsbereich."}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
