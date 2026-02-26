// app/(mein-bereich-shell)/mein-bereich/layout.tsx
import type { ReactNode } from "react";
import Sidebar from "@/components/mein-bereich/Sidebar";
import Topbar from "@/components/mein-bereich/Topbar";
import AuthRefreshListener from "@/components/auth/AuthRefreshListener";

export default function MeinBereichLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AuthRefreshListener />
      {/* Linke Spalte: Sidebar (fixer Rahmen links) */}
      <Sidebar />

      {/* Rechte Spalte: Topbar oben, darunter scrollbarer Inhalt */}
      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        {/* Topbar bleibt wie gebaut – kein fixed/kein sticky nötig */}
        <Topbar />

        {/* Content-Bereich scrollt unabhängig von Topbar */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
