"use client";

import * as React from "react";

/**
 * SektorX_ScrollTextStack – Scrolltext + Übergang (grau → cyan, statisch)
 * - Oberer Block: zeilenweiser Reveal (grau → schwarz) – unverändert.
 * - Unterer Übergang: graue Basis + deckungsgleiches Overlay in statischem Cyan,
 *   Wort-für-Wort-Opacity (ohne Gradients / bg-clip-text).
 * - Cyan-Glow: responsive Höhe (mobil = 1/2 der Desktop-Höhe).
 */
export default function SektorX_ScrollTextStack() {
  // --- OBERER SCROLLTEXT ---
  const PARAS = [
    "Werde Teil einer Wirtschaft, die Menschen stärkt und Märkte fördert. Wir gestalten Räume, die mitdenken, entwickeln Prozesse, die Sinn ergeben, und schaffen Begegnungen, die auf Vertrauen bauen.",
    "Hier fallen Entscheidungen leicht, bleiben Absichten klar und Gespräche ehrlich.",
  ];
  const PARA_GAP = "space-y-6 md:space-y-8 lg:space-y-10";

  const MID = 0.8;
  const START_OFFSET_PX = 80;
  const FADE_RANGE_PX = 80;

  const tokensPerPara = React.useMemo(() => PARAS.map((p) => p.split(/(\s+)/)), [PARAS]);

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

  const globalIndexByParaToken = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const w of wordPtrs) m.set(`${w.paraIdx}:${w.tokenIdx}`, w.globalWordIdx);
    return m;
  }, [wordPtrs]);

  const spanRefs = React.useRef<Map<number, HTMLSpanElement>>(new Map());
  const [opacities, setOpacities] = React.useState<number[]>(
    () => new Array(wordPtrs.length).fill(0)
  );

  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

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
  }, [wordPtrs.length]);

  const txtSize = "text-[clamp(25.5px,calc(25.5px+29.5*(100vw-320px)/960),55px)]";
  const txtStyle = `${txtSize} leading-[1.08] tracking-tight font-medium`;

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

  const renderPara = (tokens: string[], isBlack: boolean, paraIdx: number) => {
    const cls = (isBlack ? "text-black " : "text-slate-300 ") + txtStyle + " m-0 px-4 md:px-6";
    return (
      <p className={cls} style={isBlack && !hydrated ? { opacity: 0 } : undefined}>
        {tokens.map((tok, tokenIdx) => {
          if (!/\S/.test(tok)) return <span key={tokenIdx}>{tok}</span>;
          const g = globalIndexByParaToken.get(`${paraIdx}:${tokenIdx}`)!;
          const opacity = isBlack ? (opacities[g] ?? 0) : 1;
          return (
            <span
              key={tokenIdx}
              ref={(el) => {
                if (isBlack) {
                  if (el) spanRefs.current.set(g, el);
                  else spanRefs.current.delete(g);
                }
              }}
              className="align-baseline will-change-[opacity] transition-opacity duration-300 ease-out"
              style={{ opacity }}
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
      <div className="h-[2vh]" />

      {/* OBERER REVEAL-BLOCK */}
      <section className="relative h-auto">
        <div className="relative mx-auto max-w-6xl px-4 md:px-6">
          <div aria-hidden style={{ height: contentH }} />
          <div className={`absolute inset-x-0 top-0 ${PARA_GAP}`}>
            {tokensPerPara.map((tokens, pi) => (
              <div key={"grey-" + pi}>{renderPara(tokens, false, pi)}</div>
            ))}
          </div>
          <div ref={contentRef} className={`absolute inset-x-0 top-0 ${PARA_GAP}`} aria-hidden>
            {tokensPerPara.map((tokens, pi) => (
              <div key={"black-" + pi}>{renderPara(tokens, true, pi)}</div>
            ))}
          </div>
        </div>
      </section>

      {/* UNTERER ÜBERGANG */}
      <BridgeSingleParagraph txtStyle={txtStyle} />
    </section>
  );
}

/** Unterer Übergang: Cyan-Glow mobil halb so hoch wie Desktop */
function BridgeSingleParagraph({ txtStyle }: { txtStyle: string }) {
  const LINE = "Gemeinsam gestalten wir ein völlig neues Gefühl wirtschaftlicher Kooperation.";
  const CYAN_CLASS = "text-cyan-500";

  const MID = 0.8;
  const START_OFFSET_PX = 72;
  const FADE_RANGE_PX = 120;

  const tokens = React.useMemo(() => LINE.split(/(\s+)/), [LINE]);
  const wordIdxs = React.useMemo(() => {
    const out: number[] = [];
    tokens.forEach((t, i) => { if (/\S/.test(t)) out.push(i); });
    return out;
  }, [tokens]);
  const tokenToWord = React.useMemo(() => {
    const m = new Map<number, number>();
    wordIdxs.forEach((ti, wi) => m.set(ti, wi));
    return m;
  }, [wordIdxs]);

  const spanRefs = React.useRef<Map<number, HTMLSpanElement>>(new Map());
  const [opac, setOpac] = React.useState<number[]>(() => new Array(wordIdxs.length).fill(0));
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

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
        const next = new Array(wordIdxs.length).fill(0);
        for (let wi = 0; wi < wordIdxs.length; wi++) {
          const el = spanRefs.current.get(wi);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          if (r.top > vh + 200) { next[wi] = 0; continue; }
          if (r.bottom < -200) { next[wi] = 1; continue; }
          const yMid = r.top + r.height / 2;
          const t = (start - yMid) / range;
          next[wi] = t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
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
  }, [wordIdxs.length]);

  return (
    <section className="relative w-full">
      {/* A: Top-Wash */}
      <div
        className="absolute inset-0 z-0"
        style={{
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(247,252,255,1) 58%, rgba(196,241,255,0.92) 74%, rgba(170,236,255,0.86) 82%, rgba(225,245,255,1) 100%)",
        }}
      />

      {/* B: großer Cyan-Glow von unten – mobil halb so hoch */}
      <div
        className="absolute inset-x-0 bottom-0 z-0 h-[26vh] md:h-[52vh]"
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(72% 60% at 50% 100%, rgba(34,211,238,0.42) 0%, rgba(34,211,238,0.28) 45%, rgba(34,211,238,0) 82%)",
        }}
      />

      {/* C: Core-Spot – mobil halb so hoch */}
      <div
        className="absolute inset-x-0 bottom-0 z-0 h-[15vh] md:h-[30vh]"
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(42% 36% at 50% 100%, rgba(14,165,233,0.40) 0%, rgba(14,165,233,0.24) 48%, rgba(14,165,233,0) 80%)",
        }}
      />

      {/* INHALT */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <div className="h-6 md:h-8" />

        <div className="relative">
          <p className={`${txtStyle} text-slate-300 m-0`}>{
            LINE
          }</p>

          <p aria-hidden className={`${txtStyle} m-0 absolute inset-0 top-0 z-10 ${CYAN_CLASS}`}>
            {tokens.map((tok, ti) => {
              if (!/\S/.test(tok)) return <span key={ti}>{tok}</span>;
              const wi = tokenToWord.get(ti)!;
              const o = opac[wi] ?? 0;
              return (
                <span
                  key={ti}
                  ref={(el) => {
                    if (el) spanRefs.current.set(wi, el);
                    else spanRefs.current.delete(wi);
                  }}
                  className="align-baseline will-change-[opacity] transition-opacity duration-300 ease-out"
                  style={{ opacity: hydrated ? o : 0 }}
                >
                  {tok}
                </span>
              );
            })}
          </p>
        </div>

        {/* Abstand unten (passt sich dem kleineren Glow an) */}
        <div className="h-[15vh] md:h-[30vh]" />
      </div>
    </section>
  );
}
