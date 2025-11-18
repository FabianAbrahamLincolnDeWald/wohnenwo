import * as React from "react";

export default function HeroSection() {
  return (
    <section id="hero" className="relative bg-white">
      {/* Container: max-w-6xl */}
      <div className="mx-auto max-w-6xl px-6 pt-16 md:pt-20 pb-8 md:pb-10 lg:pb-10">
        {/* Mobile/Tablet: Eyebrow + kompakter Titel */}
        <div className="2xl:hidden mb-3">
          <p className="text-[11px] tracking-[0.2em] leading-tight text-slate-600 uppercase">
            Willkommen in einer neuen Ära wirtschaftlicher Zusammenarbeit
          </p>
        </div>

        <div className="2xl:hidden">
          <h1
            className="font-semibold tracking-tight text-slate-900 leading-[1.1]
                       text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
          >
            <span className="font-light">Eine Plattform für grenzenlose </span>
            <span className="font-extrabold italic underline decoration-slate-900/80 decoration-4 underline-offset-[5px] whitespace-nowrap">
              Innovation.
            </span>
          </h1>
        </div>

        {/* Desktop: zweizeilige Redaktion – ab 2xl */}
        <div className="hidden 2xl:block">
          {/* Zeile 1: Titel */}
          <h1
            className="font-light tracking-[0.08em] text-slate-900 uppercase leading-[0.95]
                       text-4xl sm:text-5xl md:text-6xl lg:text-[62px]"
          >
            EINE PLATTFORM FÜR
          </h1>

          {/* Zeile 2: links Eyebrow-Block, rechts Rest der Headline */}
          <div className="mt-4 grid grid-cols-12 gap-4 items-center">
            <div className="col-span-12 md:col-span-2">
              <p className="text-[11px] leading-tight tracking-[0.2em] text-slate-600 uppercase">
                Willkommen in
                <br />
                einer neuen Ära
                <br />
                wirtschaftlicher
                <br />
                Zusammenarbeit
              </p>
            </div>
            <div className="col-span-12 md:col-span-10">
              <h1
                className="font-extrabold italic tracking-tight text-slate-900 uppercase leading-[0.95]
                           text-[62px]"
              >
                <span className="font-light not-italic tracking-[0.08em] uppercase mr-2">
                  GRENZENLOSE
                </span>
                <span className="underline decoration-slate-900/80 decoration-6 underline-offset-[6px] whitespace-nowrap">
                  INNOVATION.
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
