"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

/**
 * DashboardShell
 * - lädt den aktuell eingeloggten Supabase-User (falls vorhanden)
 * - zeigt:
 *   - Demo-Bereich (öffentlich), wenn KEIN User
 *   - Personalisierten Bereich, wenn User vorhanden
 */
export default function DashboardShell() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        setUser(null);
      } else {
        setUser(data.user);
      }
      setLoading(false);
    }

    fetchUser();
  }, []);

  // 1) Ladezustand – kleiner, ruhiger Loader
  if (loading) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="h-6 w-40 rounded-md bg-slate-200 animate-pulse mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded-md bg-slate-200 animate-pulse" />
            <div className="h-4 w-2/3 rounded-md bg-slate-200 animate-pulse" />
            <div className="h-4 w-1/2 rounded-md bg-slate-200 animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  // 2) KEIN User → Demo-Bereich (öffentlich)
  if (!user) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
          {/* Headline */}
          <header className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
              Mein Bereich · Demo
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              Erlebe, was hinter einer Rechnung und einem Projekt steckt.
            </h1>
            <p className="text-sm md:text-[15px] text-slate-600 max-w-2xl">
              Dies ist die öffentliche Vorschau deines persönlichen Bereichs.
              Hier siehst du beispielhaft, wie Wertströme, Dokumentation und
              Projektphasen später dargestellt werden – bevor du dich einloggst.
            </p>
          </header>

          {/* Beispiel-Karte Rechnung */}
          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white/60 p-5 shadow-sm">
              <h2 className="text-[15px] font-semibold text-slate-900">
                Beispiel: Transparente Rechnung
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Hier würde eine konkrete Rechnung – z.&nbsp;B. von Andrea –
                erscheinen, inkl. Aufschlüsselung der{" "}
                <span className="font-medium">Wertschöpfung</span>,
                Beteiligten und Leistungen.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                <li>• Leistung: Beratung & Planung</li>
                <li>• Beteiligte: Studio, Handwerk, Hersteller</li>
                <li>• Aufteilung: Lohn, Material, Schöpfungswert</li>
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Nach dem Login wird dieser Bereich mit deinen echten Daten
                gefüllt.
              </p>
            </div>

            {/* Beispiel-Karte Projektpfad */}
            <div className="rounded-2xl border border-slate-200 bg-white/60 p-5 shadow-sm">
              <h2 className="text-[15px] font-semibold text-slate-900">
                Beispiel: Projektverlauf Küche
              </h2>
              <ol className="mt-2 space-y-1.5 text-sm text-slate-600">
                <li>1 · Entwurf & Angebot</li>
                <li>2 · Vertrag & Finanzierung</li>
                <li>3 · Ausarbeitung & Detailplanung</li>
                <li>4 · Produktion & Logistik</li>
                <li>5 · Montage & Feinschliff</li>
                <li>6 · Übergabe & Dokumentation</li>
              </ol>
              <p className="mt-3 text-xs text-slate-500">
                Jede Phase kann später mit Plänen, PDFs, Bildern und
                Wertströmen hinterlegt werden.
              </p>
            </div>
          </section>

          {/* Hinweis auf Login */}
          <section className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-100/60 px-4 py-3">
            <p className="text-xs md:text-sm text-slate-600">
              Über das <span className="font-medium">Profil-Icon</span> in der
              Navigation kannst du dich anmelden oder registrieren.
              Anschließend wird dieser Bereich zu deinem persönlichen
              Wirkungsbereich.
            </p>
          </section>
        </div>
      </main>
    );
  }

  // 3) User vorhanden → personalisierter Bereich
  const email = user.email ?? "Dein Zugang";

  return (
    <main className="min-h-[calc(100vh-56px)] bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
        {/* Header */}
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
            Mein Bereich · Persönlich
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            Willkommen zurück,&nbsp;
            <span className="text-slate-900/90">{email}</span>
          </h1>
          <p className="text-sm md:text-[15px] text-slate-600 max-w-2xl">
            Hier entsteht dein persönlicher Wirkungsbereich: Rechnungen,
            Wertströme und die vollständige Dokumentation deiner Projekte.
          </p>
        </header>

        {/* Grid: Rechnungen + Projekte */}
        <section className="grid gap-6 md:grid-cols-3">
          {/* Karte: Rechnungen */}
          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm">
            <h2 className="text-[15px] font-semibold text-slate-900">
              Deine Rechnungen & Wertströme
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              In diesem Bereich werden wir deine tatsächlichen Rechnungen
              hinterlegen – jede mit sichtbarer Aufteilung von Lohn,
              Materialkosten, Studioanteil und Schöpfungswert.
            </p>
            <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-500">
              Platzhalter: Hier legen wir als erstes die Rechnung von{" "}
              <span className="font-medium">Andrea</span> an, sobald du soweit
              bist.
            </div>
          </div>

          {/* Karte: Projekte */}
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm">
            <h2 className="text-[15px] font-semibold text-slate-900">
              Projekte & Phasen
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Hier erscheinen später deine Küchen-, Bad- oder
              Erlebniswohnungs-Projekte – inklusive aller Phasen, PDFs und
              Freigaben.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Wir starten mit einem Pilot-Projekt und erweitern den Bereich
              Schritt für Schritt.
            </p>
          </div>
        </section>

        {/* Nächste Schritte-Hinweis für dich selbst */}
        <section className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3">
          <p className="text-xs md:text-[13px] text-amber-900">
            Interner Hinweis: Ab hier kannst du später direkt an eine Sanity- /
            Strapi-Struktur andocken und echte Daten für Rechnungen und
            Projektphasen ausspielen.
          </p>
        </section>
      </div>
    </main>
  );
}
