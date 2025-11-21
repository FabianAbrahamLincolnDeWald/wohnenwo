import type { ReactNode } from "react";
import DashboardShell from "@/components/mein-bereich/DashboardShell";

export default function MeinBereichLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
