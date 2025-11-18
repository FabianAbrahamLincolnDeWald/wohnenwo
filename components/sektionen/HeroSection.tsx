import * as React from "react";

export default function HeroSection() {
  return (
    <section id="hero" className="relative bg-white px-6">
      <div className="relative z-20 mx-auto w-[min(88vw,1120px)] sm:w-[min(86vw,1120px)] md:w-[min(84vw,1120px)] lg:w-[min(78vw,1200px)] pt-16 md:pt-20 pb-8 md:pb-10 lg:pb-10">
        {/* Mobile/Tablet: Eyebrow + kompakter Titel */}
        <div className="2xl:hidden mb-3">
          <p className="text-[11px] tracking-[0.2em] leading-tight text-slate-600 uppercase">
            Willkommen in einer neuen Ära wirtschaftlicher Zusammenarbeit
          </p>
        </div>
        <div className="2xl:hidden">
          <h1 className="font-semibold tracking-tight text-slate-900 text-[clamp(2.7rem,4.4vw,4.8rem)] leading-[1.1]">
            <span className="font-light">Eine Plattform für grenzenlose </span>
            <span className="font-extrabold italic underline decoration-slate-900/80 decoration-4 underline-offset-[5px] whitespace-nowrap">
              Innovation.
            </span>
          </h1>
        </div>

        {/* Desktop: zweizeilige Redaktion – links Label/Copy, rechts Headline */}
        <div className="hidden 2xl:block">
          {/* Zeile 1: Titel */}
          <h1 className="font-light tracking-[0.08em] text-slate-900 text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[0.95] uppercase">
            EINE PLATTFORM FÜR
          </h1>

          {/* Zeile 2: links Eyebrow-Block, rechts Rest der Headline */}
          <div className="mt-4 grid grid-cols-12 gap-4 items-center">
            <div className="col-span-12 md:col-span-2">
              <p className="text-[11px] leading-tight tracking-[0.2em] text-slate-600 uppercase">
                Willkommen in
                <br />einer neuen Ära
                <br />wirtschaftlicher
                <br />Zusammenarbeit
              </p>
            </div>
            <div className="col-span-12 md:col-span-10">
              <h1 className="font-extrabold italic tracking-tight text-slate-900 text-[68px] leading-[0.95] uppercase">
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
