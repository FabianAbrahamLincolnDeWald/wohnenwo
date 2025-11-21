"use client";

import * as React from "react";
import Link from "next/link";
import {
  PanelsTopLeft,
  LayoutGrid,
  BookOpen,
  Dumbbell,
  Bookmark,
  Users,
  Search,
  Menu,
} from "lucide-react";

export default function MeinBereichPage() {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* SIDEBAR – nur ab md sichtbar */}
      <aside
        className="hidden md:flex flex-col shrink-0 h-screen bg-slate-50 py-3 px-5 border-r border-slate-200 sticky top-0 overflow-hidden"
        style={{ width: 240 }}
      >
        {/* Logo / Home-Button */}
        <div className="mb-5">
          <Link
            href="/mein-bereich"
            className="border border-slate-200 h-9 w-9 flex items-center justify-center rounded-md bg-white text-slate-900"
          >
            <PanelsTopLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          {/* Hauptnavigation */}
          <nav className="flex flex-col gap-1.5">
            <NavItem href="/mein-bereich" icon={LayoutGrid} label="Home" />
            <NavItem
              href="/mein-bereich/kurse"
              icon={BookOpen}
              label="Kurse"
            />
            <NavItem
              href="/mein-bereich/training"
              icon={Dumbbell}
              label="Dein Training"
            />
            <NavItem
              href="/mein-bereich/sammlungen"
              icon={Bookmark}
              label="Sammlungen"
            />
          </nav>

          {/* Community-Bereich */}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-medium text-slate-400 mb-1 tracking-wide">
              Community
            </div>
            <nav className="flex flex-col gap-1.5">
              <NavItem
                href="/mein-bereich/community"
                icon={Users}
                label="Jobs & Community"
              />
            </nav>
          </div>
        </div>
      </aside>

      {/* RECHTE SEITE: Topbar + Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30">
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

        {/* CONTENT-BEREICH */}
        <main className="flex-1 bg-slate-100">
          <div className="mx-auto w-full max-w-5xl px-4 md:px-6 py-6">
            <header className="space-y-1 mb-6">
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                Debug 999 – Mein Bereich
              </h1>
              <p className="text-sm text-slate-500 max-w-xl">
                Willkommen in deinem persönlichen WohnenWo-Bereich. Hier
                findest du deine Projekte, Anfragen und Trainings auf einen
                Blick.
              </p>
            </header>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card eyebrow="Übersicht" title="Aktive Projekte">
                Hier erscheinen deine laufenden WohnenWo-Projekte.
              </Card>

              <Card eyebrow="Training" title="Transparenz &amp; Wirkung">
                Module und Sessions rund um deine transparente
                Wirtschaftskultur.
              </Card>

              <Card eyebrow="Community" title="Netzwerk &amp; Jobs">
                Zugang zu Fachkräften, Partnern und möglichen Aufträgen.
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

/* --- Kleine, lokale Hilfs-Komponenten --- */

type NavItemProps = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function NavItem({ href, label, icon: Icon }: NavItemProps) {
  return (
    <Link href={href} className="w-full">
      <div className="flex w-full items-center gap-x-2 p-2.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 ease-in-out">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-[15px] font-medium leading-tight">{label}</span>
      </div>
    </Link>
  );
}

type CardProps = {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
};

function Card({ eyebrow, title, children }: CardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.15em] text-slate-400 mb-1">
          {eyebrow}
        </p>
      )}
      <h2 className="text-sm font-semibold text-slate-900 mb-1">{title}</h2>
      {children && (
        <div className="text-xs text-slate-500 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}
