export type AccessibilityResource = {
  id: string;
  title: string;
  description: string;
  /** lucide-react Icon als Komponente */
  icon: React.ComponentType<{ className?: string }>;
  /** Link-Kachel (Arrow) oder Overlay-Kachel (Plus) */
  kind: "link" | "overlay";
  href?: string;
  overlayTitle?: string;
  overlayHeadline?: string;
  overlayParas?: string[];
  /** optional: Oberfläche wie bei Sector 2 */
  surface?: "light" | "dark";
};

import * as React from "react";
import { LifeBuoy, GraduationCap, Layers } from "lucide-react";

/**
 * Hinweis:
 * - Texte/Bilder kannst du später frei austauschen.
 * - Für Links: kind="link" + href
 * - Für Overlay: kind="overlay" + overlayTitle/overlayHeadline/overlayParas
 */
export const ACCESSIBILITY_RESOURCES: AccessibilityResource[] = [
  {
    id: "accessibility-support",
    title: "Support für\nBedienungshilfen",
    description:
      "Hol dir Hilfe zu deinen Funktionen oder setze dich mit Expert:innen in Verbindung.",
    icon: LifeBuoy,
    kind: "link",
    href: "https://support.apple.com/de-de/accessibility",
    surface: "light",
  },
  {
    id: "accessibility-education",
    title: "Barrierefreiheit im\nBildungsbereich",
    description: "Finde Bedienungshilfen für deine Lerngemeinschaft.",
    icon: GraduationCap,
    kind: "link",
    href: "https://support.apple.com/de-de/121825",
    surface: "light",
  },
  {
    id: "developer-guides",
    title: "Leitfäden für\nEntwickler:innen",
    description:
      "Hier findest du Ressourcen zum Entwickeln von barrierefreien Apps.",
    icon: Layers,
    kind: "link",
    href: "https://developer.apple.com/accessibility/",
    surface: "light",
  },
];
