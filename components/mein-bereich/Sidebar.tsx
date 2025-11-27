// components/mein-bereich/Sidebar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import EcosystemFlyout from "@/components/navigation/EcosystemFlyout";
import {
  MEIN_BEREICH_NAV_ITEMS,
  MeinBereichRole,
  MeinBereichFlag,
} from "@/components/mein-bereich/nav-config";
import { supabase } from "@/lib/supabaseClient";

function classNames(...classes: (string | boolean | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type MeinBereichFlagsState = {
  hasProjects: boolean;
  hasInvoices: boolean;
};

export default function Sidebar() {
  const pathname = usePathname();

  const [role, setRole] = useState<MeinBereichRole>("guest");
  const [flags, setFlags] = useState<MeinBereichFlagsState>({
    hasProjects: false,
    hasInvoices: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        setLoading(true);

        // 1. Aktuellen Auth-User holen
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (!mounted) return;
          setRole("guest");
          setFlags({ hasProjects: false, hasInvoices: false });
          return;
        }

        // 2. Profil aus Supabase laden
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role, has_projects, has_invoices")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Fehler beim Laden des Profils:", error);
          if (!mounted) return;
          // Fallback: angemeldeter User ohne spezielles Profil
          setRole("user");
          setFlags({ hasProjects: false, hasInvoices: false });
          return;
        }

        // 3. Rolle bestimmen
        const dbRole = (profile?.role as MeinBereichRole | null) ?? "user";

        // 4. Flags aus Profil ableiten (oder Fallback)
        const nextFlags: MeinBereichFlagsState = {
          hasProjects: Boolean(profile?.has_projects),
          hasInvoices: Boolean(profile?.has_invoices),
        };

        if (!mounted) return;
        setRole(dbRole);
        setFlags(nextFlags);
      } catch (err) {
        console.error("Unerwarteter Fehler beim Laden des Profils:", err);
        if (!mounted) return;
        setRole("guest");
        setFlags({ hasProjects: false, hasInvoices: false });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  // kleine Hilfsfunktion: prüft, ob ein Item sichtbar sein darf
  function isItemVisible(
    requiredRoles: MeinBereichRole[],
    requiresFlag?: MeinBereichFlag
  ) {
    const roleOk = requiredRoles.includes(role);

    if (!requiresFlag || requiresFlag === "none") {
      return roleOk;
    }

    const flagMap: Record<MeinBereichFlag, boolean> = {
      none: true,
      hasProjects: flags.hasProjects,
      hasInvoices: flags.hasInvoices,
    };

    const flagOk = flagMap[requiresFlag];
    return roleOk && flagOk;
  }

  const mainItems = MEIN_BEREICH_NAV_ITEMS.filter(
    (item) =>
      item.section === "main" &&
      isItemVisible(item.visibleFor, item.requiresFlag)
  );

  const communityItems = MEIN_BEREICH_NAV_ITEMS.filter(
    (item) =>
      item.section === "community" &&
      isItemVisible(item.visibleFor, item.requiresFlag)
  );

  return (
    <aside
      className="hidden md:flex flex-col shrink-0 h-screen bg-slate-50 py-3 px-5 border-r border-slate-200 sticky top-0 z-40"
      style={{ width: 240 }}
    >
      {/* Ecosystem Flyout */}
      <div className="mb-5">
        <EcosystemFlyout panelWidth={640} />
      </div>

      <div className="flex flex-col gap-6">
        {/* Optional: kleiner Hinweis oben, wenn noch geladen wird */}
        {loading && (
          <div className="text-[11px] text-slate-400 mb-1">
            Bereich wird personalisiert …
          </div>
        )}

        {/* Hauptnavigation */}
        <nav className="flex flex-col gap-1.5">
          {mainItems.map((item) => {
            const isActive =
              item.href === "/mein-bereich"
                ? pathname === "/mein-bereich"
                : pathname?.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="w-full cursor-pointer"
              >
                <div
                  className={classNames(
                    "flex w-full items-center gap-x-2 p-2.5 rounded-lg group transition-all duration-300 ease-in-out text-sm",
                    "hover:bg-slate-100",
                    isActive
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <div className="text-[15px] font-medium leading-tight">
                    {item.label}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Community-Bereich */}
        {communityItems.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-medium text-slate-400 mb-1 tracking-wide">
              Community
            </div>
            <nav className="flex flex-col gap-1.5">
              {communityItems.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="w-full cursor-pointer"
                  >
                    <div
                      className={classNames(
                        "flex w-full items-center gap-x-2 p-2.5 rounded-lg group transition-all duration-300 ease-in-out text-sm",
                        "hover:bg-slate-100",
                        isActive
                          ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <div className="text-[15px] font-medium leading-tight">
                        {item.label}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
}
