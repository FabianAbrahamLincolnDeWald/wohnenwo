"use client";

import * as React from "react";

const VIDEO_SRC =
  "https://cdn.siematic.com/site/assets/files/315973/240529_siematic_loop_16zu9_hd_no_siematic.mp4";

/**
 * HeroBackgroundFullBleedKuechen / Erlebnisse
 * - Vollflächiges Hero-Video (Siematic)
 * - Blend-in nach Schwarz am unteren Rand
 * - Attribution-Badge oben rechts im Glass-Look
 * - Höhe = 100vh (Viewport)
 */
export default function HeroBackgroundFullBleedKuechen() {
  return (
    <section
      id="hero"
      className="relative h-screen overflow-hidden" // statt min-h-[72vh] / md:min-h-[84vh]
    >
      {/* Hintergrundvideo */}
      <video
        className="absolute inset-0 h-full w-full object-cover md:object-[center_top]"
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Übergang nach Schwarz (statt Weiß) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 md:h-64 bg-gradient-to-b from-transparent to-black" />

      {/* Attribution-Badge – Glass-Look, rechts unterhalb der Navbar */}
      <div className="pointer-events-auto absolute right-4 top-20 sm:right-8 sm:top-24 max-w-[70%] z-10">
        <a
          href="https://www.siematic.com/de/"
          target="_blank"
          rel="noreferrer"
          className="relative inline-flex items-center rounded-full px-2 py-1 text-xs leading-snug"
        >
          {/* einfacher Glass-Look (angelehnt an dein Panel) */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-white/18 backdrop-blur-sm shadow-[0_4px_16px_rgba(15,23,42,0.45)]"
          />
          <span className="relative inline-block truncate text-black">
            Videoausschnitt von SieMatic.
          </span>
        </a>
      </div>

      {/* Slot für weiteren Hero-Content (falls später nötig) */}
      <div className="relative mx-auto max-w-6xl h-full px-4 md:px-6" />
    </section>
  );
}
