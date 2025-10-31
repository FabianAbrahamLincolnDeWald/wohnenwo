"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import CloseDock from "@/components/overlay/CloseDock";

export type OverlayModalProps = {
  open: boolean;
  onClose: () => void;
  ariaLabel?: string;
  title?: string;
  headline?: string;
  children?: React.ReactNode;

  /** Animationsdauer (nur als CSS-Var genutzt) */
  durationMs?: number;

  /** Abstand oben (mobil) bis Sheet-Beginn */
  topGapMobile?: number;

  /** Abstand oben (sm) bis Sheet-Beginn */
  topGapMobileSm?: number;

  /** Weiterleitung an CloseDock: IntersectionObserver-Hysterese */
  dockRootMargin?: string;   // z.B. "-2px 0px 0px 0px"
  dockThreshold?: number;    // z.B. 0
};

export default function OverlayModal({
  open,
  onClose,
  ariaLabel,
  title,
  headline,
  children,
  durationMs = 400,
  topGapMobile = 16,
  topGapMobileSm = 24,
  dockRootMargin,
  dockThreshold,
}: OverlayModalProps) {
  const overlayRef = React.useRef<HTMLDivElement | null>(null); // äußerer Scroller (Backdrop)
  const contentRef = React.useRef<HTMLDivElement | null>(null); // Sheet/Content
  const [mounted, setMounted] = React.useState(false);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);

  // Mount-Flag gegen Hydration-Diffs
  React.useEffect(() => setMounted(true), []);

  // Sehr konservative Safari-Erkennung (WebKit ohne Chrome/Edge)
  const isSafari = React.useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent;
    const isAppleWebKit = /AppleWebKit/.test(ua);
    const isChrome = /Chrome\//.test(ua) || /CriOS\//.test(ua);
    const isEdge = /Edg\//.test(ua);
    return isAppleWebKit && !isChrome && !isEdge;
  }, []);

  // Body-Scroll sperren & Fokus wiederherstellen
  React.useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // sanfter Autofokus
    const focusTarget =
      contentRef.current?.querySelector<HTMLElement>("[data-autofocus]") ??
      contentRef.current?.querySelector<HTMLElement>(
        'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
      ) ??
      contentRef.current ??
      undefined;

    try { focusTarget?.focus(); } catch {}

    return () => {
      document.body.style.overflow = originalOverflow;
      try { previouslyFocused.current?.focus?.(); } catch {}
    };
  }, [open]);

  // ESC schließt
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Klick auf Backdrop schließt (nur wenn exakt Backdrop getroffen)
  const onOverlayMouseDown = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Fokus-Trap
  const onKeyDownTrap = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const root = contentRef.current; if (!root) return;
    const focusables = Array.from(
      root.querySelectorAll<HTMLElement>(
        'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
    if (focusables.length < 2) return;

    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  // Safari-only Wheel-Routing (Chrome/Edge/Firefox → nativ & butterweich)
  React.useEffect(() => {
    if (!open || !isSafari) return;
    const el = overlayRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // verhindert "Durchscrollen" der Seite hinter dem Overlay
      e.preventDefault();
      e.stopPropagation();
      el.scrollBy({ top: e.deltaY, behavior: "auto" });
    };

    // non-passive nötig für preventDefault
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel as any);
  }, [open, isSafari]);

  // Scroll-Reset bei Open (zweifach rAF)
  React.useEffect(() => {
    const overlay = overlayRef.current;
    const dialog = contentRef.current as unknown as { scrollTop?: number } | null;

    const reset = () => {
      requestAnimationFrame(() => {
        if (overlay) overlay.scrollTop = 0;
        if (dialog && typeof dialog.scrollTop === "number") dialog.scrollTop = 0;
        requestAnimationFrame(() => {
          if (overlay) overlay.scrollTop = 0;
          if (dialog && typeof dialog.scrollTop === "number") dialog.scrollTop = 0;
        });
      });
    };

    reset();
  }, [open]);

  // CSS-Variablen
  const portalStyle: React.CSSProperties & Record<string, string> = {
    "--modal-open-timeout": `${durationMs}ms`,
  } as any;
  const overlayVars: React.CSSProperties & Record<string, string> = {
    "--overlay-top-gap": `${topGapMobile}px`,
    "--overlay-top-gap-sm": `${topGapMobileSm}px`,
    WebkitOverflowScrolling: "touch",
  } as any;

  if (!mounted) return null;

  const computedAriaLabel = ariaLabel || headline || title || "Overlay";

  return createPortal(
    <div
      className={[
        "fixed inset-0 z-[1000] transition-[opacity] ease-out",
        open
          ? "opacity-100 duration-0"
          : "opacity-0 pointer-events-none duration-0 md:duration-[var(--modal-open-timeout)]",
      ].join(" ")}
      style={portalStyle}
      aria-hidden={!open}
    >
      <div
        ref={overlayRef}
        onMouseDown={onOverlayMouseDown}
        className={[
          "absolute inset-0 bg-black/40",
          "supports-[backdrop-filter]:backdrop-blur-[2px] md:supports-[backdrop-filter]:backdrop-blur-md",
          "backdrop-saturate-150 flex items-start md:items-start justify-center",
          "overflow-y-auto p-0 pt-[var(--overlay-top-gap,16px)] sm:pt-[var(--overlay-top-gap-sm,24px)] md:py-12",
          "transition-opacity duration-200 ease-out motion-reduce:transition-none",
          "touch-pan-y overscroll-contain transform-gpu will-change-transform",
        ].join(" ")}
        style={overlayVars}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={computedAriaLabel}
          aria-labelledby={title ? "om-title" : undefined}
          aria-describedby={headline ? "om-headline" : undefined}
          tabIndex={-1}
          onKeyDown={onKeyDownTrap}
          ref={contentRef}
          className={[
            "relative mx-0 my-0 w-screen md:w-[min(96vw,680px)]",
            "rounded-t-3xl rounded-b-none md:rounded-3xl",
            "bg-white/95 shadow-xl ring-1 ring-black/5 md:bg-white md:shadow-2xl",
            "min-h-[calc(100vh-var(--overlay-top-gap,16px))] sm:min-h-[calc(100vh-var(--overlay-top-gap-sm,24px))]",
            "pb-[env(safe-area-inset-bottom)]",
            // Wichtig für dein aktuelles Fix: unten sichtbar lassen (mobil),
            // aber auf Desktop das Card-"Überstehen" verhindern:
            "overflow-visible md:overflow-hidden",
            "transition-transform transition-shadow duration-200 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none",
            "transform-gpu will-change-transform",
          ].join(" ")}
        >
          {/* CloseDock mit Hysterese-Props durchgereicht */}
          <CloseDock
            sheetRef={contentRef as unknown as React.RefObject<HTMLElement>}
            active={open}
            onClose={onClose}
            // Diese Props werden nur angewendet, falls deine CloseDock-Version sie unterstützt;
            // andernfalls werden sie ignoriert (kein Fehler).
            rootMargin={dockRootMargin}
            threshold={dockThreshold}
          />

          <div className="px-6 sm:px-8 md:px-[66px] py-[66px] md:py-[99px] antialiased">
            {(title || headline) && (
              <h3 className="space-y-2">
                {title && (
                  <span
                    id="om-title"
                    className="block font-semibold text-slate-700 leading-[1.1] text-[17px] md:text-[18px]"
                  >
                    {title}
                  </span>
                )}
                {headline && (
                  <span
                    id="om-headline"
                    className="block font-semibold tracking-tight text-slate-900 leading-[1.05] text-[33px] md:text-[56px]"
                  >
                    {headline}
                  </span>
                )}
              </h3>
            )}

            {children && (
              <div className="mt-4 antialiased text-[17px] md:text-[18px] leading-[1.3] md:leading-[1.35] text-slate-700">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
