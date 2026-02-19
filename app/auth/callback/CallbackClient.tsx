"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // ✅ nimm deinen zentralen Client

const PENDING_KEY = "ww_pending_claim";

type PendingClaim = { claimCode: string; createdAt: number };

function readPending(): PendingClaim | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as PendingClaim;
    if (!v?.claimCode) return null;
    return v;
  } catch {
    return null;
  }
}

function clearPending() {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {}
}

export default function CallbackClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const [msg, setMsg] = React.useState("Anmeldung wird abgeschlossen…");

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      // Provider-Fehler anzeigen
      const err = sp.get("error_description") || sp.get("error");
      if (err) {
        if (!cancelled) setMsg(`Login fehlgeschlagen: ${decodeURIComponent(err)}`);
        return;
      }

      // PKCE: Code gegen Session tauschen
      const code = sp.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (!cancelled) setMsg(`Login fehlgeschlagen: ${error.message}`);
          return;
        }
      }

      // Session muss jetzt da sein
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        const next = sp.get("next") || "/";
        router.replace(next);
        return;
      }

      // ✅ Pending Claim ausführen (wenn vorhanden)
      const pending = readPending();
      if (pending?.claimCode) {
        setMsg("Rechnung wird verbunden…");

        const res = await supabase.rpc("claim_invoice", {
          p_claim_code: pending.claimCode,
        });

        clearPending();

        if (res.error || !res.data) {
          const next = sp.get("next") || "/";
          router.replace(next);
          return;
        }

        const invoiceId = res.data as string;
        router.replace(`/mein-bereich/rechnungen/${invoiceId}`);
        return;
      }

      // kein Claim → normal weiter
      const next = sp.get("next") || "/mein-bereich";
      router.replace(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [router, sp]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center p-6">
      <p className="text-sm text-slate-600">{msg}</p>
    </div>
  );
}
