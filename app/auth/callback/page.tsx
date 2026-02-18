// /app/auth/callback/page.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();

  React.useEffect(() => {
    const next = sp.get("next") || "/";
    const code = sp.get("code");

    async function run() {
      // PKCE-Code gegen Session tauschen
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) console.error("[auth/callback]", error);
      }
      router.replace(next);
    }

    run();
  }, [router, sp]);

  return (
    <div className="h-full flex items-center justify-center text-slate-600 text-sm">
      Anmeldung wird abgeschlossen…
    </div>
  );
}
