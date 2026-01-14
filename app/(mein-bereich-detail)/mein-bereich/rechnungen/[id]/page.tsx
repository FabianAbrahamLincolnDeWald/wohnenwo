"use client";

import * as React from "react";
import Image from "next/image";
import {
  FileText,
  Download,
  Printer,
  MoreHorizontal,
  Layers,
  Sparkles,
  Info,
  ShoppingCart,
  Factory,
  Briefcase,
  Scale,
} from "lucide-react";

type Participant = {
  id: string;
  label: string; // Name (z.B. WohnenWo Studio)
  description: string; // Kurzbeschreibung
  pages: number; // Anzahl „Dokumente“ in der Vorschau
  icon?: React.ReactNode; // ← NEU
  role: string; // Rolle in der Wertschöpfung
  value?: string; // ← NEU: Mehrwert / Beitrag
};

const PARTICIPANTS: Participant[] = [
  {
    id: "wohnenwo",
    label: "Fabian · WohnenWo",
    description: "Planung, Koordination & Umsetzung",
    pages: 2,
    icon: <Briefcase className="h-4 w-4" />,
    role: "Dienstleister",
    value: "70,56 €",
  },
  {
    id: "hansgrohe",
    label: "Hansgrohe",
    description: "Ablaufgarnitur · Ablauf-System",
    pages: 2,
    icon: <Factory className="h-4 w-4" />,
    role: "Hersteller",
    value: "44,53 €",
  },
  {
    id: "grohe",
    label: "Grohe",
    description: "Röhren-Geruchsverschluss · Siphon",
    pages: 1,
    icon: <Factory className="h-4 w-4" />,
    role: "Hersteller",
    value: "12,79 €",
  },
  {
    id: "staat",
    label: "Staat & Sozialkassen",
    description: "Steuern & Sozialabgaben",
    pages: 0,
    icon: <Scale className="h-4 w-4" />,
    role: "Gesetzlich gebundene Abgaben",
    value: "14,02 €",
  },
];


export default function RechnungDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeParticipantId, setActiveParticipantId] = React.useState<string>(
    PARTICIPANTS.length > 0 ? PARTICIPANTS[0]!.id : ""
  );

  const activeParticipant = React.useMemo<Participant | null>(() => {
    if (PARTICIPANTS.length === 0) return null;

    const found = PARTICIPANTS.find((p) => p.id === activeParticipantId);
    if (found) return found;

    return PARTICIPANTS[0]!;
  }, [activeParticipantId]);

  if (!activeParticipant) return null;

  return (
    <div className="h-full">
      <div className="flex h-full">
        {/* Linke Spalte */}
        <section className="flex-1 min-w-0 border-r border-slate-200 bg-white">
          <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Rechnung · Detailansicht · Abgeschlossene Leistung
                </p>
                <h1 className="text-[18px] md:text-[20px] font-semibold tracking-tight text-slate-900">
                  Austausch Ablaufgarnitur &amp; Geruchsverschluss
                </h1>
                <p className="text-[12px] text-slate-500">
                  Rechnungs-ID:{" "}
                  <span className="font-mono">{params.id}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-800 hover:bg-slate-50"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-800 hover:bg-slate-50"
                >
                  <Printer className="h-3.5 w-3.5 mr-1.5" />
                  Drucken
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  aria-label="Mehr"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 md:px-6 py-4 md:py-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Vorschau
                    </p>
                    <p className="text-[14px] font-semibold text-slate-900">
                      {activeParticipant.label}
                    </p>
                    <p className="text-[12px] text-slate-500">
                      {activeParticipant.description}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {activeParticipant.pages} Dokumente
                  </p>
                </div>

                <div className="space-y-4 md:space-y-5">
                  {Array.from({ length: activeParticipant.pages }).map(
                    (_, idx) => (
                      <div
                        key={idx}
                        className="mx-auto w-full max-w-[900px] rounded-xl border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.04)] p-6 md:p-8"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                            Dokument {idx + 1} ·{" "}
                            {activeParticipant.label.split("·")[0]}
                          </p>
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-600">
                            {activeParticipant.label}
                          </span>
                        </div>

                        <div className="h-80 md:h-[420px] rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                          <div className="text-center px-6">
                            <FileText className="mx-auto mb-3 h-7 w-7 text-slate-300" />
                            <p className="text-[13px] font-medium text-slate-800">
                              {activeParticipant.label} · Dokument {idx + 1}
                            </p>
                            <p className="mt-1 text-[12px] text-slate-500">
                              Hier kannst du später die echte Rechnung,
                              Materiallisten, Fotos oder Zeiterfassungen für
                              diesen Beteiligten einbinden.
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="h-20" />
            </div>
          </div>
        </section>

        {/* Rechte Spalte */}
        <aside className="w-[320px] xl:w-[400px] bg-slate-50">
          <div className="h-full overflow-y-auto border-l border-slate-200 px-5 py-5 space-y-5">
            {/* Top-Container: Rechnung + Person + Partner/Tabs */}
            <section className="rounded-2xl bg-white border border-slate-200 px-4 py-6 space-y-6 shadow-sm">
              {/* 1) Rechnungsübersicht */}
              <div className="space-y-1">
                <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                  Rechnungsübersicht
                </p>

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[13px] font-semibold text-slate-900 leading-snug">
                      Austausch Ablaufgarnitur &amp; Geruchsverschluss
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Rechnungs-ID:{" "}
                      <span className="font-mono">{params.id}</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">
                      Bezahlt
                    </span>
                    <span className="text-[11px] text-slate-500">
                      144,22 € brutto
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-600">
                  <div className="space-y-0.5">
                    <p className="text-slate-500">Rechnungsdatum</p>
                    <p className="font-medium text-slate-800">12.11.2025</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-500">Leistungszeitraum</p>
                    <p className="font-medium text-slate-800">
                      12.11.2025 · Sanitär
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-500">Netto-Betrag</p>
                    <p className="font-medium text-slate-800">121,19 €</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-500">Umsatzsteuer (19 %)</p>
                    <p className="font-medium text-slate-800">23,03 €</p>
                  </div>
                </div>
              </div>
              {/* Divider */}
              <div className="border-t border-slate-200" />


              {/* Mitwirkende / Tabs */}
              <div className="space-y-3">
                <header className="space-y-0.5">
                  <p className="text-[13px] font-semibold text-slate-900">
                    Wie sich der Wert dieser Rechnung verteilt
                  </p>
                </header>

                <div className="space-y-2">
                  {PARTICIPANTS.map((p) => {
                    const active = p.id === activeParticipantId;
                    const isState = p.id === "staat";

                    // ─────────────────────────────
                    // STAAT & SOZIALKASSEN – NICHT KLICKBAR
                    // ─────────────────────────────
                    if (isState) {
                      return (
                        <div
                          key={p.id}
                          className="w-full rounded-lg px-3 py-2.5 text-[12px] flex items-center gap-3 border bg-slate-500/80 border-slate-400 text-white shadow-sm"
                        >
                          {/* Avatar */}
                          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                            {p.icon}
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-semibold truncate">
                              {p.label}
                            </p>
                            <p className="text-[11px] truncate text-slate-200">
                              {p.description}
                            </p>
                          </div>

                          {/* Betrag */}
                          {p.value && (
                            <span className="text-[14px] font-semibold tabular-nums text-white">
                              {p.value}
                            </span>
                          )}
                        </div>
                      );
                    }

                    // ─────────────────────────────
                    // NORMALE, KLICKBARER TABS
                    // ─────────────────────────────
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActiveParticipantId(p.id)}
                        className={[
                          "w-full text-left rounded-lg px-3 py-2.5 text-[12px] flex items-center gap-3 transition border",
                          active
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                            : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        {/* Avatar */}
                        <div
                          className={[
                            "inline-flex h-8 w-8 items-center justify-center rounded-full shrink-0",
                            active ? "bg-white/10 text-white" : "bg-slate-900 text-white",
                          ].join(" ")}
                        >
                          {p.icon}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={[
                              "text-[14px] font-semibold truncate",
                              active ? "text-white" : "text-slate-900",
                            ].join(" ")}
                          >
                            {p.label}
                          </p>
                          <p
                            className={[
                              "text-[11px] truncate",
                              active ? "text-slate-200" : "text-slate-500",
                            ].join(" ")}
                          >
                            {p.description}
                          </p>
                        </div>

                        {/* Betrag */}
                        {p.value && (
                          <span
                            className={[
                              "text-[14px] font-semibold tabular-nums",
                              active ? "text-white" : "text-slate-900",
                            ].join(" ")}
                          >
                            {p.value}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-1 text-[11px] leading-snug text-slate-600">
                  Tippe auf einen Mitwirkenden: Die linke Dokumentenvorschau
                  springt automatisch zu den Unterlagen, die diesen Schritt der
                  Wertschöpfung dokumentieren.
                </p>
              </div>
            </section>

            {/* 2. Kontextabhängige Detailansicht */}
            {activeParticipant.id === "wohnenwo" && (
              <section className="rounded-2xl bg-white border border-slate-200 px-4 py-4 space-y-3 shadow-sm">
                {/* Header */}
                <header className="space-y-0.5">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                    Lohnkosten
                  </p>
                  <p className="text-[13px] font-semibold text-slate-900">
                    Zeit &amp; Einsatz für deinen Auftrag
                  </p>
                </header>

                {/* Tabelle */}
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
                    <tr className="border-t border-slate-200">
                      <td className="py-1 text-slate-700">
                        Anfahrt &amp; Abfahrt
                      </td>
                      <td className="py-1 text-slate-500">
                        Weg zu dir und zurück
                      </td>
                      <td className="py-1 text-right text-slate-700">
                        10 min
                      </td>
                    </tr>

                    <tr className="border-t border-slate-200">
                      <td className="py-1 text-slate-700">
                        Arbeit im Raum
                      </td>
                      <td className="py-1 text-slate-500">
                        Ausbau &amp; Einbau
                      </td>
                      <td className="py-1 text-right text-slate-700">
                        22 min
                      </td>
                    </tr>

                    <tr className="border-t border-slate-300">
                      <td className="py-1.5 font-semibold text-slate-800">
                        Gesamtzeit
                      </td>
                      <td />
                      <td className="py-1.5 text-right font-semibold text-slate-800">
                        32 min
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Kurz-Erklärung */}
                <p className="text-[11px] leading-snug text-slate-600">
                  Abgerechnet werden{" "}
                  <span className="font-medium">32 min</span>{" "}
                  Arbeitszeit als Lohnkosten.
                </p>

                {/* Zusammenfassung */}
                <div className="pt-2 border-t border-slate-100 space-y-0.5 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Stundensatz (netto)</span>
                    <span className="font-medium text-slate-800">66,00 €</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[14px] font-bold text-slate-800">Arbeitslohn (netto)</span>
                    <span className="text-[14px] font-bold text-slate-900">35,20 €</span>
                  </div>
                </div>
              </section>
            )}

{activeParticipant.id === "grohe" && (
  <section className="rounded-2xl bg-white border border-slate-200 px-4 py-5 space-y-5 shadow-sm">

    {/* HEADER */}
    <header className="space-y-0.5">
      <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
        Materialherkunft &amp; Wertstrom
      </p>
      <p className="text-[13px] font-semibold text-slate-900">
        Hier wurde Ihr neuer Geruchsverschluss gekauft
      </p>
    </header>

    {/* ───────────── EINKAUF ───────────── */}
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="bg-slate-800 text-white px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
            <ShoppingCart className="h-4 w-4" />
          </div>
          <span className="text-[14px] font-semibold">
            Einkauf · Amazon
          </span>
        </div>
        <span className="text-[14px] font-semibold">
          15,22 €
        </span>
      </div>

      <div className="bg-slate-50 px-3 py-3 space-y-1 text-[12px] text-slate-600">
        <Row label="enthaltene Umsatzsteuer" value="2,43 €" />
        <Row label="Netto-Einkaufswert (Grohe)" value="12,79 €" />
      </div>
    </div>

    {/* ───────────── MATERIALAUFSCHLAG · DIENSTLEISTER ───────────── */}
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
      6,40 €
    </span>
  </div>

  <div className="bg-slate-50 px-3 py-3 space-y-1 text-[12px] text-slate-600">
    <Row label="Arbeitnehmer:in · Netto" value="≈ 1,69 €" />
    <Row label="Unternehmerische Struktur · Netto" value="≈ 1,60 €" />
    <Row label="Wirkungsfonds" value="2,13 €" />
    <Row label="Staat & Sozialkassen" value="≈ 0,97 €" />
  </div>
</div>


    {/* ───────────── STAAT & SOZIALKASSEN ───────────── */}
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      <div className="px-3 py-2 flex items-center justify-between text-slate-700">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-300">
            <Scale className="h-4 w-4" />
          </div>
          <span className="text-[14px] font-semibold">
            Staat &amp; Sozialkassen
          </span>
        </div>
        <span className="text-[14px] font-semibold">
          ≈ 7,87 €
        </span>
      </div>

      <div className="px-3 py-3 space-y-1 text-[12px] text-slate-600">
        <Row label="Umsatzsteuer (Endkunde)" value="3,65 €" />
        <Row label="Abgaben aus Produktion & Handel (≈ 33 %)" value="≈ 4,22 €" />
      </div>
    </div>

    {/* HINWEIS */}
    <p className="pt-2 text-[11px] leading-snug text-slate-500 border-t border-slate-100">
      Geschätzte Anteile basieren auf branchenüblichen Näherungen.
      Hersteller- und lieferkettenabhängige Abweichungen sind möglich.
    </p>
  </section>
)}

            {activeParticipant.id === "hansgrohe" && (
              <section className="rounded-2xl bg-white border border-slate-200 px-4 py-5 space-y-4 shadow-sm">
                <header className="space-y-1">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                    Materialherkunft · Hansgrohe
                  </p>
                  <p className="text-[13px] font-semibold text-slate-900">
                    Hier wurde Ihre neue Ablaufgarnitur gekauft
                  </p>
                </header>

                <table className="w-full border-collapse text-[11px]">
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-1.5 text-slate-600">Materialquelle</td>
                      <td className="py-1.5 text-right font-medium text-slate-900">
                        Lagerbestand · WohnenWo
                      </td>
                    </tr>

                    <tr>
                      <td className="py-1.5 text-slate-600">
                        Hinweis zur Herkunft
                      </td>
                      <td className="py-1.5 text-right text-slate-700">
                        keine externe Rechnung
                      </td>
                    </tr>

                    <tr>
                      <td className="py-1.5 text-slate-600">
                        Netto-Warenwert
                      </td>
                      <td className="py-1.5 text-right font-medium text-slate-900">
                        44,53 €
                      </td>
                    </tr>

                    <tr>
                      <td className="py-1.5 text-slate-600">
                        Kalkulation (÷ 0,6666)
                      </td>
                      <td className="py-1.5 text-right text-slate-900">
                        66,80 €
                      </td>
                    </tr>

                    <tr>
                      <td className="py-1.5 text-slate-600">
                        Umsatzsteuer (19 %)
                      </td>
                      <td className="py-1.5 text-right text-slate-900">
                        12,69 €
                      </td>
                    </tr>

                    <tr className="border-t border-slate-300">
                      <td className="py-2 font-medium text-slate-800">
                        Materialpreis für Sie
                      </td>
                      <td className="py-2 text-right font-semibold text-slate-900">
                        79,49 € brutto
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p className="pt-2 mt-1 border-t border-slate-100 text-[11px] leading-snug text-slate-500">
                  Diese Ablaufgarnitur stammt aus einem Lager-Altbestand.
                  Der ausgewiesene Preis basiert auf derselben transparenten
                  Kalkulationslogik wie neu beschaffte Materialien.
                </p>
              </section>
            )}

            {/* Verantwortung & Gewinn – Ist-Zustand */}
            {activeParticipant.id === "wohnenwo" && (
              <section className="rounded-2xl bg-white border border-slate-200 px-4 py-5 space-y-4 shadow-sm">

                {/* Header – neutral */}
                <header className="space-y-0.5">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                    Verantwortung &amp; Gewinn
                  </p>
                  <p className="text-[13px] font-semibold text-slate-900">
                    Wie sich der Arbeitswert zusammensetzt
                  </p>
                </header>

                {/* VERBUNDENER BLOCK */}
                <div className="overflow-hidden rounded-xl border border-slate-200">

                  {/* Arbeitswert-Badge (oben, dominant) */}
                  <div className="bg-slate-800 text-white px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                        <Layers className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="text-[14px] font-semibold text-slate-100">
                        Arbeitswert (brutto)
                      </span>
                    </div>
                    <span className="text-[14px] font-semibold">
                      41,89 €
                    </span>
                  </div>

                  {/* Aufschlüsselung – ANGEKOPPELT */}
                  <div className="bg-slate-50 px-3 py-3 space-y-1 text-[12px] text-slate-600">
                    <Row label="Arbeitnehmer:in · Netto" value="7,92 €" />
                    <Row
                      label="Unternehmerische Struktur · Netto"
                      value="8,77 €"
                    />
                    <Row
                      label="Wirkungsfonds"
                      value="11,73 €"
                    />
                    <Row
                      label="Staat & Sozialkassen"
                      value="14,02 €"
                    />
                  </div>
                </div>

                {/* Gewinnverteilung – Material */}
                <div className="pt-3 border-t border-slate-200 space-y-3">

                  {/* Überschrift */}
                  <header className="space-y-0.5">
                    <p className="text-[13px] font-semibold text-slate-900">
                      Wie sich der Gesamtwert dieses Auftrags verteilt
                    </p>
                  </header>

                  {/* HAUPT-BLOCK – Material / Gesamtgewinn */}
                  <div className="overflow-hidden rounded-xl border border-slate-200">

                    {/* Gewinn-Badge – Fabian / WohnenWo */}
                    <div className="bg-slate-800 text-white px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* F-Avatar statt Icon */}
                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[12px] font-semibold">
                          F
                        </div>
                        <span className="text-[14px] font-semibold text-slate-100">
                          Material- &amp; Gewinnanteil
                        </span>
                      </div>
                      <span className="text-[14px] font-semibold">
                        28,67 €
                      </span>
                    </div>

                    {/* Tabelle */}
                    <div className="bg-slate-50 px-3 py-3 space-y-1 text-[12px] text-slate-600">
                      <Row label="Dienstleistung · Anteil" value="9,56 €" />
                      <Row
                        label="Unternehmerische Struktur · Anteil"
                        value="9,55 €"
                      />
                      <Row
                        label="Wirkungsfonds"
                        value="9,56 €"
                      />
                    </div>
                  </div>

                  {/* SEKUNDÄRE BADGES – Hersteller */}
                  <div className="grid grid-cols-1 gap-2">

                    {/* Hansgrohe */}
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-[10px] font-semibold text-slate-700">
                          HG
                        </div>
                        <span className="text-[12px] font-medium text-slate-700">
                          Hansgrohe · Gewinnanteil
                        </span>
                      </div>
                      <span className="text-[12px] font-semibold text-slate-800">
                        44,53 €
                      </span>
                    </div>

                    {/* Grohe */}
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-[10px] font-semibold text-slate-700">
                          GR
                        </div>
                        <span className="text-[12px] font-medium text-slate-700">
                          Grohe · Gewinnanteil
                        </span>
                      </div>
                      <span className="text-[12px] font-semibold text-slate-800">
                        12,79 €
                      </span>
                    </div>

                  </div>

                  {/* Hinweis */}
                  <p className="pt-2 text-[11px] leading-snug text-slate-500 border-t border-slate-100">
                    Die dargestellten Anteile basieren auf prozentualen Schätzungen.
                    Geringfügige Abweichungen sind möglich und werden erst mit
                    Abschluss des Kalenderjahres exakt bestimmt.
                  </p>
                </div>
              </section>
            )}



            {/* 5. Wirkung & Überschuss */}
            {activeParticipant.id === "wohnenwo" && (
              <section className="rounded-2xl bg-slate-50 text-slate-900 px-4 py-5 space-y-4 shadow-sm border border-slate-200">
                <header className="flex items-center gap-2">
                  <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                      Wirkung &amp; Überschuss
                    </p>
                    <p className="text-[13px] font-semibold text-slate-900">
                      Welche Wirkung dein Überschuss hat
                    </p>
                  </div>
                </header>

                <p className="text-[12px] leading-snug text-slate-800">
                  Deine Investition sorgt dafür, dass der Ablauf deines Waschbeckens
                  technisch erneuert ist – Ablaufgarnitur und Geruchsverschluss sind
                  jetzt auf dem aktuellen Stand und fachgerecht montiert.
                </p>

                <p className="text-[11px] leading-snug text-slate-700">
                  Gleichzeitig fließen aus Lohn und Materialgewinnen zusammen rund{" "}
                  <span className="font-semibold">21,30 €</span> in den Wirkungsfonds.
                  Damit stärkst du künftige Projekte, die wir transparent
                  dokumentieren – etwa soziale oder lokale Maßnahmen, CO₂-Einsparungen
                  oder besondere handwerkliche Einsätze.
                </p>

                <p className="text-[11px] leading-snug text-slate-700">
                  Dieses System ist keine Pflicht, sondern eine Einladung: Wer Wert
                  darauf legt, dass mit Mitarbeitern, Natur und Umfeld im
                  Gleichgewicht gehandelt wird, soll diesen Weg hier klar erkennen
                  können.
                </p>
              </section>
            )}

            {/* 6. Transparenz-Hinweis */}
            {activeParticipant.id === "wohnenwo" && (
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
                  Original-Rechnung bleibt ausschließlich dir vorbehalten. Du
                  entscheidest später selbst, welche Details du für andere sichtbar
                  machen möchtest.
                </p>
              </section>
            )}

            <div className="h-10" />
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ───────────── Utility-Komponente für Info-Zeilen ───────────── */

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
