// data/landing/featureHighlights.tsx
import type { ReactNode } from "react";

export type FeatureHighlight = {
  id: string;
  category: string;
  title: string;
  image: { src: string; alt: string };
  surface: "light" | "dark";

  overlayTitle: string;
  overlayHeadline: string;
  overlayParas: Array<string | ReactNode>;
};

export const FEATURE_HIGHLIGHTS: FeatureHighlight[] = [
  {
    id: "magnifier",
    category: "Sehvermögen",
    title: "Lupe",
    image: {
      src: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1800&q=80",
      alt: "Abstraktes, ruhiges Hintergrundbild",
    },
    surface: "light",
    overlayTitle: "Lupe",
    overlayHeadline: "Zoom bis ins Detail. Direkt auf deinem Mac.",
    overlayParas: [
      "Die Lupe ist ein digitales Vergrößerungsglas. Sie nutzt die Kamera deines iPhone oder iPad und vergrößert alles, worauf du sie richtest.",
      "Auf dem Mac verbindet sich die Lupe App mit deiner Kamera, damit du deine Umgebung vergrößern kannst, etwa einen Bildschirm oder ein Whiteboard.",
      "Im Reader Modus wird der Reader für Bedienungshilfen mit der Lupe kombiniert, damit du nahtlos mit Text in der realen Welt interagieren kannst.",
    ],
  },
  {
    id: "live-listen",
    category: "Hörvermögen",
    title: "Live Mithören",
    image: {
      src: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1800&q=80",
      alt: "Ruhiges Hintergrundbild",
    },
    surface: "dark",
    overlayTitle: "Live Mithören",
    overlayHeadline: "Verstärke deine Unterhaltungen. Und lass sie dir als Untertitel anzeigen.",
    overlayParas: [
      "„Live Mithören“ unterstützt dich bei Gesprächen in lauten Umgebungen, indem es Audio von Personen aufnimmt, die aus der Ferne sprechen.",
      "Wenn „Live Mithören“ aktiv ist, kannst du Live Untertitel der Unterhaltung sehen – zum Beispiel auf einer gekoppelten Uhr oder auf einem Gerät in der Nähe.",
    ],
  },
  {
    id: "personal-voice",
    category: "Sprache",
    title: "Eigene Stimme",
    image: {
      src: "https://images.unsplash.com/photo-1520975682031-ae1c6a5b3bbf?auto=format&fit=crop&w=1800&q=80",
      alt: "Ruhiges Hintergrundbild",
    },
    surface: "light",
    overlayTitle: "Eigene Stimme",
    overlayHeadline: "Erstelle eine Stimme, die wie deine klingt.",
    overlayParas: [
      "Falls das Risiko besteht, dass du deine Sprechfähigkeit verlieren könntest, kann „Eigene Stimme“ dir helfen.",
      "Es ist ein einfacher und sicherer Weg, eine Stimme zu erzeugen, die wie deine eigene klingt.",
      "„Eigene Stimme“ wird auf deinem Gerät erstellt. So bleiben deine Daten privat und sicher.",
    ],
  },
  {
    id: "eye-tracking",
    category: "Mobilität",
    title: "Blickerfassung",
    image: {
      src: "https://images.unsplash.com/photo-1523875194681-bedd468c58bf?auto=format&fit=crop&w=1800&q=80",
      alt: "Ruhiges Hintergrundbild",
    },
    surface: "dark",
    overlayTitle: "Blickerfassung",
    overlayHeadline: "Steuere dein Gerät nur mit deinen Augen.",
    overlayParas: [
      "Wenn du Einschränkungen bezüglich der Mobilität hast oder mit deinem Gerät ohne Hände interagieren musst, kannst du nur mit deinen Augen navigieren.",
      "Durch maschinelles Lernen auf dem Gerät werden alle Daten zum Einrichten und Steuern sicher auf deinem Gerät gespeichert.",
    ],
  },
  {
    id: "assistive-access",
    category: "Kognitive Unterstützung",
    title: "Unterstützender Zugriff",
    image: {
      src: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1800&q=80",
      alt: "Ruhiges Hintergrundbild",
    },
    surface: "light",
    overlayTitle: "Unterstützender Zugriff",
    overlayHeadline: "Pass deine Apps an. Wie es für dich passt.",
    overlayParas: [
      "Menschen mit kognitiven Einschränkungen können ihr Gerät einfacher an Bedürfnisse und Präferenzen anpassen.",
      "Der unterstützende Zugriff bietet eine übersichtliche Benutzeroberfläche mit großen Textbeschriftungen und visuellen Alternativen.",
    ],
  },
];
