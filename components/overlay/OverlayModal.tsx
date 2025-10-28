"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import CloseDock from "./CloseDock";

type OverlayModalProps = {
  open: boolean;
  onClose: () => void;
  ariaLabel?: string;
  title?: string;
  headline?: string;
  children?: React.ReactNode;
  durationMs?: number;
  topGapMobile?: number;
  topGapMobileSm?: number;
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
}: OverlayModalProps) {
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTarget =
      contentRef.current?.querySelector<HTMLElement>("[data-autofocus]") ??
      contentRef.current?.querySelector<HTMLElement>("button,[href],input,select,textarea,[tabindex]:not([tabindex='-1'])") ??
      contentRef.current ?? undefined;
    focusTarget?.focus();

    return () => {
      document.body.style.overflow = original;
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.preventDefault(); onClose(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onOverlayMouseDown = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const onKeyDownTrap = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const root = contentRef.current;
    if (!root) return;
    const focusables = Array.from(root.querySelectorAll<HTMLElement>("button,[href],input,select,textarea,[tabindex]:not([tabindex='-1'])"))
      .filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  // sanfte CSS-Variablen
  const portalStyle = { ["--modal-open-timeout" as any]: `${durationMs}ms` } as React.CSSProperties;
  const overlayVars = {
    ["--overlay-top-gap" as any]: `${topGapMobile}px`,
    ["--overlay-top-gap-sm" as any]: `${topGapMobileSm}px`,
  } as React.CSSProperties;

  // Scroll-Reset bei Öffnen/Schließen
  React.useEffect(() => {
    const overlay = overlayRef.current;
    const dialog = contentRef.current;
    const reset = () => {
      requestAnimationFrame(() => {
        if (overlay) overlay.scrollTop = 0;
        if (dialog && typeof (dialog as any).scrollTop === "number") (dialog as any).scrollTop = 0;
        requestAnimationFrame(() => {
          if (overlay) overlay.scrollTop = 0;
          if (dialog && typeof (dialog as any).scrollTop === "number") (dialog as any).scrollTop = 0;
        });
      });
    };
    reset();
  }, [open]);

  if (!mounted) return null;

  const computedAriaLabel = ariaLabel || headline || title || "Overlay";

  return createPortal(
    <div
      className={[
        "fixed inset-0 z-[1000] transition-[opacity] ease-out",
        open ? "opacity-100 duration-0" : "opacity-0 pointer-events-none duration-0 md:duration-[var(--modal-open-timeout)]",
      ].join(" ")}
      style={portalStyle}
      aria-hidden={!open}
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/45 backdrop-blur-md backdrop-saturate-150
                   flex items-start md:items-start justify-center
                   overflow-y-auto
                   p-0 pt-[var(--overlay-top-gap,16px)] sm:pt-[var(--overlay-top-gap-sm,24px)] md:py-12
                   transition-opacity duration-200 ease-out motion-reduce:transition-none"
        style={overlayVars}
        onMouseDown={onOverlayMouseDown}
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
          className="relative mx-0 my-0
                     w-screen md:w-[min(96vw,680px)]
                     rounded-t-3xl rounded-b-none md:rounded-3xl
                     bg-white/95 shadow-xl ring-1 ring-black/5 md:bg-white md:shadow-2xl
                     min-h-[calc(100vh-var(--overlay-top-gap,16px))]
                     sm:min-h-[calc(100vh-var(--overlay-top-gap-sm,24px))]
                     pb-[env(safe-area-inset-bottom)]
                     overflow-visible md:overflow-visible
                     transition-transform transition-shadow duration-200 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none"
        >
          <CloseDock sheetRef={contentRef as unknown as React.RefObject<HTMLElement>} active={open} onClose={onClose} />
          <div className="px-6 sm:px-8 md:px-[66px] py-[66px] md:py-[99px]">
            {(title || headline) && (
              <h3 className="space-y-2">
                {title && <span id="om-title" className="block font-semibold text-slate-700 leading-[1.1] text-[17px] md:text-[18px]">{title}</span>}
                {headline && <span id="om-headline" className="block font-semibold tracking-tight text-slate-900 leading-[1.05] text-[33px] md:text-[56px]">{headline}</span>}
              </h3>
            )}
            {children && <div className="mt-4 antialiased text-[17px] md:text-[18px] leading-[1.3] md:leading-[1.35] text-slate-700">{children}</div>}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
