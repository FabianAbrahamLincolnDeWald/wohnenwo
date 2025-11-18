"use client";

import * as React from "react";
import HeroSection from "@/components/sektionen/HeroSection";
import PanelImageSection from "@/components/sektionen/PanelImageSection";
import InterstitialTextSection from "@/components/sektionen/InterstitialTextSection";
import FundamentKarten from "@/components/sektionen/FundamentKarten";

export default function HeroShell() {
  return (
    <main className="relative min-h-screen bg-white text-slate-900 antialiased">
      <HeroSection />
      <PanelImageSection />
      <InterstitialTextSection />
      <FundamentKarten />
    </main>
  );
}
