// app/(mein-bereich-shell)/mein-bereich/layout.tsx
import type { ReactNode } from "react";
import MeinBereichShell from "@/components/mein-bereich/MeinBereichShell";

export default function MeinBereichLayout({ children }: { children: ReactNode }) {
  return <MeinBereichShell>{children}</MeinBereichShell>;
}
