// app/mein-bereich/layout.tsx
import type { ReactNode } from "react";
import Sidebar from "@/components/mein-bereich/Sidebar";
import Topbar from "@/components/mein-bereich/Topbar";

export default function MeinBereichLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Linke Spalte: Sidebar */}
        <Sidebar />

        {/* Rechte Spalte: Topbar + Header + Content */}
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />

          {/* Content-Bereich */}
          <main className="flex-1">
            <div className="mx-auto w-[min(92vw,1120px)] py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
