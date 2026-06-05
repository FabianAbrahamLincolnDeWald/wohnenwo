// app/(mein-bereich-detail)/mein-bereich/rechnungen/layout.tsx
import type { ReactNode } from "react";
import MeinBereichDetailShell from "@/components/mein-bereich/MeinBereichDetailShell";

export default function RechnungDetailLayout({ children }: { children: ReactNode }) {
  return <MeinBereichDetailShell>{children}</MeinBereichDetailShell>;
}
