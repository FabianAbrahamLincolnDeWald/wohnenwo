# CLAUDE.md – WohnenWo Projektinstruktionen

## Wer bin ich und was ist dieses Projekt?

Dieses Repository ist die technische Umsetzung von **WohnenWo** – einer Plattform die
erlebbare Wohnkonzepte, Interior Design, transparente Wertschöpfung und lokale Netzwerke verbindet.

Menschen sollen Design und Wohnkonzepte **erleben und bewohnen**, bevor sie kaufen oder investieren.

Das Projekt ist Teil eines größeren Betriebssystems für bewusstes Unternehmertum.
Die philosophische und strategische Grundlage liegt im **ManifestBrain**
(separates Repository: `~/Desktop/ManifestBrain`).

**Wenn du Entscheidungen über Designsprache, Werte, Kommunikation oder Strategie triffst,
orientiere dich an den Prinzipien aus dem ManifestBrain – insbesondere:**
- Transparenz als Fundament
- Bewusster Wohlstand
- Resonanz statt Überzeugung
- Erlebnis vor Erklärung

---

## Tech Stack

| Bereich | Technologie |
|---|---|
| Framework | Next.js 16 (App Router) |
| Sprache | TypeScript |
| UI | React 19 + Tailwind CSS + shadcn/ui + Radix UI |
| Animationen | Framer Motion + GSAP |
| Datenbank / Auth | Supabase |
| Deployment | Vercel |
| Icons | Lucide React |

---

## Projektstruktur

```
app/
├── (mein-bereich-shell)/     ← Authentifizierter Bereich – Shell/Layout
├── (mein-bereich-detail)/    ← Authentifizierter Bereich – Detailseiten
├── api/                      ← API Routes
├── auth/
│   └── callback/             ← Supabase Auth Callback
├── debug/                    ← Debug-Seiten (nur Development)
├── designentsteht/           ← Seite: Design-Entstehungsprozess
├── erlebnisse/               ← Seite: Erlebnisangebote
├── experten-netzwerk/        ← Seite: Expertennetzwerk
├── innenarchitektur/         ← Seite: Innenarchitektur
├── wertewirken/              ← Seite: Werte & Wirkung
├── globals.css               ← Globale Styles
├── layout.tsx                ← Root Layout
└── page.tsx                  ← Homepage

components/
├── auth/                     ← Auth-Komponenten
├── embeds/                   ← Eingebettete Inhalte
├── impact/                   ← Wirkungsbereich-Komponenten
├── mein-bereich/             ← Persönlicher Bereich
├── navigation/               ← Navigation & Menü
├── overlay/                  ← Overlay-Komponenten
├── sektionen/                ← Seitenabschnitte
├── slider/                   ← Slider-Komponenten
└── ui/                       ← Basis UI-Komponenten (shadcn)

lib/
├── supabase/                 ← Supabase Client & Server Setup
├── supabaseClient.ts         ← Direkter Supabase Client
├── useWirkungskontoStats.ts  ← Custom Hook: Wirkungskonto-Statistiken
└── utils.ts                  ← Hilfsfunktionen
```

---

## Branch-Workflow (IMMER einhalten)

### Grundregel
**Niemals direkt auf `main` arbeiten.**
`main` ist immer lauffähig und deployed auf Vercel.

### Neuen Branch erstellen
```bash
git checkout main
git pull origin main
git checkout -b feature/BESCHREIBUNG
# Beispiele:
# feature/darkmode-navigation
# fix/mobile-menu-broken
# design/homepage-hero-redesign
# feature/wirkungskonto-dashboard
```

### Namenskonventionen
- `feature/` – neue Funktionalität
- `fix/` – Bugfix
- `design/` – reine Design/UI-Änderungen
- `content/` – Inhalte, Texte, Medien
- `refactor/` – Code-Verbesserung ohne neue Funktion

### Arbeiten im Branch
Commits klein und beschreibend halten:
```bash
git add [nur betroffene Dateien]
git commit -m "Navigation: Mobile Menü Schließen-Button repariert"
git commit -m "Homepage: Hero-Section Animationsgeschwindigkeit angepasst"
```

### Vor dem Merge
1. Lokal testen: `npm run dev`
2. Build prüfen: `npm run build`
3. Lint prüfen: `npm run lint`
4. Dann mergen:
```bash
git checkout main
git merge feature/BESCHREIBUNG
git push origin main
```

---

## Wie Claude Code in diesem Projekt arbeitet

### Vor jeder Aufgabe
1. Relevante Dateien identifizieren (nicht das ganze Projekt laden)
2. Abhängigkeiten prüfen (welche Komponenten nutzen was)
3. Scope bestätigen: welche Dateien werden angefasst

### Während der Arbeit
- Änderungen minimal-invasiv halten
- Keine globalen Refactors ohne expliziten Auftrag
- Tailwind-Klassen bevorzugen, keine Inline-Styles
- Animationen immer mit Framer Motion oder GSAP (nicht mischen)
- Supabase-Zugriffe nur über `lib/supabase/` – nie direkt

### Nach jeder Aufgabe
Kurze Zusammenfassung liefern:
```
Geänderte Dateien: [Liste]
Was wurde geändert: [Beschreibung]
Wie testen: [Konkrete Schritte]
Wie mergen: git merge feature/...
```

### Datenbank-Änderungen
- Immer als SQL-Migration dokumentieren
- Niemals direkt in Supabase ohne Dokumentation

---

## Designprinzipien

- **Mobile First** – jede Komponente zuerst für Smartphone denken
- **Erlebnis vor Erklärung** – zeigen statt beschreiben
- **Ruhe und Klarheit** – keine überladenen Layouts
- **Animationen mit Bedeutung** – Bewegung unterstützt Inhalt, lenkt nicht ab
- **Responsive auf allen Geräten** – Desktop, Tablet, Smartphone gleichwertig

---

## Bekannte offene Punkte

- Einige Menüpunkte noch nicht vollständig implementiert
- Mobile Ansicht einzelner Seiten noch nicht fertig
- Responsive Verhalten prüfen und finalisieren

---

## Verbindung zum größeren System

```
ManifestBrain (~/Desktop/ManifestBrain)
      ↓ Philosophie, Werte, Strategie
WohnenWo (dieses Repo)
      ↓ Erste Branchenanwendung
Zukünftiges Betriebssystem
      ↓ Weitere Module (Steuer, andere Projekte)
```

Wenn du dir bei einer Entscheidung unsicher bist:
→ Frage dich: Was würde das ManifestBrain hier empfehlen?
→ Transparenz, Resonanz, Erlebnis, Bewusstsein.
