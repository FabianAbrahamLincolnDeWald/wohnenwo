"use client";

export default function ExploreMoreBlock() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold tracking-tight mb-12">
          Mehr entdecken
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Manifest", "Experten-Netzwerk", "Werte wirken"].map((item) => (
            <a
              key={item}
              href="#"
              className="rounded-3xl border border-slate-200 p-6 hover:bg-slate-50 transition"
            >
              <h3 className="font-semibold text-slate-900">{item}</h3>
              <p className="mt-2 text-slate-600">
                Mehr über diesen Bereich erfahren
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
