"use client";

import * as React from "react";
import WohnenWoDesignEntstehtNavBar from "@/components/navigation/WohnenWoDesignEntstehtNavBar";
import HeroBackgroundFullBleedKuechen from "@/components/sektionen/HeroBackgroundFullBleed/Kuechen";
import GlassPanel from "@/components/sektionen/GlassPanel";

function DottedGridBackground() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="dottedGrid"
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.15)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dottedGrid)" />
    </svg>
  );
}

export default function KuechenPage() {
  return (
    <main className="relative min-h-screen bg-white text-slate-900 antialiased">
      <WohnenWoDesignEntstehtNavBar />
      <DottedGridBackground />

      {/* 1. Hero-Hintergrund */}
      <HeroBackgroundFullBleedKuechen />

      {/* 2. Apple-Style Glass-Panel */}
      <GlassPanel />
    </main>
  );
}
