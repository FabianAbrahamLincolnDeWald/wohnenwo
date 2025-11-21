// app/mein-bereich/page.tsx
"use client";

import DashboardShell from "@/components/mein-bereich/DashboardShell";
import * as React from "react";

export default function MeinBereichPage() {
  return (
    <DashboardShell>
      <header className="space-y-1 mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
          Debug 999 – Mein Bereich
        </h1>
        <p className="text-sm text-slate-500 max-w-xl">
          Willkommen in deinem persönlichen WohnenWo-Bereich. Hier findest du
          deine Projekte, Anfragen und Trainings auf einen Blick.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card eyebrow="Übersicht" title="Aktive Projekte">
          Hier erscheinen deine laufenden WohnenWo-Projekte.
        </Card>

        <Card eyebrow="Training" title="Transparenz &amp; Wirkung">
          Module und Sessions rund um deine transparente Wirtschaftskultur.
        </Card>

        <Card eyebrow="Community" title="Netzwerk &amp; Jobs">
          Zugang zu Fachkräften, Partnern und möglichen Aufträgen.
        </Card>
      </section>
    </DashboardShell>
  );
}

/* Kleine Hilfs-Komponente für Cards (kann später auch in /components umziehen) */

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
