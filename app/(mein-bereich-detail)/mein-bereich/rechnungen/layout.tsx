// app/(mein-bereich-detail)/mein-bereich/rechnungen/layout.tsx
import type { ReactNode } from "react";
import Sidebar from "@/components/mein-bereich/Sidebar";
import Topbar from "@/components/mein-bereich/Topbar";

export default function RechnungDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Linke Spalte: Sidebar bleibt sichtbar */}
        <Sidebar />

        {/* Rechte Spalte: Topbar + volle Breite für Detail-Content */}
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />

          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
