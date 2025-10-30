"use client";

import * as React from "react";
import { OverlayModal, OverlayBody } from "@/components/overlay";

type OriginalsSectionProps = { bgSrc?: string };
type OriginalsOverlay = "discover" | "atHome" | null;

export default function Sektor3_Wohnerlebnisse({ bgSrc }: OriginalsSectionProps) {
  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [openOverlay, setOpenOverlay] = React.useState<OriginalsOverlay>(null);

  const phrases = [
    "Räume, die Geschichten erzählen.",
    "Licht, das Stimmung schafft.",
    "Materialien, die man fühlen kann.",
    "Formen, die Ruhe geben.",
    "Details, die Sinn stiften.",
    "Gestaltung, die bleibt.",
  ];

  React.useEffect(() => {
    const t = setInterval(() => setPhraseIndex((i) => (i + 1) % phrases.length), 2600);
    return () => clearInterval(t);
  }, []);

  const bgUrl = bgSrc || "/images/unsplash/kitchen-fabian-kuhne.jpg";

  return (
    <>
      {/* Hero-Bild */}
      <section className="relative isolate overflow-hidden bg-black text-white font-sans h-[555.55px] md:h-[777.77px] md:max-h-[777.77px] transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]">
        {/* Hintergrund als Background-Image: füllt IMMER die komplette Fläche, Crop aus der Mitte */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-center bg-cover will-change-transform"
            style={{ backgroundImage: `url(${bgUrl})` }}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/45" />
        </div>

        {/* Inhalt */}
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-[clamp(16px,4vw,44px)] transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]">
          <div className="flex flex-col items-start gap-3 leading-tight">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="inline-flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-white/10 text-white ring-1 ring-white/30 shadow-sm backdrop-blur-sm">
                  <img
                    src="/images/brand/logos/ww-badge-white.svg"
                    alt="WohnenWo – Logo"
                    className="max-h-4 max-w-4"
                  />
                </div>
                <span className="text-[17px] leading-[17px] font-semibold tracking-tight text-white">WohnenWo</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-[5px] text-[12px] font-semibold tracking-tight text-white ring-1 ring-inset ring-white/20 transition-colors duration-300">
                <span>Werte Gestalt annehmen</span>
              </div>
            </div>

            {/* Titel + Buttons */}
            <div className="flex w-full flex-col md:flex-row md:items-end md:justify-between md:gap-6">
              <h2 className="max-w-[24ch] text-[clamp(24px,3vw,40px)] font-semibold tracking-[-0.015em] leading-[1.15] transition-all duration-500 ease-in-out break-words">
                Erlebe bewusste Innenarchitektur <br className="hidden sm:block" /> auf einer Reise durch Räume <br className="hidden sm:block" /> und belebende Designkultur.
              </h2>

              <div className="mt-4 flex flex-row flex-wrap items-center gap-3 md:mt-0 md:flex-row md:gap-3 md:self-end order-2 md:order-none">
                <button
                  type="button"
                  aria-label="Wohnerlebnisse entdecken öffnen"
                  onClick={() => setOpenOverlay("discover")}
                  className="w-auto rounded-full bg-white px-6 py-2.5 text-[17px] font-medium text-slate-900 shadow-sm transition-all duration-300 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 cursor-pointer"
                >
                  Jetzt entdecken
                </button>
                <button
                  type="button"
                  aria-label="Design bei dir zu Hause öffnen"
                  onClick={() => setOpenOverlay("atHome")}
                  className="w-auto rounded-full bg-white/10 px-6 py-2.5 text-[17px] font-medium text-white ring-1 ring-white/25 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 cursor-pointer"
                >
                  Zu Hause erleben
                </button>
              </div>
            </div>

            {/* dynamischer Subtext */}
            <p className="mt-[0px] min-h-[17px] text-[17px] leading-[17px] font-normal text-white/85 sm:text-[17px] transition-opacity duration-300 order-3" aria-live="polite">
              {phrases[phraseIndex]}
            </p>
          </div>
        </div>
      </section>

      {/* EIN Overlay; Inhalt wird via openOverlay geschaltet */}
      <OverlayModal
        open={openOverlay !== null}
        onClose={() => setOpenOverlay(null)}
        ariaLabel={openOverlay === "discover" ? "Wohnerlebnisse entdecken" : openOverlay === "atHome" ? "Design bei dir zu Hause" : undefined}
        title={openOverlay === "discover" ? "Wohnerlebnisse entdecken" : openOverlay === "atHome" ? "Design bei dir zu Hause" : undefined}
        headline={openOverlay === "discover" ? "Wie du Gestaltung spürst, bevor du sie wählst." : openOverlay === "atHome" ? "Erschaffe dein eigenes Wohnerlebnis." : undefined}
      >
        {openOverlay === "discover" && (
          <>
            {/* Einführende Absätze */}
            <OverlayBody
              paras={[
                "Bevor du dich für eine Innenarchitekturlösung entscheidest, kannst du sie erleben. In unseren Erlebniswohnungen wohnst du in echten Konzepten an besonderen Orten – umgeben von Design, Licht, Duft, Atmosphäre, Kultur und Natur, die inspirieren.",
                <>
                  Die Prinzipien unserer transparenten Wirtschaftskultur finden hier reale Form – angewandt durch Handwerk, das neue Wege beschreitet und Innovation fördert.{" "}
                  <span className="text-slate-900 font-medium italic">
                    So entstehen Wohnkonzepte, in denen Materialien spürbar, Werte greifbar und Entscheidungen erlebbar werden.
                  </span>
                </>,
              ]}
            />

            {/* Titel direkt über Karte 1 */}
            <h4 className="text-slate-900 font-bold tracking-tight text-[22px] md:text-[26px] leading-[1.15] mt-6 mb-3">
              Wohnen, wo Design entsteht.
            </h4>

            {/* Karte 1 */}
            <OverlayBody
              paras={[]}
              card={{
                variant: "static",
                textParas: [
                  "Lebe in Räumen, die Geschichte schreiben. Hier wohnst du nicht einfach – du bist Teil eines Designprozesses. Jedes Objekt, jeder Raum, jedes Detail wurde für diesen Ort entworfen und inspiriert neue Formen, Möbel und Ideen.",
                  "Was du hier erlebst, prägt die Möbel und Räume von morgen – und die Wohnung, die du mit uns gestaltest, schreibt diese Geschichte fort.",
                  <span className="text-slate-900 font-medium italic underline decoration-current decoration-2 underline-offset-4 [text-decoration-skip-ink:auto]">
                    Du nimmst sie mit nach Hause – als Erlebnis, als Erinnerung, als Haltung.
                  </span>,
                ],
                img: {
                  src: "/images/dienst-wirkung/cards/magazin-masterpiece-furniture-mockup.jpg",
                  alt: "Mockup – Masterpiece_Funiture",
                },
                href: "#mehr-entdecken",
              }}
              imgRadius="1.5rem"
            />

            {/* Titel über Karte 2 */}
            <h4 className="text-slate-900 font-bold tracking-tight text-[22px] md:text-[26px] leading-[1.15] mt-8 mb-4">
              Erlebe Service, auf einem neuen Niveau.
            </h4>

            {/* Karte 2 */}
            <OverlayBody
              paras={[]}
              card={{
                variant: "static",
                textParas: [
                  "Während deines Aufenthalts zeigen dir erstklassige Dienstleister, wie Design lebendig wird und Innovationen wirken. Sie kochen, planen und gestalten mit dir – damit du spürst, was wirklich zu dir passt, was dich unterstützt, inspiriert und erfüllt.",
                  "Beratung und Erlebnisangebote helfen dir, deine Wünsche im Alltag zu erkennen – nicht theoretisch, sondern im gelebten Moment.",
                  <span className="text-slate-900 font-medium italic underline decoration-current decoration-2 underline-offset-4 [text-decoration-skip-ink:auto]">
                    So wird dein Aufenthalt zum Startpunkt deiner eigenen Designreise – achtsam, menschlich und einzigartig.
                  </span>,
                ],
                img: {
                  src: "/images/unsplash/preb-food-kaptured-by-kasia.jpg",
                  alt: "Service – Show_Cooking_Erlebnis",
                },
              }}
              imgRadius="1.5rem"
            />
          </>
        )}

        {openOverlay === "atHome" && (
          <OverlayBody
            paras={[
              "Was du in unseren Erlebniswohnungen gespürt hast, setzen wir gemeinsam in deiner eigenen Umgebung um. Aus deinen Eindrücken, Entscheidungen und Vorlieben entsteht ein Konzept, das so einzigartig ist wie du – ein Wohnraum, der deine Haltung, deine Werte und dein Erleben widerspiegelt.",
              "Wir begleiten dich auf diesem Weg, Schritt für Schritt. Jede Entscheidung entsteht im Dialog, jede Idee baut auf dem auf, was dich bewegt hat.",
            ]}
            card={{
              variant: "static",
              textParas: [
                "Vom Erleben zur eigenen Form. Gemeinsam zeigen wir dir, wie wir Werte in Gestaltung übersetzen: von der ersten Idee bis zur präzisen Umsetzung.",
              ],
              img: {
                src: "/images/unsplash/living-kitchen-amir-hossein.jpg",
                alt: "Innenarchitektur – Zuhause erleben",
              },
              paras: [
                "Jeder Schritt bleibt nachvollziehbar – vom Design über Material bis zur fairen Kostenaufteilung.",
                <span className="text-slate-900 font-medium italic underline decoration-current decoration-2 underline-offset-4 [text-decoration-skip-ink:auto]">
                  So wird dein Zuhause zum Ausdruck deines eigenen Weges und zum sichtbaren Teil einer neuen Wirtschaftskultur.
                </span>,
              ],
            }}
            link={{ href: "#zu-hause", label: "Erlebe, wie Werte Form annehmen." }}
            imgRadius="1.5rem"
          />
        )}
      </OverlayModal>
    </>
  );
}
