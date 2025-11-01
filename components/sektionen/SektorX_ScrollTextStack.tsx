"use client";

import * as React from "react";

/**
 * SektorX_ScrollTextStack — Wort-für-Wort Reveal
 * - Behaltet: visuelle Höhe 80vh (Reveal) + 120vh (Ausklang)
 * - Stabil: rAF-Throttle, reduced-motion, keine Hydration-Diffs
 */
export default function SektorX_ScrollTextStack() {
  const TEXT =
    "Sei Gastgeber einer Wirtschaft, die Menschen stärkt – nicht nur Märkte. Räume sprechen, wenn wir ihnen zuhören; Werte werden sichtbar, wenn wir sie leben. Wir gestalten so, dass Entscheidungen leichtfallen, Gespräche ehrlicher werden und Arbeit wieder Sinn stiftet. Deine Umgebung ist mehr als Kulisse – sie ist Resonanzboden für Haltung, Mut und Fürsorge. Hier beginnt der Wandel: leise im Detail, deutlich im Ergebnis, spürbar in jedem Tag.";

  // Optik/Timing (wie von dir eingestellt)
  const MID = 0.5;
  const START_OFFSET_PX = 80;
  const FADE_RANGE_PX = 80;

  // Tokenisierung (SSR-stabil)
  const tokens = React.useMemo(() => TEXT.split(/(\s+)/), [TEXT]);
  const wordTokenIndices = React.useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < tokens.length; i++) if (/\S/.test(tokens[i])) out.push(i);
    return out;
  }, [tokens]);
  const tokenToWordIdx = React.useMemo(() => {
    const m = new Map<number, number>();
    for (let wi = 0; wi < wordTokenIndices.length; wi++) m.set(wordTokenIndices[wi], wi);
    return m;
  }, [wordTokenIndices]);

  const spanRefs = React.useRef<Map<number, HTMLSpanElement>>(new Map());
  const [opacities, setOpacities] = React.useState<number[]>(
    () => new Array(wordTokenIndices.length).fill(0)
  );

  // reduced-motion respektieren
  const prefersReduced = React.useMemo(() => {
    if (typeof window === "undefined" || typeof matchMedia === "undefined") return false;
    try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; }
  }, []);

  React.useEffect(() => {
    if (prefersReduced) {
      setOpacities(new Array(wordTokenIndices.length).fill(1));
      return;
    }

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;

        const vh = window.innerHeight;
        const centerY = vh * MID;
        const start = centerY + START_OFFSET_PX;
        const range = Math.max(FADE_RANGE_PX, 1);

        const next = new Array(wordTokenIndices.length).fill(0);
        for (let wi = 0; wi < wordTokenIndices.length; wi++) {
          const tokenIdx = wordTokenIndices[wi];
          const el = spanRefs.current.get(tokenIdx);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          if (r.top > vh + 200) { next[wi] = 0; continue; }
          if (r.bottom < -200) { next[wi] = 1; continue; }
          const yMid = r.top + r.height / 2;
          const t = (start - yMid) / range;
          next[wi] = t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t); // smoothstep
        }
        setOpacities(next);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [wordTokenIndices, prefersReduced]);

  const txtSize = "text-[clamp(25.5px,calc(25.5px+29.5*(100vw-320px)/960),55px)]";
  const txtStyle = `${txtSize} leading-[1.08] tracking-tight font-medium`;

  return (
    <section aria-label="ScrollTextStack" className="bg-white">
      {/* kleiner top spacer (gültiger Wert) */}
      <div className="h-[10vh]" />

      {/* Reveal-Bereich: visuell 80vh; Sticky-Container ebenfalls 80vh */}
      <section className="relative h-[80vh]">
        <div className="sticky top-0 h-[80vh]">
          <div className="relative mx-auto max-w-6xl px-4 md:px-6 h-full grid content-center">
            {/* Reserve-Paragraph für stabile Höhe */}
            <p className={`invisible ${txtStyle} px-4 md:px-6`}>{TEXT}</p>
            {/* grauer Vollsatz */}
            <p className={`absolute inset-x-0 px-4 md:px-6 ${txtStyle} text-slate-300`}>{TEXT}</p>
            {/* animierter Satz */}
            <p aria-hidden className={`absolute inset-x-0 px-4 md:px-6 ${txtStyle} text-black`}>
              {tokens.map((tok, tokenIdx) => {
                if (!/\S/.test(tok)) return <span key={tokenIdx}>{tok}</span>;
                const wi = tokenToWordIdx.get(tokenIdx)!;
                const opacity = opacities[wi] ?? 0;
                return (
                  <span
                    key={tokenIdx}
                    ref={(el) => {
                      if (el) spanRefs.current.set(tokenIdx, el);
                      else spanRefs.current.delete(tokenIdx);
                    }}
                    style={{ opacity }}
                  >
                    {tok}
                  </span>
                );
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Ausklang: visuell 120vh mit deinem Cyan-Verlauf */}
      <section className="relative h-[120vh] w-full select-none overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 [background:linear-gradient(to_bottom,rgb(255_255_255/1)_0%,rgb(255_255_255/1)_70%,rgb(247_252_255/1)_78%,rgb(225_246_255/0.85)_84%,rgb(185_234_255/0.65)_90%,rgb(135_222_255/0.55)_95%,rgb(225_245_255/1)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-[-4%] h-[34vh] z-0 [background:radial-gradient(60%_55%_at_50%_100%,rgb(34_211_238/0.1)_0%,rgb(34_211_238/0.06)_40%,transparent_80%)]" />

        {/* optionaler Teaser (deaktivierbar, wenn du pure Ruhe willst) */}
        <div className="relative z-10 grid h-full place-items-center">
          <div className="text-center px-6">
            <p className="text-xs md:text-sm uppercase tracking-widest text-slate-400">
              Scrollen, um die Aussage zu schärfen
            </p>
            <h1 className="mt-2 md:mt-3 text-lg md:text-2xl font-medium text-slate-700">
              Ruhiger Einstieg mit viel Weißraum
            </h1>
          </div>
        </div>
      </section>
    </section>
  );
}
