"use client";

import * as React from "react";
import ErlebnisseNavbar from "@/components/navigation/ErlebnisseNavbar";
import HeroBackgroundFullBleedErlebnisse from "@/components/sektionen/HeroBackgroundFullBleed/Erlebnisse";
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

export default function ErlebnissePage() {
  return (
    <main className="relative min-h-screen bg-black text-slate-900 antialiased">
      <ErlebnisseNavbar />
      <DottedGridBackground />

      {/* 1. Hero-Hintergrund */}
      <HeroBackgroundFullBleedErlebnisse />

      {/* 2. Apple-Style Glass-Panel */}
      <GlassPanel />
    </main>
  );
}
