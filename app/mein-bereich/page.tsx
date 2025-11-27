// app/mein-bereich/page.tsx
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import InvoicesTeaser from "@/components/mein-bereich/sections/InvoicesTeaser";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  kundenummer: string | null; // Schreibweise so lassen, wie deine Tabelle es hat
};

type ViewState = "loading" | "demo" | "user" | "kunde";

export default function MeinBereichPage() {
  const [view, setView] = useState<ViewState>("loading");
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      // 1. Ist jemand eingeloggt?
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) {
        if (!active) return;
        setView("demo");
        setProfile(null);
        return;
      }

      // 2. Profil aus Supabase laden
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, kundenummer")
        .eq("id", user.id)
        .single();

      if (!active) return;

      if (error || !data) {
        console.error("Profil konnte nicht geladen werden:", error);
        setView("user"); // Fallback
        return;
      }

      setProfile(data);

      const role = (data.role || "user") as string;
      setView(role === "kunde" ? "kunde" : "user");
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const name =
    profile?.full_name ||
    profile?.email?.split("@")[0] ||
    (view === "demo" ? "Gast" : "Willkommen zurück");

  // ─────────────────────────────
  // 1) Loading
  // ─────────────────────────────
  if (view === "loading") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pt-20">
        <div className="mx-auto max-w-4xl text-sm text-slate-500">
          Lade „Mein Bereich“ …
        </div>
      </main>
    );
  }

  // ─────────────────────────────
  // 2) Demo (nicht angemeldet)
  // ─────────────────────────────
  if (view === "demo") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pt-20 pb-10">
        <div className="mx-auto max-w-4xl space-y-4">
          <header className="space-y-1">
            <p className="text-[11px] tracking-[0.24em] uppercase text-slate-500">
              Vorschau
            </p>
            <h1 className="text-[24px] font-semibold tracking-tight text-slate-900">
              Mein Bereich – Vorschau ohne Anmeldung
            </h1>
            <p className="text-sm text-slate-600">
              Hier siehst du, wofür dieser Bereich gedacht ist. Sobald du einen
              Zugang hast, erscheinen hier deine echten Projekte und
              Dokumente.
            </p>
          </header>

          <div className="grid gap-3 md:grid-cols-3 text-xs text-slate-600">
            <DemoCard title="Beispielrechnung" />
            <DemoCard title="Beispielprojekt" />
            <DemoCard title="Wirkungsfonds" />
          </div>
        </div>
      </main>
    );
  }

  // ─────────────────────────────
  // 3) Eingeloggt, aber (noch) kein Kunde
  // ─────────────────────────────
  if (view === "user") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pt-20 pb-10">
        <div className="mx-auto max-w-4xl space-y-4">
          <header className="space-y-1">
            <p className="text-[11px] tracking-[0.24em] uppercase text-slate-500">
              Mein Bereich
            </p>
            <h1 className="text-[24px] font-semibold tracking-tight text-slate-900">
              Hallo {name}.
            </h1>
            <p className="text-sm text-slate-600">
              Du bist angemeldet. Sobald wir ein gemeinsames Projekt starten,
              erscheinen hier deine Projekte, Rechnungen und Wirkungsinformationen.
            </p>
          </header>

          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            Noch sind keine persönlichen Inhalte freigeschaltet.
            <br />
            <span className="text-xs text-slate-500">
              Wenn du bereits Kundin oder Kunde bist, verknüpfen wir deinen
              bestehenden Auftrag mit deinem Zugang.
            </span>
          </div>
        </div>
      </main>
    );
  }

  // ─────────────────────────────
  // 4) Kunde (view === "kunde")
  // ─────────────────────────────

  // Für den Anfang: statischer Eintrag für Andrea (später aus Supabase laden)
  const andreaInvoice = {
    invoiceNumber: "2025.10.001/001",
    title: "Austausch Kochfeld",
    date: "29.10.2025",
    amount: "399,60 €",
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 pt-20 pb-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <header className="space-y-1">
          <p className="text-[11px] tracking-[0.24em] uppercase text-emerald-600">
            Persönlicher Wirkungsraum
          </p>
          <h1 className="text-[24px] font-semibold tracking-tight text-slate-900">
            Willkommen zurück, {name}.
          </h1>
          {profile?.kundenummer && (
            <p className="text-[12px] text-slate-500">
              Kundennummer: {profile.kundenummer}
            </p>
          )}
        </header>

        {/* Erste funktionale Kachel: Rechnungs-Teaser */}
        <InvoicesTeaser nextInvoice={andreaInvoice} />

        {/* Platzhalter für spätere Kacheln */}
        <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-slate-600">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            Hier folgt später deine Projektübersicht.
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            Hier folgt später dein Einblick in Wertschöpfung & Wirkungsfonds.
          </div>
        </div>
      </div>
    </main>
  );
}

/* ───────────── kleine Demo-Karte ───────────── */

function DemoCard({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="h-4 w-24 rounded bg-slate-100 mb-2" />
      <div className="text-[13px] font-medium text-slate-800">{title}</div>
      <div className="mt-1 h-3 w-full rounded bg-slate-100" />
    </div>
  );
}
