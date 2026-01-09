"use client";

import * as React from "react";
import WohnenWoOrbitNavbar from "@/components/navigation/WohnenWoOrbitNavbar";
import TransformHero from "@/components/sektionen/transform-hero/TransformHero";
import HeroSection from "@/components/sektionen/HeroSection";
import PanelImageSection from "@/components/sektionen/PanelImageSection";
import InterstitialTextSection from "@/components/sektionen/InterstitialTextSection";
import FundamentKarten from "@/components/sektionen/FundamentKarten";

export default function HeroShell() {
  return (
    <main className="relative min-h-screen bg-white text-slate-900 antialiased">
      <WohnenWoOrbitNavbar />

      <TransformHero
        title={
          <>Willkommen in einer neuen Ära wirtschaftlicher Zusammenarbeit
          </>
        }
        description={
          <>
            Hier trifft Gestaltung auf Handwerk, und Unternehmer auf Kunde, um
            gemeinsam zu handeln und zu wirken – ehrlich, offen, menschlich und
            sinnstiftend. Jeder hat volle Einsicht in Zahlen, Systeme, Absichten
            und Strukturen. Ein wirtschaftlicher Raum, in dem du dich vertraut
            fühlst – und in dem das, was dir wichtig ist, sichtbar wird.
          </>
        }
      />
      <HeroSection />
      <PanelImageSection />
      <InterstitialTextSection />
      <FundamentKarten />
    </main>
  );
}
