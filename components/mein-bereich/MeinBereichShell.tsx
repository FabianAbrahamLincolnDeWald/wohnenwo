"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "@/components/mein-bereich/Sidebar";
import Topbar from "@/components/mein-bereich/Topbar";
import MobileSidebar from "@/components/mein-bereich/MobileSidebar";

type Props = {
  children: ReactNode;
};

export default function MeinBereichShell({ children }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Slide-In Drawer */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Rechte Spalte: Topbar + Content */}
      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        <Topbar onMenuOpen={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
