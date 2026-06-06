// app/mein-bereich/projekte/page.tsx
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import WirkungskontoPanel from "@/components/mein-bereich/WirkungskontoPanel";
import { useWirkungskontoStats } from "@/lib/useWirkungskontoStats";
import { FolderKanban } from "lucide-react";

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
  kind: string | null;
  status: ProjectStatus;
  startDate: string | null;
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
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border";

  // Light + Dark Tokens (Badge bleibt lesbar)
  const style =
    status === "abgeschlossen"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/25 dark:text-emerald-300 dark:border-emerald-900/50"
      : status === "laufend"
      ? "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-900/45"
      : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-white/60 dark:border-white/10";

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
        setView(role === "kunde" ? "kunde" : "user");
      }

      try {
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("id, title, kind, status, start_date, volume, currency")
          .eq("customer_id", user.id)
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
  const isAuthed = view !== "demo";
  const isKunde = view === "kunde";

  const { investedEUR, impactEUR, invoiceCount } = useWirkungskontoStats(
    isAuthed ? profile?.id ?? null : null
  );

  const SCALE_MAX = 100;
  const wirkungEbene = impactEUR;
  const hasFirstInvoice = isAuthed && invoiceCount > 0;
  const hasImpact = isAuthed && impactEUR > 0.0001;
  const hasAnyRealData = (projects?.length ?? 0) > 0 || invoiceCount > 0;

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

  const MIN_SLOTS = 6;
  const totalSlots = Math.max(hasProjects ? projects!.length : 0, MIN_SLOTS);

  if (view === "loading") {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#111113] px-4 pt-20 pb-10">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[minmax(0,1.9fr)_minmax(260px,1fr)]">
          <div className="space-y-4">
            <div className="h-6 w-40 rounded bg-slate-200 animate-pulse dark:bg-white/10" />
            <div className="h-4 w-64 rounded bg-slate-200 animate-pulse dark:bg-white/10" />
            <div className="h-64 w-full rounded-xl bg-slate-100 animate-pulse dark:bg-white/5" />
          </div>
          <aside className="hidden lg:block">
            <div className="h-48 w-full rounded-2xl bg-slate-100 animate-pulse dark:bg-white/5" />
          </aside>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#111113] px-4 pt-20 pb-10">
      <div className="mx-auto max-w-7xl lg:flex lg:items-start lg:gap-10">
        {/* Linke Spalte */}
        <div className="flex-1 min-w-0 space-y-8">
          <header className="space-y-3">
            <p className="text-[11px] tracking-[0.24em] uppercase text-slate-500 dark:text-white/40">
              {eyebrow}
            </p>
            <h1 className="text-[24px] md:text-[28px] font-semibold tracking-tight text-slate-900 dark:text-white">
              {headline}
            </h1>
            <p className="max-w-2xl text-sm md:text-[15px] text-slate-600 dark:text-white/60">
              {subline}
            </p>
            {isKunde && profile?.kundenummer && (
              <p className="text-[12px] text-slate-500 dark:text-white/40">
                Kundennummer: {profile.kundenummer}
              </p>
            )}
          </header>

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-[16px] md:text-[17px] font-semibold text-slate-900 leading-tight dark:text-white">
                  Projekt-Galerie
                </h2>
                <p className="text-[12px] text-slate-500 mt-0.5 dark:text-white/40">
                  {hasProjects
                    ? `${projects!.length} Projekt${projects!.length === 1 ? "" : "e"} · angeordnet nach Startdatum`
                    : "Noch keine Projekte verknüpft – die Slots warten auf dein erstes Wohnerlebnis."}
                </p>
              </div>
            </div>

            {loadingProjects ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {Array.from({ length: MIN_SLOTS }).map((_, i) => (
                  <div
                    key={i}
                    className="
                      h-[220px] sm:h-[240px] md:h-[260px]
                      rounded-2xl bg-slate-100 animate-pulse
                      dark:bg-white/5 dark:border dark:border-white/10
                    "
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {Array.from({ length: totalSlots }).map((_, index) => {
                  const project =
                    hasProjects && index < projects!.length ? projects![index] : null;

                  if (project) {
                    return <ProjectGridCard key={project.id} project={project} />;
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

        {/* Rechte Spalte */}
        <WirkungskontoPanel
          variant={isDemo ? "demo" : "authed"}
          name={name}
          email={profile?.email}
          initials={initials}
          wirkungEbene={wirkungEbene}
          scaleMax={SCALE_MAX}
          investedEUR={investedEUR}
          impactEUR={impactEUR}
          projectsCount={projects?.length ?? 0}
          hasFirstInvoice={hasFirstInvoice}
          hasImpact={hasImpact}
          showNextStep={!hasAnyRealData}
        />
      </div>
    </main>
  );
}

/* ───────────── Karten ───────────── */

function ProjectGridCard({ project }: { project: Project }) {
  const kindLabel = project.kind || "Wohnerlebnis";
  const volumeLabel = formatCurrency(project.volume, project.currency);

  const statusText =
    project.status === "planung"
      ? "In Planung"
      : project.status === "laufend"
      ? "In Umsetzung"
      : "Abgeschlossen";

  return (
    <article className="w-full">
      <div
        className="
          group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200
          bg-slate-50 flex flex-col h-[220px] sm:h-[240px] md:h-[260px]
          transition duration-300 ease-out

          dark:bg-white/5 dark:border-white/10
        "
      >
        {/* Top */}
        <div className="relative flex-1 bg-slate-100/80 dark:bg-white/5">
          <div className="absolute top-2 left-2 z-10">
            <div
              className="
                inline-flex items-center gap-1 rounded-md
                bg-white/80 px-2 py-1 border border-slate-200
                text-[10px] font-medium text-slate-600
                dark:bg-white/10 dark:border-white/10 dark:text-white/60
              "
            >
              <span
                className="
                  inline-flex h-4 w-4 items-center justify-center rounded-[3px]
                  border border-slate-300 text-[10px]
                  dark:border-white/15 dark:text-white/70
                "
              >
                {kindLabel.substring(0, 1).toUpperCase()}
              </span>
              <span className="truncate max-w-[120px]">{kindLabel}</span>
            </div>
          </div>

          <div
            className="
              absolute inset-2 rounded-xl border border-slate-200/80
              bg-slate-100/80 group-hover:bg-white
              transition-colors duration-300 ease-out
              flex items-center justify-center overflow-hidden

              dark:border-white/10 dark:bg-white/5 dark:group-hover:bg-white/8
            "
          >
            <div className="flex items-center justify-center opacity-40">
              <div className="rounded-full border border-slate-200/80 p-4 dark:border-white/10">
                <FolderKanban className="h-7 w-7 text-slate-300 dark:text-white/25" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="bg-white px-3 py-2.5 space-y-1 h-[82.5px] flex flex-col justify-center dark:bg-[#1d1d1f]">
          <p className="text-sm font-medium text-slate-900 line-clamp-1 dark:text-white">
            {project.title}
          </p>
          <p className="text-[11px] text-slate-500 line-clamp-2 dark:text-white/40">
            {volumeLabel !== "–"
              ? `Start: ${formatDate(project.startDate)} · Volumen ${volumeLabel}`
              : `Start: ${formatDate(project.startDate)} · ${statusText}`}
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
      <div
        className="
          group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200
          bg-slate-50 flex flex-col h-[220px] sm:h-[240px] md:h-[260px]
          transition duration-300 ease-out

          dark:bg-white/5 dark:border-white/10
        "
      >
        <div className="relative flex-1 bg-slate-100/80 dark:bg-white/5">
          {highlight && (
            <div className="absolute top-2 left-2 z-10">
              <div
                className="
                  inline-flex items-center gap-1 rounded-md bg-white/80 px-2 py-1
                  border border-slate-200 text-[10px] font-medium text-slate-600
                  dark:bg-white/10 dark:border-white/10 dark:text-white/60
                "
              >
                <span
                  className="
                    inline-flex h-4 w-4 items-center justify-center rounded-[3px]
                    border border-slate-300 text-[10px]
                    dark:border-white/15 dark:text-white/70
                  "
                >
                  1
                </span>
                <span className="truncate max-w-[120px]">Dein erstes Wohnerlebnis</span>
              </div>
            </div>
          )}

          <div
            className="
              absolute inset-2 rounded-xl border border-slate-200/80
              bg-slate-100/80 group-hover:bg-white
              transition-colors duration-300 ease-out
              flex items-center justify-center overflow-hidden

              dark:border-white/10 dark:bg-white/5 dark:group-hover:bg-white/8
            "
          >
            <div className="flex items-center justify-center opacity-40">
              <div className="rounded-full border border-slate-200/80 p-4 dark:border-white/10">
                <FolderKanban className="h-7 w-7 text-slate-300 dark:text-white/25" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-3 py-2.5 space-y-1 h-[82.5px] flex flex-col justify-center dark:bg-[#1d1d1f]">
          <p className="text-sm font-medium text-slate-900 line-clamp-1 dark:text-white">
            {highlight ? "Projekt-Slots warten auf dich" : "Freier Projektslot"}
          </p>
          <p className="text-[11px] text-slate-500 line-clamp-2 dark:text-white/40">
            {highlight
              ? "Sobald dein erster Auftrag freigeschaltet ist, erscheint hier dein Projekt mit Status, Meilensteinen und Wertentwicklung."
              : "Bereit für Küchen, Bäder oder ganze Wohnungen – dein Portfolio wächst mit jedem Projekt."}
          </p>
        </div>
      </div>
    </article>
  );
}