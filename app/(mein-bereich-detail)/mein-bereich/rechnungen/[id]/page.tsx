"use client";

import * as React from "react";
import {
  FileText,
  Download,
  Printer,
  MoreHorizontal,
  User,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";

type Participant = {
  id: string;
  label: string;       // Name (z.B. WohnenWo Studio)
  description: string; // Kurzbeschreibung
  pages: number;       // Anzahl „Dokumente“ in der Vorschau
  avatar: string;      // Kürzel im Avatar
  role: string;        // Rolle in der Wertschöpfung
};

const PARTICIPANTS: Participant[] = [
  {
    id: "wohnenwo",
    label: "WohnenWo Studio",
    description: "Planung, Koordination & Umsetzung vor Ort.",
    pages: 2,
    avatar: "WS",
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
    PARTICIPANTS[0].id
  );

  const activeParticipant = React.useMemo<Participant>(() => {
    const found = PARTICIPANTS.find((p) => p.id === activeParticipantId);
    return found ?? PARTICIPANTS[0];
  }, [activeParticipantId]);

  return (
    <div className="h-full">
      <div className="flex h-full">
        {/* Linke Spalte */}
        <section className="flex-1 min-w-0 border-r border-slate-200 bg-white">
          <div className="h-full overflow-y-auto">
            <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Rechnung · Detailansicht · Abgeschlossene Leistung
                </p>
                <h1 className="text-[18px] md:text-[20px] font-semibold tracking-tight text-slate-900">
                  Austausch Ablaufgarnitur &amp; Geruchsverschluss
                </h1>
                <p className="text-[12px] text-slate-500">
                  Rechnungs-ID: <span className="font-mono">{params.id}</span>
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
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

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
                        <div className="h-[320px] md:h-[420px] rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
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
        <aside className="w-[320px] xl:w-[360px] bg-slate-50">
          <div className="h-full overflow-y-auto border-l border-slate-200 px-5 py-5 space-y-5">
            {/* 1. Lerne deinen Dienstleister kennen – vertikale Profilkarte */}
            <section className="rounded-2xl bg-white border border-slate-200 px-4 py-5 space-y-4 shadow-sm">
              <header className="space-y-1">
                <p className="text-[11px] tracking-[0.15em] uppercase text-slate-500">
                  Lerne deinen Dienstleister kennen
                </p>
              </header>

              <button
                type="button"
                className="w-full rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-5 flex flex-col items-center text-center gap-3 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer"
              >
                {/* Avatar – später durch echtes Bild ersetzen */}
                <div className="inline-flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-slate-900 text-white text-[20px] font-semibold">
                  F
                </div>
                <div className="space-y-0.5">
                  <p className="text-[16px] font-semibold text-slate-900 leading-tight">
                    Fabian
                  </p>
                  <p className="text-[14px] text-slate-500 leading-tight">
                    Gründer von WohnenWo
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Klicke hier, um mehr über mich zu erfahren.
                  </p>
                </div>
              </button>
            </section>

            {/* 1.5 Eigenständiger Cyan-Container (Badge) */}
            <section className="rounded-md bg-cyan-500 px-4 py-2 shadow-sm">
              <p className="text-[12px] font-semibold text-white">
                Dieses Projekt entstand in Zusammenarbeit mit Partnern, die
                meine Werte teilen.
              </p>
            </section>

            {/* 2. Wer an dieser Rechnung mitgewirkt hat */}
            <section className="rounded-2xl bg-white border border-slate-200 px-4 py-5 space-y-4 shadow-sm">
              <header className="space-y-1">
                <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                  Dienstleister &amp; Wertschöpfung
                </p>
                <p className="text-[13px] font-semibold text-slate-900">
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

              <p className="mt-2 text-[11px] leading-snug text-slate-600">
                Tippe auf einen Mitwirkenden: Die linke Dokumentenvorschau
                springt automatisch zu den Unterlagen, die diesen Schritt der
                Wertschöpfung dokumentieren.
              </p>
            </section>

            {/* 3. Betragsübersicht */}
            <section className="rounded-2xl bg-white border border-slate-200 px-4 py-5 space-y-3 shadow-sm">
              <header className="space-y-1">
                <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                  Betrag dieser Rechnung
                </p>
                <p className="text-[13px] font-semibold text-slate-900">
                  Wie sich der Gesamtbetrag zusammensetzt
                </p>
              </header>

              <div className="space-y-2 text-[12px] text-slate-600">
                <Row label="Brutto-Gesamtbetrag" value="144,22 €" />
                <Row label="Netto-Gesamtbetrag" value="121,19 €" />
                <Row label="Enthaltene Umsatzsteuer (19 %)" value="23,03 €" />
                <Row label="Leistungsumfang" value="Sanitär · Serviceeinsatz" />
              </div>
            </section>

            {/* 4. Aufschlüsselung */}
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
                  label="Material &amp; Ausstattung (netto)"
                  value="85,99 €"
                />
                <Row
                  label="Handwerk &amp; Umsetzung (netto)"
                  value="35,20 €"
                />
                <Row label="Planung &amp; Koordination" value="–" />
                <Row
                  label="Wirkungsfonds-Anteil"
                  value="≈ 21,30 € (Lohn &amp; Material)"
                />
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100 space-y-1.5">
                <p className="text-[11px] leading-snug text-slate-600">
                  Arbeitszeit: 10 Minuten An- und Abfahrt + 22 Minuten Arbeit im
                  Raum = 32 Minuten zu 66,00 € netto/Stunde.
                </p>
                <p className="text-[11px] leading-snug text-slate-600">
                  Die Netto-Lohnkosten von 35,20 € werden in drei gleich große
                  Teile geteilt: Handwerker &amp; Umsetzung, Betrieb &amp;
                  Service sowie Wirkungsfonds (jeweils ca. 11,73 €).
                </p>
                <p className="text-[11px] leading-snug text-slate-600">
                  Die Materialgewinne aus Ablaufgarnitur und
                  Geruchsverschluss werden ebenfalls Drittel für Drittel auf
                  Handwerk, Betrieb und Wirkungsfonds verteilt.
                </p>
              </div>
            </section>

            {/* 5. Wirkung & Effekte */}
            <section className="rounded-2xl bg-slate-50 text-slate-900 px-4 py-5 space-y-4 shadow-sm border border-slate-200">
              <header className="flex items-center gap-2">
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                    Wirkung &amp; Effekte
                  </p>
                  <p className="text-[13px] font-semibold text-slate-900">
                    Was diese Rechnung möglich macht
                  </p>
                </div>
              </header>

              <p className="text-[12px] leading-snug text-slate-800">
                Deine Investition sorgt dafür, dass der Ablauf deines
                Waschbeckens technisch erneuert ist – Ablaufgarnitur und
                Geruchsverschluss sind jetzt auf dem aktuellen Stand und
                fachgerecht montiert.
              </p>

              <p className="text-[11px] leading-snug text-slate-700">
                Gleichzeitig fließen aus Lohn und Materialgewinnen zusammen rund{" "}
                <span className="font-semibold">21,30 €</span> in den
                Wirkungsfonds. Damit stärkst du künftige Projekte, die wir
                transparent dokumentieren – etwa soziale oder lokale Maßnahmen,
                CO₂-Einsparungen oder besondere handwerkliche Einsätze.
              </p>
            </section>

            {/* 6. Transparenz-Hinweis */}
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
                sichtbaren Version datenschutzkonform reduziert. Die
                vollständige Original-Rechnung bleibt ausschließlich dir
                vorbehalten. Du entscheidest später selbst, welche Details du
                für andere sichtbar machen möchtest.
              </p>
            </section>

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
