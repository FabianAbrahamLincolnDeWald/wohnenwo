// components/mein-bereich/PageHeader.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MEIN_BEREICH_NAV_ITEMS,
  findNavItemByPath,
} from "@/components/mein-bereich/nav-config";

export default function PageHeader() {
  const pathname = usePathname();
  const current = findNavItemByPath(pathname);

  const title = current?.label ?? "Mein Bereich";
  const description =
    current?.description ??
    "Dein persönlicher Wirkungsbereich im WohnenWo Ökosystem.";

  return (
    <header className="border-b border-slate-200 bg-white/70 backdrop-blur-sm">
      <div className="mx-auto w-[min(92vw,1120px)] py-4 sm:py-5">
        {/* Titel + Beschreibung */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Mein Bereich
            </p>
            <h1 className="text-xl sm:text-[22px] font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-1 text-[13px] sm:text-sm text-slate-600 max-w-2xl">
              {description}
            </p>
          </div>

          {/* Platzhalter rechts – z.B. für Profil / Status */}
          <div className="mt-3 sm:mt-0 flex items-center gap-2 text-[12px] text-slate-500">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            <span>Im Aufbau · WohnenWo Dashboard</span>
          </div>
        </div>

        {/* Tabs */}
        <nav className="mt-4 flex flex-wrap gap-1.5 text-sm" aria-label="Unterbereiche von Mein Bereich">
          {MEIN_BEREICH_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === pathname || pathname.startsWith(item.href + "/");

            const base =
              "inline-flex items-center rounded-full px-3 py-1.5 transition-colors text-[13px] font-medium";
            const active =
              "bg-slate-900 text-white shadow-sm";
            const idle =
              "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900";

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`${base} ${isActive ? active : idle}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
