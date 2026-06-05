"use client";

/**
 * UnifiedNavbar – eine einzige Komponente für alle öffentlichen Seiten.
 *
 * Ersetzt: WohnenWoNavbar, WohnenWoOrbitNavbar, WohnenWoDesignEntstehtNavBar,
 *          WerteWirkenNavBar, InnenarchitekturNavbar, ExpertenNetzwerkNavBar,
 *          ErlebnisseNavbar, KuechenNavBar
 *
 * Props:
 *   navItems   – Seitenspezifische Tab-Links
 *   backHref   – Wenn gesetzt: zeigt einen Zurück-Button
 *   showSearch – Zeigt Suchfeld auf Desktop (Standard: false)
 *
 * Features:
 *   • Mobile  (<md): Hamburger → Framer-Motion Slide-in-Sidebar von links
 *   • Tablet  (md):  Kompakte Tab-Bar, alle Punkte erreichbar
 *   • Desktop (lg+): Vollständige Bar + Ecosystem-Flyout-Panel
 *   • Dark Mode + Light Mode (Tailwind dark: Präfix)
 *   • usePathname für aktiven Zustand
 *   • prefers-reduced-motion respektiert
 */

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  Globe,
  Search,
  Menu,
  X,
} from "lucide-react";
import AuthAvatar from "@/components/navigation/AuthAvatar";
import { ecosystemSections } from "@/components/navigation/ecosystem-config";
import type { EcosystemSection } from "@/components/navigation/ecosystem-config";

/* ─────────────────────────────────────────────
   Typen
───────────────────────────────────────────── */

export interface NavItem {
  label: string;
  href: string;
}

interface UnifiedNavbarProps {
  navItems?: NavItem[];
  backHref?: string;
  showSearch?: boolean;
}

/* ─────────────────────────────────────────────
   Animations-Varianten (Emil-Prinzipien)
   • ease-out für Einblenden: schnell raus, sanft ankommen
   • ease-drawer (iOS-like) für Sidebar
   • scale(0.95) + opacity:0 als Startzustand
───────────────────────────────────────────── */

const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const sidebarVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
  exit: { x: "-100%" },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const containerStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
};

const flyoutVariants = {
  hidden: { opacity: 0, scale: 0.97, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: -4 },
};

/* ─────────────────────────────────────────────
   Badge-Renderer (für Ecosystem-Flyout)
───────────────────────────────────────────── */

function BadgeRenderer({
  badge,
}: {
  badge?: EcosystemSection["links"][number]["badge"];
}) {
  if (!badge) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-400 dark:bg-white/60" />
      </span>
    );
  }
  if (badge.type === "logo" && badge.imgSrc) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center">
        <img
          src={badge.imgSrc}
          alt={badge.imgAlt ?? ""}
          className="h-6 w-6 object-contain"
        />
      </span>
    );
  }
  if (badge.type === "square") {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] bg-slate-900 text-[10px] font-black text-white dark:bg-white dark:text-slate-900">
        {badge.text ?? "€"}
      </span>
    );
  }
  if (badge.text) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[12px] font-semibold text-white dark:bg-white dark:text-slate-900">
        {badge.text}
      </span>
    );
  }
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
      <span className="h-2.5 w-2.5 rounded-full bg-slate-400 dark:bg-white/60" />
    </span>
  );
}

/* ─────────────────────────────────────────────
   Ecosystem-Flyout-Panel (Desktop)
───────────────────────────────────────────── */

function EcosystemFlyoutPanel() {
  const handeln = ecosystemSections.find((s) => s.id === "handeln");
  const entdecken = ecosystemSections.find((s) => s.id === "entdecken");
  const wirken = ecosystemSections.find((s) => s.id === "wirken");

  return (
    <div className="w-[620px] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#111111] shadow-[0_22px_60px_rgba(15,23,42,0.2)] dark:shadow-[0_22px_60px_rgba(0,0,0,0.6)]">
      <div className="flex text-[13px] text-slate-700 dark:text-[#A0A0A0]">
        {/* Linke Spalte: Handeln + Entdecken */}
        <div className="flex w-1/2 flex-col border-r border-slate-200/80 dark:border-white/10">
          {handeln && (
            <div className="px-4 py-4 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-[#606060]">
                {handeln.title}
              </h3>
              <ul className="space-y-1">
                {handeln.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="
                        flex items-center gap-3 rounded-xl px-2.5 py-2
                        hover:bg-slate-100 dark:hover:bg-[#1A1A1A]
                        transition-colors duration-150
                      "
                    >
                      <BadgeRenderer badge={link.badge} />
                      <span className="text-slate-700 dark:text-[#F5F5F5]">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {handeln && entdecken && (
            <div className="h-px w-full bg-slate-200/80 dark:bg-white/10" />
          )}
          {entdecken && (
            <div className="px-4 py-4 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-[#606060]">
                {entdecken.title}
              </h3>
              <ul className="space-y-1">
                {entdecken.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="
                        flex items-center gap-3 rounded-xl px-2.5 py-2
                        hover:bg-slate-100 dark:hover:bg-[#1A1A1A]
                        transition-colors duration-150
                      "
                    >
                      <BadgeRenderer badge={link.badge} />
                      <span className="text-slate-700 dark:text-[#F5F5F5]">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Rechte Spalte: Wirken */}
        {wirken && (
          <div className="w-1/2 px-4 py-4 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-[#606060]">
              {wirken.title}
            </h3>
            <ul className="space-y-1">
              {wirken.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="
                      flex items-center gap-3 rounded-xl px-2.5 py-2
                      hover:bg-slate-100 dark:hover:bg-[#1A1A1A]
                      transition-colors duration-150
                    "
                  >
                    <BadgeRenderer badge={link.badge} />
                    <span className="text-slate-700 dark:text-[#F5F5F5]">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Language-Dropdown
───────────────────────────────────────────── */

function LanguageDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label="Sprache auswählen"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="
          inline-flex h-9 w-9 items-center justify-center
          rounded-full border border-slate-200 dark:border-[#222222]
          bg-white/80 dark:bg-[#111111]
          text-slate-600 dark:text-[#A0A0A0]
          hover:bg-slate-50 dark:hover:bg-[#1A1A1A]
          hover:text-slate-900 dark:hover:text-[#F5F5F5]
          transition-all duration-150
          cursor-pointer
        "
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Hover-Brücke */}
            <div className="absolute right-0 top-full h-2 w-48" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15, ease: EASE_OUT }}
              style={{ transformOrigin: "top right" }}
              className="
                absolute right-0 mt-2 w-52 rounded-xl
                border border-slate-200/80 dark:border-[#222222]
                bg-white dark:bg-[#111111]
                p-1 shadow-lg
              "
              role="menu"
              aria-label="Sprachauswahl"
            >
              <button
                type="button"
                className="
                  flex w-full items-center justify-between
                  rounded-lg px-3 py-2 text-sm font-medium
                  bg-slate-100 dark:bg-[#1A1A1A]
                  text-slate-800 dark:text-[#F5F5F5]
                  cursor-pointer
                "
              >
                <span>Deutsch</span>
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-emerald-500"
                  aria-hidden="true"
                >
                  <polyline
                    points="20 6 9 17 4 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                disabled
                className="
                  flex w-full items-center px-3 py-2 text-sm
                  text-slate-400 dark:text-[#606060]
                  cursor-default rounded-lg
                "
              >
                Weitere Sprachen folgen.
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Haupt-Komponente: UnifiedNavbar
───────────────────────────────────────────── */

export default function UnifiedNavbar({
  navItems = [],
  backHref,
  showSearch = false,
}: UnifiedNavbarProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const flyoutCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Flyout hover-Logik mit Delay */
  const openFlyout = () => {
    if (flyoutCloseTimer.current) clearTimeout(flyoutCloseTimer.current);
    setFlyoutOpen(true);
  };
  const closeFlyout = () => {
    flyoutCloseTimer.current = setTimeout(() => setFlyoutOpen(false), 120);
  };
  const cancelClose = () => {
    if (flyoutCloseTimer.current) clearTimeout(flyoutCloseTimer.current);
  };

  /* Sidebar schließen bei ESC */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* Body scroll sperren wenn Sidebar offen */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  /* Aktiv-Check: exakter Match oder Präfix (für Subrouten) */
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  /* Animation: reduzierte Bewegung respektieren */
  const motionDuration = shouldReduceMotion ? 0 : 0.35;
  const sidebarTransition = {
    duration: motionDuration,
    ease: EASE_DRAWER,
  };
  const itemTransition = {
    duration: shouldReduceMotion ? 0 : 0.25,
    ease: EASE_OUT,
  };

  return (
    <>
      {/* ── Navbar-Bar ── */}
      <nav
        className="
          fixed inset-x-0 top-0 z-40
          backdrop-blur-xl
          bg-white/80 dark:bg-[#0A0A0A]/85
          border-b border-slate-200/80 dark:border-[#222222]
        "
        aria-label="Hauptnavigation"
      >
        {/* ── DESKTOP (≥ md) ── */}
        <div className="hidden md:flex h-16 items-center px-4 gap-3">

          {/* Ecosystem-Button links */}
          <div
            className="relative flex-none"
            onMouseEnter={openFlyout}
            onMouseLeave={closeFlyout}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={flyoutOpen}
              aria-label="Ecosystem öffnen"
              onClick={() => setFlyoutOpen((v) => !v)}
              className="
                flex items-center gap-1
                rounded-lg border border-slate-200/80 dark:border-[#222222]
                bg-white/80 dark:bg-[#111111]
                px-1.5 py-1
                shadow-sm
                hover:bg-slate-50 dark:hover:bg-[#1A1A1A]
                transition-all duration-150
                cursor-pointer
              "
            >
              <span className="inline-flex h-6 w-6 items-center justify-center">
                <img
                  src="https://wohnenwo.vercel.app/images/brand/logos/ww-badge-dark.svg"
                  alt="WohnenWo"
                  className="h-5 w-5 object-contain"
                />
              </span>
              <ChevronDown
                aria-hidden="true"
                className={`
                  h-3.5 w-3.5 text-slate-500 dark:text-[#A0A0A0]
                  transition-transform duration-200
                  ${flyoutOpen ? "rotate-180" : ""}
                `}
              />
            </button>

            {/* Flyout-Panel */}
            <AnimatePresence>
              {flyoutOpen && (
                <>
                  {/* Hover-Brücke */}
                  <div
                    className="absolute left-0 top-full h-3 w-[620px]"
                    onMouseEnter={cancelClose}
                    onMouseLeave={closeFlyout}
                  />
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={flyoutVariants}
                    transition={{ duration: 0.18, ease: EASE_OUT }}
                    style={{ transformOrigin: "top left" }}
                    className="absolute left-0 mt-3 z-50"
                    onMouseEnter={cancelClose}
                    onMouseLeave={closeFlyout}
                  >
                    <EcosystemFlyoutPanel />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="h-6 w-px rounded-full bg-slate-200 dark:bg-[#222222] flex-none" />

          {/* Zurück-Button (optional) */}
          {backHref && (
            <>
              <Link
                href={backHref}
                aria-label="Zurück"
                className="
                  inline-flex h-8 w-8 flex-none items-center justify-center
                  rounded-full border border-slate-200/80 dark:border-[#222222]
                  bg-white/80 dark:bg-[#111111]
                  text-slate-500 dark:text-[#A0A0A0]
                  hover:bg-slate-100 dark:hover:bg-[#1A1A1A]
                  hover:text-slate-900 dark:hover:text-[#F5F5F5]
                  transition-all duration-150
                  cursor-pointer
                "
              >
                <ChevronLeft className="h-4 w-4 -translate-x-px" aria-hidden="true" />
              </Link>
              <div className="h-6 w-px rounded-full bg-slate-200 dark:bg-[#222222] flex-none" />
            </>
          )}

          {/* Tab-Navigation (seitenspezifisch) */}
          {navItems.length > 0 && (
            <nav aria-label="Seitennavigation" className="flex-1 min-w-0">
              <ul className="flex items-center gap-0.5 overflow-x-auto scrollbar-none" role="list">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href} className="flex-none">
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`
                          inline-flex items-center rounded-lg px-3 py-1.5
                          text-sm font-medium
                          whitespace-nowrap
                          transition-all duration-150
                          cursor-pointer
                          ${
                            active
                              ? "text-[#F5C842] dark:text-[#F5C842]"
                              : "text-slate-600 dark:text-[#A0A0A0] hover:bg-slate-100 dark:hover:bg-[#1A1A1A] hover:text-slate-900 dark:hover:text-[#F5F5F5]"
                          }
                        `}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Suchfeld (optional) */}
          {showSearch && (
            <div className="flex-none w-52">
              <label className="
                flex items-center gap-2 rounded-full
                bg-slate-100 dark:bg-[#111111]
                border border-slate-200 dark:border-[#222222]
                px-3 py-1.5 text-sm
                text-slate-500 dark:text-[#606060]
                focus-within:ring-2 focus-within:ring-[#F5C842]/40
                transition-all duration-150
              ">
                <Search className="h-4 w-4 flex-none" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Suchen"
                  className="
                    w-full bg-transparent text-sm outline-none
                    text-slate-900 dark:text-[#F5F5F5]
                    placeholder:text-slate-400 dark:placeholder:text-[#606060]
                  "
                />
              </label>
            </div>
          )}

          {/* Sprache + Avatar */}
          <div className="flex items-center gap-2 flex-none">
            <LanguageDropdown />
            <AuthAvatar />
          </div>
        </div>

        {/* ── MOBILE (< md) ── */}
        <div className="flex md:hidden h-14 items-center justify-between px-4">
          {/* Logo / Home-Link */}
          <Link
            href="/"
            aria-label="WohnenWo – Startseite"
            className="
              inline-flex h-9 w-9 items-center justify-center
              rounded-lg border border-slate-200/80 dark:border-[#222222]
              bg-white/80 dark:bg-[#111111]
              shadow-sm
              cursor-pointer
            "
          >
            <img
              src="https://wohnenwo.vercel.app/images/brand/logos/ww-badge-dark.svg"
              alt="WohnenWo"
              className="h-6 w-6 object-contain"
            />
          </Link>

          {/* Rechts: Such-Icon + Hamburger */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={searchOpen ? "Suche schließen" : "Suche öffnen"}
              aria-pressed={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
              className="
                inline-flex h-9 w-9 items-center justify-center
                rounded-full border border-slate-200 dark:border-[#222222]
                bg-white/80 dark:bg-[#111111]
                text-slate-600 dark:text-[#A0A0A0]
                hover:bg-slate-100 dark:hover:bg-[#1A1A1A]
                transition-all duration-150
                cursor-pointer
              "
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label={sidebarOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={sidebarOpen}
              aria-controls="mobile-sidebar"
              onClick={() => setSidebarOpen(true)}
              className="
                inline-flex h-9 w-9 items-center justify-center
                rounded-full border border-slate-200 dark:border-[#222222]
                bg-white/80 dark:bg-[#111111]
                text-slate-600 dark:text-[#A0A0A0]
                hover:bg-slate-100 dark:hover:bg-[#1A1A1A]
                transition-all duration-150
                cursor-pointer
              "
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile-Suchfeld unter der Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: EASE_OUT }}
              className="overflow-hidden border-t border-slate-200 dark:border-[#222222] md:hidden"
            >
              <div className="px-4 py-2">
                <label className="
                  flex items-center gap-2 rounded-full
                  bg-slate-100 dark:bg-[#111111]
                  border border-slate-200 dark:border-[#222222]
                  px-3 py-2 text-sm
                  focus-within:ring-2 focus-within:ring-[#F5C842]/40
                ">
                  <Search className="h-4 w-4 flex-none text-slate-400 dark:text-[#606060]" aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Suchen …"
                    autoFocus
                    className="
                      w-full bg-transparent text-sm outline-none
                      text-slate-900 dark:text-[#F5F5F5]
                      placeholder:text-slate-400 dark:placeholder:text-[#606060]
                    "
                  />
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── MOBILE SIDEBAR ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={backdropVariants}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              className="
                fixed inset-0 z-50
                bg-black/50 dark:bg-black/70
                backdrop-blur-sm
              "
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />

            {/* Sidebar-Panel */}
            <motion.div
              id="mobile-sidebar"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sidebarVariants}
              transition={sidebarTransition}
              className="
                fixed inset-y-0 left-0 z-50
                w-[min(320px,85vw)]
                bg-white dark:bg-[#0A0A0A]
                border-r border-slate-200 dark:border-[#222222]
                flex flex-col
                overflow-y-auto
              "
            >
              {/* Sidebar-Header */}
              <div className="
                flex h-14 flex-none items-center justify-between
                border-b border-slate-200 dark:border-[#222222]
                px-4
              ">
                <Link
                  href="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src="https://wohnenwo.vercel.app/images/brand/logos/ww-badge-dark.svg"
                    alt="WohnenWo"
                    className="h-7 w-7 object-contain"
                  />
                  <span className="text-sm font-semibold text-slate-900 dark:text-[#F5F5F5]">
                    WohnenWo
                  </span>
                </Link>

                <button
                  type="button"
                  aria-label="Menü schließen"
                  onClick={() => setSidebarOpen(false)}
                  className="
                    inline-flex h-9 w-9 items-center justify-center
                    rounded-full
                    text-slate-500 dark:text-[#A0A0A0]
                    hover:bg-slate-100 dark:hover:bg-[#1A1A1A]
                    transition-colors duration-150
                    cursor-pointer
                  "
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Seitenspezifische Links */}
              {navItems.length > 0 && (
                <div className="px-3 py-4 flex-none">
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-[#606060]">
                    Diese Seite
                  </p>
                  <motion.ul
                    variants={containerStagger}
                    initial="hidden"
                    animate="visible"
                    className="space-y-0.5"
                    role="list"
                  >
                    {navItems.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <motion.li
                          key={item.href}
                          variants={itemVariants}
                          transition={itemTransition}
                        >
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            onClick={() => setSidebarOpen(false)}
                            className={`
                              flex items-center rounded-xl px-3 py-2.5
                              text-sm font-medium
                              transition-all duration-150
                              cursor-pointer
                              ${
                                active
                                  ? "bg-[#F5C842]/10 text-[#F5C842]"
                                  : "text-slate-700 dark:text-[#A0A0A0] hover:bg-slate-100 dark:hover:bg-[#1A1A1A] hover:text-slate-900 dark:hover:text-[#F5F5F5]"
                              }
                            `}
                          >
                            {item.label}
                          </Link>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </div>
              )}

              {/* Divider */}
              <div className="h-px w-full bg-slate-200 dark:bg-[#222222] flex-none" />

              {/* Ecosystem-Links */}
              <div className="px-3 py-4 flex-none">
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-[#606060]">
                  Entdecken
                </p>
                <motion.ul
                  variants={containerStagger}
                  initial="hidden"
                  animate="visible"
                  className="space-y-0.5"
                  role="list"
                >
                  {ecosystemSections.flatMap((section) =>
                    section.links.map((link) => (
                      <motion.li
                        key={`${section.id}-${link.href}-${link.label}`}
                        variants={itemVariants}
                        transition={itemTransition}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setSidebarOpen(false)}
                          className="
                            flex items-center gap-3 rounded-xl px-3 py-2.5
                            text-sm
                            text-slate-700 dark:text-[#A0A0A0]
                            hover:bg-slate-100 dark:hover:bg-[#1A1A1A]
                            hover:text-slate-900 dark:hover:text-[#F5F5F5]
                            transition-all duration-150
                            cursor-pointer
                          "
                        >
                          <BadgeRenderer badge={link.badge} />
                          <span>{link.label}</span>
                        </Link>
                      </motion.li>
                    ))
                  )}
                </motion.ul>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-slate-200 dark:bg-[#222222] flex-none" />

              {/* Sidebar-Footer: Auth + Language */}
              <div className="px-4 py-4 mt-auto flex items-center justify-between">
                <AuthAvatar />
                <LanguageDropdown />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SVG-Filter (für bestehende Komponenten) */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }} aria-hidden="true">
        <filter id="lensFilter" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feComponentTransfer in="SourceAlpha" result="alpha">
            <feFuncA type="identity" />
          </feComponentTransfer>
          <feGaussianBlur in="alpha" stdDeviation="50" result="blur" />
          <feDisplacementMap in="SourceGraphic" in2="blur" scale="50" xChannelSelector="A" yChannelSelector="A" />
        </filter>
      </svg>
    </>
  );
}
