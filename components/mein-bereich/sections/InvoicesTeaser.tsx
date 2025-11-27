// components/mein-bereich/sections/InvoicesTeaser.tsx
"use client";

import Link from "next/link";

type InvoicesTeaserProps = {
  nextInvoice?: {
    invoiceNumber: string;
    title: string;
    date: string;         // schon formatiert, z.B. "29.10.2025"
    amount: string;       // "399,60 €"
  };
};

export default function InvoicesTeaser({ nextInvoice }: InvoicesTeaserProps) {
  if (!nextInvoice) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5">
        <div className="text-[13px] font-medium text-slate-500">
          Rechnungen
        </div>
        <p className="mt-1 text-[14px] text-slate-600">
          Sobald deine erste transparent erstellte Rechnung vorliegt,
          erscheint sie hier mit vollem Einblick in Zeit, Material und Wertströme.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <div className="text-[13px] font-medium uppercase tracking-[0.16em] text-slate-400">
            Deine Dokumenteneinsicht
          </div>
          <div className="mt-1 text-[15px] font-semibold text-slate-900">
            Rechnung {nextInvoice.invoiceNumber}
          </div>
          <p className="mt-1 text-[13px] text-slate-500">
            {nextInvoice.title} &middot; {nextInvoice.date}
          </p>
        </div>

        <div className="text-right">
          <div className="text-[13px] text-slate-400">Betrag</div>
          <div className="text-[16px] font-semibold text-slate-900">
            {nextInvoice.amount}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          href="/mein-bereich/rechnungen/2025.10.001-001"
          className="inline-flex items-center rounded-md border border-slate-200 bg-slate-900 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-black"
        >
          Transparente Dokumentation öffnen
        </Link>
      </div>
    </div>
  );
}
