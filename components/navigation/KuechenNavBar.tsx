"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, Globe, Search, User, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Raumgestaltung", href: "/innenarchitektur",},
  { label: "Küchen", href: "/innenarchitektur/kuechen", current: true },
  { label: "Bäder", href: "/innenarchitektur/baeder" },
  { label: "Ankleiden", href: "/innenarchitektur/ankleiden" },
  { label: "Schlafen", href: "/innenarchitektur/schlafen" },
  { label: "Wohnen", href: "/innenarchitektur/wohnen" },
];

export default function KuechenNavbar() {
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const toggleLanguage = () => setLanguageOpen((v) => !v);
  const toggleFlyout = () => setFlyoutOpen((v) => !v);

  const toggleMobileSearch = () => {
    setMobileSearchOpen((v) => !v);
    if (!mobileSearchOpen) setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((v) => !v);
    if (!mobileMenuOpen) setMobileSearchOpen(false);
  };

  return (
    <nav
      className="
        fixed inset-x-0 top-0 z-40
        bg-transparent
        backdrop-blur bg-white/70
        border-b border-slate-200
      "
      aria-label="Main site navigation"
    >
      {/* DESKTOP-HEADER (>= md) */}
      <div className="hidden h-14 items-center justify-between px-4 md:flex">
        {/* Viewport-Links: Ecosystem Flyout (Brand Orbit-Icon ganz links) */}
        <div className="flex items-center gap-3">
          <div
            className="relative"
            onMouseEnter={() => setFlyoutOpen(true)}
            onMouseLeave={() => setFlyoutOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={flyoutOpen}
              aria-label="Ecosystem Dropdown"
              onClick={toggleFlyout}
              className="border border-slate-200/80 rounded-md p-1 flex items-center justify-center shadow-sm ring-1 ring-black/5"
            >
              {/* Brand Orbit-Icon */}
              <span className="inline-flex h-5.5 w-6.5 items-center justify-center">
                <img
                  src="https://wohnenwo.vercel.app/images/brand/logos/ww-badge-dark.svg"
                  alt="Orbit Logo"
                  className="h-5.5 w-5.5 object-contain"
                />
              </span>

              <span
                aria-hidden="true"
                className={`
                  inline-flex h-5 w-4 items-center justify-center
                  text-slate-800
                  transition-transform
                  ${flyoutOpen ? "rotate-180" : ""}
                `}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </span>
            </button>

            {/* Flyout-Panel Desktop – Fab.com-Stil + Apple-Glass-Effekt */}
            {flyoutOpen && (
              <>
                {/* Unsichtbare Hover-Brücke – exakt so breit wie das Flyout */}
                <div className="absolute left-0 top-full w-[640px] h-2" />

                <div className="absolute left-0 mt-2 w-[640px] rounded-3xl overflow-hidden z-40">
                  <div className="relative rounded-[inherit] bg-white border border-slate-200/80 shadow-[0_22px_60px_rgba(15,23,42,0.25)]">
                    {/* --- APPLE GLASS EFFECT --- */}
                    <div
                      className="absolute inset-0 rounded-[inherit] backdrop-blur-[1.5px]"
                      style={{
                        filter:
                          "url(#lensFilter) saturate(1.05) brightness(1.03)",
                      }}
                    />
                    <div className="absolute inset-0 rounded-[inherit] bg-white/20" />
                    <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45),inset_0_0_0_1px_rgba(0,0,0,0.06)]" />
                    <div className="absolute inset-0 rounded-[inherit] ring-1 ring-white/20 ring-offset-1 ring-offset-white/30" />
                    {/* --- END APPLE GLASS EFFECT --- */}

                    {/* Inhalt – Fab.com Layout */}
                    <div className="relative z-10 flex text-sm text-slate-700">
                      {/* Linke Spalte: Handeln + Entdecken */}
                      <div className="flex w-1/2 flex-col border-r border-slate-200">
                        {/* Handeln */}
                        <div className="px-5 py-4 space-y-3">
                          <h3 className="text-base font-semibold tracking-tight">
                            Handeln
                          </h3>
                          <ul className="space-y-2 text-[14px]">
                            <li>
                              <a
                                href="/"
                                className="flex items-center gap-3 rounded-md px-2.5 py-2 hover:bg-slate-100"
                              >
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                                  <span className="h-3.5 w-3.5 rounded-full bg-white/80" />
                                </span>
                                <span>Startseite</span>
                              </a>
                            </li>
                            <li>
                              <a
                                href="/experten-netzwerk"
                                className="flex items-center gap-3 rounded-md px-2.5 py-2 hover:bg-slate-100"
                              >
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-900 text-[12px] font-semibold">
                                  EX
                                </span>
                                <span>Experten-Netzwerk</span>
                              </a>
                            </li>
                          </ul>
                        </div>

                        {/* Divider zwischen Handeln & Entdecken */}
                        <div className="h-px w-full bg-slate-200/70" />

                        {/* Entdecken */}
                        <div className="px-5 pb-4 pt-2 space-y-3">
                          <h3 className="text-base font-semibold tracking-tight">
                            Entdecken
                          </h3>
                          <ul className="space-y-2 text-[14px]">
                            <li>
                              <a
                                href="/designentsteht"
                                className="flex items-center gap-3 rounded-md px-2.5 py-2 hover:bg-slate-100"
                              >
                                <span className="inline-flex h-6 w-6 items-center justify-center">
                                  <img
                                    src="https://wohnenwo.vercel.app/images/brand/logos/wwde-badge-dark.svg"
                                    alt="wwde Logo"
                                    className="h-6 w-6 object-contain"
                                  />
                                </span>
                                <span>WohnenWo Design entsteht</span>
                              </a>
                            </li>
                            <li>
                              <a
                                href="/dienst&wirkung"
                                className="flex items-center gap-3 rounded-md px-2.5 py-2 hover:bg-slate-100"
                              >
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[12px] font-black text-slate-900">
                                  DW
                                </span>
                                <span>Dienst & Wirkung</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Rechte Spalte: Wirken */}
                      <div className="w-1/2 px-5 py-4 space-y-3">
                        <h3 className="text-base font-semibold tracking-tight">
                          Wirken
                        </h3>
                        <ul className="space-y-2 text-[14px]">
                          <li>
                            <a
                              href="/"
                              className="flex items-center gap-3 rounded-md px-2.5 py-2 hover:bg-slate-100"
                            >
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-900 text-[11px] font-black">
                                P
                              </span>
                              <span>Philosophie</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="/"
                              className="flex items-center gap-3 rounded-md px-2.5 py-2 hover:bg-slate-100"
                            >
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                                <span className="h-3.5 w-3.5 rounded-full bg-white/80" />
                              </span>
                              <span>Strategische Planung</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="/"
                              className="flex items-center gap-3 rounded-md px-2.5 py-2 hover:bg-slate-100"
                            >
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] bg-white text-[10px] font-black text-slate-900">
                                €
                              </span>
                              <span>Store</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="/"
                              className="flex items-center gap-3 rounded-md px-2.5 py-2 hover:bg-slate-100"
                            >
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                                <span className="h-3.5 w-3.5 rounded-full bg-white/80" />
                              </span>
                              <span>Community</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="/"
                              className="flex items-center gap-3 rounded-md px-2.5 py-2 hover:bg-slate-100"
                            >
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded_full bg-white/10">
                                <span className="h-3.5 w-3.5 rounded-full bg-white/80" />
                              </span>
                              <span>Masterpiece Furniture</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mitte: zentrierter Bereich (max-w-6xl) mit neuem Logo + Tabs */}
        <div className="flex-1 flex justify-center">
          <div className="flex h-full max-w-6xl flex-1 items-center gap-4">
            {/* Neues Logo mit gleichem Rahmen, Link zu /designentsteht */}
            <a
              href="/designentsteht"
              aria-label="Back"
              className="border border-slate-200/80 rounded-full p-1 w-8 h-8 flex items-center justify-center shadow-sm ring-1 ring-black/5 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="h-5.5 w-5.5 -translate-x-px" />
            </a>

          {/* Vertikaler Divider direkt neben dem Orbit-Button */}
          <div className="h-7.5 w-px rounded-full bg-slate-200" />

            {/* Tabs (Desktop) */}
            <ul
              className="
                hidden items-center gap-1
                md:flex
              "
              role="menu"
            >
              {NAV_ITEMS.map((item) => {
                const isCurrent = item.current;

                const baseClasses =
                  "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors";
                const active = "bg-slate-100 text-slate-800";
                const ghost = "text-slate-600/80 hover:bg-slate-100";

                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      role="menuitem"
                      aria-current={isCurrent ? "page" : undefined}
                      className={`${baseClasses} ${
                        isCurrent ? active : ghost
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Rechts: Language + Avatar */}
        <div className="flex items-center gap-2">
          {/* Language Dropdown (Desktop) */}
          <div
            className="relative"
            onMouseEnter={() => setLanguageOpen(true)}
            onMouseLeave={() => setLanguageOpen(false)}
          >
            <button
              type="button"
              aria-label="Sprache auswählen"
              onClick={toggleLanguage}
              aria-haspopup="true"
              aria-expanded={languageOpen}
              className="
                inline-flex h-8 w-8 items-center justify-center
                rounded-full border border-slate-200
                bg-white text-slate-700
                hover:bg-slate-50
                transition-colors
              "
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
            </button>

            {languageOpen && (
              <>
                {/* Unsichtbare Hover-Fläche – so breit wie das Sprach-Flyout */}
                <div className="absolute right-0 top-full w-52 h-2" />

                <div
                  className="
                    absolute right-0 mt-2 w-52 rounded-xl border border-slate-200
                    bg-white p-1 shadow-lg space-y-1
                  "
                  role="menu"
                  aria-label="Sprachauswahl"
                >
                  {(() => {
                    const baseClasses =
                      "flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm font-medium transition-colors";
                    const active = "bg-slate-100 text-slate-800";
                    const ghost = "text-slate-600/80 hover:bg-slate-100";

                    const isDeutschActive = true;

                    return (
                      <>
                        <button
                          type="button"
                          className={`${baseClasses} ${
                            isDeutschActive ? active : ghost
                          }`}
                        >
                          <span>Deutsch</span>
                          {isDeutschActive && (
                            <span className="inline-flex h-4 w-4 items-center justify-center">
                              <svg
                                viewBox="0 0 24 24"
                                className="h-4 w-4 text-emerald-600"
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
                            </span>
                          )}
                        </button>

                        <button
                          type="button"
                          disabled
                          aria-disabled="true"
                          className={`${baseClasses} ${ghost} cursor-default`}
                        >
                          <span>Weitere Sprachen folgen.</span>
                        </button>
                      </>
                    );
                  })()}
                </div>
              </>
            )}
          </div>

          <Link
            href="/auth/anmelden"
            aria-label="Sign in"
            className="
              inline-flex h-8 w-8 items-center justify-center
              rounded-full bg-slate-900 text-white
              hover:bg-black
              transition-colors
            "
          >
            <User className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* MOBILE-HEADER (< md) – unverändert */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:hidden">
        {/* Links: Ecosystem-Button */}
        <div className="flex items-center">
          <div className="relative">
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={flyoutOpen}
              aria-label="Ecosystem Dropdown"
              onClick={toggleFlyout}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-1 py-1 text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center">
                <img
                  src="https://wohnenwo.vercel.app/images/brand/logos/ww-badge-dark.svg"
                  alt="Orbit Logo"
                  className="h-5 w-5 object-contain"
                />
              </span>

              <span
                aria-hidden="true"
                className={`
                  inline-flex h-5 w-4 items-center justify-center
                  text-slate-800
                  transition-transform
                  ${flyoutOpen ? "rotate-180" : ""}
                `}
              >
                <ChevronDown className="h-3 w-3" />
              </span>
            </button>

            {/* Flyout-Panel Mobile – weiterhin einfache Karte */}
            {flyoutOpen && (
              <div
                className="
                  absolute left-0 mt-2 w-72 rounded-2xl border border-slate-200
                  bg-white p-4 shadow-xl
                "
              >
                <h2 className="mb-2 text-sm font-semibold text-slate-900">
                  Orbit
                </h2>
                <p className="text-xs text-slate-600">
                  Hier kannst du dein Ökosystem wie bei Epic Games aufbauen:
                  Studios, Partner, Dienste – alles an einem Ort.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mitte: Logo */}
        <a
          href="/"
          aria-label="WohnenWo – Startseite"
          className="flex items-center justify-center"
        >
          <div className="bg-white/80 backdrop-blur border border-slate-200/80 rounded-md p-1 w-9 h-9 flex items-center justify-center shadow-sm ring-1 ring-black/5">
            <img
              src="https://wohnenwo.vercel.app/images/brand/logos/ww-badge-dark.svg"
              alt="Logo"
              className="w-7 h-7 object-contain"
            />
          </div>
        </a>

        {/* Rechts: Search + Hamburger */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Search"
            aria-pressed={mobileSearchOpen}
            onClick={toggleMobileSearch}
            className="
              inline-flex h-8 w-8 items-center justify-center
              rounded-full border border-slate-200
              bg-white text-slate-700
              hover:bg-slate-50
              transition-colors
            "
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Open the navigation menu"
            aria-pressed={mobileMenuOpen}
            onClick={toggleMobileMenu}
            className="
              inline-flex h-8 w-8 items-center justify-center
              rounded-full border border-slate-200
              bg-white text-slate-700
              hover:bg-slate-50
              transition-colors
            "
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE: Suchfeld unter der Bar – nur wenn Search aktiv */}
      {mobileSearchOpen && (
        <div className="border-t border-slate-200 px-4 py-2 md:hidden">
          <label className="group flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-500 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-slate-400">
            <Search
              aria-hidden="true"
              className="h-4 w-4 flex-none opacity-80"
            />
            <input
              type="text"
              placeholder="Suchen"
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
            />
          </label>
        </div>
      )}

      {/* MOBILE: Menüpanel unter der Bar */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-2 md:hidden">
          <ul className="space-y-1" role="menu">
            {NAV_ITEMS.map((item) => {
              const isCurrent = item.current;

              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    role="menuitem"
                    aria-current={isCurrent ? "page" : undefined}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isCurrent
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* SVG-Filter für Apple-Glass-Effekt */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "none" }}
        aria-hidden="true"
      >
        <filter
          id="lensFilter"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feComponentTransfer in="SourceAlpha" result="alpha">
            <feFuncA type="identity" />
          </feComponentTransfer>
          <feGaussianBlur in="alpha" stdDeviation="50" result="blur" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blur"
            scale="50"
            xChannelSelector="A"
            yChannelSelector="A"
          />
        </filter>
      </svg>
    </nav>
  );
}
