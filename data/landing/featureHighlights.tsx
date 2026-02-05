// data/landing/featureHighlights.tsx
import type { ReactNode } from "react";

export type OverlayValueBar = {
  label: string;
  value: number; // 0..10
};

export type OverlayTile = {
  icon: "korpus" | "service" | "hygiene" | "ergonomie";
  title: string;
  text: string;
};

export type OverlayCardBlock =
  | {
    kind: "bars";
    text: string | ReactNode;
    bars: { label: string; value: number }[];
    note?: string;
  }
  | {
    kind: "image";
    text: string | ReactNode;
    img: { src: string; alt: string };
  }
  | {
    kind: "tiles";
    text: string | ReactNode;      // der Absatz direkt unter der Overlay-Headline
    kicker?: string;               // optional kurze Überschrift/Überleitung
    tiles: OverlayTile[];          // 2×2 Grid
    bridge?: string;               // optional Übergang zurück zur nächsten Karte
  };

export type OverlayShowcaseItem = {
  id: string;
  title: string;
  image: { src: string; alt: string };
};

export type FeatureHighlight = {
  id: string;
  category: string;
  title: string;
  image: { src: string; alt: string };
  surface: "light" | "dark";

  overlayTitle: string;

  overlayHeadline: string;

  overlayModalHeadline?: string;

  overlayParas: Array<string | ReactNode>;

  overlayCards?: OverlayCardBlock[];

  overlayMoreTitle?: string;
  overlayMoreItems?: OverlayShowcaseItem[];
};

export const FEATURE_HIGHLIGHTS: FeatureHighlight[] = [
  {
    id: "schueller",
    category: "Lebensphasen",
    title: "Schüller",
    image: {
      src: "/images/kitchen/schueller.jpeg",
      alt: "Schüller Küche – wohnlich, modern, alltagstauglich",
    },
    surface: "light",
    overlayTitle: "Schüller",

    // bleibt auf der Karte
    overlayHeadline: "Design, das bezahlbar bleibt.",

    // wird Overlay-Headline (groß)
    overlayModalHeadline: "Für dich, wenn Zuhause mit dir mitwächst.",

    overlayParas: [],

    overlayCards: [
      {
        kind: "tiles",
        text:
          "Dein Leben verändert sich – und deine Küche darf das auch. Schüller denkt in Lebensphasen: planbar, alltagstauglich und so gestaltet, dass es sich jeden Tag stimmig anfühlt.",
        kicker: "Das macht Schüller im Kern aus:",
        tiles: [
          {
            icon: "service",
            title: "Planung, die mitdenkt",
            text: "Individuell planbar – damit der Raum zu deinem Alltag passt, nicht umgekehrt.",
          },
          {
            icon: "ergonomie",
            title: "Alltag wird leichter",
            text: "Ergonomie, Höhen und Abläufe so, dass Kochen sich gut anfühlt – Tag für Tag.",
          },
          {
            icon: "korpus",
            title: "Qualität fürs Leben",
            text: "Robust gebaut, sauber verarbeitet – damit sich Stabilität auch nach Jahren zeigt.",
          },
          {
            icon: "hygiene",
            title: "Ordnung & Pflegeleicht",
            text: "Stauraum-Logik und Lösungen, die dir den Alltag spürbar einfacher machen.",
          },
        ],
        bridge:
          "Wenn du wissen willst, warum das so zuverlässig wirkt, schau dir diese zwei Punkte an – sie zeigen die Haltung dahinter ganz konkret.",
      },

      {
        kind: "image",
        text:
          "Qualität, die nicht laut sein muss: solide gebaut, klar geprüft und auf Langlebigkeit ausgelegt – damit du dich einfach darauf verlassen kannst.",
        img: {
          // Wert/USP: „Qualität made by Schüller“ / Stabilität
          src: "/images/kitchen/schueller/schueller_qualitaet.jpg",
          alt: "Schüller – Qualität & Verarbeitung (Beispielbild)",
        },
      },

      {
        kind: "image",
        text:
          "Zuhause als Inspirationsquelle: Gestaltung, die nicht nur schön aussieht, sondern sich im täglichen Leben richtig anfühlt – über jede Phase hinweg.",
        img: {
          // Wert/USP: „Küchen fürs Leben“ / Lebensphasen + ganzheitlich
          src: "/images/kitchen/schueller/schueller_lebensphasen.jpg",
          alt: "Schüller – Küche fürs Leben / Lebensphasen (Beispielbild)",
        },
      },
    ],

    overlayMoreTitle: "Was Schüller sonst noch kann:",
    overlayMoreItems: [
      {
        id: "utility",
        title: "Hauswirtschaft",
        image: {
          src: "/images/kitchen/schueller/schueller_hwr.jpg",
          alt: "Schüller – Hauswirtschaftsraum (Beispiel)",
        },
      },
      {
        id: "storage",
        title: "Stauraum & Ordnung",
        image: {
          src: "/images/kitchen/schueller/schueller_stauraum.jpg",
          alt: "Schüller – Stauraum & Organisation (Beispiel)",
        },
      },
      {
        id: "living",
        title: "Wohnräume",
        image: {
          src: "/images/kitchen/schueller/schueller_wohnen.jpg",
          alt: "Schüller – Wohnmöbel / Wohnräume (Beispiel)",
        },
      },
      {
        id: "entry",
        title: "Eingangsbereich",
        image: {
          src: "/images/kitchen/schueller/schueller_entry.jpg",
          alt: "Schüller – Eingangsbereich (Beispiel)",
        },
      },
    ],
  },
  {
    id: "nobilia",
    category: "Preis-Leistung",
    title: "nobilia",
    image: {
      src: "/images/kitchen/nobilia.jpg",
      alt: "nobilia Küche – modern, alltagstauglich, wohnlich",
    },
    surface: "dark",
    overlayTitle: "nobilia",
    overlayHeadline: "Wohnqualität für alle.",
    overlayModalHeadline: "Für dich, wenn Preis-Leistung zählt.",
    overlayParas: [
      "Du willst eine Küche, die sich richtig anfühlt – weil sie schön ist, verlässlich funktioniert und im Budget planbar bleibt.",
      "nobilia steht für genau diese Haltung: gute Wohnqualität so zu bauen, dass sie für viele möglich ist – ohne kompliziert zu werden.",
      "Passt zu dir, wenn du eine klare, vernünftige Entscheidung treffen willst: viel Küche fürs echte Leben – ohne Prestige-Preis.",
    ],
  },
  {
    id: "ballerina",
    category: "Innenwerte",
    title: "Ballerina Küchen",
    image: {
      src: "/images/kitchen/ballerina_kuechen/ballerina-kuechen.jpeg",
      alt: "Ballerina Küche – detailreich, hochwertig, alltagstauglich",
    },
    surface: "light",
    overlayTitle: "Ballerina Küchen",

    overlayHeadline: "Mehr Substanz im Detail.",

    overlayModalHeadline: "Für dich, wenn innere Werte zählen.",

    overlayParas: [],

    overlayCards: [
      {
        kind: "tiles",
        text: "Du willst nicht nur eine schöne Küche — du willst, dass sie sich auch nach Jahren noch stabil, wertig und durchdacht anfühlt.",
        kicker: "Das macht Ballerina im Kern aus:",
        tiles: [
          { icon: "korpus", title: "Ultimativer Korpus", text: "Stabilität im Innenleben – spürbar robust gebaut." },
          { icon: "service", title: "Starker Service", text: "Zuverlässig in Abwicklung & Reklamation – entspannt nach dem Kauf." },
          { icon: "hygiene", title: "Antibakteriell", text: "Alltagstaugliche Oberflächen – sauber, pflegeleicht, angenehm." },
          { icon: "ergonomie", title: "Ergonomie", text: "Höhen, Greifräume, Abläufe – damit es sich körperlich richtig anfühlt." },
        ],
        bridge: "",
      },
      {
        kind: "image",
        text:
          "Ein besonders stabil gedachter Korpus mit einer sehr robuste Rückwand-Lösung — weil Alltag nicht immer zart ist.",
        img: {
          src: "/images/kitchen/ballerina_kuechen/ballerina_korpus.jpg",
          alt: "Ballerina – Korpus Querschnitt / Materialstärke (Beispielbild)",
        },
      },
      {
        kind: "image",
        text:
          "Ergonomie wird auf dich abgestimmt — damit Arbeiten, Greifen und Bewegen in der Küche wirklich angenehm wird.",
        img: {
          src: "/images/kitchen/ballerina_kuechen/ballerina_ergo.jpg",
          alt: "Ballerina – Ergonomie / Arbeitshöhen / Greifräume (Beispielbild)",
        },
      },
    ],

    overlayMoreTitle: "Was Ballerina Küchen sonst noch kann:",
    overlayMoreItems: [
      {
        id: "dressing",
        title: "Ankleiden",
        image: {
          src: "/images/kitchen/ballerina_kuechen/ballerina_ankleide.jpg",
          alt: "Ballerina – Ankleiden (Beispiel)",
        },
      },
      {
        id: "living",
        title: "Wohnräume",
        image: {
          src: "/images/kitchen/ballerina_kuechen/ballerina_wohnen.jpg",
          alt: "Ballerina – Wohnräume (Beispiel)",
        },
      },
      {
        id: "living",
        title: "Wohnräume",
        image: {
          src: "/images/kitchen/ballerina_kuechen/ballerina_wohnen1.jpg",
          alt: "Ballerina – Wohnräume (Beispiel)",
        },
      },
      {
        id: "entry",
        title: "Wohnmöbel",
        image: {
          src: "/images/kitchen/ballerina_kuechen/ballerina_wohnmoebel.jpg",
          alt: "Ballerina – Eingangsbereich (Beispiel)",
        },
      },
      {
        id: "entry",
        title: "Eingangsbereich",
        image: {
          src: "/images/kitchen/ballerina_kuechen/ballerina_eingangsbereich.jpg",
          alt: "Ballerina – Eingangsbereich (Beispiel)",
        },
      },
      {
        id: "utility",
        title: "Hauswirtschaft",
        image: {
          src: "/images/kitchen/ballerina_kuechen/ballerina_hauswirtschaftsraum.jpg",
          alt: "Ballerina – Hauswirtschaft (Beispiel)",
        },
      },
      {
        id: "utility",
        title: "Badmöbel",
        image: {
          src: "/images/kitchen/ballerina_kuechen/ballerina_bad.jpg",
          alt: "Ballerina – Hauswirtschaft (Beispiel)",
        },
      },
      {
        id: "utility",
        title: "Kinderzimmer",
        image: {
          src: "/images/kitchen/ballerina_kuechen/ballerina_kids.jpg",
          alt: "Ballerina – Hauswirtschaft (Beispiel)",
        },
      },
      {
        id: "utility",
        title: "Büromöbel",
        image: {
          src: "/images/kitchen/ballerina_kuechen/ballerina_office.jpg",
          alt: "Ballerina – Hauswirtschaft (Beispiel)",
        },
      },
    ],
  },
  {
    id: "siematic",
    category: "Designmaßstab",
    title: "SieMatic",
    image: {
      src: "/images/kitchen/siematic_urban_sg6.png",
      alt: "SieMatic Küche – architektonisch, ruhig, hochwertig",
    },
    surface: "dark",
    overlayTitle: "SieMatic",
    overlayHeadline: "Design, das neue Maßstäbe setzt.",
    overlayModalHeadline: "Für dich, wenn Design vorausgeht.",
    overlayParas: [
      "Du willst keine Küche, die nur heute gut aussieht – du willst einen Raum, der dich noch in Jahren begeistert. Genau dafür steht SieMatic: ruhig, klar, bewusst gestaltet.",
      "Du kannst dich dabei an vier Stilwelten orientieren (PURE, URBAN, CLASSIC, MONDIAL) – und trotzdem bleibt alles individuell. Nicht starr nach Programm, sondern so, dass es wirklich zu deinem Leben passt.",
      "Passt zu dir, wenn du Design als Haltung siehst: weniger „Kaufentscheidung“, mehr „ich investiere in eine Art zu wohnen“.",
    ],
  },
  {
    id: "leicht",
    category: "Küchenarchitektur",
    title: "Leicht",
    image: {
      src: "/images/kitchen/leicht.jpg",
      alt: "LEICHT Küche – architektonisch, ruhig, wohnlich",
    },
    surface: "light",
    overlayTitle: "Leicht",
    overlayHeadline: "Architektur für dein Zuhause.",
    overlayModalHeadline: "Für dich, wenn Klarheit und Ruhe zählen.",
    overlayParas: [
      "Du willst, dass die Küche sich wie ein Teil deines Zuhauses anfühlt – nicht wie ein reiner Arbeitsbereich.",
      "LEICHT denkt in Küchenarchitektur: klare Linien, wohnliche Elemente und Lösungen, die Räume zusammenziehen statt sie zu überladen.",
      "Passt zu dir, wenn du Ruhe liebst: weniger Effekt, mehr Stimmigkeit – jeden Tag.",
    ],
  },
];
