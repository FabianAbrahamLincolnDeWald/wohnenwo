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
} from "lucide-react";

type Participant = {
  id: string;
  label: string; // Name (z.B. WohnenWo Studio)
  description: string; // Kurzbeschreibung
  pages: number; // Anzahl „Dokumente“ in der Vorschau
  avatar: string; // Kürzel im Avatar
  role: string; // Rolle in der Wertschöpfung
};

const PARTICIPANTS: Participant[] = [
  {
    id: "wohnenwo",
    label: "Fabian · WohnenWo",
    description: "Planung, Koordination & Umsetzung vor Ort.",
    pages: 2,
    avatar: "F",
    role: "Planung, Koordination & Umsetzung",
  },
  {
    id: "hansgrohe",
    label: "Hansgrohe",
    description: "Neue Ablaufgarnitur für das Waschbecken.",
    pages: 2,
    avatar: "HG",
    role: "Ablaufgarnitur · neues Ablauf-System",
  },
  {
    id: "grohe",
    label: "Grohe",
    description: "Neuer Röhren-Geruchsverschluss (Siphon).",
    pages: 1,
    avatar: "GR",
    role: "Röhren-Geruchsverschluss · Siphon",
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
                  <p className="text-[11px] tracking-[0.11em] uppercase text-slate-500">
                    Wer an dieser Rechnung mitgewirkt hat
                  </p>
                </header>

                <div className="space-y-2">
                  {PARTICIPANTS.map((p) => {
                    const active = p.id === activeParticipantId;
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
                        <div
                          className={[
                            "inline-flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold shrink-0",
                            active
                              ? "bg-white/10 text-white"
                              : "bg-slate-900 text-white",
                          ].join(" ")}
                          title={p.label}
                        >
                          {p.avatar}
                        </div>

                        <div className="space-y-0.5">
                          <p
                            className={[
                              "font-medium",
                              active ? "text-white" : "text-slate-900",
                            ].join(" ")}
                          >
                            {p.label}
                          </p>
                          <p
                            className={[
                              "text-[11px]",
                              active ? "text-slate-200" : "text-slate-500",
                            ].join(" ")}
                          >
                            {p.role}
                          </p>
                        </div>
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
                    <span>Stundensatz</span>
                    <span className="font-medium text-slate-800">66,00 €</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[14px] font-bold text-slate-800">Arbeitslohn (netto)</span>
                    <span className="text-[14px] font-bold text-slate-900">35,20 €</span>
                  </div>
                </div>
              </section>
            )}{activeParticipant.id === "wohnenwo" && (
              <section className="rounded-2xl bg-white border border-slate-200 px-4 py-4 space-y-3 shadow-sm">

                {/* Header */}
                <header className="space-y-0.5">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                    Materialkosten
                  </p>
                  <p className="text-[13px] font-semibold text-slate-900">
                    Wie sich der Materialpreis zusammensetzt
                  </p>
                </header>

                {/* Tabelle */}
                <table className="w-full border-collapse text-[11px]">
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-1.5 text-slate-600">
                        Materialpreis für Sie (brutto)
                      </td>
                      <td className="py-1.5 text-right font-medium text-slate-900">
                        102,33 €
                      </td>
                    </tr>

                    <tr>
                      <td className="py-1.5 text-slate-600">
                        enthaltene Umsatzsteuer (19 %)
                      </td>
                      <td className="py-1.5 text-right">
                        − 16,34 €
                      </td>
                    </tr>

                    <tr>
                      <td className="py-1.5 text-slate-600">
                        Materialwert netto
                      </td>
                      <td className="py-1.5 text-right font-medium">
                        85,99 €
                      </td>
                    </tr>

                    <tr>
                      <td className="py-1.5 text-slate-600">
                        Einkaufspreis netto (Händler)
                      </td>
                      <td className="py-1.5 text-right">
                        − 57,32 €
                      </td>
                    </tr>

                    <tr className="border-t border-slate-300">
                      <td className="text-[14px] py-2 font-semibold text-slate-800">
                        Kalkulierter Materialanteil
                      </td>
                      <td className="text-[14px] py-2 text-right font-semibold text-slate-900">
                        28,67 €
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            )}


            {activeParticipant.id === "grohe" && (
              <section className="rounded-2xl bg-white border border-slate-200 px-4 py-5 space-y-4 shadow-sm">
                <header className="space-y-1">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                    Materialherkunft · Grohe
                  </p>
                  <p className="text-[13px] font-semibold text-slate-900">
                    Hier wurde Ihr neuer Geruchsverschluss gekauft
                  </p>
                </header>

                <table className="w-full border-collapse text-[11px]">
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-1.5 text-slate-600">Händler</td>
                      <td className="py-1.5 text-right font-medium text-slate-900">
                        Amazon EU
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-slate-600">Einkaufspreis (brutto)</td>
                      <td className="py-1.5 text-right">15,22 €</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-slate-600">Enthaltene MwSt.</td>
                      <td className="py-1.5 text-right">2,43 €</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-slate-600">Netto-Warenwert</td>
                      <td className="py-1.5 text-right font-medium">12,79 €</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-slate-600">Kalkulation (÷ 0,6666)</td>
                      <td className="py-1.5 text-right">19,19 €</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-slate-600">Umsatzsteuer (19 %)</td>
                      <td className="py-1.5 text-right">3,65 €</td>
                    </tr>
                    <tr className="border-t border-slate-300">
                      <td className="py-2 font-medium text-slate-800">
                        Materialpreis für Sie
                      </td>
                      <td className="py-2 text-right font-semibold text-slate-900">
                        22,84 € brutto
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p className="pt-2 mt-1 border-t border-slate-100 text-[11px] leading-snug text-slate-500">
                  Die beim Einkauf gezahlte Vorsteuer wird steuerlich verrechnet.
                  Sichtbar ist hier ausschließlich der reale Wertstrom dieses Bauteils.
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

            {/* 3. Wohin deine Zahlung fließt */}
            {activeParticipant.id === "wohnenwo" && (
              <section className="rounded-2xl bg-white border border-slate-200 px-4 py-5 space-y-3 shadow-sm">
                <header className="space-y-1">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                    Wohin deine Zahlung fließt
                  </p>
                  <p className="text-[13px] font-semibold text-slate-900">
                    Wie dein Betrag verteilt ist
                  </p>
                </header>

                <div className="space-y-2 text-[12px] text-slate-600">
                  <Row
                    label="Arbeitnehmer:in vor Ort (Lohnanteil)"
                    value="≈ 11,73 €"
                  />
                  <Row
                    label="Betrieb &amp; Service (Organisation, Risiko)"
                    value="≈ 11,73 €"
                  />
                  <Row
                    label="Wirkungsfonds (gemeinsame Projekte)"
                    value="≈ 11,73 € + Materialanteile"
                  />
                  <Row
                    label="Mitwirkende Partner (Hersteller &amp; Handel)"
                    value={
                      <span className="text-right">
                        Teil der 85,99 € Material – aktuell noch
                        <br />
                        nicht im Detail offengelegt
                      </span>
                    }
                  />
                  <Row label="Staat (Umsatzsteuer 19 %)" value="23,03 €" />
                </div>

                <p className="pt-2 mt-1 text-[10px] leading-snug text-slate-500 border-t border-slate-100">
                  Die gesetzlich vorgeschriebenen Angaben wie Netto-, Brutto- und
                  Steuerbeträge findest du links in der Rechnungsdokumentation.
                  Hier zeigen wir dir, wie sich dein Betrag inhaltlich auf
                  Menschen, Betrieb, Staat und Mitwirkende verteilt.
                </p>
              </section>
            )}

            {/* 4. Gewinn & Verantwortung – kontextabhängig */}
            <section className="rounded-2xl bg-white border border-slate-200 px-4 py-5 space-y-4 shadow-sm">
              <header className="flex items-center gap-2">
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                    Gewinn &amp; Verantwortung
                  </p>
                  <p className="text-[13px] font-semibold text-slate-900">
                    {activeParticipant.id === "wohnenwo"
                      ? "Wie ich Gewinn und Verantwortung teile"
                      : "Gewinn & Verantwortung des Zwischenhändlers"}
                  </p>
                </div>
              </header>

              {/* ───────── FALL 1: WohnenWo ───────── */}
              {activeParticipant.id === "wohnenwo" && (
                <>
                  <p className="text-[12px] leading-snug text-slate-700">
                    Mit jedem Auftrag entsteht Gewinn – und Verantwortung.
                    Ich lege offen, wie beides zwischen Handwerk, Betrieb
                    und Wirkungsfonds aufgeteilt wird.
                  </p>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    Arbeits- und Materialgewinne werden zu gleichen Teilen
                    für Umsetzung, Betrieb und gemeinsame Wirkung verwendet.
                  </div>
                </>
              )}

              {/* ───────── FALL 2: Grohe ───────── */}
              {activeParticipant.id === "grohe" && (
                <>
                  <div className="pt-1">
                    <p className="text-[11px] text-slate-500">
                      Weitergeleiteter Materialbetrag
                    </p>
                    <p className="text-[18px] font-semibold text-slate-900">
                      15,22 €
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                    <div className="flex justify-between">
                      <span>Umsatzsteuer</span>
                      <span className="font-medium">2,43 €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Verbleibender Wert</span>
                      <span className="font-medium">12,79 €</span>
                    </div>
                  </div>

                  <p className="pt-2 text-[11px] leading-snug text-slate-500">
                    Dieser Betrag ermöglicht dem Zwischenhändler,
                    Produktion, Logistik, Personal und
                    prozessabhängige Kosten zu tragen.
                    Wir vertrauen darauf, dass dieser Wert
                    verantwortungsvoll eingesetzt wird.
                  </p>
                </>
              )}

              {/* ───────── FALL 3: Hansgrohe ───────── */}
              {activeParticipant.id === "hansgrohe" && (
                <>
                  <div className="pt-1">
                    <p className="text-[11px] text-slate-500">
                      Kalkulierter Materialwert (Altbestand)
                    </p>
                    <p className="text-[18px] font-semibold text-slate-900">
                      66,80 €
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                    <div className="flex justify-between">
                      <span>Umsatzsteuer</span>
                      <span className="font-medium">12,69 €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Materialpreis (brutto)</span>
                      <span className="font-medium">79,49 €</span>
                    </div>
                  </div>

                  <p className="pt-2 text-[11px] leading-snug text-slate-500">
                    Auch bei Lagerbestand basiert der ausgewiesene Wert
                    auf derselben transparenten Kalkulationslogik.
                    Wir gehen davon aus, dass dieser Wert
                    verantwortungsvoll im System des Herstellers wirkt.
                  </p>
                </>
              )}
            </section>


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
