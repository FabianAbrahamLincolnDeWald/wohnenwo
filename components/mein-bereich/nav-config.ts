// components/mein-bereich/nav-config.ts

export type MeinBereichRouteId =
  | "home"
  | "kurse"
  | "training"
  | "sammlungen"
  | "community";

export type MeinBereichNavItem = {
  id: MeinBereichRouteId;
  href: string;
  label: string;
  description?: string;
};

export const MEIN_BEREICH_NAV_ITEMS: MeinBereichNavItem[] = [
  {
    id: "home",
    href: "/mein-bereich",
    label: "Home",
    description: "Übersicht über deinen Wirkungsbereich.",
  },
  {
    id: "kurse",
    href: "/mein-bereich/kurse",
    label: "Kurse",
    description: "Alle Lernpfade und Module, an denen du arbeitest.",
  },
  {
    id: "training",
    href: "/mein-bereich/training",
    label: "Dein Training",
    description: "Routinen, Fortschritt und persönliche Vertiefung.",
  },
  {
    id: "sammlungen",
    href: "/mein-bereich/sammlungen",
    label: "Sammlungen",
    description: "Merkliste, Inspirationen und gespeicherte Inhalte.",
  },
  {
    id: "community",
    href: "/mein-bereich/community",
    label: "Jobs & Community",
    description: "Menschen, Projekte und Möglichkeiten zum Mitwirken.",
  },
];

// Hilfsfunktion, um anhand der URL den aktuellen Eintrag zu finden
export function findNavItemByPath(pathname: string): MeinBereichNavItem | undefined {
  // exakte Treffer zuerst
  const exact = MEIN_BEREICH_NAV_ITEMS.find((item) => item.href === pathname);
  if (exact) return exact;

  // Fallback: beginnt mit Pfad (z.B. /mein-bereich/kurse/123)
  return MEIN_BEREICH_NAV_ITEMS.find((item) =>
    pathname.startsWith(item.href)
  );
}
