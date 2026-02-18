import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center p-6">
          <p className="text-sm text-slate-600">Anmeldung wird abgeschlossen…</p>
        </div>
      }
    >
      <CallbackClient />
    </Suspense>
  );
}
