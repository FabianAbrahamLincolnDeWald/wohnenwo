"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function CloseDock({
  sheetRef,
  onClose,
  active = true,
}: {
  sheetRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  active?: boolean;
}) {
  const [docked, setDocked] = React.useState(false);
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const [rightOffset, setRightOffset] = React.useState<number>(16);

  const measure = React.useCallback(() => {
    const el = sheetRef.current as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ro = Math.max(16, window.innerWidth - rect.right + 16);
    setRightOffset(ro);
  }, [sheetRef]);

  React.useEffect(() => {
    if (!active) return;
    const s = sentinelRef.current;
    if (!s) return;
    const io = new IntersectionObserver(
      ([e]) => { const shouldDock = !e.isIntersecting; if (shouldDock) measure(); setDocked(shouldDock); },
      { root: null, threshold: 0, rootMargin: "-6px 0px 0px 0px" }
    );
    io.observe(s);
    return () => io.disconnect();
  }, [measure, active]);

  React.useEffect(() => { if (!active) setDocked(false); }, [active]);

  React.useEffect(() => {
    if (!docked || !active) return;
    let raf = 0;
    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(() => measure());
    if (sheetRef.current) ro.observe(sheetRef.current as Element);
    return () => { window.removeEventListener("resize", onResize); ro.disconnect(); cancelAnimationFrame(raf); };
  }, [docked, active, measure, sheetRef]);

  const styleAbs: React.CSSProperties = { position: "absolute", top: 16, right: 16, zIndex: 10 };
  const styleFix: React.CSSProperties = { position: "fixed", top: `calc(env(safe-area-inset-top, 0px) + 16px)`, right: rightOffset, zIndex: 1100 };

  const renderDocked = (btn: React.ReactElement) =>
    (typeof window === "undefined" ? btn : createPortal(btn, document.body));

  const Btn = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
      type="button"
      {...props}
      className="group inline-flex h-11 w-11 items-center justify-center rounded-full
                 bg-slate-900 text-white shadow-md ring-1 ring-white/10
                 hover:bg-slate-800 hover:shadow-lg hover:ring-white/30
                 active:scale-[0.98]
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                 transition-transform transition-colors transition-shadow duration-200 ease-[cubic-bezier(.2,.8,.2,1)]
                 motion-reduce:transition-none motion-reduce:transform-none
                 cursor-pointer select-none touch-manipulation"
      aria-label={props["aria-label"] ?? "Overlay schließen"}
    >
      <X className="h-5 w-5" />
    </button>
  );

  return (
    <>
      <div ref={sentinelRef} aria-hidden style={{ position: "absolute", top: 0, left: 0, height: 1, width: 1 }} />
      {!docked && active && <Btn onClick={onClose} style={styleAbs} />}
      {docked && active && renderDocked(<Btn onClick={onClose} style={styleFix} />)}
    </>
  );
}
