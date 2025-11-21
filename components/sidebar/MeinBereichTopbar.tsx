"use client";

import Link from "next/link";
import { PanelsTopLeft, Search, Menu } from "lucide-react";

export default function MeinBereichTopbar() {
  // wenn du später ein Mobile-Menü brauchst, kannst du hier State ergänzen
  // const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30">
      <div className="w-full mx-auto bg-slate-950/95 border-b border-slate-800/80 backdrop-blur">
        <div className="relative w-full px-4 md:px-5">
          <nav className="flex items-center justify-between py-3">
            {/* Linke Seite */}
            <div className="flex items-center gap-3">
              {/* Mobile: kleines Logo (wie bei Memorisely) */}
              <Link
                href="/mein-bereich"
                className="border border-slate-800 h-9 w-9 flex items-center justify-center rounded-md bg-white text-slate-900 md:hidden"
              >
                <PanelsTopLeft className="h-4 w-4" />
              </Link>

              {/* Desktop-Suche */}
              <div className="hidden md:block md:relative md:max-w-[400px] md:min-w-[240px] md:w-full">
                <div className="relative w-full">
                  <input
                    placeholder="Suchen..."
                    className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/70 px-9 text-sm text-slate-100 placeholder:text-slate-500
                               hover:bg-slate-900 focus:outline-none focus:border-slate-500 focus:border-2 transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center text-xs text-slate-300">
                    <Search className="h-4 w-4" />
                  </div>
                  <div className="absolute top-1.5 right-3 text-xs text-slate-500">
                    ⌘ S
                  </div>
                </div>
              </div>
            </div>

            {/* Rechte Seite */}
            <div className="flex items-center gap-2">
              {/* Desktop: Actions (später z.B. Profil/Notifications) */}
              <div className="hidden md:flex items-center space-x-2">
                {/* Platzhalter-Buttons – kannst du durch dein Profil ersetzen */}
                <button className="rounded-md border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 transition">
                  Mein Profil
                </button>
                <button className="rounded-md border border-yellow-400/80 bg-yellow-400 text-slate-950 px-3 py-1.5 text-xs font-semibold hover:bg-yellow-300 transition">
                  Neue Anfrage
                </button>
              </div>

              {/* Mobile: Suche + Menu Icon */}
              <div className="md:hidden flex items-center gap-2">
                {/* Mobile-Suche unter der Topbar wie im Snippet */}
                {/* Wir packen sie in einen zweiten Block unter der Hauptzeile (s.u.) */}
                <button
                  className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-900/70 transition"
                  aria-label="Menü öffnen"
                >
                  <Menu className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile-Suche (unter der Hauptzeile, wie im Original) */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full">
            <input
              placeholder="Suchen..."
              className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/70 px-9 text-sm text-slate-100 placeholder:text-slate-500
                         hover:bg-slate-900 focus:outline-none focus:border-slate-500 focus:border-2 transition-all duration-200"
            />
            <div className="absolute inset-y-0 left-3 flex items-center text-xs text-slate-300">
              <Search className="h-4 w-4" />
            </div>
            <div className="absolute top-1.5 right-3 text-xs text-slate-500">
              ⌘ S
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
