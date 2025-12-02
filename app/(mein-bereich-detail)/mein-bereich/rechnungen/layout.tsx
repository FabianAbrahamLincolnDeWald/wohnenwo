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
    // Gesamte App-Hülle: volle Höhe des Viewports
    <div className="flex h-screen bg-slate-50">
      {/* Linke Spalte: Sidebar (bereits sticky im eigenen Component) */}
      <Sidebar />

      {/* Rechte Spalte: Topbar + darunter der Detail-Inhalt */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar bleibt oben stehen, der Rest bekommt eigene Höhe */}
        <Topbar />

        {/* Bereich unterhalb der Topbar: füllt den Rest der Höhe */}
        <div className="flex-1 min-h-0">
          {/*
            Hier kommt die Detailseite rein (Rechnung [id]).
            Diese Seite bekommt selbst ein flex + h-full
            und kümmert sich um das 2-Spalten-Layout mit
            unabhängig scrollenden Bereichen.
          */}
          {children}
        </div>
      </div>
    </div>
  );
}
