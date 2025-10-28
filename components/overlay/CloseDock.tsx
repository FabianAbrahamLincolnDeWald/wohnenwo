"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type CloseDockProps = {
  sheetRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  active?: boolean;
  /** Innenabstand oben/rechts in px – bleibt auch im Dock beibehalten */
  offsetPx?: number; // default 16
};

export default function CloseDock({
  sheetRef,
  onClose,
  active = true,
  offsetPx = 16,
}: CloseDockProps) {
  const [docked, setDocked] = React.useState(false);
  const [rightOffset, setRightOffset] = React.useState<number>(offsetPx);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  const measure = React.useCallback(() => {
    const el = sheetRef.current;
    if (!el || typeof window === "undefined") return;
    const rect = el.getBoundingClientRect();
    // Abstand vom Viewport-Rechts bis zur SHEET-Rechtskante + interner Button-Abstand
    const ro = Math.max(offsetPx, window.innerWidth - rect.right + offsetPx);
    setRightOffset(ro);
  }, [sheetRef, offsetPx]);

  // Dock/Undock per IntersectionObserver (defensiv getypt, kein Destructuring)
  React.useEffect(() => {
    if (!active || typeof window === "undefined") return;
    const s = sentinelRef.current;
    if (!s) return;

    const io = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        const shouldDock = entry ? !entry.isIntersecting : false;
        if (shouldDock) measure();
        setDocked(shouldDock);
      },
      { root: null, threshold: 0, rootMargin: "-6px 0px 0px 0px" }
    );

    io.observe(s);
    return () => io.disconnect();
  }, [active, measure]);

  // Bei Deaktivierung zurücksetzen
  React.useEffect(() => {
    if (!active) setDocked(false);
  }, [active]);

  // Right-Offset bei Resize/Layout-Änderungen nachführen (defensiv)
  React.useEffect(() => {
    if (!docked || !active || typeof window === "undefined") return;

    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    window.addEventListener("resize", onResize);

    // Optional/defensiv: ResizeObserver kann auf alten Browsern fehlen
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && sheetRef.current) {
      ro = new ResizeObserver(() => measure());
      ro.observe(sheetRef.current);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [docked, active, measure, sheetRef]);

  // Styles für beide Modi (immer 16px default – bzw. offsetPx)
  const styleAbs: React.CSSProperties = {
    position: "absolute",
    top: offsetPx,
    right: offsetPx,
    zIndex: 10,
  };
  const styleFix: React.CSSProperties = {
    position: "fixed",
    top: `calc(env(safe-area-inset-top, 0px) + ${offsetPx}px)`,
    right: rightOffset,
    zIndex: 1100,
  };

  const renderDocked = (btn: React.ReactElement) =>
    typeof window === "undefined" ? btn : createPortal(btn, document.body);

  return (
    <>
      {/* Sentinel an der Sheet-Oberkante */}
      <div
        ref={sentinelRef}
        data-close-sentinel
        aria-hidden
        style={{ position: "absolute", top: 0, left: 0, height: 1, width: 1 }}
      />

      {/* UNDOKCED: im Sheet (absolute) */}
      {!docked && active && (
        <button
          type="button"
          aria-label="Overlay schließen"
          onClick={onClose}
          style={styleAbs}
          className="group inline-flex h-11 w-11 items-center justify-center rounded-full
                     bg-slate-900 text-white shadow-md ring-1 ring-white/10
                     hover:bg-slate-800 hover:shadow-lg hover:ring-white/30
                     active:scale-[0.98]
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                     transition-transform transition-colors transition-shadow duration-200 ease-[cubic-bezier(.2,.8,.2,1)]
                     motion-reduce:transition-none motion-reduce:transform-none
                     cursor-pointer select-none touch-manipulation"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* DOCKED: via Portal (fixed am Viewport, Right-Offset dynamisch zur Sheet-Kante) */}
      {docked &&
        active &&
        renderDocked(
          <button
            type="button"
            aria-label="Overlay schließen"
            onClick={onClose}
            style={styleFix}
            className="group inline-flex h-11 w-11 items-center justify-center rounded-full
                       bg-slate-900 text-white shadow-md ring-1 ring-white/10
                       hover:bg-slate-800 hover:shadow-lg hover:ring-white/30
                       active:scale-[0.98]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                       transition-transform transition-colors transition-shadow duration-200 ease-[cubic-bezier(.2,.8,.2,1)]
                       motion-reduce:transition-none motion-reduce:transform-none
                       cursor-pointer select-none touch-manipulation"
          >
            <X className="h-5 w-5" />
          </button>
        )}
    </>
  );
}
