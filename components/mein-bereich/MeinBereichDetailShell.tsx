"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "@/components/mein-bereich/Sidebar";
import Topbar from "@/components/mein-bereich/Topbar";
import MobileSidebar from "@/components/mein-bereich/MobileSidebar";

type Props = {
  children: ReactNode;
};

export default function MeinBereichDetailShell({ children }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0A0A0A]">
      <Sidebar />

      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuOpen={() => setMobileMenuOpen(true)} />

        <div className="flex-1 min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}
