// app/mein-bereich/layout.tsx
import type { ReactNode } from "react";
import DashboardShell from "@/components/mein-bereich/DashboardShell";

export default function MeinBereichLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Dieses Layout umhüllt ALLE Seiten unter /mein-bereich
  return <DashboardShell>{children}</DashboardShell>;
}
