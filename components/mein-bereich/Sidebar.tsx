"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelsTopLeft } from "lucide-react";
import { meinBereichNav } from "./nav-config";
import EcosystemFlyout from "@/components/navigation/EcosystemFlyout";

function classNames(...classes: (string | boolean | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const pathname = usePathname();

  const mainItems = meinBereichNav.filter((i) => i.section === "main");
  const communityItems = meinBereichNav.filter(
    (i) => i.section === "community"
  );

  return (
    <aside
      className="hidden md:flex flex-col shrink-0 h-screen bg-slate-50 py-3 px-5 border-r border-slate-200 sticky top-0 overflow-hidden"
      style={{ width: 240 }}
    >
      {/* Ecosystem Flyout statt Logo */}
      <div className="mb-5">
        <EcosystemFlyout panelWidthClassName="w-[520px]" />
      </div>

      <div className="flex flex-col gap-6">
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
