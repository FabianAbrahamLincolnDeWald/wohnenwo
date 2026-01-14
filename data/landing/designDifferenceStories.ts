export type StoryCta = {
  label: string; // z.B. "Jetzt ansehen", "Weitere Infos zum Programm"
  href: string;
  external?: boolean;
};

export type DesignDifferenceStory = {
  id: string;
  theme: "dark" | "light"; // Apple: Stories sind überwiegend dark
  headline: string; // großer Statement-Text (typography-stories-headline)
  cta: StoryCta;

  // Background media
  image: { src: string; alt: string };

  // Optional: später für Inline-Video/Audio
  media?: {
    type: "video" | "audio";
    src: string;
    poster?: string;
    ariaLabel?: string;
  };

  // Optional: stärkere Lesbarkeit
  withScrim?: boolean;
};

export const DESIGN_DIFFERENCE_STORIES: DesignDifferenceStory[] = [
  {
    id: "designed-for-students",
    theme: "dark",
    headline:
      "Unser Film „Entwickelt für alle, die lernen.“ zeigt, wie Bedienungshilfen das Lernen für alle vereinfachen.",
    cta: { label: "Jetzt ansehen", href: "/de/accessibility/designed-for-students/" },
    image: {
      // Placeholder – später ersetzen
      src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
      alt: "Diverse Gruppe in einer Lernumgebung, dynamische Szene.",
    },
    withScrim: true,
  },
  {
    id: "deaf-president-now",
    theme: "dark",
    headline:
      "Ein Blick hinter die Kulissen des inklusiven Drehs der Apple TV Dokumentation „Deaf President Now!“",
    cta: {
      label: "Jetzt ansehen",
      href: "https://www.youtube.com/watch?v=6NFRG3Fomjw",
      external: true,
    },
    image: {
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
      alt: "Team kommuniziert, Produktionsumgebung.",
    },
    // später könntest du hier media:type:"video" ergänzen
    withScrim: true,
  },
  {
    id: "kiddo-k",
    theme: "dark",
    headline:
      "„Ich möchte, dass die Leute fühlen, was ich fühle, wenn ich diesen Song mache.“",
    cta: {
      label: "Erlebe, wie Kiddo K Klang durch Musikhaptik erlebt",
      href: "https://www.youtube.com/watch?v=ip3todolKj0",
      external: true,
    },
    image: {
      src: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80",
      alt: "Musikstudio, Mikrofon und Kopfhörer.",
    },
    withScrim: true,
  },
  {
    id: "chicago-photography",
    theme: "dark",
    headline:
      "Das Programm „Photography for All“ nutzt Technologie, um Jugendlichen das Fotografieren beizubringen.",
    cta: {
      label: "Weitere Infos zum Programm",
      href: "/de/newsroom/2022/08/seeing-chicago-differently-with-iphone-and-ipad/",
    },
    image: {
      src: "https://images.unsplash.com/photo-1520975958225-79c42a3c6e5c?auto=format&fit=crop&w=1600&q=80",
      alt: "Person mit Kamera, Lernsituation.",
    },
    withScrim: true,
  },
  {
    id: "airpods-hearing-aid",
    theme: "dark",
    headline:
      "Hör dir an, wie Gespräche mit einer Hörgerätfunktion verbessert werden können.",
    cta: {
      label: "Weitere Infos zur Funktion",
      href: "/de/newsroom/2024/10/how-apple-developed-the-worlds-first-end-to-end-hearing-health-experience/",
    },
    image: {
      src: "https://images.unsplash.com/photo-1520975681890-bc2e4f3f9b8b?auto=format&fit=crop&w=1600&q=80",
      alt: "Zwei Personen im Gespräch, Alltagsszene.",
    },
    withScrim: true,
    // später: media:type:"audio" oder eigener Player
  },
  {
    id: "jordyn-zimmerman",
    theme: "dark",
    headline:
      "„Um echte Inklusion zu fördern, sind nicht nur technische Tools nötig – sie müssen auch unterstützt werden, damit Menschen sich mit Würde bewegen können.“",
    cta: { label: "Mehr über Jordyns Erfahrungen", href: "/de/education-initiative/#accessible-education" },
    image: {
      src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
      alt: "Person arbeitet konzentriert am Schreibtisch.",
    },
    withScrim: true,
  },
  {
    id: "exceptional-minds",
    theme: "dark",
    headline:
      "„Wir möchten eine Welt schaffen, in der Studierende wegen ihrer Talente gesehen werden – nicht wegen der Herausforderungen.“",
    cta: {
      label: "Weitere Infos zum Programm",
      href: "/de/newsroom/2023/03/at-exceptional-minds-autistic-artists-turn-creativity-into-careers/",
    },
    image: {
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
      alt: "Kreatives Arbeiten im Team.",
    },
    withScrim: true,
  },
];
