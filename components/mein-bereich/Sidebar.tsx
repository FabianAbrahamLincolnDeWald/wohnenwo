// components/mein-bereich/Sidebar.tsx
"use client";

import Link from "next/link";
import {
  PanelsTopLeft,
  LayoutGrid,
  BookOpen,
  Dumbbell,
  Bookmark,
  Users,
} from "lucide-react";
import EcosystemFlyout from "@/components/navigation/EcosystemFlyout";

type NavItemProps = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function NavItem({ href, label, icon: Icon }: NavItemProps) {
  return (
    <Link href={href} className="w-full">
      <div className="flex w-full items-center gap-x-2 p-2.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 ease-in-out">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-[15px] font-medium leading-tight">{label}</span>
      </div>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside
      className="hidden md:flex flex-col shrink-0 h-screen bg-slate-50 py-3 px-5 border-r border-slate-200 sticky z-40"
      style={{ width: 240 }}
    >
      {/* Ecosystem Flyout */}
      <div className="mb-5">
        <EcosystemFlyout panelWidth={640} />
      </div>

      <div className="flex flex-col gap-6">
        {/* Hauptnavigation */}
        <nav className="flex flex-col gap-1.5">
          <NavItem href="/mein-bereich" icon={LayoutGrid} label="Home" />
          <NavItem href="/mein-bereich/kurse" icon={BookOpen} label="Kurse" />
          <NavItem
            href="/mein-bereich/training"
            icon={Dumbbell}
            label="Dein Training"
          />
          <NavItem
            href="/mein-bereich/sammlungen"
            icon={Bookmark}
            label="Sammlungen"
          />
        </nav>

        {/* Community-Bereich */}
        <div className="flex flex-col gap-1.5">
          <div className="text-xs font-medium text-slate-400 mb-1 tracking-wide">
            Community
          </div>
          <nav className="flex flex-col gap-1.5">
            <NavItem
              href="/mein-bereich/community"
              icon={Users}
              label="Jobs & Community"
            />
          </nav>
        </div>
      </div>
    </aside>
  );
}
