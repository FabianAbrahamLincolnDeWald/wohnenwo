"use client";

import * as React from "react";
import {
  FileText,
  Download,
  Printer,
  MoreHorizontal,
} from "lucide-react";

type InvoiceDoc = {
  id: string;
  label: string;
  description: string;
  pages: number;
};

const MOCK_DOCS: InvoiceDoc[] = [
  {
    id: "rechnung-pdf",
    label: "Rechnung (PDF)",
    description: "Gesamte Rechnung als PDF mit allen Positionen.",
    pages: 3,
  },
  {
    id: "material-liste",
    label: "Materialliste",
    description: "Aufschlüsselung nach Herstellern, Typen und Serien.",
    pages: 5,
  },
  {
    id: "arbeitszeiten",
    label: "Arbeitszeiten",
    description: "Aufstellung nach Gewerken, Datum und Stunden.",
    pages: 4,
  },
  {
    id: "wirkung",
    label: "Wirkungsfonds",
    description: "Anteil der Rechnung im Wirkungsfonds.",
    pages: 2,
  },
];

export default function RechnungDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeDocId, setActiveDocId] = React.useState<string>(
    MOCK_DOCS[0]?.id ?? ""
  );

  const activeDoc: InvoiceDoc =
    MOCK_DOCS.find((d) => d.id === activeDocId) ?? MOCK_DOCS[0]!;

  return (
    // Root der Seite: muss die volle Höhe unterhalb der Topbar einnehmen
    <div className="h-full">
      {/* 2-Spalten-Layout wie bei ArtStation: beide Spalten haben eigene Scrollbars */}
      <div className="flex h-full">
        {/* Linke Spalte: großer Inhaltsbereich mit Dokumenten / Assets */}
        <section className="flex-1 min-w-0 border-r border-slate-200 bg-white">
          {/* Eigenständiger Scroll-Container */}
          <div className="h-full overflow-y-auto">
            {/* Header innerhalb der linken Spalte */}
            <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Rechnung · Detailansicht
                </p>
                <h1 className="text-[18px] md:text-[20px] font-semibold tracking-tight text-slate-900">
                  Dokumentenvorschau &amp; Aufschlüsselung
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

            {/* Inhalt: links „Dokumentenliste“, rechts große Vorschau – alles in EINEM Scroll-Container */}
            <div className="px-6 py-5 flex gap-4 md:gap-6">
              {/* Dokumentenliste (kleine Spalte innerhalb des großen Bereichs) */}
              <div className="w-[220px] shrink-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 mb-2">
                  Dokumente
                </p>
                <div className="space-y-2">
                  {MOCK_DOCS.map((doc) => {
                    const active = doc.id === activeDocId;
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => setActiveDocId(doc.id)}
                        className={[
                          "w-full text-left rounded-xl border px-3 py-2.5 text-[12px] transition",
                          active
                            ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={[
                              "inline-flex h-7 w-7 items-center justify-center rounded-md border text-xs",
                              active
                                ? "border-white/30 bg-white/10"
                                : "border-slate-200 bg-white text-slate-800",
                            ].join(" ")}
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{doc.label}</p>
                            <p
                              className={[
                                "truncate",
                                active
                                  ? "text-slate-200/80"
                                  : "text-slate-500",
                              ].join(" ")}
                            >
                              {doc.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dokumenten-Vorschau – hier erzeugen wir bewusst „viel“ Inhalt, damit du Scrollen testen kannst */}
              <div className="flex-1 min-w-0">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 md:px-6 py-4 md:py-5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Vorschau
                      </p>
                      <p className="text-[14px] font-semibold text-slate-900">
                        {activeDoc.label}
                      </p>
                      <p className="text-[12px] text-slate-500">
                        {activeDoc.description}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {activeDoc.pages} Seiten
                    </p>
                  </div>

                  {/* Simulierte Seiten – wie einzelne Bilder/Frames bei ArtStation */}
                  <div className="space-y-4 md:space-y-5">
                    {Array.from({ length: activeDoc.pages }).map((_, idx) => (
                      <div
                        key={idx}
                        className="mx-auto w-full max-w-[900px] rounded-xl border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.04)] p-6 md:p-8"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                            Seite {idx + 1} · Vorschau
                          </p>
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-600">
                            {activeDoc.label}
                          </span>
                        </div>
                        <div className="h-[320px] md:h-[420px] rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                          <div className="text-center px-6">
                            <FileText className="mx-auto mb-3 h-7 w-7 text-slate-300" />
                            <p className="text-[13px] font-medium text-slate-800">
                              Dokumentseite {idx + 1}
                            </p>
                            <p className="mt-1 text-[12px] text-slate-500">
                              Hier kannst du später die echte PDF-Vorschau,
                              Positionen oder ein Canvas-Rendering der
                              Rechnungsdaten einbinden.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extra-Spacing am Ende, damit man „ausscrollen“ kann wie bei ArtStation */}
                <div className="h-20" />
              </div>
            </div>
          </div>
        </section>

        {/* Rechte Spalte: schmaler Info-Bereich mit EIGENEM Scroll-Container */}
        <aside className="w-[320px] xl:w-[360px] bg-slate-50">
          {/* Eigenständiger Scroll-Container, unabhängig von der linken Spalte */}
          <div className="h-full overflow-y-auto border-l border-slate-200 px-5 py-5 space-y-6">
            {/* Kopfbereich: Infos zur Rechnung */}
            <section className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Rechnung
              </p>
              <div>
                <h2 className="text-[16px] font-semibold text-slate-900 leading-snug">
                  Zusammenfassung &amp; Kontext
                </h2>
                <p className="mt-1 text-[12px] text-slate-600">
                  Hier bündelst du alle Metadaten zu dieser Rechnung – Status,
                  Beträge, Projekt, Kontakt und Wirkung.
                </p>
              </div>
            </section>

            {/* Kennzahlen / Beträge (statisch als Platzhalter) */}
            <section className="space-y-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-500">Status</span>
                <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                  Bezahlt
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-500">Betrag</span>
                <span className="text-[14px] font-semibold text-slate-900">
                  12.480,00&nbsp;€
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-500">
                  Anteil Wirkungsfonds
                </span>
                <span className="text-[13px] font-medium text-slate-900">
                  1.248,00&nbsp;€
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-500">
                  Projektbezeichnung
                </span>
                <span className="text-[12px] font-medium text-slate-900">
                  Musterprojekt Küche &amp; Wohnen
                </span>
              </div>
            </section>

            {/* Beschreibung / Erklärung – das kann später dynamisch werden */}
            <section className="space-y-2">
              <h3 className="text-[13px] font-semibold text-slate-900">
                Beschreibung
              </h3>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Diese Rechnung fasst ein Gesamtprojekt aus Planung, Material und
                Handwerk zusammen. In der linken Spalte kannst du jede
                Dokumentenansicht einzeln durchscrollen – ähnlich wie bei
                Projekt-Assets auf ArtStation.
              </p>
            </section>

            {/* Platzhalter für Tags, Notizen usw. */}
            <section className="space-y-3">
              <div>
                <h4 className="text-[13px] font-semibold text-slate-900">
                  Schlagworte
                </h4>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {["Innenarchitektur", "Küche", "Wirkungsfonds", "Transparenz"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-700"
                      >
                        #{tag}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <h4 className="text-[13px] font-semibold text-slate-900">
                  Interne Notiz
                </h4>
                <p className="mt-1 text-[12px] text-slate-600 leading-relaxed">
                  Hier kannst du später interne Kommentare, Klärungen mit dem
                  Kunden oder Links zu Projekt-Dateien ablegen.
                </p>
              </div>
            </section>

            {/* Extra-Spacing, damit der rechte Scrollbereich sich „voll“ anfühlt */}
            <div className="h-10" />
          </div>
        </aside>
      </div>
    </div>
  );
}
