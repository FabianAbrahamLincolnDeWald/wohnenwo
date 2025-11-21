// app/mein-bereich/page.tsx

export default function MeinBereichHomePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">
          Dein Bereich
        </h1>
        <p className="text-sm text-slate-400 max-w-xl">
          Willkommen in deinem persönlichen WohnenWo-Bereich. Hier findest du
          deine Projekte, Anfragen und Trainings auf einen Blick.
        </p>
      </header>

      {/* Beispiel-Grid für Cards wie im Dashboard */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500 mb-1">
            Übersicht
          </p>
          <h2 className="text-sm font-semibold text-slate-50 mb-1">
            Aktive Projekte
          </h2>
          <p className="text-xs text-slate-400">
            Hier erscheinen deine laufenden WohnenWo-Projekte.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500 mb-1">
            Training
          </p>
          <h2 className="text-sm font-semibold text-slate-50 mb-1">
            Transparenz & Wirkung
          </h2>
          <p className="text-xs text-slate-400">
            Module und Sessions rund um deine transparente Wirtschaftskultur.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500 mb-1">
            Community
          </p>
          <h2 className="text-sm font-semibold text-slate-50 mb-1">
            Netzwerk & Jobs
          </h2>
          <p className="text-xs text-slate-400">
            Zugang zu Fachkräften, Partnern und möglichen Aufträgen.
          </p>
        </div>
      </section>
    </div>
  );
}
