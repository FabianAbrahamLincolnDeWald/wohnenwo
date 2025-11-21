// components/navigation/ecosystem-config.ts

export type EcosystemBadgeType = "circle" | "square" | "logo";

export type EcosystemLink = {
  label: string;
  href: string;
  badge?: {
    type: EcosystemBadgeType;
    text?: string;
    imgSrc?: string;
    imgAlt?: string;
  };
};

export type EcosystemSection = {
  id: "handeln" | "entdecken" | "wirken" | string;
  title: string;
  links: EcosystemLink[];
};

export const ecosystemSections: EcosystemSection[] = [
  {
    id: "handeln",
    title: "Handeln",
    links: [
      {
        label: "Startseite",
        href: "/",
        badge: { type: "circle" },
      },
      {
        label: "Experten-Netzwerk",
        href: "/experten-netzwerk",
        badge: { type: "circle", text: "EX" },
      },
    ],
  },
  {
    id: "entdecken",
    title: "Entdecken",
    links: [
      {
        label: "WohnenWo Design entsteht",
        href: "/designentsteht",
        badge: {
          type: "logo",
          imgSrc:
            "https://wohnenwo.vercel.app/images/brand/logos/wwde-badge-dark.svg",
          imgAlt: "wwde Logo",
        },
      },
      {
        label: "WohnenWo Werte wirken",
        href: "/wertewirken",
        badge: { type: "circle", text: "DW" },
      },
    ],
  },
  {
    id: "wirken",
    title: "Wirken",
    links: [
      {
        label: "Philosophie",
        href: "/",
        badge: { type: "circle", text: "P" },
      },
      {
        label: "Strategische Planung",
        href: "/",
        badge: { type: "circle" },
      },
      {
        label: "Store",
        href: "/",
        badge: { type: "square", text: "€" },
      },
      {
        label: "Community",
        href: "/",
        badge: { type: "circle" },
      },
      {
        label: "Masterpiece Furniture",
        href: "/",
        badge: { type: "circle" },
      },
    ],
  },
];
