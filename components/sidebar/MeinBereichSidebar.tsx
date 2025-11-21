"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PanelsTopLeft,
  LayoutGrid,
  BookOpen,
  Dumbbell,
  Bookmark,
  Users,
} from "lucide-react";

const MAIN_NAV = [
  { label: "Übersicht", href: "/mein-bereich", icon: LayoutGrid },
  { label: "Kurse", href: "/mein-bereich/kurse", icon: BookOpen },
  { label: "Dein Training", href: "/mein-bereich/training", icon: Dumbbell },
  { label: "Sammlungen", href: "/mein-bereich/sammlungen", icon: Bookmark },
];

const COMMUNITY_NAV = [
  { label: "Community & Jobs", href: "/mein-bereich/community", icon: Users },
];

function classNames(...classes: (string | boolean | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function MeinBereichSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col shrink-0 h-screen bg-slate-950/95 text-slate-100 border-r border-slate-800/80 sticky top-0 overflow-hidden py-3 px-5"
      style={{ width: 240 }}
    >
      {/* Logo / Home-Button */}
      <div className="mb-5">
        <Link
          href="/mein-bereich"
          className="border border-slate-800 h-9 w-9 flex items-center justify-center rounded-md bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
        >
          <PanelsTopLeft className="h-4 w-4" />
        </Link>
      </div>

      {/* Nav-Gruppen */}
      <div className="flex flex-col gap-6">
        {/* Hauptnavigation */}
        <nav className="flex flex-col gap-1.5">
          {MAIN_NAV.map((item) => {
            const isActive =
              item.href === "/mein-bereich"
                ? pathname === "/mein-bereich"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="w-full cursor-pointer"
              >
                <div
                  className={classNames(
                    "flex w-full items-center gap-x-2 p-2.5 rounded-lg group transition-all duration-300 ease-in-out text-sm",
                    "hover:bg-slate-900/80",
                    isActive
                      ? "bg-slate-900/90 text-slate-50 shadow-sm"
                      : "text-slate-400 hover:text-slate-100"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <div className="text-[15px] font-medium leading-tight">
                    {item.label}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Community-Bereich */}
        <div className="flex flex-col gap-1.5">
          <div className="text-xs font-medium text-slate-500 mb-1 tracking-wide">
            Community
          </div>
          <nav className="flex flex-col gap-1.5">
            {COMMUNITY_NAV.map((item) => {
              const isActive = pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="w-full cursor-pointer"
                >
                  <div
                    className={classNames(
                      "flex w-full items-center gap-x-2 p-2.5 rounded-lg group transition-all duration-300 ease-in-out text-sm",
                      "hover:bg-slate-900/80",
                      isActive
                        ? "bg-slate-900/90 text-slate-50 shadow-sm"
                        : "text-slate-400 hover:text-slate-100"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <div className="text-[15px] font-medium leading-tight">
                      {item.label}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
