// app/mein-bereich/projekte/page.tsx
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FolderKanban, Lock } from "lucide-react";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  kundenummer: string | null;
};

type ViewState = "loading" | "demo" | "user" | "kunde";

type ProjectStatus = "planung" | "laufend" | "abgeschlossen";

type Project = {
  id: string;
  title: string;
  kind: string | null; // z.B. "Küche", "Bad", "Wohnung"
  status: ProjectStatus;
  startDate: string | null; // ISO
  volume: number | null;
  currency: string | null;
};

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

function formatCurrency(amount: number | null, currency: string | null) {
  if (amount == null || Number.isNaN(amount)) return "–";
  const safeAmount = Number(amount);
  const safeCurrency = currency || "EUR";

  try {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return `${safeAmount.toFixed(2)} ${safeCurrency}`;
  }
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "–";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "–";
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const label =
    status === "abgeschlossen"
      ? "Abgeschlossen"
      : status === "laufend"
      ? "Laufendes Projekt"
      : "In Planung";

  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium";

  const style =
    status === "abgeschlossen"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
      : status === "laufend"
      ? "bg-sky-50 text-sky-700 border border-sky-100"
      : "bg-slate-50 text-slate-600 border border-slate-200";

  return <span className={`${base} ${style}`}>{label}</span>;
}

export default function ProjektePage() {
  const [view, setView] = useState<ViewState>("loading");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      // 1. Auth prüfen
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) {
        if (!active) return;
        setView("demo");
        setProfile(null);
        setProjects([]);
        setLoadingProjects(false);
        return;
      }

      // 2. Profil laden
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, kundenummer")
        .eq("id", user.id)
        .single();

      if (!active) return;

      if (error || !data) {
        console.error("Profil konnte nicht geladen werden:", error);
        setView("user");
      } else {
        setProfile(data);
        const role = (data.role || "user") as string;
        if (role === "kunde") {
          setView("kunde");
        } else {
          setView("user");
        }
      }

      // 3. Projekte laden (Spalten ggf. an dein Schema anpassen)
      try {
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select(
            "id, title, kind, status, start_date, volume, currency"
          )
          .eq("user_id", user.id)
          .order("start_date", { ascending: false });

        if (!active) return;

        if (projectError) {
          console.error("Projekte konnten nicht geladen werden:", projectError);
          setProjects([]);
        } else {
          const mapped: Project[] =
            projectData?.map((row: any) => ({
              id: row.id,
              title: row.title ?? "Projekt ohne Titel",
              kind: row.kind ?? null,
              status: (row.status as ProjectStatus) || "planung",
              startDate: row.start_date ?? null,
              volume:
                typeof row.volume === "number"
                  ? row.volume
                  : row.volume != null
                  ? Number(row.volume)
                  : null,
              currency: row.currency ?? "EUR",
            })) ?? [];

          setProjects(mapped);
        }
      } catch (e) {
        console.error("Unbekannter Fehler beim Laden der Projekte:", e);
        setProjects([]);
      } finally {
        if (active) setLoadingProjects(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const isDemo = view === "demo";
  const isKunde = view === "kunde";

  const name =
    profile?.full_name ||
    profile?.email?.split("@")[0] ||
    (view === "demo" ? "Gast" : "Willkommen zurück");

  const initials = getInitialsFromProfile(profile);

  const eyebrow = isDemo
    ? "Vorschau"
    : isKunde
    ? "Projekte · Persönlicher Wirkungsraum"
    : "Projekte";

  const headline = isDemo
    ? "So ordnen wir deine Projekte in WohnenWo."
    : "Projekte im Überblick";

  const subline = isDemo
    ? "In deinem echten Zugang findest du hier laufende und abgeschlossene Wohnerlebnisse – von der ersten Skizze bis zur fertigen Küche oder Wohnung."
    : "Hier bündeln wir deine Wohnerlebnisse. Jedes Projekt verknüpft Planung, Umsetzung, Investition und deine Wirkung im Kreis.";

  const hasProjects = !!projects && projects.length > 0;

  // mindestens 2 Reihen à 3 Karten
  const MIN_SLOTS = 6;
  const totalSlots = Math.max(hasProjects ? projects!.length : 0, MIN_SLOTS);

  // Gesamt-Loading (Skeleton)
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

  return (
    <main className="min-h-screen bg-slate-50 px-4 pt-20 pb-10">
      <div className="mx-auto max-w-7xl lg:flex lg:items-start lg:gap-10">
        {/* Linke Spalte: Projekt-Galerie */}
        <div className="flex-1 min-w-0 space-y-8">
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

          {/* Grid-Sektion */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-[16px] md:text-[17px] font-semibold text-slate-900 leading-tight">
                  Projekt-Galerie
                </h2>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  {hasProjects
                    ? `${projects!.length} Projekt${
                        projects!.length === 1 ? "" : "e"
                      } · angeordnet nach Startdatum`
                    : "Noch keine Projekte verknüpft – die Slots warten auf dein erstes Wohnerlebnis."}
                </p>
              </div>
            </div>

            {loadingProjects ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {Array.from({ length: MIN_SLOTS }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[220px] sm:h-[240px] md:h-[260px] rounded-2xl bg-slate-100 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {Array.from({ length: totalSlots }).map((_, index) => {
                  const project =
                    hasProjects && index < projects!.length
                      ? projects![index]
                      : null;

                  if (project) {
                    return (
                      <ProjectGridCard
                        key={project.id}
                        project={project}
                      />
                    );
                  }

                  const isFirstPlaceholder = !hasProjects && index === 0;

                  return (
                    <ProjectPlaceholderCard
                      key={`placeholder-${index}`}
                      highlight={isFirstPlaceholder}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Rechte Spalte: Wirkungskonto – 1:1 wie in MeinBereichPage/RechnungenPage */}
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
                  {getInitialsFromProfile(profile)}
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
                  Mit deinem ersten Projekt beginnt dein Wirkungskonto zu leben –
                  von der Planung bis zur fertigen Küche oder Wohnung.
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
                Mit jedem Projekt wächst dein Wirkungskonto – sichtbar in deinen
                Rechnungen, deinem Netzwerk und deiner Wertschöpfung.
              </p>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}

/* ───────────── Karten im Grid – orientiert an ProjectSlotCard der Übersicht ───────────── */

function ProjectGridCard({ project }: { project: Project }) {
  const kindLabel = project.kind || "Wohnerlebnis";
  const volumeLabel = formatCurrency(project.volume, project.currency);

  return (
    <article className="w-full">
      <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col h-[220px] sm:h-[240px] md:h-[260px] transition duration-300 ease-out">
        {/* Top: 16/9-Feld – leerer Visual-Slot / Icon wie im Slider */}
        <div className="relative flex-1 bg-slate-100/80">
          <div className="absolute top-2 left-2 z-10">
            <div className="inline-flex items-center gap-1 rounded-md bg-white/80 px-2 py-1 border border-slate-200 text-[10px] font-medium text-slate-600">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-[3px] border border-slate-300 text-[10px]">
                {kindLabel.substring(0, 1).toUpperCase()}
              </span>
              <span className="truncate max-w-[120px]">{kindLabel}</span>
            </div>
          </div>

          <div className="absolute inset-2 rounded-xl border border-slate-200/80 bg-slate-100/80 group-hover:bg-white transition-colors duration-300 ease-out flex items-center justify-center overflow-hidden">
            <div className="flex items-center justify-center opacity-40">
              <div className="rounded-full border border-slate-200/80 p-4">
                <FolderKanban className="h-7 w-7 text-slate-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Unterer Content-Streifen */}
        <div className="bg-white px-3 py-2.5 space-y-1 h-[82.5px] flex flex-col justify-center">
          <p className="text-sm font-medium text-slate-900 line-clamp-1">
            {project.title}
          </p>
          <p className="text-[11px] text-slate-500 line-clamp-2">
            {volumeLabel !== "–"
              ? `Start: ${formatDate(project.startDate)} · Volumen ${volumeLabel}`
              : `Start: ${formatDate(project.startDate)} · ${
                  project.status === "planung"
                    ? "In Planung"
                    : project.status === "laufend"
                    ? "In Umsetzung"
                    : "Abgeschlossen"
                }`}
          </p>
          <div className="mt-1">
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectPlaceholderCard({ highlight }: { highlight?: boolean }) {
  return (
    <article className="w-full">
      <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col h-[220px] sm:h-[240px] md:h-[260px] transition duration-300 ease-out">
        {/* Top: 16/9-Feld – Icon / Placeholder */}
        <div className="relative flex-1 bg-slate-100/80">
          {highlight && (
            <div className="absolute top-2 left-2 z-10">
              <div className="inline-flex items-center gap-1 rounded-md bg-white/80 px-2 py-1 border border-slate-200 text-[10px] font-medium text-slate-600">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-[3px] border border-slate-300 text-[10px]">
                  1
                </span>
                <span className="truncate max-w-[120px]">
                  Dein erstes Wohnerlebnis
                </span>
              </div>
            </div>
          )}

          <div className="absolute inset-2 rounded-xl border border-slate-200/80 bg-slate-100/80 group-hover:bg-white transition-colors duration-300 ease-out flex items-center justify-center overflow-hidden">
            <div className="flex items-center justify-center opacity-40">
              <div className="rounded-full border border-slate-200/80 p-4">
                <FolderKanban className="h-7 w-7 text-slate-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Unterer Content-Streifen */}
        <div className="bg-white px-3 py-2.5 space-y-1 h-[82.5px] flex flex-col justify-center">
          <p className="text-sm font-medium text-slate-900 line-clamp-1">
            {highlight ? "Projekt-Slots warten auf dich" : "Freier Projektslot"}
          </p>
          <p className="text-[11px] text-slate-500 line-clamp-2">
            {highlight
              ? "Sobald dein erster Auftrag freigeschaltet ist, erscheint hier dein Projekt mit Status, Meilensteinen und Wertentwicklung."
              : "Bereit für Küchen, Bäder oder ganze Wohnungen – dein Portfolio wächst mit jedem Projekt."}
          </p>
        </div>
      </div>
    </article>
  );
}
