"use client";

import * as React from "react";
import OverlayModal from "@/components/overlay/OverlayModal";
import { Sparkles, Info, TrendingUp, CheckCircle2 } from "lucide-react";

type Props = {
  buttonClassName?: string;
};

export default function WirkungsfondsInfoButton({ buttonClassName }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={[
          "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3",
          "text-[12px] font-semibold uppercase tracking-wide",
          "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
          buttonClassName ?? "",
        ].join(" ")}
      >
        <Info className="h-4 w-4" />
        Mehr zum Wirkungsfonds
      </button>

      <OverlayModal
        open={open}
        onClose={() => setOpen(false)}
        ariaLabel="Mehr Infos zum Wirkungsfonds"
        contentClassName="bg-white"
      >
        <div className="px-5 py-5 md:px-6 md:py-6">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[18px] font-semibold text-slate-900 leading-tight">
                Was ist der Wirkungsfonds?
              </p>
              <p className="mt-1 text-[12px] leading-snug text-slate-600">
                Der Wirkungsfonds ist der transparent ausgewiesene Anteil deiner Rechnung, der
                entsteht, sobald nach sauberer Kalkulation ein Überfluss vorhanden ist – und der
                sichtbar macht, <span className="font-medium">was mit diesem Überfluss passiert</span>.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-slate-700" />
                <p className="text-[13px] font-semibold text-slate-900">
                  Warum es ihn gibt
                </p>
              </div>
              <p className="mt-2 text-[12px] leading-snug text-slate-700">
                Bisher ist „Überfluss“ in Dienstleistung und Handel oft intransparent und wird
                primär unternehmerisch gelenkt. Durch den Wirkungsfonds entsteht ein{" "}
                <span className="font-medium">Spiegel / Index</span>, der nachvollziehbar macht,
                wie viel Überfluss entsteht – und in welche Richtung er fließt.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-slate-700" />
                <p className="text-[13px] font-semibold text-slate-900">
                  Was das für dich bedeutet
                </p>
              </div>
              <ul className="mt-2 space-y-2 text-[12px] leading-snug text-slate-700 list-disc list-inside">
                <li>
                  Du siehst transparent, was nötig ist, um Service &amp; Qualität zu leisten – und ab wann Überfluss entsteht.
                </li>
                <li>
                  Du findest leichter Dienstleister, deren Richtung zu deinen Werten passt (und umgekehrt).
                </li>
                <li>
                  Deine Beauftragung wirkt wie ein „Stimmrecht“: Du stärkst durch dein Geld die Richtung, in die Überfluss fließt.
                </li>
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-slate-700" />
                <p className="text-[13px] font-semibold text-slate-900">
                  Heute vs. später
                </p>
              </div>
              <p className="mt-2 text-[12px] leading-snug text-slate-700">
                <span className="font-medium">Heute</span> ist die Verteilung in der Rechnung transparent ausgewiesen.
                <br />
                <span className="font-medium">Später</span> kann daraus ein System werden, in dem Kund:innen – wie
                Aktionär:innen – über ihre Aufträge Wirkung lenken (z.B. feste Wirkungs-Profile, Punkte-/Fondssystem,
                optional sogar „Dividenden“-Mechaniken).
              </p>
            </section>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-[13px] font-semibold text-white hover:bg-slate-800"
          >
            Verstanden
          </button>
        </div>
      </OverlayModal>
    </>
  );
}