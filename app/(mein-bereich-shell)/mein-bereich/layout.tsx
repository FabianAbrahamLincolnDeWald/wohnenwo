// app/(mein-bereich-shell)/mein-bereich/layout.tsx
export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import MeinBereichShell from "@/components/mein-bereich/MeinBereichShell";
import AuthRefreshListener from "@/components/auth/AuthRefreshListener";

export default function MeinBereichLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark:bg-[#111113]">
      <AuthRefreshListener />
      <MeinBereichShell>{children}</MeinBereichShell>
    </div>
  );
}
