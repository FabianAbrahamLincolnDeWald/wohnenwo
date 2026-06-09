// app/mein-bereich/sammlungen/page.tsx
"use client";

import { Bookmark, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const PLACEHOLDER_CARDS = [
  { label: "Küchen & Kochen", text: "Gespeicherte Küchen-Inspirationen und Materialkonzepte." },
  { label: "Bäder & Wellness", text: "Deine Badezimmer-Ideen und Wohlfühl-Konzepte." },
  { label: "Wohnräume", text: "Raumkonzepte und Interior-Inspirationen." },
  { label: "Materialien", text: "Oberflächen, Hölzer und Materialwelten die dich bewegen." },
  { label: "Produkte", text: "Einzelne Produkte und Hersteller auf deiner Merkliste." },
  { label: "Experten", text: "Studios und Planer:innen, die du dir gemerkt hast." },
];

export default function SammlungenPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] px-4 pt-6 pb-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <p className="text-[11px] tracking-[0.24em] uppercase text-slate-500 dark:text-white/40">
            Mein Bereich
          </p>
          <h1 className="text-[24px] md:text-[28px] font-semibold tracking-tight text-slate-900 dark:text-white">
            Sammlungen
          </h1>
          <p className="max-w-2xl text-sm md:text-[15px] text-slate-600 dark:text-white/60">
            Hier sammelst du alles, was dich inspiriert – Küchen, Bäder, Materialien,
            Experten. Deine persönliche Merkwelt entsteht mit jedem Projekt.
          </p>
        </motion.header>

        {/* Coming-soon Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={[
            "flex items-start gap-3 rounded-2xl border px-5 py-4",
            "border-[#F5C842]/30 bg-[#F5C842]/5",
            "dark:border-[#F5C842]/20 dark:bg-[#F5C842]/5",
          ].join(" ")}
        >
          <Sparkles className="h-4 w-4 text-[#F5C842] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-[13px] font-semibold text-slate-900 dark:text-white">
              Dieser Bereich ist in Kürze verfügbar
            </p>
            <p className="text-[12px] text-slate-600 dark:text-white/55 leading-snug">
              Wir bauen gerade die Sammlungs-Funktion – damit du Inspirationen,
              Materialien und Experten direkt aus dem Erlebnis heraus speichern kannst.
            </p>
          </div>
        </motion.div>

        {/* Vorschau-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLACEHOLDER_CARDS.map((card, idx) => (
            <motion.article
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.12 + idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div
                className={[
                  "group relative flex flex-col h-[180px] rounded-2xl",
                  "border-2 border-dashed border-slate-200 dark:border-white/10",
                  "bg-slate-50 dark:bg-white/5",
                  "transition duration-300 ease-out",
                  "hover:border-slate-300 dark:hover:border-white/20",
                ].join(" ")}
              >
                <div className="m-3 flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 px-4 py-3 flex flex-col justify-between">
                  {/* Icon Hintergrund */}
                  <div className="pointer-events-none absolute inset-3 flex items-center justify-center opacity-20">
                    <Bookmark className="h-10 w-10 text-slate-400 dark:text-white/30" />
                  </div>

                  <div className="relative z-10 space-y-1.5">
                    <p className="text-[13px] font-semibold text-slate-900 dark:text-white">
                      {card.label}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-white/40 leading-snug">
                      {card.text}
                    </p>
                  </div>

                  <p className="relative z-10 text-[10px] tracking-[0.16em] uppercase text-slate-400 dark:text-white/25">
                    Kommt bald
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}
