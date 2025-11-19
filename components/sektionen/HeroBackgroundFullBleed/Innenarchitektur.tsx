"use client";

import * as React from "react";

const HERO =
  "https://images.unsplash.com/photo-1613914153139-79eafdf15d23?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=4058";

/**
 * HeroBackgroundFullBleed
 * - Vollflächiges Hero-Bild
 * - Blend-in nach Weiß am unteren Rand
 * - Leerer Slot für späteren Hero-Content
 */
export default function HeroBackgroundFullBleed() {
  return (
    <section id="hero" className="relative min-h-[72vh] md:min-h-[84vh]">
      {/* Hintergrundbild */}
      <div
        className="absolute inset-0 bg-center bg-cover md:bg-[center_top]"
        style={{ backgroundImage: `url(${HERO})` }}
      />

      {/* Übergang nach reinem Weiß */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 md:h-64 bg-gradient-to-b from-transparent to-white" />

      {/* Slot für Inhalt */}
      <div className="relative mx-auto max-w-6xl h-full px-4 md:px-6" />
    </section>
  );
}
