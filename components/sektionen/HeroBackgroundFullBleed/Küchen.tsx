"use client";

import * as React from "react";

const VIDEO_SRC =
  "https://cdn.siematic.com/site/assets/files/315793/240919_siematic_loop_3_16zu9_hd_stoerer_unten-compressed.mp4";

/**
 * HeroBackgroundFullBleed
 * - Vollflächiges Hero-Video
 * - Blend-in nach Weiß am unteren Rand
 * - Leerer Slot für späteren Hero-Content
 */
export default function HeroBackgroundFullBleed() {
  return (
    <section
      id="hero"
      className="relative min-h-[72vh] md:min-h-[84vh] overflow-hidden"
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

      {/* Übergang nach reinem Weiß */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 md:h-64 bg-gradient-to-b from-transparent to-white" />

      {/* Attribution-Badge – Glass-Look über dem Video/Gradient */}
      <div className="pointer-events-auto absolute right-4 top-4 sm:right-8 sm:top-6 max-w-[70%] z-10">
        <a
          href="https://www.siematic.com/de/"
          target="_blank"
          rel="noreferrer"
          className="relative inline-flex items-center rounded-full px-3 py-1.5 text-[11px] leading-snug"
        >
          {/* einfacher Glass-Look */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-white/18 backdrop-blur-sm border border-white/60 shadow-[0_4px_16px_rgba(15,23,42,0.45)]"
          />
          <span className="relative inline-block truncate text-slate-900">
            Videoausschnitt mit freundlicher Genehmigung von SieMatic.
          </span>
        </a>
      </div>

      {/* Slot für Inhalt */}
      <div className="relative mx-auto max-w-6xl h-full px-4 md:px-6" />
    </section>
  );
}
