import * as React from "react";

export default function InterstitialTextSection() {
  return (
    <section
      aria-label="interstitial-text"
      className="relative bg-white mt-10 md:mt-12"
    >
      {/* Container: max-w-6xl */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-12 gap-6 items-end py-8 md:py-10">
          {/* Links: kleines gestapeltes Label */}
          <div className="md:col-span-2 self-end mb-4 md:mb-0">
            <p className="text-[11px] leading-tight tracking-[0.2em] text-slate-600 uppercase">
              Exklusiv
              <br />
              Wertsteigernd
              <br />
              Visionär
            </p>
          </div>

          {/* Mitte: Headline */}
          <div className="md:col-span-9 md:col-start-1 relative z-10">
            <h2
              className="font-medium tracking-tight text-slate-900
                         text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.97]"
            >
              Wir gestalten Räume, die erinnern, wer wir wirklich sind.
            </h2>
          </div>

          {/* Rechts: Beschreibung + CTA */}
          <div className="md:col-span-3 md:justify-self-end">
            <p className="text-sm md:text-base text-slate-600 max-w-xs">
              Erkunde die symbiotische Wirkung einer transparenten
              Wirtschaftskultur und einzigartiger Architektur.
            </p>
            <div className="mt-4">
              <button className="inline-flex items-center gap-3 rounded-full bg-black text-white px-5 py-2 text-sm md:text-base shadow-md hover:shadow-lg active:scale-[0.98]">
                <span>All catalog</span>
                <span className="inline-block h-2 w-2 rounded-full bg-white/80" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
