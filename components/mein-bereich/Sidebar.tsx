"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelsTopLeft, LayoutGrid, BookOpen, Dumbbell, Bookmark, Users } from "lucide-react";

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const MAIN = [
  { label: "Home", href: "/mein-bereich", icon: LayoutGrid },
  { label: "Kurse", href: "/mein-bereich/kurse", icon: BookOpen },
  { label: "Dein Training", href: "/mein-bereich/training", icon: Dumbbell },
  { label: "Sammlungen", href: "/mein-bereich/sammlungen", icon: Bookmark },
];

const COMMUNITY = [
  { label: "Jobs & Community", href: "/mein-bereich/community", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col shrink-0 h-screen bg-slate-50 py-3 px-5 border-r border-slate-200 sticky top-0 overflow-hidden"
      style={{ width: 240 }}
    >
      {/* Logo / Home-Button (kann später durch EcosystemFlyout ersetzt werden) */}
      <div className="mb-5">
        <Link
          href="/mein-bereich"
          className="border border-slate-200 h-9 w-9 flex items-center justify-center rounded-md bg-white text-slate-900"
        >
          <PanelsTopLeft className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {/* Hauptnavigation */}
        <nav className="flex flex-col gap-1.5">
          {MAIN.map((item) => {
            const isActive =
              item.href === "/mein-bereich"
                ? pathname === "/mein-bereich"
                : pathname?.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} className="w-full">
                <div
                  className={cx(
                    "flex w-full items-center gap-x-2 p-2.5 rounded-lg text-sm transition-all duration-300 ease-in-out",
                    "hover:bg-slate-100",
                    isActive
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-[15px] font-medium leading-tight">
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Community */}
        <div className="flex flex-col gap-1.5">
          <div className="text-xs font-medium text-slate-400 mb-1 tracking-wide">
            Community
          </div>
          <nav className="flex flex-col gap-1.5">
            {COMMUNITY.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href} className="w-full">
                  <div
                    className={cx(
                      "flex w-full items-center gap-x-2 p-2.5 rounded-lg text-sm transition-all duration-300 ease-in-out",
                      "hover:bg-slate-100",
                      isActive
                        ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-[15px] font-medium leading-tight">
                      {item.label}
                    </span>
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
