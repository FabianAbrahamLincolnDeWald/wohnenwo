// components/mein-bereich/Sidebar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeft } from "lucide-react";
import {
  MEIN_BEREICH_NAV_ITEMS,
  MeinBereichRole,
  MeinBereichFlag,
} from "@/components/mein-bereich/nav-config";
import { useSidebarState } from "@/components/mein-bereich/SidebarContext";
import { supabase } from "@/lib/supabaseClient";

function cn(...classes: (string | boolean | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type FlagsState = { hasProjects: boolean; hasInvoices: boolean };

export default function Sidebar() {
  const pathname = usePathname();
  const { isExpanded, toggle } = useSidebarState();

  const [role, setRole] = useState<MeinBereichRole>("guest");
  const [flags, setFlags] = useState<FlagsState>({ hasProjects: false, hasInvoices: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProfile(userId?: string) {
      try {
        setLoading(true);
        const uid = userId ?? (await supabase.auth.getUser()).data.user?.id;
        if (!uid) {
          if (!mounted) return;
          setRole("guest");
          setFlags({ hasProjects: false, hasInvoices: false });
          return;
        }
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role, has_projects, has_invoices")
          .eq("id", uid)
          .maybeSingle();
        if (!mounted) return;
        if (error) {
          setRole("user");
          setFlags({ hasProjects: false, hasInvoices: false });
          return;
        }
        setRole((profile?.role as MeinBereichRole | null) ?? "user");
        setFlags({
          hasProjects: Boolean(profile?.has_projects),
          hasInvoices: Boolean(profile?.has_invoices),
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "SIGNED_OUT" || !session) {
        setRole("guest");
        setFlags({ hasProjects: false, hasInvoices: false });
        setLoading(false);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        loadProfile(session.user.id);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  function isVisible(requiredRoles: MeinBereichRole[], flag?: MeinBereichFlag) {
    const roleOk = requiredRoles.includes(role);
    if (!flag || flag === "none") return roleOk;
    const flagMap: Record<MeinBereichFlag, boolean> = {
      none: true,
      hasProjects: flags.hasProjects,
      hasInvoices: flags.hasInvoices,
    };
    return roleOk && flagMap[flag];
  }

  const mainItems = MEIN_BEREICH_NAV_ITEMS.filter(
    (item) => item.section === "main" && isVisible(item.visibleFor, item.requiresFlag)
  );
  const communityItems = MEIN_BEREICH_NAV_ITEMS.filter(
    (item) => item.section === "community" && isVisible(item.visibleFor, item.requiresFlag)
  );

  return (
    <motion.aside
      className="hidden md:flex flex-col shrink-0 h-screen sticky top-0 z-40 overflow-hidden border-r border-white/[0.06] bg-[#111111]"
      animate={{ width: isExpanded ? 240 : 64 }}
      initial={false}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <AnimatePresence mode="wait" initial={false}>
        {isExpanded ? (
          <motion.div
            key="header-expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0"
          >
            <span className="text-[14px] font-semibold text-white tracking-tight select-none">
              WohnenWo
            </span>
            <button
              type="button"
              onClick={toggle}
              title="Sidebar einklappen"
              className="h-7 w-7 flex items-center justify-center rounded-lg text-white/35 hover:text-white/70 hover:bg-white/[0.08] transition-colors duration-150 cursor-pointer"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="header-collapsed"
            type="button"
            onClick={toggle}
            title="Sidebar ausklappen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="group w-full flex justify-center items-center py-4 px-2 border-b border-white/[0.06] shrink-0 cursor-pointer"
          >
            <div className="h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:shadow-[0_0_18px_rgba(245,200,66,0.35)] group-hover:ring-1 group-hover:ring-[#F5C842]/20">
              <img
                src="/images/brand/logos/ww-badge-white.svg"
                alt="WohnenWo"
                className="h-7 w-7 object-contain"
              />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
        {loading && isExpanded && (
          <div className="px-3 py-2 text-[11px] text-white/25">Wird geladen…</div>
        )}

        <nav className="flex flex-col gap-0.5">
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
                title={!isExpanded ? item.label : undefined}
              >
                <div
                  className={cn(
                    "flex items-center rounded-lg transition-colors duration-150 cursor-pointer",
                    isExpanded ? "gap-x-2.5 px-3 py-2.5" : "justify-center p-3",
                    isActive
                      ? "bg-white/[0.08] border border-white/[0.06] text-white"
                      : "border border-transparent hover:bg-white/[0.05] hover:text-white/80"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors duration-150",
                      isActive ? "text-[#F5C842]" : "text-white/35"
                    )}
                  />
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "text-[14px] font-medium leading-tight whitespace-nowrap",
                          isActive ? "text-white" : "text-white/45"
                        )}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}
        </nav>

        {communityItems.length > 0 && (
          <div className="mt-4 flex flex-col gap-0.5">
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="px-3 pb-1.5 text-[11px] font-medium text-white/25 tracking-[0.12em] uppercase"
                >
                  Community
                </motion.div>
              )}
            </AnimatePresence>

            <nav className="flex flex-col gap-0.5">
              {communityItems.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <div
                      className={cn(
                        "flex items-center rounded-lg transition-colors duration-150 cursor-pointer",
                        isExpanded ? "gap-x-2.5 px-3 py-2.5" : "justify-center p-3",
                        isActive
                          ? "bg-white/[0.08] border border-white/[0.06] text-white"
                          : "border border-transparent hover:bg-white/[0.05] hover:text-white/80"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors duration-150",
                          isActive ? "text-[#F5C842]" : "text-white/35"
                        )}
                      />
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className={cn(
                              "text-[14px] font-medium leading-tight whitespace-nowrap",
                              isActive ? "text-white" : "text-white/45"
                            )}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

    </motion.aside>
  );
}
