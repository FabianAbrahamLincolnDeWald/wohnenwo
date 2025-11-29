// app/(mein-bereich-detail)/mein-bereich/rechnungen/[id]/page.tsx
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  Info,
  Layers,
  Sparkles,
  User,
} from "lucide-react";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  kundenummer: string | null;
};

type ViewState = "loading" | "demo" | "user" | "kunde";

type InvoiceStatus = "offen" | "bezahlt" | "entwurf";

type InvoiceDetail = {
  id: string;
  number: string;
  date: string | null;
  totalAmount: number;
  currency: string;
  status: InvoiceStatus;
  projectName: string | null;
  projectKind: string | null;

  materialAmount: number | null;
  labourAmount: number | null;
  planningAmount: number | null;
  impactFundAmount: number | null;

  dienstleisterName?: string | null;
  dienstleisterRolle?: string | null;
};

type InvoiceAssetType = "image" | "video" | "pdf";

type InvoiceAsset = {
  id: string;
  type: InvoiceAssetType;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  fileUrl?: string | null;
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

function formatCurrency(amount: number | null | undefined, currency?: string) {
  if (amount == null || Number.isNaN(amount)) return "–";
  const safeAmount = Number(amount);
  const safeCurrency = currency || "EUR";

  try {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return `${safeAmount.toFixed(2)} ${safeCurrency}`;
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

export default function RechnungDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = (params?.id ?? "") as string;

  const [view, setView] = useState<ViewState>("loading");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [assets, setAssets] = useState<InvoiceAsset[]>([]);
  const [loading, setLoading] = useState(true);

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
        setInvoice(null);
        setAssets([]);
        setLoading(false);
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

      // 3. Rechnung laden
      try {
        const { data: invData, error: invError } = await supabase
          .from("invoices")
          .select(
            `
            id,
            number,
            date,
            total_amount,
            currency,
            status,
            project_name,
            project_kind,
            material_amount,
            labour_amount,
            planning_amount,
            impact_fund_amount,
            dienstleister_name,
            dienstleister_rolle
          `
          )
          .eq("id", invoiceId)
          .single();

        if (!active) return;

        if (invError || !invData) {
          console.error("Rechnung konnte nicht geladen werden:", invError);
          setInvoice(null);
        } else {
          const mapped: InvoiceDetail = {
            id: invData.id,
            number: invData.number ?? "–",
            date: invData.date ?? null,
            totalAmount: Number(invData.total_amount) || 0,
            currency: invData.currency || "EUR",
            status: (invData.status as InvoiceStatus) || "entwurf",
            projectName: invData.project_name ?? null,
            projectKind: invData.project_kind ?? null,
            materialAmount:
              typeof invData.material_amount === "number"
                ? invData.material_amount
                : invData.material_amount != null
                ? Number(invData.material_amount)
                : null,
            labourAmount:
              typeof invData.labour_amount === "number"
                ? invData.labour_amount
                : invData.labour_amount != null
                ? Number(invData.labour_amount)
                : null,
            planningAmount:
              typeof invData.planning_amount === "number"
                ? invData.planning_amount
                : invData.planning_amount != null
                ? Number(invData.planning_amount)
                : null,
            impactFundAmount:
              typeof invData.impact_fund_amount === "number"
                ? invData.impact_fund_amount
                : invData.impact_fund_amount != null
                ? Number(invData.impact_fund_amount)
                : null,
            dienstleisterName: invData.dienstleister_name ?? null,
            dienstleisterRolle: invData.dienstleister_rolle ?? null,
          };

          setInvoice(mapped);

          // 4. Platzhalter-Assets (später durch echte Daten ersetzen)
          const placeholderAssets: InvoiceAsset[] = [
            {
              id: "asset-main",
              type: "pdf",
              title: "Hauptdokument · Rechnung",
              description:
                "Vollständige Rechnung als PDF – hier später eingebettet oder verlinkt.",
            },
            {
              id: "asset-offer",
              type: "pdf",
              title: "Angebot / Kostenvoranschlag",
              description:
                "Vorherige Kalkulation als Vergleich zur finalen Rechnung.",
            },
            {
              id: "asset-photos",
              type: "image",
              title: "Fotodokumentation",
              description:
                "Fotos der abgeschlossenen Leistung – Vorher/Nachher, Details.",
            },
          ];

          setAssets(placeholderAssets);
        }
      } catch (e) {
        console.error("Unbekannter Fehler beim Laden der Rechnung:", e);
        setInvoice(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    if (invoiceId) {
      void load();
    }

    return () => {
      active = false;
    };
  }, [invoiceId]);

  const isDemo = view === "demo";
  const name =
    profile?.full_name ||
    profile?.email?.split("@")[0] ||
    (view === "demo" ? "Gast" : "Willkommen zurück");

  const initials = getInitialsFromProfile(profile);

  const title = invoice
    ? `Rechnung ${invoice.number}`
    : "Rechnung nicht gefunden";

  const projectLabel =
    invoice?.projectName || invoice?.projectKind || "Projekt ohne Titel";

  const eyebrow = isDemo
    ? "Vorschau"
    : invoice
    ? "Rechnungs-Ansicht · Abgeschlossene Leistung"
    : "Rechnungs-Ansicht";

  // Loading-Skeleton
  if (view === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 pt-20 pb-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div className="space-y-4">
            <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
            <div className="h-7 w-64 rounded bg-slate-200 animate-pulse" />
            <div className="h-[420px] w-full rounded-2xl bg-slate-100 animate-pulse" />
          </div>
          <aside className="hidden lg:block">
            <div className="h-[420px] w-full rounded-2xl bg-slate-100 animate-pulse" />
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 lg:px-6 pt-20 pb-10">
      {/* kein max-w – volle Breite der rechten Spalte neben Sidebar */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:gap-10">
        {/* Linke Spalte – Dokumentenansicht mit eigener Scrollbar */}
        <section className="flex flex-col min-h-[60vh]">
          {/* Header oberhalb der Scroll-Fläche */}
          <div className="mb-3 space-y-3">
            <button
              type="button"
              onClick={() => router.push("/mein-bereich/rechnungen")}
              className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Zurück zu den Rechnungen
            </button>

            <p className="text-[11px] tracking-[0.24em] uppercase text-slate-500">
              {eyebrow}
            </p>
            <h1 className="text-[22px] md:text-[24px] font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
            {invoice && (
              <p className="max-w-2xl text-[13px] md:text-[14px] text-slate-600">
                {projectLabel} · Ausgestellt am {formatDate(invoice.date)} ·{" "}
                {formatCurrency(invoice.totalAmount, invoice.currency)}
              </p>
            )}
          </div>

          {/* Schwarze Dokumentenfläche mit eigenem Scrollbereich – ArtStation-ähnlich */}
          <div className="flex-1 rounded-2xl bg-slate-950 border border-slate-900/80 shadow-sm overflow-hidden">
            <div
              className="
                h-[calc(100vh-10rem)]
                lg:h-[calc(100vh-8rem)]
                overflow-y-auto
                scrollbar-thin
                scrollbar-track-slate-900
                scrollbar-thumb-slate-700/80
              "
            >
              <div className="px-4 sm:px-6 pt-4 pb-6 space-y-6">
                {assets.length === 0 ? (
                  <div className="flex h-[360px] items-center justify-center">
                    <div className="max-w-md text-center px-4">
                      <p className="text-[12px] font-medium tracking-[0.22em] uppercase text-slate-400">
                        Dokumentenvorschau
                      </p>
                      <p className="mt-2 text-sm text-slate-200">
                        Hier kannst du später Rechnungs-PDFs, Bilder oder
                        Videos einbetten – ähnlich wie eine Bildserie auf
                        ArtStation.
                      </p>
                    </div>
                  </div>
                ) : (
                  assets.map((asset) => (
                    <InvoiceAssetBlock key={asset.id} asset={asset} />
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Rechte Spalte – sticky, eigener Scrollbereich für Meta / Wirkung */}
        <aside
          className="
            hidden lg:flex
            flex-col
            h-[calc(100vh-6rem)]
            sticky top-20
          "
        >
          <div
            className="
              flex-1
              overflow-y-auto
              pr-1
              space-y-5
            "
          >
            {/* Rechnungsprofil / Kopfdaten */}
            <section className="rounded-2xl bg-white border border-slate-200 px-4 py-5 space-y-4 shadow-sm">
              <header className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                      Rechnungsprofil
                    </p>
                    <p className="text-[13px] font-semibold text-slate-900">
                      {title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {projectLabel}
                    </p>
                  </div>
                </div>
                {invoice && <StatusBadge status={invoice.status} />}
              </header>

              <div className="space-y-2 text-[12px] text-slate-600">
                {invoice && (
                  <>
                    <Row label="Rechnungsnummer" value={invoice.number} />
                    <Row
                      label="Ausgestellt am"
                      value={formatDate(invoice.date)}
                    />
                    <Row label="Projekt" value={projectLabel} />
                    <Row
                      label="Betrag gesamt"
                      value={formatCurrency(
                        invoice.totalAmount,
                        invoice.currency
                      )}
                    />
                  </>
                )}
                {profile?.kundenummer && (
                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <Row
                      label="Kundennummer"
                      value={profile.kundenummer}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Dienstleister / Wertschöpfungskette */}
            <section className="rounded-2xl bg-white border border-slate-200 px-4 py-5 space-y-4 shadow-sm">
              <header className="space-y-1">
                <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                  Dienstleister & Wertschöpfung
                </p>
                <p className="text-[13px] font-semibold text-slate-900">
                  Wer an dieser Rechnung mitgewirkt hat
                </p>
              </header>

              <div className="space-y-3 text-[12px] text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-[11px] font-semibold">
                    {(invoice?.dienstleisterName || "Studio")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {invoice?.dienstleisterName || "WohnenWo Studio"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {invoice?.dienstleisterRolle ||
                        "Planung, Koordination & Umsetzung"}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] leading-snug text-slate-600">
                  Diese Rechnung bündelt Material, Handwerk und Planung in einer
                  transparenten Wertschöpfungskette. Später kannst du hier die
                  beteiligten Studios, Gewerke und Hersteller einzeln
                  auflisten.
                </p>
              </div>
            </section>

            {/* Aufschlüsselung – Material / Handwerk / Planung / Wirkungsfonds */}
            <section className="rounded-2xl bg-white border border-slate-200 px-4 py-5 space-y-4 shadow-sm">
              <header className="flex items-center gap-2">
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                    Aufschlüsselung
                  </p>
                  <p className="text-[13px] font-semibold text-slate-900">
                    Material · Handwerk · Planung · Wirkung
                  </p>
                </div>
              </header>

              <div className="space-y-2 text-[12px] text-slate-600">
                <Row
                  label="Material & Ausstattung"
                  value={formatCurrency(
                    invoice?.materialAmount,
                    invoice?.currency
                  )}
                />
                <Row
                  label="Handwerk & Umsetzung"
                  value={formatCurrency(
                    invoice?.labourAmount,
                    invoice?.currency
                  )}
                />
                <Row
                  label="Planung & Koordination"
                  value={formatCurrency(
                    invoice?.planningAmount,
                    invoice?.currency
                  )}
                />
                <Row
                  label="Wirkungsfonds-Anteil"
                  value={formatCurrency(
                    invoice?.impactFundAmount,
                    invoice?.currency
                  )}
                />
              </div>

              <p className="text-[11px] leading-snug text-slate-500">
                Diese Aufschlüsselung macht sichtbar, wie sich deine Investition
                auf Material, Handwerk, Planung und den gemeinsamen
                Wirkungsfonds verteilt.
              </p>
            </section>

            {/* Wirkung & Effekte */}
            <section className="rounded-2xl bg-slate-900 text-slate-50 px-4 py-5 space-y-4 shadow-sm">
              <header className="flex items-center gap-2">
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-50/10">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.18em] uppercase text-slate-300">
                    Wirkung & Effekte
                  </p>
                  <p className="text-[13px] font-semibold text-slate-50">
                    Was diese Rechnung möglich macht
                  </p>
                </div>
              </header>

              <p className="text-[12px] leading-snug text-slate-100">
                Jede Rechnung ist mehr als eine Zahl. Sie steht für ein
                Wohnerlebnis, das real geworden ist – Raum, Material und Licht
                wurden in Einklang mit deinen Werten gestaltet.
              </p>

              <p className="text-[11px] leading-snug text-slate-300">
                Später kannst du hier konkrete Effekte ergänzen: CO₂-Einsparung,
                lokale Wertschöpfung, eingesetzte Materialien oder besondere
                handwerkliche Details.
              </p>
            </section>

            {/* Transparenz-Hinweis */}
            <section className="rounded-2xl bg-white border border-slate-200 px-4 py-4 space-y-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <Info className="h-3.5 w-3.5" />
                </div>
                <p className="text-[12px] font-medium text-slate-900">
                  Transparenz-Hinweis
                </p>
              </div>
              <p className="text-[11px] leading-snug text-slate-600">
                Persönliche Daten von Auftraggeber:innen werden in der online
                sichtbaren Version datenschutzkonform reduziert. Die vollständige
                Rechnung bleibt dir vorbehalten.
              </p>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ───────────── Komponenten für die linke Asset-Liste ───────────── */

function InvoiceAssetBlock({ asset }: { asset: InvoiceAsset }) {
  const isMain = asset.id === "asset-main";

  return (
    <article className="project-asset w-full">
      <div className="flex flex-col items-center">
        {/* Bild-/Dokumentenrahmen */}
        <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
          {/* Platzhalter-Vorschau – später durch <img>, <video> oder PDF-Viewer ersetzen */}
          <div className="aspect-video w-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center">
            <div className="text-center px-4">
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-slate-400">
                {asset.type === "image"
                  ? "Bilddokument"
                  : asset.type === "video"
                  ? "Video"
                  : "PDF / Dokument"}
              </p>
              <p className="mt-2 text-sm text-slate-100">{asset.title}</p>
              {asset.description && (
                <p className="mt-1 text-[11px] text-slate-400">
                  {asset.description}
                </p>
              )}
            </div>
          </div>

          {/* Overlay-Buttons à la ArtStation: Download / Einzelansicht */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 py-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 text-[11px] font-medium text-slate-50 border border-slate-700/80 hover:bg-slate-900/90"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 text-[11px] font-medium text-slate-50 border border-slate-700/80 hover:bg-slate-900/90"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Einzelansicht
            </button>
          </div>
        </div>

        {/* Caption wie auf ArtStation */}
        <div className="mt-2 text-center max-w-xl mx-auto">
          <p className="text-[12px] text-slate-200 font-medium">
            {asset.title}
          </p>
          {asset.description && (
            <p className="mt-0.5 text-[11px] text-slate-400">
              {asset.description}
            </p>
          )}
          {isMain && (
            <p className="mt-0.5 text-[11px] text-slate-500">
              Hauptdokument der abgeschlossenen Leistung.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/* ───────────── Utility-Row für Meta-Daten ───────────── */

function Row(props: { label: string; value: string | number | null | undefined }) {
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
