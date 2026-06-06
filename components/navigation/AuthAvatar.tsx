// components/navigation/AuthAvatar.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { User as UserIcon, LayoutGrid, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuthOverlay } from "@/components/auth/AuthOverlayContext";

type AuthAvatarProps = {
  size?: "sm" | "md";
};

function getInitials(user: User): string {
  const meta = (user.user_metadata || {}) as { full_name?: string };
  const fullName = meta.full_name;

  if (fullName && fullName.trim().length > 0) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
    return `${parts[0]!.charAt(0)}${parts[1]!.charAt(0)}`.toUpperCase();
  }

  if (user.email) return user.email.charAt(0).toUpperCase();
  return "U";
}

export default function AuthAvatar({ size = "sm" }: AuthAvatarProps) {
  const { openAuthOverlay } = useAuthOverlay();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Größen-Klassen für Ring + Avatar
  const ringSizeClasses =
    size === "md" ? "h-10 w-10 p-[2px]" : "h-9 w-9 p-[2px]";
  const textSizeClasses = size === "md" ? "text-[13px]" : "text-[12px]";

  // User laden + auf Auth-Änderungen hören
  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user ?? null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);
      }
    );

    function handleClickOutside(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      mounted = false;
      document.removeEventListener("mousedown", handleClickOutside);
      subscription?.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      router.refresh();
    } finally {
      setMenuOpen(false);
    }
  }

  // ─────────────────────────────
  // NICHT ANGEMELDET → Lucide-Avatar
  // ─────────────────────────────
  if (!user) {
    return (
      <button
        type="button"
        aria-label="Anmelden"
        onClick={() => openAuthOverlay("signin")}
        className="
          inline-flex h-8 w-8 items-center justify-center
          rounded-full bg-slate-900 text-white
          hover:bg-black
          transition-colors
        "
      >
        <UserIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    );
  }

  // ─────────────────────────────
  // ANGEMELDET → Initialen + Verlauf-Ring + Dropdown
  // ─────────────────────────────
  const initials = getInitials(user);
  const displayName =
    ((user.user_metadata || {}) as { full_name?: string }).full_name ||
    user.email ||
    "Angemeldeter Nutzer";

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => setMenuOpen(false)}
    >
      {/* Avatar mit Verlauf-Ring */}
      <div
        className={`
          relative inline-flex items-center justify-center
          rounded-full
          bg-gradient-to-tr from-white via-sky-300 to-cyan-400
          ${ringSizeClasses}
        `}
      >
        <button
          type="button"
          aria-label="Account-Menü öffnen"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className={`
            inline-flex items-center justify-center
            rounded-full bg-slate-900 text-white
            hover:bg-black
            transition-colors font-semibold
            w-full h-full
            ${textSizeClasses}
          `}
        >
          {initials}
        </button>
      </div>

      {/* Dropdown – Inhalte à la Chrome, mit dunklem Badge */}
      {menuOpen && (
        <>
          {/* Brücke unter dem Button */}
          <div className="absolute right-0 top-full w-56 h-2" />

          <div
            className="
              absolute right-0 top-full mt-2 w-56
              rounded-xl border border-slate-200
              bg-white p-2 shadow-lg space-y-1 z-50
              dark:bg-[#1d1d1f] dark:border-white/10
            "
            role="menu"
            aria-label="Account-Menü"
          >
            {(() => {
              const baseClasses =
                "flex w-full items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors";
              const ghost = "text-slate-600/80 hover:bg-slate-100 dark:text-white/60 dark:hover:bg-white/5";

              return (
                <>
                  {/* 1. Zeile: dunkles Badge mit Avatar (ohne Ring) + Name + Mail */}
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className={`
                      ${baseClasses}
                      bg-slate-200 text-white
                      pt-5 pb-5
                      dark:bg-white/10
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar ohne Gradient-Ring im Dropdown */}
                      <span
                        className="
                          inline-flex h-9 w-9 items-center justify-center
                          rounded-full bg-slate-800
                          text-[13px] font-semibold
                        "
                      >
                        {initials}
                      </span>

                      {/* Name + E-Mail untereinander */}
                      <div className="flex min-w-0 flex-col text-left">
                        <span className="text-[13px] text-black font-semibold leading-snug truncate dark:text-white">
                          {displayName}
                        </span>
                        {user.email && (
                          <span className="text-[12px] text-slate-500 leading-snug truncate dark:text-white/60">
                            {user.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* 2. Zeile: Mein Bereich */}
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "/mein-bereich";
                    }}
                    className={`${baseClasses} ${ghost}`}
                    role="menuitem"
                  >
                    <span className="flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                      <span>Mein Bereich</span>
                    </span>
                  </button>

                  {/* 3. Zeile: Abmelden */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className={`${baseClasses} ${ghost}`}
                    role="menuitem"
                  >
                    <span className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      <span>Abmelden</span>
                    </span>
                  </button>
                </>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
}
