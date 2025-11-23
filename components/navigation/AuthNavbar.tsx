"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe } from "lucide-react";
import EcosystemFlyout from "@/components/navigation/EcosystemFlyout";

type AuthNavbarProps = {
  mode: "signin" | "signup"; // "signin" = Anmelden, "signup" = Registrieren
};

export default function AuthNavbar({ mode }: AuthNavbarProps) {
  const [languageOpen, setLanguageOpen] = useState(false);

  const toggleLanguage = () => setLanguageOpen((v) => !v);

  const isSignin = mode === "signin";

  const text = isSignin ? "Noch kein Zugang?" : "Bereits registriert?";
  const buttonLabel = isSignin ? "Registrieren" : "Anmelden";
  const buttonHref = isSignin ? "/auth/registrieren" : "/auth/anmelden";
  const buttonClasses = isSignin
    ? "rounded-md border border-slate-900 bg-slate-900 text-white px-3 py-1.5 text-sm font-medium hover:bg-black transition"
    : "rounded-md border border-slate-300 bg-white text-slate-700 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 transition";

  return (
    <nav
      className="fixed inset-x-0 top-0 z-40 bg-transparent backdrop-blur bg-white/70 border-b border-slate-200"
      aria-label="WohnenWo Auth Navigation"
    >
      {/* Vollbreite, nur Innenabstand */}
      <div className="flex h-14 w-full items-center justify-between px-4">
        {/* LINKS: nur Ecosystem */}
        <div className="flex items-center">
          <EcosystemFlyout panelWidth={640} />
        </div>

        {/* RECHTS: Switch-Text + Button + Language-Button ganz außen */}
        <div className="flex items-center gap-4">
          {/* Switch-Text + Button */}
          <div className="flex items-center gap-2 text-[14px] text-slate-600">
            <span>{text}</span>
            <Link href={buttonHref}>
              <button type="button" className={buttonClasses}>
                {buttonLabel}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
