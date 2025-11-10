"use client";

import * as React from "react";

/**
 * ScrollTextStack – zeilenweiser Reveal (grau → schwarz), 3 Absätze
 * - Drei separate <p>-Absätze (grau + schwarz je Absatz übereinander)
 * - Mobile Fix: KEIN Abschalten bei prefers-reduced-motion → Animation läuft auch auf iOS/Android
 * - Kein Flash of Black beim Hydratisieren
 * - Abstände/Typo identisch zu deiner Version
 */
export default function SektorX_ScrollTextStack() {
  // === 3 Absätze statt ein String ===
  const PARAS = [
    "Werde Teil einer Wirtschaft, die Menschen stärkt und Märkte fördert. Wir gestalten Räume, die mitdenken, entwickeln Prozesse, die Sinn ergeben, und schaffen Begegnungen, die auf Vertrauen bauen.",
    "Hier fallen Entscheidungen leicht, bleiben Absichten klar und Gespräche ehrlich.",
  ];

  // Tuning (wie bei dir)
  const MID = 0.8;
  const START_OFFSET_PX = 80;
  const FADE_RANGE_PX = 80;

  // Tokenisierung pro Absatz
  const tokensPerPara = React.useMemo(() => PARAS.map(p => p.split(/(\s+)/)), [PARAS]);

  // Flache Wortliste über alle Absätze (Index-Mapping)
  type WordPtr = { paraIdx: number; tokenIdx: number; globalWordIdx: number };
  const wordPtrs = React.useMemo<WordPtr[]>(() => {
    const out: WordPtr[] = [];
    let g = 0;
    tokensPerPara.forEach((tokens, pi) => {
      tokens.forEach((t, ti) => {
        if (/\S/.test(t)) {
          out.push({ paraIdx: pi, tokenIdx: ti, globalWordIdx: g++ });
        }
      });
    });
    return out;
  }, [tokensPerPara]);

  // Hilfslookup: (para, token) -> globalWordIdx
  const globalIndexByParaToken = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const w of wordPtrs) m.set(`${w.paraIdx}:${w.tokenIdx}`, w.globalWordIdx);
    return m;
  }, [wordPtrs]);

  // Refs & Opazitäten
  const spanRefs = React.useRef<Map<number, HTMLSpanElement>>(new Map());
  const [opacities, setOpacities] = React.useState<number[]>(
    () => new Array(wordPtrs.length).fill(0)
  );

  // Hydration-Guard: verhindert "Flash of Black"
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => { setHydrated(true); }, []);

  // Scroll-Reveal (nicht durch prefers-reduced-motion abgebrochen)
  React.useEffect(() => {
    let raf = 0;

    const measure = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;

        const vh = window.innerHeight;
        const centerY = vh * MID;
        const start = centerY + START_OFFSET_PX;
        const range = Math.max(FADE_RANGE_PX, 1);

        const next = new Array(wordPtrs.length).fill(0);
        for (let i = 0; i < wordPtrs.length; i++) {
          const el = spanRefs.current.get(i);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          // fern/nahe Kappung
          if (r.top > vh + 200) { next[i] = 0; continue; }
          if (r.bottom < -200) { next[i] = 1; continue; }
          const yMid = r.top + r.height / 2;
          const t = (start - yMid) / range;
          // smoothstep
          next[i] = t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
        }
        setOpacities(next);
      });
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    // iOS bfcache / Tab-Wechsel
    const rerun = () => measure();
    window.addEventListener("pageshow", rerun);
    document.addEventListener("visibilitychange", rerun);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      window.removeEventListener("pageshow", rerun);
      document.removeEventListener("visibilitychange", rerun);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [wordPtrs.length, MID, START_OFFSET_PX, FADE_RANGE_PX]);

  // Typo unverändert
  const txtSize = "text-[clamp(25.5px,calc(25.5px+29.5*(100vw-320px)/960),55px)]";
  const txtStyle = `${txtSize} leading-[1.08] tracking-tight font-medium`;

  // Höhe messen: Wir messen einen Wrapper, der alle schwarzen Absätze enthält
  const [contentH, setContentH] = React.useState(0);
  const contentRef = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setContentH(Math.ceil(el.getBoundingClientRect().height));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  // Hilfsrenderer für die Absätze (grau/schwarz)
  const renderPara = (tokens: string[], isBlack: boolean, paraIdx: number) => {
    return (
      <p
        className={`${txtStyle} ${isBlack ? "text-black" : "text-slate-300"} px-4 md:px-6`}
        style={isBlack && !hydrated ? { opacity: 0 } : undefined}
      >
        {tokens.map((tok, tokenIdx) => {
          if (!/\S/.test(tok)) return <span key={tokenIdx}>{tok}</span>;
          const g = globalIndexByParaToken.get(`${paraIdx}:${tokenIdx}`)!;
          const opacity = isBlack ? (opacities[g] ?? 0) : 1;
          // inline (nicht inline-block) → zeilenweiser Reveal
          return (
            <span
              key={tokenIdx}
              ref={(el) => {
                if (isBlack) {
                  if (el) spanRefs.current.set(g, el);
                  else spanRefs.current.delete(g);
                }
              }}
              style={isBlack ? { opacity } : undefined}
            >
              {tok}
            </span>
          );
        })}
      </p>
    );
  };

  return (
    <section aria-label="ScrollTextStack" className="bg-white">
      {/* Top-Spacer (wie bei dir) */}
      <div className="h-[2vh]" />

      {/* Reveal-Block */}
      <section className="relative h-auto">
        <div className="relative mx-auto max-w-6xl px-4 md:px-6">
          {/* Platzhalter exakt in Inhaltshöhe */}
          <div aria-hidden style={{ height: contentH }} />

          {/* GRAU: statisch, 3 Absätze */}
          <div className="absolute inset-x-0 top-0 space-y-4">
            {tokensPerPara.map((tokens, pi) => (
              <div key={`grey-${pi}`}>
                {renderPara(tokens, false, pi)}
              </div>
            ))}
          </div>

          {/* SCHWARZ: überlagert, 3 Absätze (animiert) */}
          <div ref={contentRef} className="absolute inset-x-0 top-0 space-y-4" aria-hidden>
            {tokensPerPara.map((tokens, pi) => (
              <div key={`black-${pi}`}>
                {renderPara(tokens, true, pi)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hintergrund unten: hell → sanftes Cyan → Weissblau (wie gehabt) */}
      <section className="relative h-[80vh] w-full select-none overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 [background:linear-gradient(to_bottom,rgb(255_255_255/1)_0%,rgb(255_255_255/1)_70%,rgb(247_252_255/1)_78%,rgb(225_246_255/0.85)_84%,rgb(185_234_255/0.65)_90%,rgb(135_222_255/0.55)_95%,rgb(225_245_255/1)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-[-4%] h-[34vh] z-0 [background:radial-gradient(60%_55%_at_50%_100%,rgb(34_211_238/0.1)_0%,rgb(34_211_238/0.06)_40%,transparent_80%)]" />

        <div className="relative z-10 grid h-full place-items-center">
          <div className="text-center px-6">
            <p className="text-xs md:text-sm uppercase tracking-widest text-slate-400">
              Scrolle weiter für ein völlig neues
            </p>
            <h1 className="mt-2 md:mt-3 text-lg md:text-2xl font-medium text-slate-700">
               Gefühl wirtschaftlicher Kooperation
            </h1>
          </div>
        </div>
      </section>
    </section>
  );
}
