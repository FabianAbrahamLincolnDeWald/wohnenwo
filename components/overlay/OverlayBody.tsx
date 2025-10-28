"use client";

import * as React from "react";

function splitLead(text: string): { lead: string; rest: string } {
  const idx = text.indexOf(".");
  if (idx === -1) return { lead: text, rest: "" };
  return { lead: text.slice(0, idx + 1), rest: text.slice(idx + 1).trim() };
}

export default function OverlayBody({
  paras,
  card,
  link,
  imgRadius = "1.5rem",
}: {
  paras: Array<string | React.ReactNode>;
  card?: {
    variant: "clickable" | "static";
    textParas?: Array<string | React.ReactNode>; // Absätze (erster Satz im ersten Absatz fett)
    paras?: Array<string | React.ReactNode>;     // zusätzliche Absätze
    img?: { src: string; alt: string };
    href?: string;
  };
  link?: { href: string; label: string };
  imgRadius?: string; // nur obere Bild-Ecken gerundet
}) {
  const renderTextParas = (arr?: Array<string | React.ReactNode>) =>
    arr?.map((p, i) => {
      if (typeof p === "string") {
        if (i === 0) {
          const { lead, rest } = splitLead(p);
          return (
            <p key={`tp-${i}`} className={i ? "mt-4" : undefined}>
              <span className="font-semibold text-slate-900">{lead}</span>
              {rest ? " " + rest : null}
            </p>
          );
        }
        return <p key={`tp-${i}`} className="mt-4">{p}</p>;
      }
      return <p key={`tp-${i}`} className={i ? "mt-4" : undefined}>{p}</p>;
    }) ?? null;

  const renderExtraParas = (arr?: Array<string | React.ReactNode>) =>
    arr?.map((p, i) => <p key={`ep-${i}`} className={i ? "mt-4" : undefined}>{p}</p>) ?? null;

  return (
    <div style={{ ["--img-radius" as any]: imgRadius }}>
      {paras.map((p, idx) => <p key={idx} className={idx ? "mt-4" : undefined}>{p}</p>)}

      {link && (
        <div className="mt-6">
          <a href={link.href} aria-label={link.label}
             className="inline-flex items-center gap-2 text-yellow-400 hover:underline decoration-yellow-400 decoration-2 underline-offset-4 cursor-pointer">
            <span>{link.label}</span>
          </a>
        </div>
      )}

      {card && (card.variant === "clickable" ? (
        <a href={card.href} className="group mt-6 block focus:outline-none" aria-label="Mehr erfahren">
          <div className="rounded-3xl bg-slate-200 ring-1 ring-black/10 p-5 md:p-6 pb-5 transition-all duration-200 hover:ring-black/20 hover:bg-slate-200/95 focus-visible:ring-2 focus-visible:ring-slate-400">
            {renderTextParas(card.textParas)}
            {renderExtraParas(card.paras)}
            {card.img && (
              <div className="mt-4 overflow-hidden -mx-5 md:-mx-6 -mb-5 md:-mb-6 rounded-b-3xl">
                <img src={card.img.src} alt={card.img.alt} className="block w-full h-auto rounded-t-[var(--img-radius)]" loading="lazy" />
              </div>
            )}
          </div>
        </a>
      ) : (
        <div className="mt-6 rounded-3xl bg-slate-200/90 ring-1 ring-black/10 p-5 md:p-6 pb-5">
          {renderTextParas(card.textParas)}
          {renderExtraParas(card.paras)}
          {card.img && (
            <div className="mt-4 overflow-hidden -mx-5 md:-mx-6 -mb-5 md:-mb-6 rounded-b-3xl">
              <img src={card.img.src} alt={card.img.alt} className="block w-full h-auto rounded-t-[var(--img-radius)]" loading="lazy" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
