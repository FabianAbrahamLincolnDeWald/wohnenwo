// components/mein-bereich/DashboardCard.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type DashboardCardProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  href?: string;
  badge?: string;
  children?: React.ReactNode;
};

export default function DashboardCard({
  title,
  eyebrow,
  description,
  href,
  badge,
  children,
}: DashboardCardProps) {
  const content = (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {eyebrow && (
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 leading-tight">
              {eyebrow}
            </p>
          )}
          {badge && (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-[17px] sm:text-[18px] font-semibold tracking-tight text-slate-900">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-slate-600 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="mt-3 text-sm text-slate-500">
          {children}
        </div>
      )}

      {href && (
        <div className="mt-4 flex items-center gap-1 text-[13px] font-medium text-slate-600">
          <span className="group-hover:text-slate-900">Bereich öffnen</span>
          <ChevronRight className="h-3.5 w-3.5 translate-x-[0.5px] group-hover:translate-x-[2px] transition-transform" />
        </div>
      )}
    </>
  );

  const baseClasses = `
    group relative flex flex-col justify-between
    rounded-2xl border border-slate-200/80 bg-white
    px-5 py-4 sm:px-6 sm:py-5
    shadow-[0_18px_40px_rgba(15,23,42,0.06)]
    transition-all duration-300
    hover:-translate-y-[2px] hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)]
  `;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return <div className={baseClasses}>{content}</div>;
}
