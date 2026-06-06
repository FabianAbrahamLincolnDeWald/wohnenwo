"use client";

import * as React from "react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import WirkungskontoPanel from "@/components/mein-bereich/WirkungskontoPanel";
import { useWirkungskontoStats } from "@/lib/useWirkungskontoStats";
import {
  FileText,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react";

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
  currency: string;
  status: InvoiceStatus;
  projectName: string | null; // title
  previewUrl: string | null; // wohnenwo page 1
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

function cn(...classes: (string | boolean | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
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

function mapInvoiceStatus(s: unknown): InvoiceStatus {
  const v = String(s ?? "open").toLowerCase();
  if (v === "paid") return "paid";
  if (v === "canceled") return "canceled";
  return "open";
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
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium";

  const style =
    status === "paid"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/25 dark:text-emerald-300 dark:border-emerald-900/40"
      : status === "open"
        ? "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/25 dark:text-amber-300 dark:border-amber-900/40"
        : "bg-slate-50 text-slate-600 border border-slate-200 dark:bg-white/5 dark:text-white/50 dark:border-white/10";

  return <span className={`${base} ${style}`}>{label}</span>;
}

/* ──────────────────────────────────────────────────────────────
  Page
────────────────────────────────────────────────────────────── */

export default function MeinBereichPage() {
  const [view, setView] = useState<ViewState>("loading");
  const [profile, setProfile] = useState<Profile | null>(null);

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  // (vorerst) mock/placeholder — später mit echten Queries ersetzen
  const [projects, setProjects] = useState<any[]>([]);
  const [experts, setExperts] = useState<any[]>([]);

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

      // ✅ Invoices (für Startseite) + Preview URLs
      try {
        setLoadingInvoices(true);

        // WICHTIG: 4 laden → damit wir "ab 4" den 3. Slot als SeeAll nutzen können
        const { data: invoiceData, error: invoiceError } = await supabase
          .from("invoices")
          .select("id, invoice_number, date, total_amount, status, title, created_at")
          .eq("customer_id", user.id)
          .order("date", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false })
          .limit(4);

        if (!active) return;

        if (invoiceError) {
          console.error("Rechnungen konnten nicht geladen werden:", invoiceError);
          setInvoices([]);
          return;
        }

        const invRows = (invoiceData ?? []) as InvoiceRow[];
        const base: Invoice[] = invRows.map((row) => ({
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
        }));

        const ids = base.map((b) => b.id);

        if (ids.length > 0) {
          const { data: docs, error: docErr } = await supabase
            .from("invoice_documents")
            .select(
              "id, invoice_id, participant_id, doc_type, page_index, storage_bucket, storage_path"
            )
            .in("invoice_id", ids)
            .eq("participant_id", "wohnenwo")
            .eq("doc_type", "rechnung")
            .eq("page_index", 1);

          if (!docErr) {
            const docRows = (docs ?? []) as DocumentRow[];
            const docByInv = new Map<string, DocumentRow>();
            for (const d of docRows) {
              if (!docByInv.has(d.invoice_id)) docByInv.set(d.invoice_id, d);
            }

            const signedByInvoice: Record<string, string | null> = {};
            await Promise.all(
              ids.map(async (invId) => {
                const doc = docByInv.get(invId);
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

            for (const b of base) b.previewUrl = signedByInvoice[b.id] ?? null;
          } else {
            console.error("invoice_documents error:", docErr);
          }
        }

        setInvoices(base);
      } catch (e) {
        console.error(e);
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
  const isAuthed = view !== "demo";
  const isKunde = view === "kunde";

  // ✅ Zentrale Stats (kein lokales Rechnen mehr)
  const { investedEUR, impactEUR, invoiceCount } = useWirkungskontoStats(
    isAuthed ? profile?.id ?? null : null
  );

  const name =
    profile?.full_name ||
    profile?.email?.split("@")[0] ||
    (isDemo ? "Gast" : "Willkommen zurück");

  const initials = getInitialsFromProfile(profile);

  const eyebrow = isDemo
    ? "Vorschau"
    : isKunde
      ? "Persönlicher Wirkungsraum"
      : "Mein Bereich";

  const headline = isDemo
    ? "Mein Bereich – so fühlt sich dein Wirkungsraum an."
    : isKunde
      ? `Willkommen zurück, ${name}.`
      : `Hallo ${name}.`;

  const subline = isDemo
    ? "Ohne Anmeldung siehst du hier eine Vorschau. Mit deinem Zugang wird dieser Bereich zu deiner persönlichen Übersicht mit echten Projekten, Rechnungen und Wirkungsfonds."
    : isKunde
      ? "Hier bündeln wir deine Projekte, Rechnungen und die Wirkung deiner Investitionen. In den Taps der Sidebar kannst du später tiefer einsteigen."
      : "Du bist angemeldet. Sobald wir ein gemeinsames Projekt starten, erscheinen hier deine individuellen Projekte, Rechnungen und Wirkungsinformationen.";

  // Wirkungsebene I: 0–100
  const SCALE_MAX = 100;
  const wirkungEbene = impactEUR;

  const hasFirstInvoice = isAuthed && invoiceCount > 0;
  const hasImpact = isAuthed && impactEUR > 0.0001;

  // ✅ “Nächster Schritt” soll verschwinden sobald Rechnung oder Projekt existiert
  const projectsCount = projects.length; // später echte Query
  const hasAnyRealData = invoiceCount > 0 || projectsCount > 0;

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

  return (
    <main className="min-h-screen bg-slate-50 px-6 pt-20 pb-10 dark:bg-[#111113]">
      <div className="mx-auto max-w-7xl lg:flex lg:items-start lg:gap-10">
        {/* Linke Spalte */}
        <div className="flex-1 min-w-0 space-y-10">
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

          {/* Rechnungen */}
          <section>
            <SliderShell
              title="Rechnungen"
              subtitle={
                isAuthed
                  ? `${invoiceCount} abgeschlossene Leistung${invoiceCount === 1 ? "" : "en"}`
                  : "0 Transparente Aufschlüsselung deiner Projekte."
              }
              hrefAllMobile="/mein-bereich/rechnungen"
              allLabelMobile="Alle ansehen"
            >
              {(() => {
                const SLOT_COUNT = 3;

                if (!isAuthed) {
                  return Array.from({ length: SLOT_COUNT }).map((_, i) => (
                    <InvoicePlaceholderA4 key={i} highlight={i === 0} />
                  ));
                }

                if (loadingInvoices) {
                  return Array.from({ length: SLOT_COUNT }).map((_, i) => (
                    <InvoicePreviewSkeleton key={i} />
                  ));
                }

                const totalLoaded = invoices.length;

                // CASE A: 0–3 → echte + Platzhalter bis 3
                if (totalLoaded <= SLOT_COUNT) {
                  const shown = invoices.slice(0, SLOT_COUNT);
                  const placeholders = SLOT_COUNT - shown.length;

                  return (
                    <>
                      {shown.map((inv) => (
                        <InvoicePreviewCard key={inv.id} invoice={inv} />
                      ))}
                      {Array.from({ length: placeholders }).map((_, i) => (
                        <InvoicePlaceholderA4
                          key={`ph-${i}`}
                          highlight={shown.length === 0 && i === 0}
                        />
                      ))}
                    </>
                  );
                }

                // CASE B: 4+ → 2 + "Alle ansehen"
                const shown = invoices.slice(0, SLOT_COUNT - 1);

                return (
                  <>
                    {shown.map((inv) => (
                      <InvoicePreviewCard key={inv.id} invoice={inv} />
                    ))}
                    <SeeAllCard href="/mein-bereich/rechnungen" />
                  </>
                );
              })()}
            </SliderShell>
          </section>

          {/* Projekte */}
          <section>
            <SliderShell
              title="Projekte"
              subtitle="0 laufende und abgeschlossene Wohnerlebnisse."
              hrefAllMobile="/mein-bereich/projekte"
              allLabelMobile="Alle ansehen"
            >
              {(() => {
                const SLOT_COUNT = 3;
                const total = projects.length;

                if (total <= SLOT_COUNT) {
                  const shown = projects.slice(0, SLOT_COUNT);
                  const placeholders = SLOT_COUNT - shown.length;

                  return (
                    <>
                      {shown.map((p: any) => (
                        <ProjectSlotCard
                          key={p.id}
                          icon={<FolderKanban className="h-10 w-10" />}
                          badgeText={p.badgeText ?? ""}
                          title={p.title ?? "Projekt"}
                          meta={p.meta ?? ""}
                          showBadge={!!p.badgeText}
                        />
                      ))}

                      {Array.from({ length: placeholders }).map((_, i) => (
                        <ProjectSlotCard
                          key={`ph-${i}`}
                          icon={<FolderKanban className="h-10 w-10" />}
                          badgeText={i === 0 && total === 0 ? "Noch keine Projekte verknüpft" : ""}
                          title={
                            i === 0 && total === 0
                              ? "Projektslots warten auf dich"
                              : "Freier Projektslot"
                          }
                          meta={
                            i === 0 && total === 0
                              ? "Sobald dein erster Auftrag freigeschaltet ist, erscheinen hier deine Projekte."
                              : "Bereit für Küchen, Bäder oder Wohnungen."
                          }
                          showBadge={i === 0 && total === 0}
                        />
                      ))}
                    </>
                  );
                }

                const shown = projects.slice(0, SLOT_COUNT - 1);

                return (
                  <>
                    {shown.map((p: any) => (
                      <ProjectSlotCard
                        key={p.id}
                        icon={<FolderKanban className="h-10 w-10" />}
                        badgeText={p.badgeText ?? ""}
                        title={p.title ?? "Projekt"}
                        meta={p.meta ?? ""}
                        showBadge={!!p.badgeText}
                      />
                    ))}
                    <SeeAllCard href="/mein-bereich/projekte" />
                  </>
                );
              })()}
            </SliderShell>
          </section>

          {/* Experten */}
          <section>
            <SliderShell
              title="Experten"
              subtitle="0 verbundene Experten, mit denen du im Netzwerk arbeitest."
              hrefAllMobile="/mein-bereich/experten"
              allLabelMobile="Alle ansehen"
            >
              {(() => {
                const SLOT_COUNT = 3;
                const total = experts.length;

                if (total <= SLOT_COUNT) {
                  const shown = experts.slice(0, SLOT_COUNT);
                  const placeholders = SLOT_COUNT - shown.length;

                  return (
                    <>
                      {shown.map((e: any) => (
                        <PersonSlotCard
                          key={e.id}
                          name={e.name ?? "Expert:in"}
                          role={e.role ?? ""}
                          showBadge={!!e.badgeText}
                          badgeText={e.badgeText}
                        />
                      ))}

                      {Array.from({ length: placeholders }).map((_, i) => (
                        <PersonSlotCard
                          key={`ph-${i}`}
                          name={i === 0 && total === 0 ? "Noch kein Team verknüpft" : "Freier Team-Slot"}
                          role={
                            i === 0 && total === 0
                              ? "Sobald wir dein Team verknüpft haben, siehst du es hier."
                              : "Platz für weitere Studios, Planer:innen oder Hersteller."
                          }
                          showBadge={i === 0 && total === 0}
                          badgeText={i === 0 && total === 0 ? "Team-Slots" : undefined}
                        />
                      ))}
                    </>
                  );
                }

                const shown = experts.slice(0, SLOT_COUNT - 1);

                return (
                  <>
                    {shown.map((e: any) => (
                      <PersonSlotCard
                        key={e.id}
                        name={e.name ?? "Expert:in"}
                        role={e.role ?? ""}
                        showBadge={!!e.badgeText}
                        badgeText={e.badgeText}
                      />
                    ))}
                    <SeeAllCard href="/mein-bereich/experten" />
                  </>
                );
              })()}
            </SliderShell>
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
          projectsCount={projectsCount}
          hasFirstInvoice={hasFirstInvoice}
          hasImpact={hasImpact}
          showNextStep={!hasAnyRealData}
        />
      </div>
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────
  SliderShell (mit Dark Mode)
────────────────────────────────────────────────────────────── */

function SliderShell(props: {
  title: string;
  subtitle?: string;
  hrefAllMobile?: string;
  allLabelMobile?: string;
  children: React.ReactNode;
}) {
  const { title, subtitle, hrefAllMobile, allLabelMobile, children } = props;

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const update = () => {
      if (!trackRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      const max = Math.max(0, scrollWidth - clientWidth);
      setCanLeft(scrollLeft > 2);
      setCanRight(scrollLeft < max - 2);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;

    const first = el.children[0] as HTMLElement | null;
    const second = el.children[1] as HTMLElement | null;

    let step: number;

    if (first && second) {
      const rect1 = first.getBoundingClientRect();
      const rect2 = second.getBoundingClientRect();
      step = rect2.left - rect1.left;
    } else if (first) {
      step = first.getBoundingClientRect().width;
    } else {
      step = el.clientWidth * 0.9;
    }

    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const showArrows = canLeft || canRight;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[18px] sm:text-[20px] font-semibold text-slate-900 leading-tight dark:text-white">
            {title}
          </h2>

          {/* Mobile Link */}
          {hrefAllMobile ? (
            <Link
              href={hrefAllMobile}
              className="sm:hidden inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-700 hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap dark:text-white/70 dark:hover:text-white"
              aria-label={allLabelMobile ?? "Alle ansehen"}
            >
              {allLabelMobile ?? "Alle ansehen"}
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : null}

          {/* Tablet/Desktop arrows only if needed */}
          {showArrows ? (
            <div className="hidden md:flex items-center space-x-1">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                disabled={!canLeft}
                aria-label="Nach links blättern"
              >
                <div
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full border text-center transition duration-300 ease-out",
                    "border-slate-200 bg-white text-slate-500 hover:bg-slate-100",
                    "dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10",
                    !canLeft &&
                    "opacity-30 cursor-not-allowed hover:bg-white pointer-events-none dark:hover:bg-white/5"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleScroll("right")}
                disabled={!canRight}
                aria-label="Nach rechts blättern"
              >
                <div
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full border text-center transition duration-300 ease-out",
                    "border-slate-200 bg-white text-slate-500 hover:bg-slate-100",
                    "dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10",
                    !canRight &&
                    "opacity-30 cursor-not-allowed hover:bg-white pointer-events-none dark:hover:bg-white/5"
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>
            </div>
          ) : null}
        </div>

        {subtitle ? (
          <p className="hidden sm:block text-[13px] text-slate-500 dark:text-white/40">
            {subtitle}
          </p>
        ) : null}

        {subtitle ? (
          <p className="sm:hidden text-[13px] text-slate-500 leading-snug dark:text-white/40">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          className="
            flex gap-x-3 sm:gap-x-4 md:gap-x-5
            overflow-x-auto
            scroll-smooth pb-2
            w-full max-w-full
            [scrollbar-width:none] [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
  Cards / Placeholders (mit Dark Mode)
────────────────────────────────────────────────────────────── */

function InvoicePreviewSkeleton() {
  return (
    <article className="shrink-0 w-[220px] sm:w-[260px] md:w-[260px] lg:w-[260px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#1d1d1f]">
        <div className="w-full aspect-210/297 rounded-lg bg-slate-100 animate-pulse dark:bg-white/10" />
        <div className="mt-3 h-3 w-2/3 rounded bg-slate-100 animate-pulse dark:bg-white/10" />
        <div className="mt-2 h-3 w-1/2 rounded bg-slate-100 animate-pulse dark:bg-white/10" />
      </div>
    </article>
  );
}

function InvoicePreviewCard({ invoice }: { invoice: Invoice }) {
  return (
    <article className="shrink-0 w-[220px] sm:w-[260px] md:w-[260px] lg:w-[260px]">
      <Link href={`/mein-bereich/rechnungen/${invoice.id}`} className="block group">
        <div
          className={[
            "rounded-2xl border border-slate-200 bg-white p-3 shadow-sm",
            "transition duration-300 ease-out",
            "group-hover:-translate-y-px group-hover:shadow-md group-hover:border-slate-300",
            "dark:border-white/10 dark:bg-[#1d1d1f] dark:group-hover:border-white/20 dark:group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]",
          ].join(" ")}
        >
          <div
            className={[
              "w-full aspect-210/297 overflow-hidden rounded-lg border border-slate-200",
              "bg-slate-100/80 group-hover:bg-white",
              "transition-colors duration-300 ease-out",
              "dark:border-white/10 dark:bg-white/5 dark:group-hover:bg-white/8",
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

            <p className="text-[11px] text-slate-500 truncate dark:text-white/40">
              {invoice.projectName || "Ohne Titel"}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 dark:text-white/40">
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

function InvoicePlaceholderA4({ highlight }: { highlight?: boolean }) {
  return (
    <article className="shrink-0 w-[220px] sm:w-[260px] md:w-[260px] lg:w-[260px]">
      <div
        className={[
          "group rounded-2xl border-2 border-dashed border-slate-200",
          "bg-slate-50 p-3 transition duration-300 ease-out hover:border-slate-300",
          "dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20",
        ].join(" ")}
      >
        <div
          className={[
            "w-full aspect-210/297 rounded-lg border border-slate-200",
            "bg-slate-100/80 group-hover:bg-white",
            "transition-colors duration-300 ease-out",
            "flex items-center justify-center",
            "dark:border-white/10 dark:bg-white/5 dark:group-hover:bg-white/8",
          ].join(" ")}
        >
          <FileText className="h-10 w-10 text-slate-300 dark:text-white/25" />
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-[12px] font-medium text-slate-900 dark:text-white">
            {highlight ? "Noch keine Rechnungen hinterlegt" : "Freier Rechnungsslot"}
          </p>
          <p className="text-[11px] text-slate-500 leading-snug dark:text-white/40">
            {highlight
              ? "Sobald deine erste Projekt-Rechnung vorliegt, erscheint sie hier."
              : "Platz für weitere Rechnungen in deinem Wirkungsbereich."}
          </p>
        </div>
      </div>
    </article>
  );
}

function SeeAllCard({ href }: { href: string }) {
  return (
    <article className="shrink-0 w-[220px] sm:w-[260px] md:w-[260px] lg:w-[260px]">
      <Link href={href} className="block group">
        <div
          className={[
            "rounded-2xl border-2 border-dashed border-slate-200",
            "bg-slate-50 p-3 transition duration-300 ease-out hover:border-slate-300",
            "dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20",
            "group-hover:-translate-y-px",
          ].join(" ")}
        >
          <div
            className={[
              "w-full aspect-210/297 rounded-lg border border-slate-200",
              "bg-slate-100/80 group-hover:bg-white",
              "transition-colors duration-300 ease-out",
              "flex items-center justify-center",
              "dark:border-white/10 dark:bg-white/5 dark:group-hover:bg-white/8",
            ].join(" ")}
          >
            <div className="text-center px-4">
              <p className="text-[12px] font-semibold text-slate-900 dark:text-white">
                Alle Rechnungen ansehen
              </p>
              <p className="mt-1 text-[11px] text-slate-500 leading-snug dark:text-white/40">
                Zur vollständigen Übersicht
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[12px] font-semibold text-slate-900 truncate dark:text-white">
                Rechnungsgalerie öffnen
              </p>

              <span
                className={[
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                  "bg-slate-50 text-slate-600 border border-slate-200",
                  "transition-colors duration-300 ease-out",
                  "group-hover:bg-slate-100 group-hover:border-slate-300 group-hover:text-slate-700",
                  "dark:bg-white/5 dark:text-white/50 dark:border-white/10",
                  "dark:group-hover:bg-white/10 dark:group-hover:border-white/20 dark:group-hover:text-white/70",
                ].join(" ")}
              >
                Übersicht
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug dark:text-white/40">
              Alle deine Rechnungen an einem Ort.
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}

function ProjectSlotCard(props: {
  icon: React.ReactNode;
  badgeText: string;
  title: string;
  meta: string;
  showBadge?: boolean;
}) {
  const { icon, badgeText, title, meta, showBadge } = props;
  return (
    <article className="shrink-0 w-[220px] sm:w-[260px] md:w-[260px] lg:w-[260px]">
      <div
        className={[
          "group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200",
          "bg-slate-50 flex flex-col h-[220px] sm:h-[240px] md:h-[260px] transition duration-300 ease-out",
          "dark:border-white/10 dark:bg-white/5",
        ].join(" ")}
      >
        <div className="relative flex-1 bg-slate-100/80 dark:bg-white/5">
          {showBadge && badgeText && (
            <div className="absolute top-2 left-2 z-10">
              <div className="inline-flex items-center gap-1 rounded-md bg-white/80 px-2 py-1 border border-slate-200 text-[10px] font-medium text-slate-600 dark:bg-white/10 dark:border-white/10 dark:text-white/60">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-[3px] border border-slate-300 text-[10px] dark:border-white/20">
                  1
                </span>
                <span className="truncate max-w-[120px]">{badgeText}</span>
              </div>
            </div>
          )}

          <div
            className={[
              "absolute inset-2 rounded-xl border border-slate-200/80 bg-slate-100/80",
              "group-hover:bg-white transition-colors duration-300 ease-out flex items-center justify-center overflow-hidden",
              "dark:border-white/10 dark:bg-white/5 dark:group-hover:bg-white/8",
            ].join(" ")}
          >
            <div className="flex items-center justify-center opacity-40">
              <div className="rounded-full border border-slate-200/80 p-4 dark:border-white/10">
                <div className="text-slate-300 dark:text-white/25">{icon}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-3 py-2.5 space-y-1 h-[82.5px] flex flex-col justify-center dark:bg-[#1d1d1f]">
          <p className="text-sm font-medium text-slate-900 line-clamp-1 dark:text-white">
            {title}
          </p>
          <p className="text-[11px] text-slate-500 line-clamp-2 dark:text-white/40">
            {meta}
          </p>
        </div>
      </div>
    </article>
  );
}

function PersonSlotCard(props: {
  name: string;
  role: string;
  showBadge?: boolean;
  badgeText?: string;
}) {
  const { name, role, showBadge, badgeText } = props;
  return (
    <article className="shrink-0 w-40">
      <div
        className={[
          "group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50",
          "flex h-[210px] sm:h-[220px] transition duration-300 ease-out",
          "dark:border-white/10 dark:bg-white/5",
        ].join(" ")}
      >
        <div className="relative flex-1 bg-slate-100 dark:bg-white/5">
          {showBadge && badgeText && (
            <div className="absolute top-2 left-2 z-10">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 border border-slate-200 text-[10px] font-medium text-slate-600 dark:bg-white/10 dark:border-white/10 dark:text-white/60">
                {badgeText}
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
            <div className="rounded-full border border-slate-200/80 p-4 bg-white/70 dark:border-white/10 dark:bg-white/10">
              <UserPlus className="h-7 w-7 text-slate-300 dark:text-white/25" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-3 text-left text-white bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
            <p className="text-sm font-medium leading-snug line-clamp-2">{name}</p>
            <p className="mt-0.5 text-[11px] text-slate-100 leading-snug line-clamp-3">
              {role}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}