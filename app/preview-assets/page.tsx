// app/preview-assets/page.tsx
import Image from "next/image";

type Tile = { title: string; desc: string; src: string; note?: string; };

const tiles: Tile[] = [
  { title: "Hero", desc: "Key Visual (1600–2000 px, ≤1 MB, .webp)", src: "/images/dienst-wirkung/hero/hero-bg.webp", note: "Lege die Datei hier ab, dann erscheint sie." },
  { title: "Card", desc: "Teaser/Slider (~800 px, ≤1 MB, .webp)", src: "/images/dienst-wirkung/cards/card-1.webp" },
  { title: "Overlay", desc: "Overlay/Modal (~1200 px, ≤1 MB, .webp)", src: "/images/dienst-wirkung/overlays/overlay-vision.webp" },
  { title: "Logo (SVG)", desc: "Projekt-Logo (.svg, optimiert mit svgo)", src: "/images/brand/logos/wwde-badge-white.svg" }
];

export default function PreviewAssetsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Preview · Bilder & Logos</h1>
      <p className="mt-2 text-sm text-slate-600">Lege deine Assets unter <code>/public/images/…</code> ab. Diese Seite lädt sie direkt per Pfad.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <div key={t.title} className="rounded-2xl border bg-white shadow-sm">
            <div className="p-4">
              <h2 className="text-base font-medium">{t.title}</h2>
              <p className="mt-1 text-xs text-slate-600">{t.desc}</p>
              {t.note && <p className="mt-1 text-[11px] text-slate-500">{t.note}</p>}
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-b-2xl bg-slate-50">
              <Image src={t.src} alt={t.title} fill sizes="(min-width:1024px)33vw,(min-width:640px)50vw,100vw" className="object-contain" />
            </div>
            <div className="px-4 py-3 text-[11px] text-slate-500">Pfad: <code>{t.src}</code></div>
          </div>
        ))}
      </div>
    </main>
  );
}
