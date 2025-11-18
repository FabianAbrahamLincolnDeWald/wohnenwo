"use client";

import * as React from "react";
import WohnenWoNavbar from "@/components/navigation/WohnenWoNavbar";
import Sektor1_EinladungZusammenarbeit from "@/components/sektionen/Sektor1_EinladungZusammenarbeit";
import Sektor2_TransparenteKommunikation from "@/components/sektionen/Sektor2_TransparenteKommunikation";
import SektorX_ScrollTextStack from "@/components/sektionen/SektorX_ScrollTextStack";
import HeroTopIsolated from "@/components/sektionen/HeroTopIsolated";
import OneBannerIsolated from "@/components/sektionen/OneBannerIsolated";
import Sektor3_Wohnerlebnisse from "@/components/sektionen/Sektor3_Wohnerlebnisse";

export default function Startseite() {
  return (
    <main className="flex flex-col min-h-screen bg-white text-slate-900 antialiased">
      <WohnenWoNavbar />
      <section id="einladung">
        <Sektor1_EinladungZusammenarbeit />
      </section>

      <section id="kommunikation">
        <Sektor2_TransparenteKommunikation />
      </section>

      <section id="scrolltext">
        <SektorX_ScrollTextStack />
      </section>

      <section id="hero-top">
        <HeroTopIsolated />
      </section>

      <section id="transparenz-banner">
        <OneBannerIsolated />
      </section>

      <section id="wohnerlebnisse">
        <Sektor3_Wohnerlebnisse />
      </section>
    </main>
  );
}
