// components/mein-bereich/Topbar.tsx
"use client";

import Link from "next/link";
import { PanelsTopLeft, Search, Menu } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-20">
      <div className="w-full mx-auto bg-slate-50 border-b border-slate-200">
        {/* Hauptzeile */}
        <div className="relative w-full px-4 md:px-5">
          <nav className="flex items-center justify-between py-3">
            {/* Links: Mobile-Logo + Desktop-Suche */}
            <div className="flex items-center gap-3">
              {/* Mobile-Logo */}
              <Link
                href="/mein-bereich"
                className="border border-slate-200 h-9 w-9 flex items-center justify-center rounded-md bg-white text-slate-900 md:hidden"
              >
                <PanelsTopLeft className="h-4 w-4" />
              </Link>

              {/* Desktop-Suche */}
              <div className="hidden md:block md:relative md:max-w-[400px] md:min-w-[200px] md:w-full">
                <div className="relative w-full">
                  <input
                    placeholder="Search..."
                    className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-9 text-sm text-slate-900 placeholder:text-slate-400 hover:bg-slate-100 md:hover:border-slate-300 focus:outline-none focus:border-slate-300 focus:border-2 transition-all duration-300"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center text-xs text-slate-500">
                    <Search className="h-4 w-4" />
                  </div>
                  <div className="absolute top-1.5 right-3 text-xs text-slate-400">
                    ⌘ S
                  </div>
                </div>
              </div>
            </div>

            {/* Rechts: Buttons + Mobile-Menü */}
            <div className="flex items-center gap-x-2">
              {/* Desktop Buttons */}
              <div className="hidden md:flex space-x-2 items-center">
                <button className="rounded-md border border-slate-300 bg-white text-slate-700 px-3 py-1.5 text-xs font-medium hover:bg-slate-100 transition">
                  Anmelden
                </button>
                <button className="rounded-md border border-slate-900 bg-slate-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-black transition">
                  Registrieren
                </button>
              </div>

              {/* Mobile: Burger */}
              <div className="md:hidden">
                <button
                  type="button"
                  className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100 transition"
                  aria-label="Menü öffnen"
                >
                  <Menu className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile-Suche */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full">
            <input
              placeholder="Search..."
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-9 text-sm text-slate-900 placeholder:text-slate-400 hover:bg-slate-100 focus:outline-none focus:border-slate-300 focus:border-2 transition-all duration-300"
            />
            <div className="absolute inset-y-0 left-3 flex items-center text-xs text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <div className="absolute top-1.5 right-3 text-xs text-slate-400">
              ⌘ S
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
