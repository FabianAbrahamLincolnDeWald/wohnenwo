// data/kommunikationCards.tsx
import React, { ReactNode } from "react";

export type OverlayCard =
  | {
      variant: "clickable" | "static";
      text?: string;
      paras?: Array<string | ReactNode>;
      img?: { src: string; alt: string; imgClassName?: string };
      href?: string;
    }
  | undefined;

export type KommunikationCard = {
  title: string;
  icon:
    | "Users"
    | "UserSearch"
    | "UserStar"
    | "Gem"
    | "Scale"
    | "HeartHandshake"
    | "Earth"
    | "Trophy"
    | "RefreshCw"
    | "FolderOpen"
    | "WandSparkles"
    | "Sparkles"
    | "HandCoins";
  subtitle: ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
  subtitleIcon?:
    | "Users"
    | "ScanEye"
    | "FolderOpen"
    | "HandCoins"
    | "BrickWallShield"
    | "HandHeart"
    | "WandSparkles"
    | "Sparkles";
  overlayTitle: string;
  overlayHeadline: string;
  overlayParas: Array<string | ReactNode>;
  overlayLink?: { href: string; label: string };
  overlayCard?: OverlayCard;
};

// Kleine Helper-Funktion: ersten Satz fett setzen
function splitLead(text: string): { lead: string; rest: string } {
  const idx = text.indexOf(".");
  if (idx === -1) return { lead: text, rest: "" };
  return { lead: text.slice(0, idx + 1), rest: text.slice(idx + 1).trim() };
}

export const KOMMUNIKATION_CARDS: KommunikationCard[] = [
  {
    title: "Damit sich findet, wer sich sucht.",
    icon: "UserSearch",
    subtitle: "Wir führen dich zu dem, was dich wirklich anspricht.",
    titleClassName:
      "text-[clamp(22px,6.4vw,28px)] md:text-[30px] leading-[1.06] md:leading-[1.04]",
    subtitleClassName: "text-[clamp(14px,4.2vw,17px)] md:text-[19px]",
    subtitleIcon: "Users",
    overlayTitle: "Ehrliche Begegnungen",
    overlayHeadline: "Wir zeigen ehrlich, wer wir sind.",
    overlayParas: [
      "Bevor Zusammenarbeit entsteht, steht das ehrliche Kennenlernen. Hier sprechen wir offen über Beweggründe, Erwartungen und Werte – ohne Rollen, ohne Fassade.",
      "Jede Perspektive darf sichtbar werden, jede Frage ist willkommen. Aus dieser Offenheit wächst Vertrauen – das Fundament, auf dem alles Weitere aufbaut.",
    ],
    overlayLink: { href: "#fuer-wen", label: "Für wen ist das – und was hast du davon?" },
  },
  {
    title: "Damit du siehst, in welche Werte du investierst.",
    icon: "UserStar",
    subtitle: "Du darfst hinter die Kulissen schauen.",
    titleClassName:
      "text-[clamp(22px,6.4vw,28px)] md:text-[30px] leading-[1.06] md:leading-[1.04]",
    subtitleClassName: "text-[clamp(14px,4.2vw,17px)] md:text-[19px]",
    subtitleIcon: "ScanEye",
    overlayTitle: "Transparenz & bewusste Investition",
    overlayHeadline: "Während der ersten Begegnung erhältst du vollen Einblick.",
    overlayParas: [
      "Du darfst verstehen, was hinter dem Dienstleistungsangebot steckt. Unternehmer und Kunde sprechen offen über Werte, Erwartungen und Möglichkeiten – ehrlich und auf Augenhöhe. So entsteht Klarheit darüber, wer miteinander arbeiten will und welche Haltung verbindet.",
      "Wir zeigen transparent, wie Leistungen entstehen, welche Materialien, Partner und Schritte beteiligt sind. Jeder Vorgang ist nachvollziehbar, jede Entscheidung sichtbar. So erkennst du, wohin dein Geld fließt – und welchen echten Wert es schafft.",
    ],
    overlayCard: {
      variant: "clickable",
      text:
        "Sieh selbst, wie Klarheit aussieht. Der Transparenz-Rechner öffnet dir den Blick hinter die Zahlen – ehrlich, nachvollziehbar und einfach erklärt.",
      paras: [
        "Er zeigt, wie aus jedem Euro sichtbare Qualität, echter Nutzen und gesellschaftliche Wirkung entstehen.",
        "In Zukunft wird er zum Kommunikationstool, das dich direkt mit dem passenden Dienstleister verbindet.",
      ],
      img: {
        src: "/images/dienst-wirkung/cards/mockup-erlebe-wie-wirtschaft.png",
        alt: "Mockup – Erlebe, wie Wirtschaft neu gedacht wird",
        imgClassName: "rounded-3xl",
      },
      href: "#erlebe-wirtschaft-neu-gedacht",
    },
  },
  {
    title: "Damit Qualität sichtbar wird und spürbar bleibt.",
    icon: "Gem",
    subtitle: (
      <>
        Das <span className="font-semibold italic">Wie, Woher</span> und
        <span className="font-semibold italic"> zu welchem Preis</span> wird sichtbar.
      </>
    ),
    titleClassName:
      "text-[clamp(22px,6.4vw,28px)] md:text-[30px] leading-[1.06] md:leading-[1.04]",
    subtitleClassName: "text-[clamp(14px,4.2vw,17px)] md:text-[19px]",
    subtitleIcon: "FolderOpen",
    overlayTitle: "Offene Prozesse & gelebte Qualität",
    overlayHeadline: "Wir zeigen, wie echte Qualität entsteht.",
    overlayParas: [
      "Wenn alle Schritte offen gelegt sind, wird sichtbar, wie gute Arbeit entsteht – vom ersten Handgriff bis zum fertigen Ergebnis. Jede Handlung, jedes Material und jede Entscheidung trägt zum Ganzen bei.",
      "Wir dokumentieren den Weg vom Entwurf bis zur Umsetzung, damit du nachvollziehen kannst, wo Wert geschaffen und wie Qualität gesichert wird. So wird Arbeit greifbar, Vertrauen spürbar – und Qualität zu etwas, das bleibt.",
    ],
    overlayCard: {
      variant: "static",
      text:
        "Qualität, die man sieht und versteht. In deiner Rechnung findest du mehr als nur Zahlen – du erkennst, wo Werte entstehen, wie Preise sich zusammensetzen und welche Menschen, Materialien und Ideen dahinterstehen.",
      paras: [
        "Einkauf, Herstellung, Verantwortung und Gewinn werden offen dargestellt – klar, nachvollziehbar und leicht zu verstehen.",
        <>
          So wird Qualität nicht nur versprochen, sondern dokumentiert:{" "}
          <span className="text-slate-900 font-medium italic underline decoration-current decoration-2 underline-offset-4 [text-decoration-skip-ink:auto]">
            Das Wie, das Woher und das Warum stehen direkt vor dir.
          </span>
        </>,
      ],
      img: {
        src: "/images/dienst-wirkung/cards/mockup-invoice.jpg",
        alt: "'Mockup Rechnung' – Offene Prozesse & gelebte Qualität",
        imgClassName: "rounded-3xl",
      },
    },
  },
  {
    title: "Damit alle für ihren Beitrag fair entlohnt werden.",
    icon: "Scale",
    subtitle: "Der gerechte Ausgleich entsteht.",
    titleClassName:
      "text-[clamp(22px,6.4vw,28px)] md:text-[30px] leading-[1.06] md:leading-[1.04]",
    subtitleClassName: "text-[clamp(14px,4.2vw,17px)] md:text-[19px]",
    subtitleIcon: "HandCoins",
    overlayTitle: "Faire & gerechte Verteilung",
    overlayHeadline: "Wir verbinden Transparenz mit Gerechtigkeit.",
    overlayParas: [
      "Wir zeigen, wie gerechter Ausgleich entsteht – damit Leistung, Verantwortung und Einsatz im Gleichgewicht stehen.",
      "Jede Arbeit, jedes Können und jede Verantwortung hat ihren Wert. Damit dieser Wert fair verteilt wird, bringen wir Aufwände, Zeit und Risiko ins richtige Verhältnis.",
      <strong>So wächst Vertrauen, weil jeder weiß, worauf sein Anteil beruht.</strong>,
    ],
    overlayCard: {
      variant: "clickable",
      text:
        "Erkenne, was dein Beitrag bewirkt. Der Transparenz-Rechner zeigt, wie faire Verteilung Beziehungen stärkt und Leistung verlässlich macht.",
      paras: [
        "Einblicke in Modelle, Beispiele und Wirkung formen gemeinsames Verständnis und Vertrauen.",
        <span className="text-slate-900 font-medium italic underline decoration-current decoration-2 underline-offset-4 [text-decoration-skip-ink:auto]">
          Die Basis einer Wirtschaft, die alle Beteiligten achtet.
        </span>,
      ],
      img: {
        src: "/images/dienst-wirkung/cards/mockup-transparenz-rechner.png",
        alt: "Mockup – Tranzparenz-Rechner",
        imgClassName: "rounded-3xl",
      },
      href: "#erlebe-wirtschaft-neu-gedacht",
    },
  },
  {
    title: "Damit Service beliebt und belebend wirkt.",
    icon: "HeartHandshake",
    subtitle: "Das System wird tragfähig und fasziniert.",
    titleClassName:
      "text-[clamp(22px,6.4vw,28px)] md:text-[30px] leading-[1.06] md:leading-[1.04]",
    subtitleClassName: "text-[clamp(14px,4.2vw,17px)] md:text-[19px]",
    subtitleIcon: "BrickWallShield",
    overlayTitle: "Verlässliche Partnerschaften",
    overlayHeadline: "Aus Gerechtigkeit wächst Stabilität und neue Attraktivität.",
    overlayParas: [
      "Gemeinsam schaffen wir Vertrauen, das trägt. Wenn alle ihren gerechten Anteil kennen und Verantwortung übernehmen, entsteht Sicherheit – für alle Beteiligten.",
      "Ehrliche Absprachen, klare Zuständigkeiten und offene Kommunikation halten die Zusammenarbeit stabil.",
      <>
        Durch Fairness und gegenseitige Achtung entsteht ein Umfeld, das anzieht –{" "}
        <span className="text-slate-900 font-medium italic">
          für Fachkräfte, die Sinn suchen, und für Kunden, die Qualität und Haltung schätzen.
        </span>
      </>,
      <span className="text-slate-900 font-bold italic">
        So wächst eine Dienstleistungsbranche, die nicht nur funktioniert, sondern inspiriert – beliebt, belebend und zukunftsfähig.
      </span>,
    ],
  },
  {
    title: "Damit Vertrauen zur Kultur wird.",
    icon: "Earth",
    subtitle: "Der Wandel von Werten wird spürbar.",
    titleClassName:
      "text-[clamp(22px,6.4vw,28px)] md:text-[30px] leading-[1.06] md:leading-[1.04]",
    subtitleClassName: "text-[clamp(14px,4.2vw,17px)] md:text-[19px]",
    subtitleIcon: "HandHeart",
    overlayTitle: "Wertschätzung & Anerkennung",
    overlayHeadline:
      "Vertrauen ist das Ergebnis und der Beginn einer neuen Haltung.",
    overlayParas: [
      "Wir bauen eine Gemeinschaft, die aus Vertrauen wächst – wo Menschen sich gesehen und verstanden fühlen. Wir gestalten eine Kultur, in der Leistung anerkannt und Leidenschaft geschätzt wird.",
      "Wo Verantwortung geteilt und Erfolge gemeinsam gefeiert werden, wird Vertrauen selbstverständlich – es wird zur Kultur.",
      <span className="text-slate-900 font-bold italic">
        So entsteht ein Miteinander, das trägt: offen, respektvoll und voller Freude am gemeinsamen Handeln.
      </span>,
    ],
  },
  {
    title: "Damit das, was wir schaffen, Bedeutung hat.",
    icon: "Trophy",
    subtitle: "Wir verzaubern Wirtschaft mit Bewusstsein und Gefühl.",
    titleClassName:
      "text-[clamp(22px,6.4vw,28px)] md:text-[30px] leading-[1.06] md:leading-[1.04]",
    subtitleClassName: "text-[clamp(14px,4.2vw,17px)] md:text-[19px]",
    subtitleIcon: "WandSparkles",
    overlayTitle: "Bewusste Gestaltung",
    overlayHeadline:
      "Arbeit wird zum Erlebnis – mit Sinn und Tiefe, die berührt.",
    overlayParas: [
      <>
        Wenn Arbeit mit Bewusstsein geschieht, entstehen Erlebnisse, die bleiben. Jeder Handgriff trägt eine Idee, jedes Material eine Haltung, jeder Raum eine Geschichte.{" "}
        <span className="text-slate-900 font-bold italic">
          Was mit Sinn entsteht, bleibt.<br />
          Es begleitet, inspiriert und erinnert daran, was uns wirklich verbindet.
        </span>
      </>,
    ],
  },
  {
    title: "Damit alle in Harmonie geben und nehmen.",
    icon: "RefreshCw",
    subtitle: "Die Vision einer bewussten, fairen Wirtschaft.",
    titleClassName:
      "text-[clamp(22px,6.4vw,28px)] md:text-[30px] leading-[1.06] md:leading-[1.04]",
    subtitleClassName: "text-[clamp(14px,4.2vw,17px)] md:text-[19px]",
    subtitleIcon: "Sparkles",
    overlayTitle: "Gemeinsame Ausrichtung",
    overlayHeadline: "Der Abschluss: Alles wirkt zusammen.",
    overlayParas: [
      "Wir bringen Wirtschaft in Einklang mit Mensch und Natur. Wenn Geben und Nehmen im Gleichgewicht stehen, entsteht ein natürlicher Kreislauf.",
      <span className="text-slate-900 font-bold italic">
        So entsteht Fülle, die nicht trennt, sondern verbindet – friedlich, beständig, lebendig.
      </span>,
    ],
  },
];
