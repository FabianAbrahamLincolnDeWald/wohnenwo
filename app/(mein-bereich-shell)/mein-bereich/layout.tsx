// app/(mein-bereich-shell)/mein-bereich/layout.tsx
export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import Sidebar from "@/components/mein-bereich/Sidebar";
import Topbar from "@/components/mein-bereich/Topbar";
import AuthRefreshListener from "@/components/auth/AuthRefreshListener";

export default function MeinBereichLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#111113]">
      <AuthRefreshListener />
      <Sidebar />

      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}