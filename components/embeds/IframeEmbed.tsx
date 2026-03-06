// components/embeds/IframeEmbed.tsx
"use client";

import * as React from "react";

type IframeEmbedProps = {
  src: string;
  title: string;
  className?: string;
  /** Nach wie vielen ms wir einen Fallback zeigen, falls Embedding geblockt ist */
  fallbackAfterMs?: number;
};

export default function IframeEmbed({
  src,
  title,
  className,
  fallbackAfterMs = 2500,
}: IframeEmbedProps) {
  const [loaded, setLoaded] = React.useState(false);
  const [fallback, setFallback] = React.useState(false);

  React.useEffect(() => {
    setLoaded(false);
    setFallback(false);

    const t = window.setTimeout(() => {
      // Wenn Linktree das Framing blockt, kommt oft kein sinnvoller Render.
      // Wir können cross-origin NICHT sicher prüfen — daher pragmatischer Timeout-Fallback.
      if (!loaded) setFallback(true);
    }, fallbackAfterMs);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <div
      className={[
        "relative w-full overflow-hidden rounded-2xl",
        "ring-1 ring-black/5 dark:ring-white/10",
        "bg-white/60 dark:bg-white/5",
        // Höhe: an dein Overlay angepasst (CSS-Var kommt vom Overlay-Scroller!)
        "h-[calc(100vh-var(--overlay-top-gap,16px)-240px)] md:h-[calc(100vh-260px)]",
        className ?? "",
      ].join(" ")}
    >
      {!fallback ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          // Sandbox ist sinnvoll, aber kann je nach Anbieter zu restriktiv sein.
          // Wenn Linktree “komisch” reagiert, testweise sandbox entfernen oder erweitern.
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer-when-downgrade"
          allow="clipboard-write; fullscreen"
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <div className="max-w-[520px] space-y-3">
            <p className="text-[15px] md:text-[16px] text-slate-700 dark:text-white/80">
              Dieses Profil lässt sich vermutlich nicht direkt in einem iFrame einbetten (Frame-Policy des Anbieters).
            </p>
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-[15px] font-semibold
                         bg-slate-900 text-white dark:bg-white dark:text-black"
            >
              Linktree in neuem Tab öffnen
            </a>
          </div>
        </div>
      )}
    </div>
  );
}