// app/mein-bereich/page.tsx

export default function MeinBereichHomePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
          Debug 999 – Mein Bereich
        </h1>
        <p className="text-sm text-slate-500 max-w-xl">
          Willkommen in deinem persönlichen WohnenWo-Bereich. Hier findest du
          deine Projekte, Anfragen und Trainings auf einen Blick.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-400 mb-1">
            Übersicht
          </p>
          <h2 className="text-sm font-semibold text-slate-900 mb-1">
            Aktive Projekte
          </h2>
          <p className="text-xs text-slate-500">
            Hier erscheinen deine laufenden WohnenWo-Projekte.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-400 mb-1">
            Training
          </p>
          <h2 className="text-sm font-semibold text-slate-900 mb-1">
            Transparenz &amp; Wirkung
          </h2>
          <p className="text-xs text-slate-500">
            Module und Sessions rund um deine transparente Wirtschaftskultur.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-400 mb-1">
            Community
          </p>
          <h2 className="text-sm font-semibold text-slate-900 mb-1">
            Netzwerk &amp; Jobs
          </h2>
          <p className="text-xs text-slate-500">
            Zugang zu Fachkräften, Partnern und möglichen Aufträgen.
          </p>
        </div>
      </section>
    </div>
  );
}
