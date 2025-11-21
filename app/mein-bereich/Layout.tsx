import type { ReactNode } from "react";
import MeinBereichSidebar from "@/components/sidebar/MeinBereichSidebar";
import MeinBereichTopbar from "@/components/sidebar/MeinBereichTopbar";

export default function MeinBereichLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Linke Sidebar (nur ab md sichtbar) */}
      <MeinBereichSidebar />

      {/* Rechte Seite: Topbar + Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <MeinBereichTopbar />

        <main className="flex-1 bg-slate-950">
          {/* Max-Width Content wie Dashboard */}
          <div className="mx-auto w-full max-w-5xl px-4 md:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
