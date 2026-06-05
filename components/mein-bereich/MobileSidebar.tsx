"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { MEIN_BEREICH_NAV_ITEMS, MeinBereichRole } from "@/components/mein-bereich/nav-config";

const SIDEBAR_WIDTH = 280;

function classNames(...classes: (string | boolean | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  role?: MeinBereichRole;
};

export default function MobileSidebar({ isOpen, onClose, role = "guest" }: Props) {
  const pathname = usePathname();

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
    const roleOk = item.visibleFor.includes(role);
    return roleOk;
  });

  const mainItems = visibleItems.filter((i) => i.section === "main");
  const communityItems = visibleItems.filter((i) => i.section === "community");

  return (
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
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: SIDEBAR_WIDTH }}
            className={[
              "fixed left-0 top-0 bottom-0 z-50 md:hidden",
              "flex flex-col",
              "bg-slate-100 dark:bg-[#111111]",
              "border-r border-slate-200 dark:border-white/10",
              "shadow-xl",
            ].join(" ")}
            aria-label="Mobile Navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/10">
              <p className="text-[13px] font-semibold tracking-tight text-slate-900 dark:text-white">
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

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-200 dark:border-white/10">
              <p className="text-[11px] text-slate-400 dark:text-white/30 leading-snug">
                WohnenWo · Mein Bereich
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
