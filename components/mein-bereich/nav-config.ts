// components/mein-bereich/nav-config.ts

import {
  LayoutGrid,
  FileText,
  FolderKanban,
  Bookmark,
  Users,
  UserStar,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type MeinBereichRouteId =
  | "mein-bereich"
  | "rechnungen"
  | "projekte"
  | "sammlungen"
  | "experten"
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

  // Sichtbarkeit nach Rolle
  visibleFor: MeinBereichRole[];

  // Optionaler Daten-Flag
  requiresFlag?: MeinBereichFlag;
};

export const MEIN_BEREICH_NAV_ITEMS: MeinBereichNavItem[] = [
  {
    id: "mein-bereich",
    href: "/mein-bereich",
    label: "Mein Bereich",
    description: "Start in deinen persönlichen Wirkungsbereich.",
    section: "main",
    icon: LayoutGrid,
    visibleFor: ["guest", "user", "kunde", "partner", "admin"],
    requiresFlag: "none",
  },
  {
    id: "rechnungen",
    href: "/mein-bereich/rechnungen",
    label: "Rechnungen",
    description:
      "Transparente Rechnungen und Aufschlüsselungen deiner Projekte.",
    section: "main",
    icon: FileText,
    // Gäste dürfen die Struktur sehen, um ein Gefühl zu bekommen
    visibleFor: ["guest", "user", "kunde", "partner", "admin"],
    requiresFlag: "none",
  },
  {
    id: "projekte",
    href: "/mein-bereich/projekte",
    label: "Projekte",
    description: "Laufende und abgeschlossene Wohnerlebnisse im Überblick.",
    section: "main",
    icon: FolderKanban,
    // Projekte erst, wenn jemand angemeldet ist
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
    // Merkliste nur für eingeloggte
    visibleFor: ["user", "kunde", "partner", "admin"],
    requiresFlag: "none",
  },
  {
    id: "experten",
    href: "/mein-bereich/experten",
    label: "Experten",
    description:
      "Verbundenes Team aus Studios, Planer:innen und Hersteller:innen.",
    section: "community",
    icon: UserStar,
    visibleFor: ["guest", "user", "kunde", "partner", "admin"],
    requiresFlag: "none",
  },
  {
    id: "community",
    href: "/mein-bereich/community",
    label: "Community",
    description: "Menschen und Projekte, mit denen du Wirkung teilst.",
    section: "community",
    icon: Users,
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
