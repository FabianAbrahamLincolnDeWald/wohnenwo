import type * as React from "react";
import { GraduationCap, Leaf, ShieldCheck, Repeat2 } from "lucide-react";

export type AccessibilityValue = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  surface?: "light" | "dark";
  ctaLabel?: string;
  external?: boolean;
};

export const ACCESSIBILITY_VALUES: AccessibilityValue[] = [
  {
    id: "education",
    title: "Bildung",
    description:
      "Wir helfen Schüler:innen, Studierenden und Lehrkräften zu lernen, kreativ zu werden und ihren Erfolg selbst zu definieren.",
    href: "/de/education-initiative/",
    icon: GraduationCap,
    surface: "light",
    ctaLabel: "Weitere Infos",
  },
  {
    id: "environment",
    title: "Umwelt",
    description:
      "Wir sind entschlossen, unsere Netto-Emissionen für unseren gesamten CO₂-Fußabdruck bis 2030 auf null zu senken.",
    href: "/de/environment/",
    icon: Leaf,
    surface: "light",
    ctaLabel: "Weitere Infos",
  },
  {
    id: "privacy",
    title: "Datenschutz",
    description:
      "Wir entwickeln jedes Produkt und jeden Service so, dass deine Daten sicher und geschützt bleiben.",
    href: "/de/privacy/",
    icon: ShieldCheck,
    surface: "light",
    ctaLabel: "Weitere Infos",
  },
  {
    id: "supply-chain",
    title: "Innovation in der Lieferkette",
    description:
      "Sichere, respektvolle und unterstützende Arbeitsplätze bereitzustellen, hat für uns Priorität.",
    href: "/de/supply-chain/",
    icon: Repeat2,
    surface: "light",
    ctaLabel: "Weitere Infos",
  },
];
