import {
  LayoutGrid,
  BookOpen,
  Dumbbell,
  Bookmark,
  Users,
  LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  section?: "main" | "community";
};

export const meinBereichNav: NavItem[] = [
  { label: "Mein Bereich", href: "/mein-bereich", icon: LayoutGrid, section: "main" },
  {
    label: "Kurse",
    href: "/mein-bereich/kurse",
    icon: BookOpen,
    section: "main",
  },
  {
    label: "Dein Training",
    href: "/mein-bereich/training",
    icon: Dumbbell,
    section: "main",
  },
  {
    label: "Sammlungen",
    href: "/mein-bereich/sammlungen",
    icon: Bookmark,
    section: "main",
  },
  {
    label: "Jobs & Community",
    href: "/mein-bereich/community",
    icon: Users,
    section: "community",
  },
];
