// components/navigation/ecosystem-config.ts

export type EcosystemLink = {
  label: string;
  href: string;
  badge?: {
    type: "circle" | "square" | "logo";
    text?: string;
    imgSrc?: string;
    imgAlt?: string;
  };
};

export type EcosystemSection = {
  title: string;
  id: "handeln" | "entdecken" | "wirken" | string;
  links: EcosystemLink[];
};

export const ecosystemSections: EcosystemSection[] = [
  {
    title: "Handeln",
    id: "handeln",
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
    title: "Entdecken",
    id: "entdecken",
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
    title: "Wirken",
    id: "wirken",
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
