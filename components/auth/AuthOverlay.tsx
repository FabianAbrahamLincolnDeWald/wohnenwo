// /Users/fabiandewald/Documents/wohnenwo/components/auth/AuthOverlay.tsx
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

  // wird NACH erfolgreichem Login/Signup (mit Session) aufgerufen
  onAuthed?: () => void;
};

// ✅ Feature Flag (später easy deaktivierbar)
const ENABLE_GOOGLE_AUTH =
  (process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH ?? "true") === "true";

function buildReturnToUrlWithAutoClaim(): string | null {
  if (typeof window === "undefined") return null;

  const cb = new URL("/auth/callback", window.location.origin);

  // optional: falls kein pendingClaim existiert, können wir wohin zurück?
  cb.searchParams.set(
    "next",
    window.location.pathname + window.location.search
  );

  cb.searchParams.set("autoclaim", "1");
  return cb.toString();
}

export default function AuthOverlay({
  mode,
  onClose,
  onSwitchMode,
  onAuthed,
}: AuthOverlayProps) {
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  if (!mode) return null;

  const isSignin = mode === "signin";
  const headline = isSignin ? "Anmelden" : "Registrieren";

  const handleSuccess = () => {
    onClose();
    onAuthed?.();
  };

  async function handleGoogle() {
    setOauthError(null);

    if (!ENABLE_GOOGLE_AUTH) {
      setOauthError("Google-Anmeldung ist aktuell deaktiviert.");
      return;
    }

    try {
      setOauthLoading(true);

      const redirectTo = buildReturnToUrlWithAutoClaim();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: redirectTo
          ? { redirectTo, queryParams: { prompt: "select_account" } }
          : { queryParams: { prompt: "select_account" } },
      });

      if (error) {
        setOauthError("Google-Anmeldung nicht möglich. Bitte versuche es erneut.");
        return;
      }
    } catch (e) {
      console.error(e);
      setOauthError("Google-Anmeldung nicht möglich. Bitte versuche es erneut.");
    } finally {
      setOauthLoading(false);
    }
  }

  return (
    <OverlayModal
      open={!!mode}
      onClose={onClose}
      ariaLabel={headline}
      contentClassName="bg-slate-50 text-slate-900 md:bg-slate-50 dark:bg-[#1d1d1f] dark:text-white"
    >
      <div className="mt-4 mx-auto w-full max-w-[360px] space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div>
            <img
              src="https://wohnenwo.vercel.app/images/brand/logos/ww-badge-dark.svg"
              alt="WohnenWo Logo"
              className="h-7 w-7 object-contain dark:hidden"
            />
            <img
              src="https://wohnenwo.vercel.app/images/brand/logos/ww-badge-light.svg"
              alt="WohnenWo Logo"
              className="hidden h-7 w-7 object-contain dark:block"
            />
          </div>

          <div>
            <span className="text-[18px] md:text-[19px] font-semibold tracking-tight text-slate-900 dark:text-white">
              {headline}
            </span>
          </div>
        </div>

        {/* Google + Divider */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={oauthLoading || !ENABLE_GOOGLE_AUTH}
            className={[
              "text-center transition duration-300 ease-out whitespace-nowrap font-medium w-full border py-1.5 px-3 text-[15px] rounded-md",
              "border-slate-200 text-slate-800 bg-white md:hover:bg-slate-50",
              "dark:border-white/10 dark:text-white dark:bg-white/5 dark:hover:bg-white/10",
              "disabled:opacity-60 disabled:cursor-not-allowed",
            ].join(" ")}
          >
            <div className="flex items-center justify-center pointer-events-none">
              <div>{oauthLoading ? "Bitte warten…" : "Mit Google fortfahren"}</div>
              <div className="mr-1 order-first">
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

          {oauthError && <p className="text-[13px] text-red-500">{oauthError}</p>}

          <div className="flex items-center justify-center w-full pt-1">
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            <span className="mx-3 text-slate-400 dark:text-white/45 text-[16px] md:text-[14px] text-center font-normal">
              oder
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>
        </div>

        {/* Formular */}
        {isSignin ? (
          <SignInFields onSuccess={handleSuccess} />
        ) : (
          <SignUpFields onSuccess={handleSuccess} />
        )}

        {/* Switch */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-[14px] text-slate-500 dark:text-white/60">
            {isSignin ? "Noch kein Zugang?" : "Du hast bereits ein Konto?"}
          </span>

          <button
            type="button"
            onClick={() => onSwitchMode?.(isSignin ? "signup" : "signin")}
            className={
              isSignin
                ? [
                  "rounded-md border px-3 py-1.5 text-[16px] md:text-[14px] font-medium transition",
                  "border-slate-900 bg-slate-900 text-white hover:bg-black",
                  "dark:border-white/10 dark:bg-white dark:text-slate-900 dark:hover:bg-white/95",
                ].join(" ")
                : [
                  "rounded-md border px-3 py-1.5 text-[16px] md:text-[14px] font-medium transition",
                  "border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
                  "dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
                ].join(" ")
            }
          >
            {isSignin ? "Registrieren" : "Anmelden"}
          </button>
        </div>
      </div>
    </OverlayModal>
  );
}

/* --- Teilformulare --- */

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
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        const msg = String(error.message ?? "").toLowerCase();
        if (msg.includes("email not confirmed") || msg.includes("not confirmed")) {
          setErrorMsg("Bitte bestätige zuerst deine E-Mail-Adresse (Link in deinem Postfach).");
          return;
        }
        setErrorMsg("Anmeldung nicht möglich. Bitte prüfe deine Eingaben.");
        return;
      }

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
      <div className="space-y-0.5">
        <div className="text-slate-500 dark:text-white/60 text-[16px] md:text-[14px]">
          E-Mail
        </div>
        <input
          className={[
            "py-2 px-[10px] w-full text-[16px] md:text-[14px] rounded-md transition ease-in-out duration-300 focus:outline-none focus:ring-0",
            "border border-slate-200 md:hover:border-slate-300 focus:border-slate-300",
            "bg-white text-slate-900 placeholder:text-slate-400",
            "dark:bg-white/5 dark:text-white dark:placeholder:text-white/35 dark:border-white/10 dark:hover:border-white/20 dark:focus:border-white/25",
          ].join(" ")}
          placeholder="E-Mail-Adresse eingeben…"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-0.5">
        <div className="text-slate-500 dark:text-white/60 text-[16px] md:text-[14px]">
          Passwort
        </div>
        <input
          className={[
            "py-2 px-[10px] w-full text-[16px] md:text-[14px] rounded-md transition ease-in-out duration-300 focus:outline-none focus:ring-0",
            "border border-slate-200 md:hover:border-slate-300 focus:border-slate-300",
            "bg-white text-slate-900 placeholder:text-slate-400",
            "dark:bg-white/5 dark:text-white dark:placeholder:text-white/35 dark:border-white/10 dark:hover:border-white/20 dark:focus:border-white/25",
          ].join(" ")}
          placeholder="Passwort eingeben…"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {errorMsg && <p className="text-[13px] text-red-500 mt-0.5">{errorMsg}</p>}

      <button
        type="submit"
        disabled={loading}
        className={[
          "mt-2 text-center transition duration-300 ease-out whitespace-nowrap font-medium w-full py-1.5 px-3 text-[16px] md:text-[14px] rounded-md",
          "bg-slate-900 text-white border border-slate-900 md:hover:bg-black",
          "dark:bg-white dark:text-slate-900 dark:border-white dark:hover:bg-white/95",
          "disabled:opacity-60 disabled:cursor-not-allowed",
        ].join(" ")}
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

      const emailRedirectTo = buildReturnToUrlWithAutoClaim() ?? undefined;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: emailRedirectTo ? { emailRedirectTo } : undefined,
      });

      if (error) {
        setErrorMsg("Registrierung nicht möglich. Bitte prüfe deine Eingaben.");
        return;
      }

      // Wenn Email-Verifikation aktiv ist → data.session ist i.d.R. null
      if (data.session) {
        onSuccess?.();
      } else {
        setInfoMsg(
          "Registrierung erfolgreich. Bitte bestätige deine E-Mail-Adresse (Link in deinem Postfach)."
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
      <div className="space-y-0.5">
        <div className="text-slate-500 dark:text-white/60 text-[16px] md:text-[14px]">
          E-Mail
        </div>
        <input
          className={[
            "py-2 px-[10px] w-full text-[16px] md:text-[14px] rounded-md transition ease-in-out duration-300 focus:outline-none focus:ring-0",
            "border border-slate-200 md:hover:border-slate-300 focus:border-slate-300",
            "bg-white text-slate-900 placeholder:text-slate-400",
            "dark:bg-white/5 dark:text-white dark:placeholder:text-white/35 dark:border-white/10 dark:hover:border-white/20 dark:focus:border-white/25",
          ].join(" ")}
          placeholder="E-Mail-Adresse eingeben…"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-0.5">
        <div className="text-slate-500 dark:text-white/60 text-[16px] md:text-[14px]">
          Passwort
        </div>
        <input
          className={[
            "py-2 px-[10px] w-full text-[16px] md:text-[14px] rounded-md transition ease-in-out duration-300 focus:outline-none focus:ring-0",
            "border border-slate-200 md:hover:border-slate-300 focus:border-slate-300",
            "bg-white text-slate-900 placeholder:text-slate-400",
            "dark:bg-white/5 dark:text-white dark:placeholder:text-white/35 dark:border-white/10 dark:hover:border-white/20 dark:focus:border-white/25",
          ].join(" ")}
          placeholder="Passwort wählen…"
          type="password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="space-y-0.5">
        <div className="text-slate-500 dark:text-white/60 text-[16px] md:text-[14px]">
          Passwort bestätigen
        </div>
        <input
          className={[
            "py-2 px-[10px] w-full text-[16px] md:text-[14px] rounded-md transition ease-in-out duration-300 focus:outline-none focus:ring-0",
            "border border-slate-200 md:hover:border-slate-300 focus:border-slate-300",
            "bg-white text-slate-900 placeholder:text-slate-400",
            "dark:bg-white/5 dark:text-white dark:placeholder:text-white/35 dark:border-white/10 dark:hover:border-white/20 dark:focus:border-white/25",
          ].join(" ")}
          placeholder="Passwort wiederholen…"
          type="password"
          name="passwordConfirm"
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </div>

      {errorMsg && <p className="text-[13px] text-red-500 mt-0.5">{errorMsg}</p>}
      {infoMsg && (
        <p className="text-[13px] text-emerald-600 dark:text-emerald-400 mt-0.5">
          {infoMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={[
          "text-center transition duration-300 ease-out whitespace-nowrap font-medium w-full py-1.5 px-3 text-[16px] md:text-[14px] rounded-md",
          "bg-slate-900 text-white border border-slate-900 md:hover:bg-black",
          "dark:bg-white dark:text-slate-900 dark:border-white dark:hover:bg-white/95",
          "disabled:opacity-60 disabled:cursor-not-allowed",
        ].join(" ")}
      >
        {loading ? "Wird erstellt…" : "Mit E-Mail registrieren"}
      </button>

      {/* ✅ wieder sichtbar (nicht mehr hidden) */}
      <div className="mt-3 text-[13px] text-slate-500 dark:text-white/50 text-center">
        Indem du fortfährst, bestätigst du, dass du die Bedingungen &amp;
        Datenschutzhinweise von WohnenWo gelesen und verstanden hast.
      </div>
    </form>
  );
}
