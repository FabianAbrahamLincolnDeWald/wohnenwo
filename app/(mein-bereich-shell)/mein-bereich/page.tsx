"use client";

import * as React from "react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import WirkungskontoWidget from "@/components/mein-bereich/WirkungskontoWidget";
import { useWirkungskontoStats } from "@/lib/useWirkungskontoStats";
import {
  FileText,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Zap,
  RefreshCw,
  Layers,
  TrendingUp,
  Receipt,
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
  number: string;
  date: string | null;
  totalAmount: number | null;
  currency: string;
  status: InvoiceStatus;
  projectName: string | null;
  previewUrl: string | null;
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

type ProjectItem = {
  id: string;
  title?: string;
  meta?: string;
  badgeText?: string;
};

type ExpertItem = {
  id: string;
  name?: string;
  role?: string;
  badgeText?: string;
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
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

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

/* ──────────────────────────────────────────────────────────────
  Animation variants
────────────────────────────────────────────────────────────── */

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ──────────────────────────────────────────────────────────────
  Sub-components
────────────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const label = status === "paid" ? "Bezahlt" : status === "open" ? "Offen" : "Storniert";
  const style =
    status === "paid"
      ? "bg-emerald-900/25 text-emerald-400 border border-emerald-800/40"
      : status === "open"
        ? "bg-amber-900/25 text-amber-400 border border-amber-800/40"
        : "bg-white/5 text-white/40 border border-white/10";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${style}`}>
      {label}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  gold,
  progress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  gold?: boolean;
  progress?: number;
}) {
  return (
    <motion.div
      variants={cardVariants}
      className={cn(
        "rounded-2xl p-5 flex flex-col gap-3",
        gold
          ? "border border-[#F5C842]/15 bg-[#111111]/80 backdrop-blur-xl shadow-[0_0_20px_rgba(245,200,66,0.06)]"
          : "border border-white/[0.06] bg-[#111111]/80 backdrop-blur-xl"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">{label}</p>
        <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", gold ? "bg-[#F5C842]/10" : "bg-white/[0.06]")}>
          <span className={gold ? "text-[#F5C842]" : "text-white/40"}>{icon}</span>
        </div>
      </div>
      <div>
        <p className={cn("text-[26px] font-bold tabular-nums leading-none tracking-tight", gold ? "text-[#F5C842]" : "text-white")}>
          {value}
        </p>
        {sub && <p className="mt-1 text-[11px] text-white/35">{sub}</p>}
      </div>
      {progress !== undefined && (
        <div className="h-1 w-full rounded-full bg-[#222222] overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              background: "linear-gradient(90deg, #F5C842, #00B4D8)",
              transition: "width 600ms ease-out",
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
  SliderWidget – glass card wrapping a horizontal scroll area
────────────────────────────────────────────────────────────── */

function SliderWidget({
  title,
  subtitle,
  hrefAll,
  children,
}: {
  title: string;
  subtitle?: string;
  hrefAll?: string;
  children: React.ReactNode;
}) {
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
      step = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
    } else if (first) {
      step = first.getBoundingClientRect().width;
    } else {
      step = el.clientWidth * 0.9;
    }
    el.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  };

  const showArrows = canLeft || canRight;

  return (
    <motion.div
      variants={cardVariants}
      className="h-full rounded-2xl border border-white/[0.06] bg-[#111111]/80 backdrop-blur-xl p-5 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-[15px] font-semibold text-white leading-tight">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[11px] text-white/35">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {hrefAll && (
            <Link
              href={hrefAll}
              className="text-[11px] font-medium text-white/35 hover:text-[#F5C842] transition-colors duration-150 whitespace-nowrap"
            >
              Alle ansehen
            </Link>
          )}
          {showArrows && (
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                disabled={!canLeft}
                className={cn(
                  "h-6 w-6 flex items-center justify-center rounded-md border transition duration-150",
                  "border-white/10 bg-white/[0.05] text-white/50 hover:bg-white/[0.10] hover:text-white/80",
                  !canLeft && "opacity-30 cursor-not-allowed pointer-events-none"
                )}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                disabled={!canRight}
                className={cn(
                  "h-6 w-6 flex items-center justify-center rounded-md border transition duration-150",
                  "border-white/10 bg-white/[0.05] text-white/50 hover:bg-white/[0.10] hover:text-white/80",
                  !canRight && "opacity-30 cursor-not-allowed pointer-events-none"
                )}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Track */}
      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
  Invoice Cards
────────────────────────────────────────────────────────────── */

function InvoicePreviewSkeleton() {
  return (
    <article className="shrink-0 w-[180px] sm:w-[200px]">
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-2.5">
        <div className="w-full aspect-[210/297] rounded-lg bg-white/[0.06] animate-pulse" />
        <div className="mt-2.5 h-2.5 w-2/3 rounded bg-white/[0.06] animate-pulse" />
        <div className="mt-1.5 h-2.5 w-1/2 rounded bg-white/[0.06] animate-pulse" />
      </div>
    </article>
  );
}

function InvoicePreviewCard({ invoice }: { invoice: Invoice }) {
  return (
    <article className="shrink-0 w-[180px] sm:w-[200px]">
      <Link href={`/mein-bereich/rechnungen/${invoice.id}`} className="block group">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-2.5 transition duration-300 ease-out group-hover:border-white/20 group-hover:bg-white/[0.08] group-hover:-translate-y-0.5">
          <div className="w-full aspect-[210/297] overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.04] flex items-center justify-center">
            {invoice.previewUrl ? (
              <img
                src={invoice.previewUrl}
                alt={`Rechnung ${invoice.number} · Seite 1`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <FileText className="h-8 w-8 text-white/20" />
            )}
          </div>
          <div className="mt-2.5 space-y-1">
            <div className="flex items-start justify-between gap-1.5">
              <p className="text-[11px] font-semibold text-white truncate">
                Rechnung {invoice.number}
              </p>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="text-[10px] text-white/35 truncate">{invoice.projectName || "Ohne Titel"}</p>
            <div className="flex items-center justify-between text-[10px] text-white/35 pt-0.5">
              <span>{formatDate(invoice.date)}</span>
              <span className="text-[12px] font-semibold text-white">
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
    <article className="shrink-0 w-[180px] sm:w-[200px]">
      <div className="group rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] p-2.5 transition duration-300 ease-out hover:border-white/20">
        <div className="w-full aspect-[210/297] rounded-lg border border-white/[0.06] bg-white/[0.03] flex items-center justify-center">
          <FileText className="h-8 w-8 text-white/15" />
        </div>
        <div className="mt-2.5 space-y-1">
          <p className="text-[11px] font-medium text-white/60">
            {highlight ? "Noch keine Rechnungen" : "Freier Rechnungsslot"}
          </p>
          <p className="text-[10px] text-white/25 leading-snug">
            {highlight
              ? "Erscheint hier sobald deine erste Rechnung vorliegt."
              : "Platz für weitere Rechnungen."}
          </p>
        </div>
      </div>
    </article>
  );
}

function SeeAllCard({ href }: { href: string }) {
  return (
    <article className="shrink-0 w-[180px] sm:w-[200px]">
      <Link href={href} className="block group">
        <div className="rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] p-2.5 transition duration-300 ease-out hover:border-[#F5C842]/30 hover:bg-[#F5C842]/[0.03] group-hover:-translate-y-0.5">
          <div className="w-full aspect-[210/297] rounded-lg border border-white/[0.06] bg-white/[0.03] flex items-center justify-center">
            <div className="text-center px-3">
              <p className="text-[11px] font-semibold text-white/60 group-hover:text-white transition-colors duration-150">
                Alle Rechnungen
              </p>
              <p className="mt-1 text-[10px] text-white/30">ansehen →</p>
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-[11px] font-semibold text-white/60 group-hover:text-[#F5C842] transition-colors duration-150">
              Vollständige Übersicht
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ──────────────────────────────────────────────────────────────
  Project / Expert Cards
────────────────────────────────────────────────────────────── */

function ProjectSlotCard({
  icon,
  title,
  meta,
  badgeText,
  showBadge,
}: {
  icon: React.ReactNode;
  title: string;
  meta: string;
  badgeText: string;
  showBadge?: boolean;
}) {
  return (
    <article className="shrink-0 w-[160px] sm:w-[180px]">
      <div className="group relative overflow-hidden rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] flex flex-col h-[200px] transition duration-300 ease-out hover:border-white/20">
        <div className="relative flex-1 bg-white/[0.03]">
          {showBadge && badgeText && (
            <div className="absolute top-2 left-2 z-10">
              <div className="inline-flex items-center gap-1 rounded-md bg-white/[0.08] px-2 py-1 border border-white/10 text-[10px] font-medium text-white/50">
                {badgeText}
              </div>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-25">
            <div className="rounded-full border border-white/10 p-3 text-white/30">{icon}</div>
          </div>
        </div>
        <div className="bg-[#1A1A1A] px-3 py-2.5 h-[72px] flex flex-col justify-center border-t border-white/[0.06]">
          <p className="text-[12px] font-medium text-white/80 line-clamp-1">{title}</p>
          <p className="text-[10px] text-white/35 line-clamp-2 mt-0.5">{meta}</p>
        </div>
      </div>
    </article>
  );
}

function PersonSlotCard({
  name,
  role,
  showBadge,
  badgeText,
}: {
  name: string;
  role: string;
  showBadge?: boolean;
  badgeText?: string;
}) {
  return (
    <article className="shrink-0 w-[130px]">
      <div className="group relative overflow-hidden rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] h-[180px] transition duration-300 ease-out hover:border-white/20">
        <div className="relative h-full bg-white/[0.03]">
          {showBadge && badgeText && (
            <div className="absolute top-2 left-2 z-10">
              <div className="inline-flex items-center rounded-full bg-white/[0.08] px-2 py-0.5 border border-white/10 text-[10px] font-medium text-white/50">
                {badgeText}
              </div>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-25">
            <div className="rounded-full border border-white/10 p-3 bg-white/[0.05]">
              <UserPlus className="h-5 w-5 text-white/30" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-[#111111]/90 via-[#111111]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-[11px] font-medium text-white line-clamp-2">{name}</p>
            <p className="mt-0.5 text-[10px] text-white/60 line-clamp-2">{role}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ──────────────────────────────────────────────────────────────
  Page
────────────────────────────────────────────────────────────── */

export default function MeinBereichPage() {
  const [view, setView] = useState<ViewState>("loading");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [projects] = useState<ProjectItem[]>([]);
  const [experts] = useState<ExpertItem[]>([]);

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
        setView("user");
      } else {
        setProfile(data);
        setView((data.role || "user") === "kunde" ? "kunde" : "user");
      }

      try {
        setLoadingInvoices(true);
        const { data: invoiceData, error: invoiceError } = await supabase
          .from("invoices")
          .select("id, invoice_number, date, total_amount, status, title, created_at")
          .eq("customer_id", user.id)
          .order("date", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false })
          .limit(4);

        if (!active) return;
        if (invoiceError) { setInvoices([]); return; }

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
            .select("id, invoice_id, participant_id, doc_type, page_index, storage_bucket, storage_path")
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
                if (!doc) { signedByInvoice[invId] = null; return; }
                const { data, error } = await supabase.storage
                  .from(doc.storage_bucket)
                  .createSignedUrl(doc.storage_path, 60 * 30);
                signedByInvoice[invId] = error ? null : (data?.signedUrl ?? null);
              })
            );
            for (const b of base) b.previewUrl = signedByInvoice[b.id] ?? null;
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
    return () => { active = false; };
  }, []);

  const isDemo = view === "demo";
  const isAuthed = view !== "demo";
  const isKunde = view === "kunde";

  const {
    investedEUR,
    impactEUR,
    invoiceCount,
    totalRevenue2024,
    totalNetIncome2024,
    reinvestmentRate,
    expertRate,
    avgProfitMargin,
    clientDiversificationScore,
    incomeStreamCount,
    taxFilingStreak,
    profileTier,
    taxYearStatus,
  } = useWirkungskontoStats(isAuthed ? (profile?.id ?? null) : null);

  const name =
    profile?.full_name ||
    profile?.email?.split("@")[0] ||
    (isDemo ? "Gast" : "Willkommen zurück");

  const initials = getInitialsFromProfile(profile);
  const SCALE_MAX = 100;
  const wirkungEbene = impactEUR;
  const progressPct = Math.max(0, Math.min(100, (wirkungEbene / Math.max(1, SCALE_MAX)) * 100));
  const hasFirstInvoice = isAuthed && invoiceCount > 0;
  const hasImpact = isAuthed && impactEUR > 0.0001;
  const projectsCount = projects.length;
  const hasAnyRealData = invoiceCount > 0 || projectsCount > 0;

  const eyebrow = isDemo ? "Vorschau" : isKunde ? "Persönlicher Wirkungsraum" : "Mein Bereich";
  const headline = isDemo
    ? "Mein Bereich – so fühlt sich dein Wirkungsraum an."
    : isKunde
      ? `Willkommen zurück, ${name}.`
      : `Hallo ${name}.`;

  /* ── Loading Skeleton ── */
  if (view === "loading") {
    return (
      <div className="space-y-4">
        <div className="h-5 w-36 rounded bg-white/[0.06] animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/[0.04] animate-pulse" />
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="col-span-1 md:col-span-2 h-64 rounded-2xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  /* ── Main Render ── */
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-[10px] tracking-[0.24em] uppercase text-white/30">{eyebrow}</p>
        <h1 className="mt-1 text-[20px] md:text-[24px] font-semibold tracking-tight text-white leading-snug">
          {headline}
        </h1>
        {isKunde && profile?.kundenummer && (
          <p className="mt-1 text-[11px] text-white/35">Kundennummer: {profile.kundenummer}</p>
        )}
      </motion.header>

      {/* Dashboard Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* ── Row 1: 4 Stat-Kacheln ── */}
        <StatCard
          icon={<Zap className="h-4 w-4" />}
          label="Wirkungsebene"
          value={`${wirkungEbene.toFixed(0)}`}
          sub={`von ${SCALE_MAX} Punkten`}
          gold
          progress={progressPct}
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Investiert"
          value={fmtEUR(investedEUR)}
          sub="Gesamtvolumen"
          gold={investedEUR > 0}
        />
        <StatCard
          icon={<FolderKanban className="h-4 w-4" />}
          label="Projekte"
          value={String(projectsCount)}
          sub="Aktiv & abgeschlossen"
        />
        <StatCard
          icon={<Receipt className="h-4 w-4" />}
          label="Rechnungen"
          value={String(invoiceCount)}
          sub="Transparente Aufschlüsselungen"
        />

        {/* ── Row 2: Wirkungskonto (2 cols) + Rechnungen (2 cols) ── */}

        {/* Wirkungskonto Widget */}
        <motion.div
          variants={cardVariants}
          className="col-span-1 md:col-span-2 lg:col-span-2"
        >
          <WirkungskontoWidget
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
            totalRevenue2024={totalRevenue2024}
            totalNetIncome2024={totalNetIncome2024}
            reinvestmentRate={reinvestmentRate}
            expertRate={expertRate}
            avgProfitMargin={avgProfitMargin}
            clientDiversificationScore={clientDiversificationScore}
            incomeStreamCount={incomeStreamCount}
            taxFilingStreak={taxFilingStreak}
            profileTier={profileTier}
            taxYearStatus={taxYearStatus}
          />
        </motion.div>

        {/* Rechnungen Widget */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <SliderWidget
            title="Rechnungen"
            subtitle={
              isAuthed
                ? `${invoiceCount} Leistung${invoiceCount === 1 ? "" : "en"} dokumentiert`
                : "0 Transparente Aufschlüsselungen"
            }
            hrefAll="/mein-bereich/rechnungen"
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
              if (totalLoaded <= SLOT_COUNT) {
                return (
                  <>
                    {invoices.slice(0, SLOT_COUNT).map((inv) => (
                      <InvoicePreviewCard key={inv.id} invoice={inv} />
                    ))}
                    {Array.from({ length: SLOT_COUNT - invoices.length }).map((_, i) => (
                      <InvoicePlaceholderA4 key={`ph-${i}`} highlight={invoices.length === 0 && i === 0} />
                    ))}
                  </>
                );
              }
              return (
                <>
                  {invoices.slice(0, SLOT_COUNT - 1).map((inv) => (
                    <InvoicePreviewCard key={inv.id} invoice={inv} />
                  ))}
                  <SeeAllCard href="/mein-bereich/rechnungen" />
                </>
              );
            })()}
          </SliderWidget>
        </div>

        {/* ── Row 3: Projekte (2 cols) + Experten (2 cols) ── */}

        {/* Projekte Widget */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <SliderWidget
            title="Projekte"
            subtitle={`${projectsCount} laufende und abgeschlossene Wohnerlebnisse`}
            hrefAll="/mein-bereich/projekte"
          >
            {(() => {
              const SLOT_COUNT = 3;
              const total = projects.length;
              if (total <= SLOT_COUNT) {
                return (
                  <>
                    {projects.slice(0, SLOT_COUNT).map((p: ProjectItem) => (
                      <ProjectSlotCard
                        key={p.id}
                        icon={<FolderKanban className="h-8 w-8" />}
                        badgeText={p.badgeText ?? ""}
                        title={p.title ?? "Projekt"}
                        meta={p.meta ?? ""}
                        showBadge={!!p.badgeText}
                      />
                    ))}
                    {Array.from({ length: SLOT_COUNT - projects.length }).map((_, i) => (
                      <ProjectSlotCard
                        key={`ph-${i}`}
                        icon={<FolderKanban className="h-8 w-8" />}
                        badgeText={i === 0 && total === 0 ? "Noch keine Projekte" : ""}
                        title={i === 0 && total === 0 ? "Projektslots warten" : "Freier Projektslot"}
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
              return (
                <>
                  {projects.slice(0, SLOT_COUNT - 1).map((p: ProjectItem) => (
                    <ProjectSlotCard
                      key={p.id}
                      icon={<FolderKanban className="h-8 w-8" />}
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
          </SliderWidget>
        </div>

        {/* Experten Widget */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <SliderWidget
            title="Experten"
            subtitle={`${experts.length} verbundene Expert:innen im Netzwerk`}
            hrefAll="/mein-bereich/experten"
          >
            {(() => {
              const SLOT_COUNT = 4;
              const total = experts.length;
              if (total <= SLOT_COUNT) {
                return (
                  <>
                    {experts.slice(0, SLOT_COUNT).map((e: ExpertItem) => (
                      <PersonSlotCard
                        key={e.id}
                        name={e.name ?? "Expert:in"}
                        role={e.role ?? ""}
                        showBadge={!!e.badgeText}
                        badgeText={e.badgeText}
                      />
                    ))}
                    {Array.from({ length: SLOT_COUNT - experts.length }).map((_, i) => (
                      <PersonSlotCard
                        key={`ph-${i}`}
                        name={i === 0 && total === 0 ? "Noch kein Team verknüpft" : "Freier Team-Slot"}
                        role={
                          i === 0 && total === 0
                            ? "Sobald wir dein Team verknüpft haben, siehst du es hier."
                            : "Platz für Studios, Planer:innen oder Hersteller."
                        }
                        showBadge={i === 0 && total === 0}
                        badgeText={i === 0 && total === 0 ? "Team-Slots" : undefined}
                      />
                    ))}
                  </>
                );
              }
              return (
                <>
                  {experts.slice(0, SLOT_COUNT - 1).map((e: ExpertItem) => (
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
          </SliderWidget>
        </div>

        {/* ── Optional: Steuerjahr-Band (nur wenn Daten vorhanden) ── */}
        {isAuthed && totalNetIncome2024 > 0 && (
          <>
            <motion.div
              variants={cardVariants}
              className="col-span-1 md:col-span-2 lg:col-span-2 rounded-2xl border border-[#F5C842]/15 bg-[#111111]/80 backdrop-blur-xl shadow-[0_0_20px_rgba(245,200,66,0.06)] p-5 space-y-3"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#F5C842]" />
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
                  Gesamtgewinn 2024
                </p>
              </div>
              <p className="text-[32px] font-bold text-[#F5C842] tabular-nums leading-none tracking-tight">
                {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(totalNetIncome2024)}
              </p>
              <p className="text-[11px] text-white/35">
                von {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(totalRevenue2024)} Umsatz
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="col-span-1 md:col-span-1 lg:col-span-1 rounded-2xl border border-white/[0.06] bg-[#111111]/80 backdrop-blur-xl p-5 space-y-3"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-[#F5C842]" />
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">Reinvestition</p>
              </div>
              <p className="text-[28px] font-bold text-[#F5C842] tabular-nums leading-none">
                {fmtPct(reinvestmentRate)}
              </p>
              <p className="text-[11px] text-white/35">Wachstumsinvestition</p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="col-span-1 md:col-span-1 lg:col-span-1 rounded-2xl border border-white/[0.06] bg-[#111111]/80 backdrop-blur-xl p-5 space-y-3"
            >
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#F5C842]" />
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">Einkunftsarten</p>
              </div>
              <p className="text-[28px] font-bold text-white tabular-nums leading-none">
                {incomeStreamCount}
              </p>
              <p className="text-[11px] text-white/35">Diversifikation</p>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
