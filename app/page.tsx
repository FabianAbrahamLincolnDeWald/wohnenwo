"use client";

import * as React from "react";
import Sektor1_EinladungZusammenarbeit from "@/components/sektionen/Sektor1_EinladungZusammenarbeit";
import Sektor2_TransparenteKommunikation from "@/components/sektionen/Sektor2_TransparenteKommunikation";
import Sektor3_Wohnerlebnisse from "@/components/sektionen/Sektor3_Wohnerlebnisse";

export default function Startseite() {
  return (
    <main className="flex flex-col min-h-screen bg-white text-slate-900 antialiased">
      <section id="einladung">
        <Sektor1_EinladungZusammenarbeit />
      </section>
      <section id="kommunikation" className="border-t border-slate-100">
        <Sektor2_TransparenteKommunikation />
      </section>
      <section id="wohnerlebnisse" className="border-t border-slate-100">
        <Sektor3_Wohnerlebnisse />
      </section>
    </main>
  );
}
