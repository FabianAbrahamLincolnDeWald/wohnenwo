import * as React from "react";
import type { Metadata } from "next";
import Sektor3_Wohnerlebnisse from "@/components/sektionen/Sektor3_Wohnerlebnisse";

export const metadata: Metadata = {
  title: "Experten-Netzwerk – WohnenWo",
  description:
    "Architektur, Handwerk, Licht und Montage in einem kuratierten Netzwerk – transparent, präzise, verlässlich.",
};

export default function ExpertenNetzwerkPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white text-slate-900 antialiased">
      {/* Start mit dem bestehenden Sektor 3 */}
      <section id="wohnerlebnisse">
        <Sektor3_Wohnerlebnisse />
      </section>

      {/* Intro + CTA bleiben wie zuvor – hier gekürzt */}
      <section id="netzwerk-intro" className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 py-16 sm:py-24">
          <p className="text-sm tracking-tight text-slate-500">Gemeinsam wirken</p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Experten-Netzwerk
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
            Unser kuratiertes Netzwerk verbindet Planung, Material, Licht und Montage.
            Klar in den Rollen, offen in der Kommunikation, sauber in der Ausführung.
          </p>
        </div>
      </section>

      <section id="cta" className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 py-16 sm:py-24">
          <div className="rounded-3xl border border-slate-200 p-8 sm:p-10 lg:p-12 bg-white">
            <div className="md:flex md:items-center md:justify-between md:gap-8">
              <div className="md:max-w-2xl">
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">
                  Teil des Netzwerks werden?
                </h3>
                <p className="mt-2 text-slate-600">
                  Schreib kurz, welche Expertise du einbringst – wir melden uns.
                </p>
              </div>
              <div className="mt-6 md:mt-0 flex gap-3">
                <a
                  href="/kontakt"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 active:scale-[0.99]"
                >
                  Kontakt aufnehmen
                </a>
                <a
                  href="mailto:hallo@wohnenwo.de"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 backdrop-blur px-5 py-2.5 text-sm font-medium hover:bg-white hover:shadow-md active:scale-[0.99]"
                >
                  E-Mail senden
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
