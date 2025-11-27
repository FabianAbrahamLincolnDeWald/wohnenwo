"use client";

import * as React from "react";
import { FormEvent, useState } from "react";
import OverlayModal from "@/components/overlay/OverlayModal";
import { supabase } from "@/lib/supabaseClient";

export type AuthMode = "signin" | "signup";

type AuthOverlayProps = {
  mode: AuthMode | null; // null = geschlossen
  onClose: () => void;
  onSwitchMode?: (mode: AuthMode) => void;
};

export default function AuthOverlay({
  mode,
  onClose,
  onSwitchMode,
}: AuthOverlayProps) {
  if (!mode) return null;

  const isSignin = mode === "signin";
  const headline = isSignin ? "Anmelden" : "Registrieren";

  return (
    <OverlayModal
      open={!!mode}
      onClose={onClose}
      ariaLabel={headline}
      contentClassName="bg-slate-50 md:bg-slate-50"
    >
      <div className="mt-4 mx-auto w-full max-w-[360px] space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div>
            <img
              src="https://wohnenwo.vercel.app/images/brand/logos/ww-badge-dark.svg"
              alt="WohnenWo Logo"
              className="h-7 w-7 object-contain"
            />
          </div>
          <div>
            <span className="text-[18px] md:text-[19px] font-semibold tracking-tight text-slate-900">
              {headline}
            </span>
          </div>
        </div>

        {/* Google + Divider */}
        <div className="space-y-5 pt-2">
          <button
            type="button"
            className="text-center transition duration-300 ease-out whitespace-nowrap font-medium w-full border border-slate-200 text-slate-800 bg-white md:hover:bg-slate-50 py-1.5 px-3 text-[15px] rounded-md"
          >
            <div className="flex items-center justify-center pointer-events-none">
              <div>Mit Google fortfahren</div>
              <div className="mr-1 order-first">
                {/* Google Icon */}
                <svg
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                    c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                    c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                    C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                    c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                    c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
              </div>
            </div>
          </button>

          <div className="flex items-center justify-center w-full">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="mx-3 text-slate-400 text-[16px] md:text-[14px] text-center font-normal">
              oder
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
        </div>

        {/* Formular */}
        {isSignin ? (
          <SignInFields onSuccess={onClose} />
        ) : (
          <SignUpFields onSuccess={onClose} />
        )}

        {/* Switch-Bereich unten */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-2">
          <span className="text-[14px] text-slate-500">
            {isSignin ? "Noch kein Zugang?" : "Du hast bereits ein Konto?"}
          </span>

          <button
            type="button"
            onClick={() => onSwitchMode?.(isSignin ? "signup" : "signin")}
            className={
              isSignin
                ? "rounded-md border border-slate-900 bg-slate-900 text-white px-3 py-1.5 text-[16px] md:text-[14px] font-medium hover:bg-black transition"
                : "rounded-md border border-slate-300 bg-white text-slate-700 px-3 py-1.5 text-[16px] md:text-[14px] font-medium hover:bg-slate-100 transition"
            }
          >
            {isSignin ? "Registrieren" : "Anmelden"}
          </button>
        </div>
      </div>
    </OverlayModal>
  );
}

/* --- Teilformulare mit Supabase-Logik --- */

type FormProps = {
  onSuccess?: () => void;
};

function SignInFields({ onSuccess }: FormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Bitte fülle E-Mail und Passwort aus.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // ✅ Nur Overlay schließen – Nutzer bleibt auf der aktuellen Seite
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* E-Mail */}
      <div>
        <div className="space-y-0.5">
          <div className="text-slate-500 text-[16px] md:text-[14px]">E-Mail</div>
          <input
            className="
              text-slate-900 placeholder:text-slate-400
              py-2 px-[10px] w-full text-[16px] md:text-[14px]
              border border-slate-200
              md:hover:border-slate-300
              transition ease-in-out duration-300
              focus:outline-none focus:border-slate-300 focus:ring-0
              rounded-md bg-white
            "
            placeholder="E-Mail-Adresse eingeben…"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Passwort */}
      <div>
        <div className="space-y-0.5">
          <div className="text-slate-500 text-[16px] md:text-[14px]">Passwort</div>
          <input
            className="
              text-slate-900 placeholder:text-slate-400
              py-2 px-[10px] w-full text-[16px] md:text-[14px]
              border border-slate-200
              md:hover:border-slate-300
              transition ease-in-out duration-300
              focus:outline-none focus:border-slate-300 focus:ring-0
              rounded-md bg-white
            "
            placeholder="Passwort eingeben…"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {errorMsg && (
        <p className="text-[13px] text-red-500 mt-0.5">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="
          mt-2
          text-center transition duration-300 ease-out whitespace-nowrap font-medium
          w-full bg-slate-900 text-white border border-slate-900
          md:hover:bg-black
          py-1.5 px-3 text-[16px] md:text-[14px] rounded-md
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        {loading ? "Melde an…" : "Mit E-Mail anmelden"}
      </button>
    </form>
  );
}

function SignUpFields({ onSuccess }: FormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!email || !password || !passwordConfirm) {
      setErrorMsg("Bitte fülle alle Felder aus.");
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMsg("Die Passwörter stimmen nicht überein.");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data.session) {
        // Direkt eingeloggt → nur Overlay schließen
        onSuccess?.();
      } else {
        // Bestätigungs-Mail
        setInfoMsg(
          "Registrierung erfolgreich. Bitte prüfe deine E-Mails, um dein Konto zu bestätigen."
        );
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* E-Mail */}
      <div>
        <div className="space-y-0.5">
          <div className="text-slate-500 text-[16px] md:text-[14px]">E-Mail</div>
          <input
            className="
              text-slate-900 placeholder:text-slate-400
              py-2 px-[10px] w-full text-[16px] md:text-[14px]
              border border-slate-200
              md:hover:border-slate-300
              transition ease-in-out duration-300
              focus:outline-none focus:border-slate-300 focus:ring-0
              rounded-md bg-white
            "
            placeholder="E-Mail-Adresse eingeben…"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Passwort */}
      <div>
        <div className="space-y-0.5">
          <div className="text-slate-500 text-[16px] md:text-[14px]">Passwort</div>
          <input
            className="
              text-slate-900 placeholder:text-slate-400
              py-2 px-[10px] w-full text-[16px] md:text-[14px]
              border border-slate-200
              md:hover:border-slate-300
              transition ease-in-out duration-300
              focus:outline-none focus:border-slate-300 focus:ring-0
              rounded-md bg-white
            "
            placeholder="Passwort wählen…"
            type="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {/* Passwort bestätigen */}
      <div>
        <div className="space-y-0.5">
          <div className="text-slate-500 text-[16px] md:text-[14px]">
            Passwort bestätigen
          </div>
          <input
            className="
              text-slate-900 placeholder:text-slate-400
              py-2 px-[10px] w-full text-[16px] md:text-[14px]
              border border-slate-200
              md:hover:border-slate-300
              transition ease-in-out duration-300
              focus:outline-none focus:border-slate-300 focus:ring-0
              rounded-md bg-white
            "
            placeholder="Passwort wiederholen…"
            type="password"
            name="passwordConfirm"
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
      </div>

      {errorMsg && (
        <p className="text-[13px] text-red-500 mt-0.5">{errorMsg}</p>
      )}
      {infoMsg && (
        <p className="text-[13px] text-emerald-600 mt-0.5">{infoMsg}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="
          text-center transition duration-300 ease-out whitespace-nowrap font-medium
          w-full bg-slate-900 text-white border border-slate-900
          md:hover:bg-black
          py-1.5 px-3 text-[16px] md:text-[14px] rounded-md
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        {loading ? "Wird erstellt…" : "Mit E-Mail registrieren"}
      </button>

      <div className="hidden sm:block mt-3 text-[13px] text-slate-500 text-center">
        Indem du fortfährst, bestätigst du, dass du die Bedingungen &amp;
        Datenschutzhinweise von WohnenWo gelesen und verstanden hast.
      </div>
    </form>
  );
}
