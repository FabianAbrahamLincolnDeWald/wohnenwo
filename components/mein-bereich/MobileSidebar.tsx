"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LogOut } from "lucide-react";
import { MEIN_BEREICH_NAV_ITEMS, MeinBereichRole } from "@/components/mein-bereich/nav-config";
import { supabase } from "@/lib/supabaseClient";
import AuthOverlay from "@/components/auth/AuthOverlay";
import type { AuthMode } from "@/components/auth/AuthOverlay";

const SIDEBAR_WIDTH = 280;

function classNames(...classes: (string | boolean | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type Profile = {
  full_name: string | null;
  email: string | null;
};

function getInitials(profile: Profile | null): string {
  if (!profile) return "?";
  if (profile.full_name?.trim()) {
    const parts = profile.full_name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
    return `${parts[0]!.charAt(0)}${parts[1]!.charAt(0)}`.toUpperCase();
  }
  if (profile.email) return profile.email.charAt(0).toUpperCase();
  return "?";
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  role?: MeinBereichRole;
};

export default function MobileSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  // Separate role state so nav items react instantly to login/logout
  const [navRole, setNavRole] = useState<MeinBereichRole>("guest");

  // Auth-State laden (Footer + Nav-Rolle)
  useEffect(() => {
    let mounted = true;

    async function loadAuth(userId?: string) {
      const uid = userId ?? (await supabase.auth.getUser()).data.user?.id;
      if (!mounted) return;
      if (!uid) {
        setIsLoggedIn(false);
        setProfile(null);
        setNavRole("guest");
        setAuthLoaded(true);
        return;
      }
      setIsLoggedIn(true);
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, role")
        .eq("id", uid)
        .maybeSingle();
      if (!mounted) return;
      setProfile({ full_name: data?.full_name ?? null, email: data?.email ?? null });
      setNavRole((data?.role as MeinBereichRole | null) ?? "user");
      setAuthLoaded(true);
    }

    loadAuth();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "SIGNED_OUT" || !session) {
        setIsLoggedIn(false);
        setProfile(null);
        setNavRole("guest");
        setAuthLoaded(true);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setIsLoggedIn(true);
        loadAuth(session.user.id);
      }
    });

    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  // ESC schließt die Sidebar
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Body-Scroll sperren wenn offen
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const visibleItems = MEIN_BEREICH_NAV_ITEMS.filter((item) => {
    return item.visibleFor.includes(navRole);
  });

  const mainItems = visibleItems.filter((i) => i.section === "main");
  const communityItems = visibleItems.filter((i) => i.section === "community");

  const initials = getInitials(profile);
  const displayName =
    profile?.full_name?.split(" ")[0] || profile?.email?.split("@")[0] || "Mein Konto";

  return (
    <>
      <AuthOverlay
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onSwitchMode={(m) => setAuthMode(m)}
        onAuthed={() => { setAuthMode(null); onClose(); }}
      />

    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            key="mobile-drawer"
            initial={{ x: -SIDEBAR_WIDTH }}
            animate={{ x: 0 }}
            exit={{ x: -SIDEBAR_WIDTH }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            style={{ width: SIDEBAR_WIDTH }}
            className={[
              "fixed left-0 top-0 bottom-0 z-50 md:hidden",
              "flex flex-col",
              "bg-white dark:bg-[#111111]",
              "border-r border-slate-200 dark:border-white/[0.06]",
              "shadow-2xl dark:shadow-black/60",
            ].join(" ")}
            aria-label="Mobile Navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/[0.06]">
              <p className="text-[13px] font-semibold tracking-tight text-slate-900 dark:text-white/90">
                Mein Bereich
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Navigation schließen"
                className={[
                  "h-8 w-8 flex items-center justify-center rounded-lg",
                  "text-slate-500 hover:text-slate-900 hover:bg-slate-200",
                  "dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10",
                  "transition-colors duration-150 cursor-pointer",
                ].join(" ")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav-Items */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {mainItems.map((item, idx) => {
                const isActive =
                  item.href === "/mein-bereich"
                    ? pathname === "/mein-bereich"
                    : pathname?.startsWith(item.href);

                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.05 + idx * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link href={item.href} onClick={onClose}>
                      <div
                        className={classNames(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                          "transition-colors duration-150 cursor-pointer",
                          isActive
                            ? [
                                "bg-white dark:bg-white/10",
                                "text-[#F5C842]",
                                "shadow-sm border border-slate-200 dark:border-white/10",
                              ].join(" ")
                            : [
                                "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80",
                                "dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10",
                              ].join(" ")
                        )}
                      >
                        <Icon
                          className={classNames(
                            "h-4 w-4 shrink-0",
                            isActive
                              ? "text-[#F5C842]"
                              : "text-slate-500 dark:text-white/50"
                          )}
                        />
                        <span className="text-[15px] font-medium leading-tight">
                          {item.label}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}

              {communityItems.length > 0 && (
                <div className="pt-4">
                  <p className="px-3 pb-1.5 text-[11px] font-medium tracking-wide uppercase text-slate-400 dark:text-white/30">
                    Community
                  </p>
                  {communityItems.map((item, idx) => {
                    const isActive = pathname?.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.15 + idx * 0.04,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <Link href={item.href} onClick={onClose}>
                          <div
                            className={classNames(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                              "transition-colors duration-150 cursor-pointer",
                              isActive
                                ? [
                                    "bg-white dark:bg-white/10",
                                    "text-[#F5C842]",
                                    "shadow-sm border border-slate-200 dark:border-white/10",
                                  ].join(" ")
                                : [
                                    "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80",
                                    "dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10",
                                  ].join(" ")
                            )}
                          >
                            <Icon
                              className={classNames(
                                "h-4 w-4 shrink-0",
                                isActive
                                  ? "text-[#F5C842]"
                                  : "text-slate-500 dark:text-white/50"
                              )}
                            />
                            <span className="text-[15px] font-medium leading-tight">
                              {item.label}
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </nav>

            {/* Footer – Auth-Status */}
            <div className="px-4 py-4 border-t border-slate-200 dark:border-white/[0.06]">
              {/* Skeleton */}
              {!authLoaded && (
                <div className="h-8 w-full rounded-lg bg-slate-100 dark:bg-white/5 animate-pulse" />
              )}

              {/* Nicht eingeloggt */}
              {authLoaded && !isLoggedIn && (
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className={[
                    "w-full rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-150 cursor-pointer",
                    "border border-slate-200 dark:border-white/10",
                    "text-slate-700 dark:text-white/70",
                    "hover:bg-slate-50 dark:hover:bg-white/5",
                    "hover:text-slate-900 dark:hover:text-white",
                  ].join(" ")}
                >
                  Anmelden
                </button>
              )}

              {/* Eingeloggt: Avatar + Name + Abmelden */}
              {authLoaded && isLoggedIn && (
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                      "bg-slate-900 text-white text-[11px] font-semibold",
                      "dark:bg-white dark:text-slate-900",
                    ].join(" ")}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-slate-900 dark:text-white truncate">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-white/35 truncate">
                      {profile?.email ?? ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => supabase.auth.signOut()}
                    title="Abmelden"
                    className={[
                      "h-8 w-8 flex items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer shrink-0",
                      "text-slate-400 hover:text-slate-700 hover:bg-slate-100",
                      "dark:text-white/35 dark:hover:text-white dark:hover:bg-white/10",
                    ].join(" ")}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
