"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState("Anmeldung wird abgeschlossen…");

  useEffect(() => {
    const run = async () => {
      // 1) Fehler vom Provider/Supabase anzeigen
      const err =
        searchParams.get("error_description") ||
        searchParams.get("error");

      if (err) {
        setMsg(`Login fehlgeschlagen: ${decodeURIComponent(err)}`);
        return;
      }

      // 2) PKCE: Code austauschen
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/mein-bereich";

      if (!code) {
        // Fallback: evtl. Session schon da
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          router.replace(next);
          return;
        }
        setMsg("Kein Auth-Code gefunden. Bitte erneut anmelden.");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setMsg(`Login fehlgeschlagen: ${error.message}`);
        return;
      }

      router.replace(next);
    };

    run();
  }, [router, searchParams]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center p-6">
      <p className="text-sm text-slate-600">{msg}</p>
    </div>
  );
}
