"use client";

import * as React from "react";

export default function Sektor1_EinladungZusammenarbeit() {
  return (
    <section className="relative overflow-hidden bg-white text-slate-900">
      {/* Dezenter Boden-Gradient */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_66%,rgb(0_0_0/0.03)_77%,rgb(0_0_0/0.09)_99%)] pointer-events-none"
        aria-hidden
      />

      {/* max-w-6xl statt 5xl → Desktop dreizeilig */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-[132px] pb-[66px] sm:pt-28 sm:pb-20 md:pt-32 md:pb-24 text-center">
        <h1 className="font-semibold tracking-tight leading-[1.02] text-[40px] sm:text-[56px] md:text-[80px] lg:text-[96px]">
          <span className="block">Sei Gast</span>
          <span className="block">einer neuen Art,</span>
          <span className="block">
            {"zusammen"}
            <span className="relative inline-block align-baseline">
              <span className="bg-[linear-gradient(175deg,rgba(51,65,85,1)_0%,rgba(51,65,85,1)_12%,rgba(251,191,36,1)_58%,rgba(253,224,71,1)_100%)] bg-clip-text text-transparent">
                zu
              </span>
              <span
                aria-hidden
                className="absolute left-0 right-0 bottom-0 translate-y-[0.16em] md:translate-y-[0.14em] h-[0.14em] sm:h-[0.15em] md:h-[0.13em] bg-yellow-400"
              />
            </span>
            {"arbeiten."}
          </span>
        </h1>

        <p className="mt-8 text-[18px] sm:text-[20px] md:text-[22px] font-semibold text-slate-700 mx-auto md:max-w-[56ch] lg:max-w-[58ch] leading-[1.35] md:leading-[1.18]">
          Hier trifft Gestaltung auf Handwerk, und Unternehmer auf Kunde, um
          gemeinsam zu handeln und zu wirken – ehrlich, offen, menschlich und
          sinnstiftend. Jeder hat volle Einsicht in Zahlen, Systeme, Absichten
          und Strukturen. Ein wirtschaftlicher Raum, in dem du dich vertraut
          fühlst – und in dem das, was dir wichtig ist, sichtbar wird.
        </p>
      </div>
    </section>
  );
}
