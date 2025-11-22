// components/mein-bereich/nav-config.ts

import {
  LayoutGrid,
  BookOpen,
  Dumbbell,
  Bookmark,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type MeinBereichRouteId =
  | "mein-bereich"
  | "kurse"
  | "training"
  | "sammlungen"
  | "community";

export type MeinBereichSection = "main" | "community";

export type MeinBereichNavItem = {
  id: MeinBereichRouteId;
  href: string;
  label: string;
  description?: string;
  section: MeinBereichSection;
  icon: LucideIcon;
};

export const MEIN_BEREICH_NAV_ITEMS: MeinBereichNavItem[] = [
  {
    id: "mein-bereich",
    href: "/mein-bereich",
    label: "Mein Bereich",
    description: "Übersicht über deinen Wirkungsbereich.",
    section: "main",
    icon: LayoutGrid,
  },
  {
    id: "kurse",
    href: "/mein-bereich/kurse",
    label: "Kurse",
    description: "Alle Lernpfade und Module, an denen du arbeitest.",
    section: "main",
    icon: BookOpen,
  },
  {
    id: "training",
    href: "/mein-bereich/training",
    label: "Dein Training",
    description: "Routinen, Fortschritt und persönliche Vertiefung.",
    section: "main",
    icon: Dumbbell,
  },
  {
    id: "sammlungen",
    href: "/mein-bereich/sammlungen",
    label: "Sammlungen",
    description: "Merkliste, Inspirationen und gespeicherte Inhalte.",
    section: "main",
    icon: Bookmark,
  },
  {
    id: "community",
    href: "/mein-bereich/community",
    label: "Jobs & Community",
    description: "Menschen, Projekte und Möglichkeiten zum Mitwirken.",
    section: "community",
    icon: Users,
  },
];

// Hilfsfunktion für PageHeader (wie vorher)
export function findNavItemByPath(pathname: string): MeinBereichNavItem | undefined {
  const exact = MEIN_BEREICH_NAV_ITEMS.find((item) => item.href === pathname);
  if (exact) return exact;

  return MEIN_BEREICH_NAV_ITEMS.find((item) =>
    pathname.startsWith(item.href)
  );
}
