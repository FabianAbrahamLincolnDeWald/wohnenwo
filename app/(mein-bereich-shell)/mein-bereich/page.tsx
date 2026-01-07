// app/mein-bereich/page.tsx
"use client";

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  FileText,
  FolderKanban,
  Users as UsersIcon,
  Lock,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  kundenummer: string | null;
};

type ViewState = "loading" | "demo" | "user" | "kunde";

function getInitialsFromProfile(profile: Profile | null): string {
  if (!profile) return "G";
  if (profile.full_name && profile.full_name.trim().length > 0) {
    const parts = profile.full_name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
    return `${parts[0]!.charAt(0)}${parts[1]!.charAt(0)}`.toUpperCase();
  }
  if (profile.email) return profile.email.charAt(0).toUpperCase();
  return "G";
}

function cn(...classes: (string | boolean | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

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
      if (role === "kunde") {
        setView("kunde");
      } else {
        setView("user");
      }
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

  const initials = getInitialsFromProfile(profile);

  // ─────────────────────────────
  // Loading-State
  // ─────────────────────────────

  if (view === "loading") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pt-20 pb-10">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[minmax(0,1.9fr)_minmax(260px,1fr)]">
          <div className="space-y-4">
            <div className="h-6 w-40 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-64 rounded bg-slate-200 animate-pulse" />
            <div className="h-64 w-full rounded-xl bg-slate-100 animate-pulse" />
          </div>
          <aside className="hidden lg:block">
            <div className="h-48 w-full rounded-2xl bg-slate-100 animate-pulse" />
          </aside>
        </div>
      </main>
    );
  }

  const isDemo = view === "demo";
  const isKunde = view === "kunde";

  // kleine Texte je nach View
  const eyebrow = isDemo
    ? "Vorschau"
    : isKunde
    ? "Persönlicher Wirkungsraum"
    : "Mein Bereich";

  const headline = isDemo
    ? "Mein Bereich – so fühlt sich dein Wirkungsraum an."
    : isKunde
    ? `Willkommen zurück, ${name}.`
    : `Hallo ${name}.`;

  const subline = isDemo
    ? "Ohne Anmeldung siehst du hier eine Vorschau. Mit deinem Zugang wird dieser Bereich zu deiner persönlichen Übersicht mit echten Projekten, Rechnungen und Wirkungsfonds."
    : isKunde
    ? "Hier bündeln wir deine Projekte, Rechnungen und die Wirkung deiner Investitionen. In den Taps der Sidebar kannst du später tiefer einsteigen."
    : "Du bist angemeldet. Sobald wir ein gemeinsames Projekt starten, erscheinen hier deine individuellen Projekte, Rechnungen und Wirkungsinformationen.";

  // ─────────────────────────────
  // Hauptlayout: Links Inhalte, rechts statisches Übersicht-Panel
  // ─────────────────────────────

  return (
    <main className="min-h-screen bg-slate-50 px-4 pt-20 pb-10">
      <div className="mx-auto max-w-7xl lg:flex lg:items-start lg:gap-10">
        {/* Linke Spalte: Slider-Bereiche */}
        <div className="flex-1 min-w-0 space-y-10">
          {/* Header */}
          <header className="space-y-3">
            <p className="text-[11px] tracking-[0.24em] uppercase text-slate-500">
              {eyebrow}
            </p>
            <h1 className="text-[24px] md:text-[28px] font-semibold tracking-tight text-slate-900">
              {headline}
            </h1>
            <p className="max-w-2xl text-sm md:text-[15px] text-slate-600">
              {subline}
            </p>
            {isKunde && profile?.kundenummer && (
              <p className="text-[12px] text-slate-500">
                Kundennummer: {profile.kundenummer}
              </p>
            )}
          </header>

          {/* Sektion: Rechnungen – A4-Equipment-Slots */}
          <section>
            <SliderShell
              title="Rechnungen"
              subtitle="0 Rechnungen · Transparente Aufschlüsselung deiner Projekte."
            >
              {isKunde ? (
                <>
                  <InvoiceSlotCard
                    icon={<FileText className="h-12 w-12" />}
                    label="Noch keine Rechnungen hinterlegt"
                    text="Sobald deine erste Projekt-Rechnung vorliegt, erscheint sie hier vollständig aufgeschlüsselt."
                    showLabel
                  />
                  <InvoiceSlotCard
                    icon={<FileText className="h-12 w-12" />}
                    label=""
                    text="Platz für weitere Rechnungen."
                  />
                  <InvoiceSlotCard
                    icon={<FileText className="h-12 w-12" />}
                    label=""
                    text="Platz für weitere Rechnungen."
                  />
                </>
              ) : (
                <>
                  <InvoiceSlotCard
                    icon={<FileText className="h-12 w-12" />}
                    label="Noch keine Rechnungen hinterlegt"
                    text={
                      isDemo
                        ? "In deinem echten Zugang siehst du hier Rechnungen – aufgeschlüsselt nach Material, Handwerk, Planung und Wirkungsfonds."
                        : "Sobald wir gemeinsam ein Projekt starten, erscheinen hier deine transparenten Rechnungen."
                    }
                    showLabel
                  />
                  <InvoiceSlotCard
                    icon={<FileText className="h-12 w-12" />}
                    label=""
                    text="Platz für weitere Rechnungen."
                  />
                  <InvoiceSlotCard
                    icon={<FileText className="h-12 w-12" />}
                    label=""
                    text="Platz für weitere Rechnungen."
                  />
                  <InvoiceSlotCard
                    icon={<FileText className="h-12 w-12" />}
                    label=""
                    text="Platz für weitere Rechnungen."
                  />
                  <InvoiceSlotCard
                    icon={<FileText className="h-12 w-12" />}
                    label=""
                    text="Platz für weitere Rechnungen."
                  />
                  <InvoiceSlotCard
                    icon={<FileText className="h-12 w-12" />}
                    label=""
                    text="Platz für weitere Rechnungen."
                  />
                  <InvoiceSlotCard
                    icon={<FileText className="h-12 w-12" />}
                    label=""
                    text="Platz für weitere Rechnungen."
                  />
                </>
              )}
            </SliderShell>
          </section>

          {/* Sektion: Projekte – 16:9 oben, weißer Streifen unten */}
          <section>
            <SliderShell
              title="Projekte"
              subtitle="0 Projekte · Laufende und abgeschlossene Wohnerlebnisse."
            >
              {isKunde ? (
                <>
                  <ProjectSlotCard
                    icon={<FolderKanban className="h-10 w-10" />}
                    badgeText="1 Projekt-Slot"
                    title="Dein erstes Wohnerlebnis"
                    meta="Status, Meilensteine und Wertentwicklung."
                    showBadge
                  />
                  <ProjectSlotCard
                    icon={<FolderKanban className="h-10 w-10" />}
                    badgeText=""
                    title="Freier Projektslot"
                    meta="Bereit für Küchen, Bäder oder Wohnungen."
                  />
                  <ProjectSlotCard
                    icon={<FolderKanban className="h-10 w-10" />}
                    badgeText=""
                    title="Freier Projektslot"
                    meta="Dein Portfolio wächst mit jedem Projekt."
                  />
                </>
              ) : (
                <>
                  <ProjectSlotCard
                    icon={<FolderKanban className="h-10 w-10" />}
                    badgeText="Noch keine Projekte verknüpft"
                    title="Projektslots warten auf dich"
                    meta={
                      isDemo
                        ? "Hier siehst du später echte Projekte, an denen wir gemeinsam arbeiten."
                        : "Sobald dein erster Auftrag freigeschaltet ist, erscheinen hier deine Projekte."
                    }
                    showBadge
                  />
                  <ProjectSlotCard
                    icon={<FolderKanban className="h-10 w-10" />}
                    badgeText=""
                    title="Freier Projektslot"
                    meta="Dein nächstes Wohnerlebnis."
                  />
                  <ProjectSlotCard
                    icon={<FolderKanban className="h-10 w-10" />}
                    badgeText=""
                    title="Freier Projektslot"
                    meta="Dein nächstes Wohnerlebnis."
                  />
                  <ProjectSlotCard
                    icon={<FolderKanban className="h-10 w-10" />}
                    badgeText=""
                    title="Freier Projektslot"
                    meta="Dein nächstes Wohnerlebnis."
                  />
                  <ProjectSlotCard
                    icon={<FolderKanban className="h-10 w-10" />}
                    badgeText=""
                    title="Freier Projektslot"
                    meta="Dein nächstes Wohnerlebnis."
                  />
                  <ProjectSlotCard
                    icon={<FolderKanban className="h-10 w-10" />}
                    badgeText=""
                    title="Freier Projektslot"
                    meta="Dein nächstes Wohnerlebnis."
                  />
                  <ProjectSlotCard
                    icon={<FolderKanban className="h-10 w-10" />}
                    badgeText=""
                    title="Freier Projektslot"
                    meta="Dein nächstes Wohnerlebnis."
                  />
                </>
              )}
            </SliderShell>
          </section>

          {/* Sektion: Arbeite mit – Profilkarten-Equipment-Slider */}
          <section>
            <SliderShell
              title="Arbeite mit"
              subtitle="0 verbundene Experten · Menschen, mit denen du im Wertschöpfungs-Kreis verbunden bist."
            >
              <PersonSlotCard
                name={
                  isDemo ? "Beispiel – Planung & Studio" : "Noch kein Team verknüpft"
                }
                role={
                  isDemo
                    ? "Studio & Planung"
                    : "Sobald wir dein Team verknüpft haben, siehst du es hier."
                }
                showBadge
                badgeText="Team-Slots"
              />
              <PersonSlotCard
                name="Freier Team-Slot"
                role="Platz für weitere Studios, Planer:innen oder Hersteller."
              />
              <PersonSlotCard
                name="Freier Team-Slot"
                role="Dein Netzwerk wächst mit jedem Projekt."
              />
              <PersonSlotCard
                name="Freier Team-Slot"
                role="Dein Netzwerk wächst mit jedem Projekt."
              />
              <PersonSlotCard
                name="Freier Team-Slot"
                role="Dein Netzwerk wächst mit jedem Projekt."
              />
              <PersonSlotCard
                name="Freier Team-Slot"
                role="Dein Netzwerk wächst mit jedem Projekt."
              />
              <PersonSlotCard
                name="Freier Team-Slot"
                role="Dein Netzwerk wächst mit jedem Projekt."
              />
              <PersonSlotCard
                name="Freier Team-Slot"
                role="Dein Netzwerk wächst mit jedem Projekt."
              />
            </SliderShell>
          </section>
        </div>

        {/* Rechte Spalte: sticky Wirkungskonto mit Divider */}
        <aside
          className="
            hidden lg:block
            w-[300px]
            lg:pl-8
            lg:border-l lg:border-slate-200/80
            lg:sticky lg:top-24
            self-start
          "
        >
          <div className="space-y-5">
            {/* Wirkungskonto / Profil-Panel */}
            <section className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200/80 px-4 py-5 space-y-5 shadow-sm">
              {/* Eyebrow + lockerer Introtext */}
              <header className="space-y-1">
                <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
                  Dein Wirkungskonto
                </p>
                <p className="text-[13px] leading-snug text-slate-700">
                  {isDemo
                    ? "Lerne deinen Wirkungsraum kennen – ganz ohne Verpflichtung."
                    : "Schön, dass du da bist. Hier wächst die Wirkung deiner Investitionen."}
                </p>
              </header>

              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex h-9 w-9 items-center justify-center
                             rounded-full bg-slate-900 text-white
                             text-[13px] font-semibold"
                >
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-slate-900 truncate">
                    {name}
                  </p>
                  <p className="text-[12px] text-slate-500 truncate">
                    {profile?.email ||
                      (isDemo ? "Gast-Zugang" : "Ohne E-Mail hinterlegt")}
                  </p>
                </div>
              </div>

              {/* Highlight-Block – „Reward“-Gefühl */}
              <div className="rounded-xl bg-slate-900 text-slate-50 px-4 py-3 space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300">
                  Nächster Schritt
                </p>
                <p className="text-[13px] leading-snug">
                  Starte dein erstes Projekt, um Wirkungspunkte zu sammeln und
                  dein Konto zu füllen.
                </p>
                <button
                  type="button"
                  className="mt-1 inline-flex items-center justify-center rounded-full
                             bg-white/90 px-3 py-1 text-[12px] font-medium text-slate-900"
                >
                  Projekt anfragen
                </button>
              </div>

              {/* Wirkungsabzeichen */}
              <div className="pt-2 border-t border-slate-100/80 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                    Wirkungsabzeichen
                  </p>
                  <p className="text-[11px] text-slate-400">0 / 5</p>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50"
                    >
                      <Lock className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Kennzahlen – locker gesetzt */}
              <div className="space-y-3 text-[12px] text-slate-600">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Wirkungspunkte</span>
                    <span className="font-semibold text-slate-900">
                      0&nbsp;px
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-0 rounded-full bg-emerald-500" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span>Projekte</span>
                  <span className="font-semibold text-slate-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Investiertes Volumen</span>
                  <span className="font-semibold text-slate-900">
                    0&nbsp;€
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Wirkungsfonds-Anteil</span>
                  <span className="font-semibold text-slate-900">
                    0&nbsp;€
                  </span>
                </div>
              </div>

              <p className="text-[11px] leading-snug text-slate-500">
                Mit deiner ersten Rechnung wird aus dieser Vorschau dein echtes
                Wirkungskonto – mit jedem Projekt wächst deine sichtbare Wirkung.
              </p>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}

/* ───────────── Slider-Shell (Memorisely-Stil, Scrollbar versteckt) ───────────── */

function SliderShell(props: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { title, subtitle, children } = props;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const update = () => {
      if (!trackRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      setCanLeft(scrollLeft > 0);
      setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // exakt eine Karte (inkl. Gap) pro Klick
  const handleScroll = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;

    const first = el.children[0] as HTMLElement | null;
    const second = el.children[1] as HTMLElement | null;

    let step: number;

    if (first && second) {
      const rect1 = first.getBoundingClientRect();
      const rect2 = second.getBoundingClientRect();
      step = rect2.left - rect1.left; // Breite + Gap
    } else if (first) {
      step = first.getBoundingClientRect().width;
    } else {
      step = el.clientWidth * 0.9;
    }

    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-3">
      {/* Header + Navigation */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-[18px] sm:text-[20px] font-semibold text-slate-900 leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="hidden sm:block text-[13px] text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <div className="hidden md:flex items-center space-x-1">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            disabled={!canLeft}
            aria-label="Nach links blättern"
          >
            <div
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 text-center transition duration-300 ease-out",
                !canLeft &&
                  "opacity-30 cursor-not-allowed hover:bg-white pointer-events-none",
                canLeft && "hover:bg-slate-100"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            disabled={!canRight}
            aria-label="Nach rechts blättern"
          >
            <div
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 text-center transition duration-300 ease-out",
                !canRight &&
                  "opacity-30 cursor-not-allowed hover:bg-white pointer-events-none",
                canRight && "hover:bg-slate-100"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Slider-Track – eigener horizontaler Scroll-Bereich */}
      <div className="relative">
        <div
          ref={trackRef}
          className="
            flex gap-x-3 sm:gap-x-4 md:gap-x-5
            overflow-x-auto
            scroll-smooth pb-2
            w-full max-w-full
            [scrollbar-width:none] [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ───────────── Karten-Typen für Equipment-Slots ───────────── */

function InvoiceSlotCard(props: {
  icon: React.ReactNode;
  label: string;
  text: string;
  showLabel?: boolean;
}) {
  const { icon, label, text, showLabel } = props;
  return (
    <article className="shrink-0 w-[220px] sm:w-[260px] md:w-[260px] lg:w-[260px]">
      <div className="group relative flex h-[260px] sm:h-[280px] flex-col rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition duration-300 ease-out">
        <div className="m-3 flex-1 rounded-xl border border-slate-200 bg-slate-100/80 group-hover:bg-white transition-colors duration-300 ease-out px-3 py-3 flex flex-col justify-between overflow-hidden">
          {/* Icon im Hintergrund */}
          <div className="pointer-events-none absolute inset-3 flex items-center justify-center opacity-25">
            <div className="rounded-full border border-slate-200/80 p-4">
              <div className="text-slate-300">{icon}</div>
            </div>
          </div>

          {/* Inhalt */}
          <div className="relative z-10 space-y-2">
            {showLabel && label && (
              <p className="text-[12px] font-medium text-slate-900">
                {label}
              </p>
            )}
            <p className="text-[11px] text-slate-500 leading-snug">{text}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectSlotCard(props: {
  icon: React.ReactNode;
  badgeText: string;
  title: string;
  meta: string;
  showBadge?: boolean;
}) {
  const { icon, badgeText, title, meta, showBadge } = props;
  return (
    <article className="shrink-0 w-[220px] sm:w-[260px] md:w-[260px] lg:w-[260px]">
      <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col h-[220px] sm:h-[240px] md:h-[260px] transition duration-300 ease-out">
        {/* Top: 16/9-Feld */}
        <div className="relative flex-1 bg-slate-100/80">
          {showBadge && badgeText && (
            <div className="absolute top-2 left-2 z-10">
              <div className="inline-flex items-center gap-1 rounded-md bg-white/80 px-2 py-1 border border-slate-200 text-[10px] font-medium text-slate-600">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-[3px] border border-slate-300 text-[10px]">
                  1
                </span>
                <span className="truncate max-w-[120px]">{badgeText}</span>
              </div>
            </div>
          )}

          <div className="absolute inset-2 rounded-xl border border-slate-200/80 bg-slate-100/80 group-hover:bg-white transition-colors duration-300 ease-out flex items-center justify-center overflow-hidden">
            <div className="flex items-center justify-center opacity-40">
              <div className="rounded-full border border-slate-200/80 p-4">
                <div className="text-slate-300">{icon}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Unterer Content-Streifen */}
        <div className="bg-white px-3 py-2.5 space-y-1 h-[82.5px] flex flex-col justify-center">
          <p className="text-sm font-medium text-slate-900 line-clamp-1">
            {title}
          </p>
          <p className="text-[11px] text-slate-500 line-clamp-2">{meta}</p>
        </div>
      </div>
    </article>
  );
}

function PersonSlotCard(props: {
  name: string;
  role: string;
  showBadge?: boolean;
  badgeText?: string;
}) {
  const { name, role, showBadge, badgeText } = props;
  return (
    <article className="shrink-0 w-40">
      <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex h-[210px] sm:h-[220px] transition duration-300 ease-out">
        <div className="relative flex-1 bg-slate-100">
          {showBadge && badgeText && (
            <div className="absolute top-2 left-2 z-10">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 border border-slate-200 text-[10px] font-medium text-slate-600">
                {badgeText}
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
            <div className="rounded-full border border-slate-200/80 p-4 bg-white/70">
              <UserPlus className="h-7 w-7 text-slate-300" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-3 text-left text-white bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
            <p className="text-sm font-medium leading-snug line-clamp-2">
              {name}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-100 leading-snug line-clamp-3">
              {role}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ───────────── Reserve-Platzhalter-Komponenten ───────────── */

function PlaceholderCard(props: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  const { icon, title, text } = props;
  return (
    <article className="flex flex-col items-start gap-3 rounded-2xl bg-white border border-slate-200 p-4">
      <div className="inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-600">
        <div className="p-2">{icon}</div>
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-600">{text}</p>
    </article>
  );
}

function PlaceholderWide(props: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  const { icon, title, text } = props;
  return (
    <article className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center px-6 py-10">
      <div className="space-y-3 text-center max-w-md">
        <div className="flex justify-center">
          <div className="inline-flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 p-3 text-slate-500">
            {icon}
          </div>
        </div>
        <p className="font-medium text-sm text-slate-800">{title}</p>
        <p className="text-xs text-slate-500">{text}</p>
      </div>
    </article>
  );
}
