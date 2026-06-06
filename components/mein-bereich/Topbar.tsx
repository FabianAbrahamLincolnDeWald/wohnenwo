// components/mein-bereich/Topbar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuthOverlay from "@/components/auth/AuthOverlay";
import { PanelsTopLeft, Search, Menu, LogOut, Zap, TrendingUp } from "lucide-react";

type AuthMode = "signin" | "signup" | null;

type Profile = {
  full_name: string | null;
  email: string | null;
};

type HudStats = {
  wirkungspunkte: number;
  wirkungsfonds: number; // in Euro
};

type TopbarProps = {
  onMenuOpen?: () => void;
};

function getInitials(profile: Profile | null): string {
  if (!profile) return "?";
  if (profile.full_name && profile.full_name.trim().length > 0) {
    const parts = profile.full_name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
    return `${parts[0]!.charAt(0)}${parts[1]!.charAt(0)}`.toUpperCase();
  }
  if (profile.email) return profile.email.charAt(0).toUpperCase();
  return "?";
}

// Animiert eine Zahl von 0 auf target über duration ms
function useCountUp(target: number, duration = 700): number {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}

export default function Topbar({ onMenuOpen }: TopbarProps) {
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [hudStats, setHudStats] = useState<HudStats>({ wirkungspunkte: 0, wirkungsfonds: 0 });

  const animatedPunkte = useCountUp(hudStats.wirkungspunkte);
  const animatedFonds = useCountUp(hudStats.wirkungsfonds);

  useEffect(() => {
    let mounted = true;

    async function loadAuth() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!mounted) return;

      if (!user) {
        setIsLoggedIn(false);
        setProfile(null);
        setAuthLoaded(true);
        return;
      }

      setIsLoggedIn(true);

      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, wirkungspunkte, wirkungsfonds_anteil")
        .eq("id", user.id)
        .maybeSingle();

      if (!mounted) return;

      setProfile({
        full_name: data?.full_name ?? null,
        email: data?.email ?? user.email ?? null,
      });
      setHudStats({
        wirkungspunkte: Number(data?.wirkungspunkte) || 0,
        wirkungsfonds: Number(data?.wirkungsfonds_anteil) || 0,
      });
      setAuthLoaded(true);
    }

    loadAuth();

    // Auth-State Listener für Login/Logout ohne Reload
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "SIGNED_OUT" || !session) {
        setIsLoggedIn(false);
        setProfile(null);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setIsLoggedIn(true);
        loadAuth();
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  const initials = getInitials(profile);
  const displayName =
    profile?.full_name?.split(" ")[0] ||
    profile?.email?.split("@")[0] ||
    "Mein Konto";

  return (
    <>
      {/* Auth-Overlay für Anmelden / Registrieren */}
      <AuthOverlay
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onSwitchMode={(mode) => setAuthMode(mode)}
        onAuthed={() => setAuthMode(null)}
      />

      <header className="sticky top-0 z-20 w-full">
        <div className="w-full mx-auto bg-slate-50 dark:bg-[#111111] border-b border-slate-200 dark:border-white/10">
          {/* Hauptzeile */}
          <div className="relative w-full px-4 md:px-5">
            <nav className="flex items-center justify-between h-14">
              {/* Links: Mobile-Logo + Desktop-Suche */}
              <div className="flex items-center gap-3">
                {/* Mobile-Logo */}
                <Link
                  href="/mein-bereich"
                  className={[
                    "border h-9 w-9 flex items-center justify-center rounded-md md:hidden",
                    "bg-white border-slate-200 text-slate-900",
                    "dark:bg-white/5 dark:border-white/10 dark:text-white",
                  ].join(" ")}
                >
                  <PanelsTopLeft className="h-4 w-4" />
                </Link>

                {/* Desktop-Suche */}
                <div className="hidden md:block md:relative md:max-w-[400px] md:min-w-[200px] md:w-full">
                  <div className="relative w-full">
                    <input
                      placeholder="Suchen"
                      className={[
                        "h-9 w-full rounded-md border px-9 text-sm placeholder:text-slate-400",
                        "bg-slate-50 border-slate-200 text-slate-900",
                        "hover:bg-slate-100 hover:border-slate-300",
                        "focus:outline-none focus:border-slate-300 focus:border-2",
                        "dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-white/30",
                        "dark:hover:bg-white/10 dark:hover:border-white/20",
                        "transition-all duration-300",
                      ].join(" ")}
                    />
                    <div className="absolute inset-y-0 left-3 flex items-center text-slate-400 dark:text-white/40">
                      <Search className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mitte: Mini-HUD – Gaming Coin Display, nur Mobile+Tablet (< lg) */}
              {authLoaded && isLoggedIn && (
                <div className="flex items-center gap-2 lg:hidden">
                  {/* Wirkungspunkte */}
                  <div
                    className={[
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                      "bg-[#F5C842]/10 border border-[#F5C842]/20",
                      "dark:bg-[#F5C842]/8 dark:border-[#F5C842]/15",
                    ].join(" ")}
                  >
                    <Zap className="h-3 w-3 text-[#F5C842] shrink-0" />
                    <span className="text-[12px] font-semibold tabular-nums text-slate-900 dark:text-white leading-none">
                      {animatedPunkte.toLocaleString("de-DE")}
                      <span className="text-[10px] font-medium text-slate-500 dark:text-white/40 ml-0.5">px</span>
                    </span>
                  </div>
                  {/* Wirkungsfonds */}
                  <div
                    className={[
                      "hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                      "bg-emerald-50 border border-emerald-100",
                      "dark:bg-emerald-500/8 dark:border-emerald-500/15",
                    ].join(" ")}
                  >
                    <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-[12px] font-semibold tabular-nums text-slate-900 dark:text-white leading-none">
                      {animatedFonds.toLocaleString("de-DE")}
                      <span className="text-[10px] font-medium text-slate-500 dark:text-white/40 ml-0.5">€</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Rechts: Auth-Actions + Mobile-Menü */}
              <div className="flex items-center gap-x-2">
                {/* Desktop: Auth-abhängige Buttons */}
                <div className="hidden md:flex items-center gap-x-2">
                  {/* Skeleton während geladen */}
                  {!authLoaded && (
                    <div className="h-8 w-24 rounded-md bg-slate-200 dark:bg-white/10 animate-pulse" />
                  )}

                  {/* Nicht eingeloggt */}
                  {authLoaded && !isLoggedIn && (
                    <>
                      <button
                        type="button"
                        onClick={() => setAuthMode("signin")}
                        className={[
                          "rounded-md border px-3 py-1.5 text-sm font-medium transition cursor-pointer",
                          "border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
                          "dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
                        ].join(" ")}
                      >
                        Anmelden
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMode("signup")}
                        className={[
                          "rounded-md border px-3 py-1.5 text-sm font-medium transition cursor-pointer",
                          "border-slate-900 bg-slate-900 text-white hover:bg-black",
                          "dark:border-white dark:bg-white dark:text-slate-900 dark:hover:bg-white/90",
                        ].join(" ")}
                      >
                        Registrieren
                      </button>
                    </>
                  )}

                  {/* Eingeloggt: Avatar + Name + Abmelden */}
                  {authLoaded && isLoggedIn && (
                    <div className="flex items-center gap-x-3">
                      {/* Name */}
                      <p className="text-[13px] font-medium text-slate-700 dark:text-white/80 hidden lg:block truncate max-w-[120px]">
                        {displayName}
                      </p>

                      {/* Avatar */}
                      <div
                        className={[
                          "h-8 w-8 rounded-full flex items-center justify-center",
                          "bg-slate-900 text-white text-[12px] font-semibold",
                          "dark:bg-white dark:text-slate-900",
                          "shrink-0",
                        ].join(" ")}
                        title={profile?.email ?? ""}
                      >
                        {initials}
                      </div>

                      {/* Abmelden */}
                      <button
                        type="button"
                        onClick={handleSignOut}
                        title="Abmelden"
                        aria-label="Abmelden"
                        className={[
                          "h-8 w-8 flex items-center justify-center rounded-md transition cursor-pointer",
                          "text-slate-400 hover:text-slate-700 hover:bg-slate-100",
                          "dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10",
                        ].join(" ")}
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile: Burger öffnet MobileSidebar */}
                <div className="md:hidden flex items-center gap-x-2">
                  {/* Mobile Avatar wenn eingeloggt */}
                  {authLoaded && isLoggedIn && (
                    <div
                      className={[
                        "h-7 w-7 rounded-full flex items-center justify-center",
                        "bg-slate-900 text-white text-[11px] font-semibold",
                        "dark:bg-white dark:text-slate-900",
                        "shrink-0",
                      ].join(" ")}
                      title={profile?.email ?? ""}
                    >
                      {initials}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={onMenuOpen}
                    className={[
                      "h-8 w-8 flex items-center justify-center rounded",
                      "hover:bg-slate-100 dark:hover:bg-white/10",
                      "transition cursor-pointer",
                    ].join(" ")}
                    aria-label="Navigation öffnen"
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
                placeholder="Suchen"
                className={[
                  "h-9 w-full rounded-md border px-9 text-sm placeholder:text-slate-400",
                  "bg-slate-50 border-slate-200 text-slate-900",
                  "hover:bg-slate-100 focus:outline-none focus:border-slate-300 focus:border-2",
                  "dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-white/30",
                  "transition-all duration-300",
                ].join(" ")}
              />
              <div className="absolute inset-y-0 left-3 flex items-center text-slate-400 dark:text-white/40">
                <Search className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
