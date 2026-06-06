"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/mein-bereich/Sidebar";
import Topbar from "@/components/mein-bereich/Topbar";
import MobileSidebar from "@/components/mein-bereich/MobileSidebar";

type Props = {
  children: ReactNode;
};

// iOS drawer easing – snappy entry, smooth settle
const DRAWER_EASE = [0.32, 0.72, 0, 1] as const;

export default function MeinBereichShell({ children }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Slide-In Drawer */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Hauptcontent – animiert wie Claude Mobile App beim Drawer-Öffnen */}
      <motion.div
        className="flex flex-1 flex-col h-screen overflow-hidden bg-[#0A0A0A]"
        animate={
          mobileMenuOpen
            ? { scale: 0.93, borderRadius: 20 }
            : { scale: 1, borderRadius: 0 }
        }
        transition={{ duration: 0.35, ease: DRAWER_EASE }}
        style={{ transformOrigin: "center center" }}
      >
        <Topbar onMenuOpen={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-6 py-6">
            {children}
          </div>
        </main>
      </motion.div>
    </div>
  );
}
