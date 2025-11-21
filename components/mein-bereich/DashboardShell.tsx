// components/mein-bereich/DashboardShell.tsx
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type Props = {
  children: ReactNode;
};

export default function DashboardShell({ children }: Props) {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Linke Sidebar */}
      <Sidebar />

      {/* Rechts: Topbar + Inhalt */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 bg-slate-100">
          <div className="mx-auto w-full max-w-5xl px-4 md:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
