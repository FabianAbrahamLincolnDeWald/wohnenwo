"use client";

import * as React from "react";
import {
  FileText,
  Layers,
  Sparkles,
  Info,
  Factory,
  Briefcase,
  Scale,
  Wrench,
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
    value: "52,55 €",
  },
  {
    id: "hansgrohe",
    label: "Hansgrohe",
    description: "Ablaufgarnitur · Ablauf-System",
    pages: 0,
    icon: <Factory className="h-4 w-4" />,
    role: "Hersteller",
    value: "29,83 €",
  },
  {
    id: "grohe",
    label: "Grohe",
    description: "Röhren-Geruchsverschluss · Siphon",
    pages: 1,
    icon: <Factory className="h-4 w-4" />,
    role: "Hersteller",
    value: "8,57 €",
  },
  {
    id: "staat",
    label: "Staat & Sozialkassen",
    description: "Steuern & Sozialabgaben",
    pages: 0,
    icon: <Scale className="h-4 w-4" />,
    role: "Gesetzlich gebundene Abgaben",
    value: "53,27 €",
  },
];

/* ──────────────────────────────────────────────────────────────
   DESKTOP: DOKUMENTE (UNVERÄNDERT, untereinander, im linken Panel)
────────────────────────────────────────────────────────────── */

function DesktopDocuments({
  participant,
}: {
  participant: Pick<Participant, "id" | "label" | "pages">;
}) {
  return (
    <div className="space-y-6">
      {/* ───── FALL: DOKUMENTE VORHANDEN ───── */}
      {participant.pages > 0 &&
        Array.from({ length: participant.pages }).map((_, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <img
              src={`/documents/${participant.id}-doc-${idx + 1}.jpg`}
              alt={`${participant.label} Dokument ${idx + 1}`}
              className="w-full max-w-[600px] rounded-lg shadow-sm"
              loading="lazy"
            />
          </div>
        ))}

      {/* ───── FALL: KEINE DOKUMENTE → PLATZHALTER ───── */}
      {participant.pages === 0 && (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[600px] h-[840px] rounded-lg border border-dashed border-slate-300 bg-white flex items-center justify-center">
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
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   MOBILE/TABLET: Dokumente im Container + Slider (Dots)
   - Container-Optik wie rechte Spalte
   - Abstand zum nächsten Container bleibt stabil
────────────────────────────────────────────────────────────── */

function MobileDocumentsCard({
  participant,
}: {
  participant: Pick<Participant, "id" | "label" | "pages">;
}) {
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const pageCount = Math.max(0, participant.pages);

  const scrollToIndex = React.useCallback((i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollTo({ left: i * w, behavior: "smooth" });
  }, []);

  const handleScroll = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.clientWidth || 1;
    const next = Math.round(el.scrollLeft / w);
    setActiveIndex((prev) => (prev === next ? prev : next));
  }, []);

  React.useEffect(() => {
    // Wenn Tab wechselt, Index resetten
    setActiveIndex(0);
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: 0 });
  }, [participant.id]);

  return (
    <section className="rounded-2xl bg-white border border-slate-200 px-4 py-4 shadow-sm">
      {/* FALL: Keine Dokumente */}
      {pageCount === 0 && (
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
      )}

      {/* FALL: 1 Dokument */}
      {pageCount === 1 && (
        <div className="flex flex-col items-center">
          <img
            src={`/documents/${participant.id}-doc-1.jpg`}
            alt={`${participant.label} Dokument 1`}
            className="w-full rounded-lg shadow-sm"
            loading="lazy"
          />
        </div>
      )}

      {/* FALL: mehrere Dokumente → Slider + Dots */}
      {pageCount > 1 && (
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
            {Array.from({ length: pageCount }).map((_, idx) => (
              <div
                key={idx}
                className="shrink-0 w-full snap-center"
                aria-label={`Dokumentseite ${idx + 1}`}
              >
                <img
                  src={`/documents/${participant.id}-doc-${idx + 1}.jpg`}
                  alt={`${participant.label} Dokument ${idx + 1}`}
                  className="w-full rounded-lg shadow-sm"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Dots (zentriert) */}
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, idx) => {
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
    return (
      PARTICIPANTS.find((p) => p.id === activeParticipantId) ??
      PARTICIPANTS[0]!
    );
  }, [activeParticipantId]);

  if (!activeParticipant) return null;
  const participant = activeParticipant;

  return (
    <div className="h-full">
      {/* Mobile/Tablet: nur rechte Spalte sichtbar
          Desktop: zwei Spalten unverändert */}
      <div className="flex h-full flex-col lg:flex-row">
        {/* ───────────────────────── LEFT: DOKUMENTE (DESKTOP UNVERÄNDERT) ───────────────────────── */}
        <section className="hidden lg:block flex-1 min-w-0 border-r border-slate-200 bg-white">
          <div className="h-full overflow-y-auto">
            <div className="px-6 py-5">
              {/* Dieser Container ist der EINZIGE Rahmen links (kein doppelter Rahmen) */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 md:px-6 py-4 md:py-5">
                <DesktopDocuments participant={participant} />
              </div>

              <div className="h-20" />
            </div>
          </div>
        </section>

        {/* ───────────────────────── RIGHT: DETAILS ───────────────────────── */}
        <aside className="w-full lg:w-[320px] xl:w-[400px] bg-slate-50">
          <div className="h-full overflow-y-auto border-l border-slate-200 px-5 py-5 space-y-5">
            {/* Top-Container: Rechnung + Person + Partner/Tabs */}
            <section className="rounded-2xl bg-white border border-slate-200 px-4 py-4 space-y-3 shadow-sm">
              {/* 1) Rechnungsübersicht */}
              <div className="space-y-1">
                <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                  Rechnung · Detailansicht
                </p>

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[13px] font-semibold text-slate-900 leading-snug">
                      Austausch Ablaufgarnitur &amp; Geruchsverschluss
                    </p>
                    <p className="text-[12px] font-medium text-black mt-2">
                      Rechnungs-ID:{" "}
                      <span className="font-mono">{params.id}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-600">
                  <div className="space-y-0.5">
                    <p className="text-slate-500">Rechnungsdatum</p>
                    <p className="font-medium text-slate-800">01.02.2026</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-500">Leistungszeitraum</p>
                    <p className="font-medium text-slate-800">
                      20.11.2025 · Sanitär
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
                  <div className="space-y-0.5">
                    <p className="text-[12px] font-medium text-slate-800">
                      Brutto-Betrag
                    </p>
                    <p className="text-[14px] font-semibold text-black">
                      144,22 €
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[12px] font-medium text-slate-800">
                      Zahlungsstand
                    </p>
                    <div className="flex flex-col items-start gap-1">
                      <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-0.5 text-[10px] font-medium text-yellow-700 border border-yellow-500">
                        Offen
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200 mb-3" />

              {/* Mitwirkende / Tabs */}
              <div className="space-y-3">
                <header className="space-y-0.5">
                  <p className="text-[13px] font-semibold text-slate-900">
                    Wie sich der Rechnungswert verteilt
                  </p>
                </header>

                <div className="space-y-2">
                  {PARTICIPANTS.map((p) => {
                    const active = p.id === activeParticipantId;
                    const isState = p.id === "staat";

                    if (isState) {
                      return (
                        <div
                          key={p.id}
                          className="w-full rounded-lg px-3 py-2.5 text-[12px] flex items-center gap-3 border bg-slate-500/80 border-slate-400 text-white shadow-sm"
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

                          {p.value && (
                            <span className="text-[14px] font-semibold tabular-nums text-white">
                              {p.value}
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
                          active
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                            : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "inline-flex h-8 w-8 items-center justify-center rounded-full shrink-0",
                            active
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
                  Wertschöpfung dokumentieren. Angezeigt werden die Netto-Anteile
                  nach Steuern und Abgaben.
                </p>
              </div>
            </section>

            {/* MOBILE/TABLET: Dokumente direkt unter "Rechnung · Detailansicht" Container,
               außer bei WohnenWo (da kommen sie unter den Badge) */}
            <div className="lg:hidden">
              {activeParticipant.id !== "wohnenwo" && (
                <div className="pt-0">
                  {/* gleicher Abstand unabhängig von pages */}
                  <MobileDocumentsCard participant={participant} />
                </div>
              )}
            </div>

            {/* Wirkungs-Badge */}
            {activeParticipant.id === "wohnenwo" && (
              <div className="rounded-xl border border-slate-200 bg-cyan-600 text-white px-3 py-2 shadow-sm">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>

                  <p className="text-[14px] leading-snug text-slate-100">
                    Mit Ihrem Auftrag fließen{" "}
                    <span className="font-semibold">21,29 €</span>{" "}
                    in den Ausbau transparenter Wirtschaftskulturen (Plattform,
                    Technologie &amp; faire Prozesse).
                  </p>
                </div>
              </div>
            )}

            {/* MOBILE/TABLET: WohnenWo → Dokumente direkt unter dem Badge */}
            <div className="lg:hidden">
              {activeParticipant.id === "wohnenwo" && (
                <div className="pt-0">
                  <MobileDocumentsCard participant={participant} />
                </div>
              )}
            </div>

            {/* 2. Kontextabhängige Detailansicht */}
            {activeParticipant.id === "wohnenwo" && (
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
                    <tr className="border-t border-slate-200">
                      <td className="py-1 text-slate-700">
                        Anfahrt &amp; Abfahrt
                      </td>
                      <td className="py-1 text-slate-500">
                        Weg hin und zurück
                      </td>
                      <td className="py-1 text-right text-slate-700">10 min</td>
                    </tr>

                    <tr className="border-t border-slate-200">
                      <td className="py-1 text-slate-700">Arbeit im Raum</td>
                      <td className="py-1 text-slate-500">
                        Ausbau &amp; Einbau
                      </td>
                      <td className="py-1 text-right text-slate-700">22 min</td>
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

                <p className="text-[11px] leading-snug text-slate-600">
                  Abgerechnet werden{" "}
                  <span className="font-medium">32 Minuten</span> zu einem
                  Stundensatz von{" "}
                  <span className="font-medium">66,00 € netto</span>.
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-0.5 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Arbeitslohn (netto)</span>
                    <span className="font-medium text-slate-800">35,20 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Umsatzsteuer (19 %)</span>
                    <span className="font-medium text-slate-800">6,69 €</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[14px] font-bold text-slate-800">
                      Arbeitswert (brutto)
                    </span>
                    <span className="text-[14px] font-bold text-slate-900">
                      41,89 €
                    </span>
                  </div>
                </div>
              </section>
            )}

            {activeParticipant.id === "wohnenwo" && (
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
                    <span className="text-[14px] font-semibold">41,89 €</span>
                  </div>

                  <div className="bg-slate-50 px-3 py-3 space-y-1 text-[12px] text-slate-600">
                    <Row label="Arbeitnehmer:in · Netto" value="7,80 €" />
                    <Row
                      label="Unternehmerische Struktur · Netto"
                      value="9,43 €"
                    />
                    <Row label="Wirkungsfonds" value="11,74 €" />
                    <Row label="Staat & Sozialkassen" value="12,92 €" />
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
                      <span className="text-[14px] font-semibold">52,55 €</span>
                    </div>

                    <div className="px-3 py-3 space-y-1 text-[12px] text-slate-600">
                      <Row label="Arbeitswert (netto)" value="28,97 €" />
                      <Row label="Materialaufschlag (netto)" value="23,58 €" />
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
                        14,16 €
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
                        17,10 €
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
                        21,29 €
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
            )}

            {activeParticipant.id === "wohnenwo" && (
              <section className="rounded-2xl bg-slate-50 text-slate-900 px-4 py-5 space-y-4 shadow-sm border border-slate-200">
                <header className="space-y-0.5">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                    Überfuss &amp; Wirkung
                  </p>
                  <p className="text-[13px] font-semibold text-slate-900">
                    Was ist der Wirkungsfonds?
                  </p>
                </header>

                <p className="text-[12px] leading-snug text-slate-800">
                  Ihr Auftrag sorgt dafür, dass der Ablauf Ihres Waschbeckens
                  technisch erneuert ist, gleichzeitig fließen aus Lohn und
                  Materialaufschlag zusammen rund{" "}
                  <span className="font-semibold">21,29 €</span> in den
                  Wirkungsfonds.
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
                      <span className="text-[14px] font-semibold">21,29 €</span>
                    </div>

                    <div className="px-3 py-3 space-y-1 text-[12px] text-slate-600">
                      <Row label="Service & Qualität (netto)" value="– €" />
                      <Row label="Sozial & Lokal (netto)" value="– €" />
                      <Row label="Zukunft & System (netto)" value="21,29 €" />
                    </div>
                  </div>

                  <p className="pt-2 text-[12px] leading-snug text-slate-800 border-t border-slate-200">
                    Der Wirkungsfonds ist unser gemeinsamer Zukunfts-Topf. Er
                    entsteht aus einem fest definierten Anteil deiner Rechnung –
                    transparent und nachvollziehbar.
                  </p>
                </div>
              </section>
            )}

            {activeParticipant.id === "wohnenwo" && (
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
            )}

            {/* ────────────────────────── GROHE ────────────────────────── */}
            {activeParticipant.id === "grohe" && (
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
                        <td className="py-1 text-slate-700">
                          Einkaufspreis (netto)
                        </td>
                        <td className="py-1 text-slate-500">Amazon · Grohe</td>
                        <td className="py-1 text-right text-slate-700">12,79 €</td>
                      </tr>

                      <tr className="border-t border-slate-200">
                        <td className="py-1 text-slate-700">Materialaufschlag</td>
                        <td className="py-1 text-slate-500">Dienstleister</td>
                        <td className="py-1 text-right text-slate-700">6,40 €</td>
                      </tr>

                      <tr className="border-t border-slate-200">
                        <td className="py-1 text-slate-700">
                          Umsatzsteuer (19 %)
                        </td>
                        <td className="py-1 text-slate-500">Staat</td>
                        <td className="py-1 text-right text-slate-700">3,65 €</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-2 border-t border-slate-300 space-y-0.5 text-[11px] text-slate-600">
                    <div className="flex justify-between pt-1">
                      <span className="text-[14px] font-bold text-slate-800">
                        Materialpreis (brutto)
                      </span>
                      <span className="text-[14px] font-bold text-slate-900">
                        22,84 €
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
                      <span className="text-[14px] font-semibold">9,01 €</span>
                    </div>

                    <div className="px-3 py-3 space-y-1 text-[12px] text-slate-600">
                      <Row label="Umsatzsteuer (Endkunde)" value="3,65 €" />
                      <Row label="Abgaben aus Materialaufschlag" value="1,14 €" />
                      <Row label="Abgaben aus Produktion & Handel" value="4,22 €" />
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
                      <span className="text-[14px] font-semibold">5,26 €</span>
                    </div>

                    <div className="bg-slate-50 px-3 py-3 space-y-1 text-[12px] text-slate-600">
                      <Row label="Arbeitnehmer:in · Netto" value="1,42 €" />
                      <Row
                        label="Unternehmerische Struktur · Netto"
                        value="1,71 €"
                      />
                      <Row label="Wirkungsfonds" value="2,13 €" />
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="bg-slate-800 text-white px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                          <Factory className="h-4 w-4" />
                        </div>
                        <span className="text-[14px] font-semibold">
                          Bauteil · Grohe
                        </span>
                      </div>
                      <span className="text-[14px] font-semibold">8,57 €</span>
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

            {/* ────────────────────────── HANSGROHE ────────────────────────── */}
            {activeParticipant.id === "hansgrohe" && (
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
                        <td className="py-1 text-slate-700">
                          Einkaufspreis (netto)
                        </td>
                        <td className="py-1 text-slate-500">
                          Hansgrohe · Industrie
                        </td>
                        <td className="py-1 text-right text-slate-700">44,53 €</td>
                      </tr>

                      <tr className="border-t border-slate-200">
                        <td className="py-1 text-slate-700">Materialaufschlag</td>
                        <td className="py-1 text-slate-500">Dienstleister</td>
                        <td className="py-1 text-right text-slate-700">22,27 €</td>
                      </tr>

                      <tr className="border-t border-slate-200">
                        <td className="py-1 text-slate-700">
                          Umsatzsteuer (19 %)
                        </td>
                        <td className="py-1 text-slate-500">Staat</td>
                        <td className="py-1 text-right text-slate-700">12,69 €</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-2 border-t border-slate-300 space-y-0.5 text-[11px] text-slate-600">
                    <div className="flex justify-between pt-1">
                      <span className="text-[14px] font-bold text-slate-800">
                        Materialpreis (brutto)
                      </span>
                      <span className="text-[14px] font-bold text-slate-900">
                        79,49 €
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
                      <span className="text-[14px] font-semibold">31,34 €</span>
                    </div>

                    <div className="px-3 py-3 space-y-1 text-[12px] text-slate-600">
                      <Row label="Umsatzsteuer (Endkunde)" value="12,69 €" />
                      <Row label="Abgaben aus Materialaufschlag" value="3,95 €" />
                      <Row label="Abgaben aus Produktion & Handel" value="14,70 €" />
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
                      <span className="text-[14px] font-semibold">18,32 €</span>
                    </div>

                    <div className="bg-slate-50 px-3 py-3 space-y-1 text-[12px] text-slate-600">
                      <Row label="Arbeitnehmer:in · Netto" value="4,94 €" />
                      <Row
                        label="Unternehmerische Struktur · Netto"
                        value="5,96 €"
                      />
                      <Row label="Wirkungsfonds" value="7,42 €" />
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="bg-slate-800 text-white px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                          <Factory className="h-4 w-4" />
                        </div>
                        <span className="text-[14px] font-semibold">
                          Bauteil · Hansgrohe
                        </span>
                      </div>
                      <span className="text-[14px] font-semibold">29,83 €</span>
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
