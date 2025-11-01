"use client";

import * as React from "react";

export default function HeroTopIsolated() {
  return (
    <section className="relative bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24 text-center">
        <h1 className="font-semibold tracking-tight leading-[1.02] text-[40px] sm:text-[56px] md:text-[80px] lg:text-[96px]">
          <span className="block md:inline">Entdecke,</span>{" "}
          <span className="block md:inline">wie Wirtschaft</span>
          <br className="hidden md:block" />
          <span className="block">neu gedacht wird.</span>
        </h1>
        <p className="mt-8 text-[18px] sm:text-[20px] md:text-[22px] font-semibold text-zinc-200/90 mx-auto md:max-w-[56ch] lg:max-w-[58ch] leading-[1.35] md:leading-[1.18]">
          Hier zählt Ehrlichkeit: Aufträge werden fair vergeben, Löhne offen berechnet und Wirkung sichtbar gemacht. Mit dem Transparenz-Rechner siehst du, wohin dein Geld fließt – und wie daraus Qualität und echter Nutzen entstehen. So wächst eine Wirtschaft, in der alle gewinnen – klar, ehrlich, nachvollziehbar.
        </p>
      </div>
    </section>
  );
}
