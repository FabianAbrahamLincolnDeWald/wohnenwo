"use client";

import * as React from "react";
import OverlayModal from "@/components/overlay/OverlayModal";
import { Sparkles, Info, TrendingUp, CheckCircle2 } from "lucide-react";

type Props = {
    buttonClassName?: string;
};

function AppleCard({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={[
                "rounded-2xl p-5 sm:p-6",
                "bg-slate-100/80 dark:bg-white/5",
                "ring-1 ring-black/5 dark:ring-white/10",
            ].join(" ")}
        >
            <div className="flex items-center gap-2">
                <span className="text-slate-700 dark:text-white/75">{icon}</span>
                <p className="text-[24px] font-semibold text-slate-900 dark:text-white">
                    {title}
                </p>
            </div>

            <div className="mt-3 text-[15px] sm:text-[20px] leading-normal text-slate-700 dark:text-white/80">
                {children}
            </div>
        </div>
    );
}

export default function WirkungsfondsInfoButton({ buttonClassName }: Props) {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            {/* Trigger-Button: Light bleibt hell, Dark wird „Card-like“ */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={[
                    "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3",
                    "text-[12px] font-semibold uppercase tracking-wide",
                    "border transition",
                    "bg-white text-slate-900 border-slate-200 hover:bg-slate-50",
                    "dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10",
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
                // ✅ wichtig: Sheet selbst wird im Dark dunkel
                contentClassName="bg-white text-slate-900 md:bg-white dark:bg-[#1d1d1f] dark:text-white"
                // ✅ nutzt die standard OverlayModal Header/Headline oben
                title="Was ist der Wirkungsfonds?"
                headline="Transparenz schafft Vertrauen. Und dein Vertrauen entfaltet Wirkung."
            >
                <div className="mt-4 space-y-5">
                    <p className="mt-2 text-[17px] leading-[1.5] text-slate-700 dark:text-white/75">
                        Der Wirkungsfonds ist der Teil, der entsteht,{" "}
                        <span className="font-semibold text-slate-900 dark:text-white">
                            nachdem fair kalkuliert wurde
                        </span>
                        : Lohn, Material, Steuern und Aufwand sind sauber berücksichtigt. Wenn dann noch
                        etwas übrig bleibt, wird es nicht „unsichtbar“, sondern transparent ausgewiesen.
                    </p>

                    <p className="mt-2 text-[17px] leading-[1.5] text-slate-700 dark:text-white/75">
                        Kurz gesagt: Ein kleiner Teil deiner Rechnung wird bewusst für{" "}
                        <span className="font-semibold text-slate-900 dark:text-white">
                            Zukunft &amp; Verbesserung
                        </span>{" "}
                        zurückgelegt – und du kannst nachvollziehen, wohin er fließt.
                    </p>

                    {/* Kacheln: Apple-like, ruhig, klar */}
                    <div className="space-y-6">
                        <AppleCard
                            icon={<CheckCircle2 className="h-7 w-7" />}
                            title="Warum es ihn gibt"
                        >
                            Bisher ist „Überfluss“ in Dienstleistung und Handel{" "}
                            <span className="font-semibold text-slate-900 dark:text-white">
                                oft unsichtbar und primär unternehmerisch gelenkt.
                            </span>{" "}
                            Durch den Wirkungsfonds sehen wir in den Spiegel.{" "}
                            <span className="font-semibold text-slate-900 dark:text-white">
                                Was ist hilfreicher Service? Was ist echte Qualität? Was ist Marge? Was ist Risiko? Und was hat Zukunft?
                            </span>
                        </AppleCard>

                        <p className="mt-2 text-[17px] leading-[1.5] text-slate-700 dark:text-white/75">
                            Der Wirkungsfonds macht sichtbar, was sonst verborgen bleibt{" "}
                            <span className="font-semibold text-slate-900 dark:text-white">
                                – damit Entscheidungen nicht auf fehlenden Informationen basieren.
                            </span>{" "}
                        </p>

                        <AppleCard
                            icon={<TrendingUp className="h-7 w-7" />}
                            title="Was das für dich bedeutet"
                        >
                            <ul className="space-y-2 list-disc list-inside">
                                <li>
                                    Du siehst, wofür du bezahlst – und was wirklich{" "}
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        zusätzlich
                                    </span>{" "}
                                    möglich wird.
                                </li>
                                <li>
                                    Du erkennst leichter Dienstleister, die so arbeiten, wie es zu deinen Werten
                                    passt.
                                </li>
                                <li>
                                    Mit deinem Auftrag{" "}
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        stärkst du eine Richtung:<br />
                                    </span>
                                    mehr Qualität, mehr Fairness und mehr Aufbau von transparenten Prozessen.
                                </li>
                            </ul>
                        </AppleCard>

                        <p className="mt-2 text-[17px] leading-[1.5] text-slate-700 dark:text-white/75">
                            Er gibt dir Orientierung,{" "}
                            <span className="font-semibold text-slate-900 dark:text-white">
                                damit du nach deinen Werten entscheiden kannst
                            </span>{" "}
                            – und nicht erst im Nachhinein merkst, was dir gefehlt hat.
                        </p>

                        <AppleCard icon={<Info className="h-7 w-7" />} title="Ein Beispiel (ganz einfach)">
                            Stell dir vor, du kaufst Brot. Der Preis deckt Mehl, Arbeit und Laden. Wenn der
                            Bäcker besonders gut wirtschaftet, bleibt etwas übrig. Beim Wirkungsfonds wird
                            genau dieser „Überfluss“ sichtbar – und er wird bewusst für Verbesserungen
                            genutzt, statt still zu verschwinden.
                        </AppleCard>

                        <p className="mt-2 text-[17px] leading-[1.5] text-slate-700 dark:text-white/75">
                            So kannst du bewusst entscheiden, ob dein Beitrag eher in Innovation, Qualität, stabile Preise
                            oder in nachhaltige Weiterentwicklung fließt{" "}
                            <span className="font-semibold text-slate-900 dark:text-white">
                                – je nachdem, was dir wichtig ist.
                            </span>
                        </p>
                    </div>

                    {/* Einleitung: Oma-sicher, kurz, klar */}
                    <div className="flex items-start gap-3">
                        <div className="inline-flex h-11 w-18 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white/10 dark:text-white">
                            <Sparkles className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[17px] leading-[1.45] font-medium text-slate-800 dark:text-white/85">
                                Deshalb machen wir sichtbar, was sonst im Hintergrund bleibt.{" "}
                                <span className="font-semibold text-slate-900 dark:text-white">
                                Damit deine Entscheidung einen Einfluss hat.
                            </span>
                            </p>
                        </div>
                    </div>

                    {/* CTA Button: passt zu Dark/Light */}
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className={[
                            "mt-2 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-[17px] font-semibold transition",
                            "bg-slate-900 text-white hover:bg-slate-800",
                            "dark:bg-white dark:text-slate-900 dark:hover:bg-white/95",
                        ].join(" ")}
                    >
                        Finde ich gut!
                    </button>

                    {/* Mini-Footnote: sehr dezent */}
                    <p className="text-[17px] leading-snug text-slate-500 dark:text-white/45">
                        Hinweis: Die genaue Verteilung kann je nach Auftrag, Dienstleister und Systemstand variieren – aber
                        das Prinzip bleibt gleich: sichtbar, nachvollziehbar, fair und zu deinen Konditionen.
                    </p>
                </div>
            </OverlayModal>
        </>
    );
}