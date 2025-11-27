"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function SupabaseTestPage() {
  const [status, setStatus] = useState("Prüfe Verbindung…");

  useEffect(() => {
    async function check() {
      try {
        const { error } = await supabase
          .from("this_table_does_not_exist")
          .select("*");
        if (error) {
          console.log("Supabase antwortet:", error.message);
          setStatus("Supabase ist verbunden (Antwort erhalten).");
        } else {
          setStatus("Supabase ist verbunden (keine Fehler).");
        }
      } catch (e) {
        console.error(e);
        setStatus("Fehler bei der Supabase-Verbindung.");
      }
    }
    check();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="px-4 py-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <p className="text-sm text-slate-700">{status}</p>
      </div>
    </main>
  );
}
