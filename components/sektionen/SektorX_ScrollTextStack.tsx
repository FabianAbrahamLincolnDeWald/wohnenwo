"use client";

import * as React from "react";

/**
 * ScrollTextStack – oben: zeilenweiser Reveal (grau → schwarz), 2 Absätze
 * Unten (Bridge): zwei Zeilen mit derselben Reveal-Logik
 *  - Zeile 1: grau → schwarz
 *  - Zeile 2: grau → cyan
 */
export default function SektorX_ScrollTextStack() {
  // === OBERER SCROLLTEXT (unverändert, 2 Absätze) ===
  const PARAS = [
    "Werde Teil einer Wirtschaft, die Menschen stärkt und Märkte fördert. Wir gestalten Räume, die mitdenken, entwickeln Prozesse, die Sinn ergeben, und schaffen Begegnungen, die auf Vertrauen bauen.",
    "Hier fallen Entscheidungen leicht, bleiben Absichten klar und Gespräche ehrlich.",
  ];
  const PARA_GAP = "space-y-6 md:space-y-8 lg:space-y-10";

  // Reveal-Tuning (wie bei dir)
  const MID = 0.8;
  const START_OFFSET_PX = 80;
  const FADE_RANGE_PX = 80;

  // Tokenisierung pro Absatz
  const tokensPerPara = React.useMemo(() => PARAS.map((p) => p.split(/(\s+)/)), [PARAS]);

  // Flache Wortliste über alle Absätze (Index-Mapping)
  type WordPtr = { paraIdx: number; tokenIdx: number; globalWordIdx: number };
  const wordPtrs = React.useMemo<WordPtr[]>(() => {
    const out: WordPtr[] = [];
    let g = 0;
    tokensPerPara.forEach((tokens, pi) => {
      tokens.forEach((t, ti) => {
        if (/\S/.test(t)) out.push({ paraIdx: pi, tokenIdx: ti, globalWordIdx: g++ });
      });
    });
    return out;
  }, [tokensPerPara]);

  // Lookup: (para, token) -> globalWordIdx
  const globalIndexByParaToken = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const w of wordPtrs) m.set(`${w.paraIdx}:${w.tokenIdx}`, w.globalWordIdx);
    return m;
  }, [wordPtrs]);

  // Refs & Opazitäten (schwarzer Layer)
  const spanRefs = React.useRef<Map<number, HTMLSpanElement>>(new Map());
  const [opacities, setOpacities] = React.useState<number[]>(
    () => new Array(wordPtrs.length).fill(0)
  );

  // Hydration-Guard
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => { setHydrated(true); }, []);

  // Zeilenweiser Scroll-Reveal (oben)
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
          if (r.top > vh + 200) { next[i] = 0; continue; }
          if (r.bottom < -200) { next[i] = 1; continue; }
          const yMid = r.top + r.height / 2;
          const t = (start - yMid) / range;
          next[i] = t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t); // smoothstep
        }
        setOpacities(next);
      });
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
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

  // Typo oben
  const txtSize = "text-[clamp(25.5px,calc(25.5px+29.5*(100vw-320px)/960),55px)]";
  const txtStyle = `${txtSize} leading-[1.08] tracking-tight font-medium`;

  // Höhe messen (schwarzer Block inkl. Paragraph-Gaps)
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

  // Absatzrenderer (grau/schwarz)
  const renderPara = (tokens: string[], isBlack: boolean, paraIdx: number) => (
    <p
      className={`${txtStyle} ${isBlack ? "text-black" : "text-slate-300"} px-4 md:px-6`}
      style={isBlack && !hydrated ? { opacity: 0 } : undefined}
    >
      {tokens.map((tok, tokenIdx) => {
        if (!/\S/.test(tok)) return <span key={tokenIdx}>{tok}</span>;
        const g = globalIndexByParaToken.get(`${paraIdx}:${tokenIdx}`)!;
        const opacity = isBlack ? opacities[g] ?? 0 : 1;
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

  return (
    <section aria-label="ScrollTextStack" className="bg-white">
      {/* Top-Spacer */}
      <div className="h-[2vh]" />

      {/* OBERER REVEAL-BLOCK */}
      <section className="relative h-auto">
        <div className="relative mx-auto max-w-6xl px-4 md:px-6">
          {/* Platzhalter exakt in Inhaltshöhe */}
          <div aria-hidden style={{ height: contentH }} />

          {/* GRAU (statisch) */}
          <div className={`absolute inset-x-0 top-0 ${PARA_GAP}`}>
            {tokensPerPara.map((tokens, pi) => (
              <div key={`grey-${pi}`}>{renderPara(tokens, false, pi)}</div>
            ))}
          </div>

          {/* SCHWARZ (animiert) */}
          <div ref={contentRef} className={`absolute inset-x-0 top-0 ${PARA_GAP}`} aria-hidden>
            {tokensPerPara.map((tokens, pi) => (
              <div key={`black-${pi}`}>{renderPara(tokens, true, pi)}</div>
            ))}
          </div>
        </div>
      </section>

      {/* UNTERER ÜBERGANG: zwei Zeilen mit derselben Reveal-Logik */}
      <BridgeTwoLineReveal />
    </section>
  );
}

/** Unterer Sektor: zwei Zeilen, gleicher Reveal wie oben
 *  - Zeile 1: "Gemeinsam für ein völlig neues"  (grau → schwarz)
 *  - Zeile 2: "Gefühl wirtschaftlicher Kooperation." (grau → cyan)
 *  Höhe wie in deinem Code: h-[30vh] md:h-[50vh]
 */
function BridgeTwoLineReveal() {
  const LINE1 = "Gemeinsam für ein völlig neues";
  const LINE2 = "Gefühl wirtschaftlicher Kooperation.";

  // Reveal-Tuning (gleich wie oben)
  const MID = 0.8;
  const START_OFFSET_PX = 80;
  const FADE_RANGE_PX = 80;

  // Tokenisierung
  const tokens1 = React.useMemo(() => LINE1.split(/(\s+)/), [LINE1]);
  const tokens2 = React.useMemo(() => LINE2.split(/(\s+)/), [LINE2]);

  // Wort-Indizes (erst L1, dann L2)
  const wordPtrs = React.useMemo(() => {
    const out: { line: 1 | 2; tokenIdx: number; globalWordIdx: number }[] = [];
    let g = 0;
    tokens1.forEach((t, i) => { if (/\S/.test(t)) out.push({ line: 1, tokenIdx: i, globalWordIdx: g++ }); });
    tokens2.forEach((t, i) => { if (/\S/.test(t)) out.push({ line: 2, tokenIdx: i, globalWordIdx: g++ }); });
    return out;
  }, [tokens1, tokens2]);

  // Lookup (line, tokenIdx) -> globalWordIdx
  const idxMap = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const w of wordPtrs) m.set(`${w.line}:${w.tokenIdx}`, w.globalWordIdx);
    return m;
  }, [wordPtrs]);

  // Refs & Opazitäten (animierter Farb-Layer)
  const spanRefs = React.useRef<Map<number, HTMLSpanElement>>(new Map());
  const [opac, setOpac] = React.useState<number[]>(() => new Array(wordPtrs.length).fill(0));

  // Hydration-Guard
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => { setHydrated(true); }, []);

  // Reveal (wie oben)
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
          if (r.top > vh + 200) { next[i] = 0; continue; }
          if (r.bottom < -200) { next[i] = 1; continue; }
          const yMid = r.top + r.height / 2;
          const t = (start - yMid) / range;
          next[i] = t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
        }
        setOpac(next);
      });
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
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

  // Höhe messen des farbigen (animierten) Blocks → Platzhalter bekommt exakte Höhe
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [contentH, setContentH] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setContentH(Math.ceil(el.getBoundingClientRect().height));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  // Typo-Klassen (identisch für Grau/Farbe pro Zeile) — keine Default-Margins
  const line1Classes = "m-0 text-xs md:text-2xl uppercase tracking-widest";
  const line2Classes = "m-0 mt-2 md:mt-3 text-lg md:text-6xl font-medium";

  return (
    <section className="relative h-[30vh] md:h-[60vh] w-full select-none overflow-hidden">
      {/* Hintergrund */}
      <div className="pointer-events-none absolute inset-0 z-0 [background:linear-gradient(to_bottom,rgb(255_255_255/1)_0%,rgb(255_255_255/1)_70%,rgb(247_252_255/1)_78%,rgb(225_246_255/0.85)_84%,rgb(185_234_255/0.65)_90%,rgb(135_222_255/0.55)_95%,rgb(225_245_255/1)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-[-4%] h-[34vh] z-0 [background:radial-gradient(60%_55%_at_50%_100%,rgb(34_211_238/0.1)_0%,rgb(34_211_238/0.06)_40%,transparent_80%)]" />

      <div className="relative z-10 grid h-full place-items-center">
        <div className="relative w-full max-w-none text-center">
          {/* Platzhalter in exakter Höhe */}
          <div aria-hidden style={{ height: contentH }} />

          {/* GRAU-Layer (statisch), absolut über dem Platzhalter */}
          <div className="absolute inset-x-0 top-0 px-6">
            <p className={`${line1Classes} text-slate-300`}>{tokens1.join("")}</p>
            <p className={`${line2Classes} text-slate-300`}>{tokens2.join("")}</p>
          </div>

          {/* FARBE-Layer (animiert), absolut deckungsgleich */}
          <div ref={contentRef} className="absolute inset-x-0 top-0 px-6" aria-hidden>
            {/* Zeile 1: grau → schwarz */}
            <p className={`${line1Classes} text-black`}>
              {tokens1.map((tok, tokenIdx) => {
                if (!/\S/.test(tok)) return <span key={`l1w${tokenIdx}`}>{tok}</span>;
                const g = idxMap.get(`1:${tokenIdx}`)!;
                return (
                  <span
                    key={`l1w${tokenIdx}`}
                    ref={(el) => {
                      if (el) spanRefs.current.set(g, el);
                      else spanRefs.current.delete(g);
                    }}
                    style={{ opacity: opac[g] ?? 0 }}
                  >
                    {tok}
                  </span>
                );
              })}
            </p>

            {/* Zeile 2: grau → cyan */}
            <p className={`${line2Classes} text-cyan-400`}>
              {tokens2.map((tok, tokenIdx) => {
                if (!/\S/.test(tok)) return <span key={`l2w${tokenIdx}`}>{tok}</span>;
                const g = idxMap.get(`2:${tokenIdx}`)!;
                return (
                  <span
                    key={`l2w${tokenIdx}`}
                    ref={(el) => {
                      if (el) spanRefs.current.set(g, el);
                      else spanRefs.current.delete(g);
                    }}
                    style={{ opacity: opac[g] ?? 0 }}
                  >
                    {tok}
                  </span>
                );
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
