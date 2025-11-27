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

/**
 * Rollen, die wir im Mein Bereich berücksichtigen.
 * - guest: nicht eingeloggt
 * - user: registriert, aber noch keine Kundin
 * - kunde: z.B. Andrea mit Projekten/Rechnungen
 * - partner: Dienstleister/Studios
 * - admin: du selbst / Admin
 */
export type MeinBereichRole = "guest" | "user" | "kunde" | "partner" | "admin";

/**
 * Feature-/Daten-Flags, die bestimmen können, ob ein Eintrag sichtbar ist.
 * (für zukünftige Erweiterung – aktuell noch auf "none" gesetzt)
 */
export type MeinBereichFlag = "none" | "hasProjects" | "hasInvoices";

export type MeinBereichNavItem = {
  id: MeinBereichRouteId;
  href: string;
  label: string;
  description?: string;
  section: MeinBereichSection;
  icon: LucideIcon;

  // NEU: Sichtbarkeit nach Rolle
  visibleFor: MeinBereichRole[];

  // NEU: Optionaler Daten-Flag
  requiresFlag?: MeinBereichFlag;
};

export const MEIN_BEREICH_NAV_ITEMS: MeinBereichNavItem[] = [
  {
    id: "mein-bereich",
    href: "/mein-bereich",
    label: "Mein Bereich",
    description: "Übersicht über deinen Wirkungsbereich.",
    section: "main",
    icon: LayoutGrid,
    visibleFor: ["guest", "user", "kunde", "partner", "admin"],
    requiresFlag: "none",
  },
  {
    id: "kurse",
    href: "/mein-bereich/kurse",
    label: "Kurse",
    description: "Alle Lernpfade und Module, an denen du arbeitest.",
    section: "main",
    icon: BookOpen,
    // Gäste dürfen Kurse-Übersicht sehen, um ein Gefühl zu bekommen
    visibleFor: ["guest", "user", "kunde", "partner", "admin"],
    requiresFlag: "none",
  },
  {
    id: "training",
    href: "/mein-bereich/training",
    label: "Dein Training",
    description: "Routinen, Fortschritt und persönliche Vertiefung.",
    section: "main",
    icon: Dumbbell,
    // Training erst, wenn jemand angemeldet ist
    visibleFor: ["user", "kunde", "partner", "admin"],
    requiresFlag: "none",
  },
  {
    id: "sammlungen",
    href: "/mein-bereich/sammlungen",
    label: "Sammlungen",
    description: "Merkliste, Inspirationen und gespeicherte Inhalte.",
    section: "main",
    icon: Bookmark,
    // Merkliste ebenfalls nur für eingeloggte
    visibleFor: ["user", "kunde", "partner", "admin"],
    requiresFlag: "none",
  },
  {
    id: "community",
    href: "/mein-bereich/community",
    label: "Jobs & Community",
    description: "Menschen, Projekte und Möglichkeiten zum Mitwirken.",
    section: "community",
    icon: Users,
    // Community kann für alle sichtbar sein
    visibleFor: ["guest", "user", "kunde", "partner", "admin"],
    requiresFlag: "none",
  },
];

// Hilfsfunktion für PageHeader (wie vorher)
export function findNavItemByPath(
  pathname: string
): MeinBereichNavItem | undefined {
  const exact = MEIN_BEREICH_NAV_ITEMS.find((item) => item.href === pathname);
  if (exact) return exact;

  return MEIN_BEREICH_NAV_ITEMS.find((item) =>
    pathname.startsWith(item.href)
  );
}
