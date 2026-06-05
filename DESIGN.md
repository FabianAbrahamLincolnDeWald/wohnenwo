# DESIGN.md – WohnenWo Designsystem

> Diese Datei ist die einzige Quelle der Wahrheit für alle visuellen Entscheidungen.
> Claude Code liest sie vor jeder UI-Aufgabe. Änderungen hier gelten überall.

---

## Designphilosophie

WohnenWo ist kein gewöhnliches Tool. Es ist ein Betriebssystem für bewusstes Unternehmertum.
Das Design soll das widerspiegeln:

- **Hochwertig ohne kalt zu sein** – Dunkel und premium, aber mit menschlicher Wärme
- **Klar ohne steril zu sein** – Viel Weißraum, aber mit Leben gefüllt
- **Bewegt ohne abzulenken** – Animationen führen den Blick, stehlen ihn nicht
- **Vertrauend ohne zu erklären** – Qualität zeigt sich, sie muss nicht behauptet werden

Referenz-Feeling: BeBeBus (Wärme, Hochformat, Bildsprache) + Kinso (Struktur, Prozessklarheit, Navigation)

---

## Farbsystem

### Basis – Dark Mode (Primär / Betriebssystem)

```css
--color-bg-primary:     #0A0A0A;   /* Tiefstes Schwarz – Haupthintergrund */
--color-bg-secondary:   #111111;   /* Karten, Panels */
--color-bg-elevated:    #1A1A1A;   /* Hover-States, erhöhte Elemente */
--color-bg-subtle:      #222222;   /* Borders, Trennlinien */

--color-text-primary:   #F5F5F5;   /* Haupttext */
--color-text-secondary: #A0A0A0;   /* Sekundärtext, Labels */
--color-text-muted:     #606060;   /* Platzhalter, deaktiviert */
```

### Basis – Light Mode (Marketing / Öffentliche Seiten)

```css
--color-bg-primary:     #FAFAFA;   /* Fast-Weiß – nie reines Weiß */
--color-bg-secondary:   #F2F2F0;   /* Warm-Grau für Sektionen */
--color-bg-elevated:    #FFFFFF;   /* Karten auf hellem Hintergrund */
--color-bg-subtle:      #E8E8E5;   /* Borders */

--color-text-primary:   #0F0F0F;   /* Fast-Schwarz */
--color-text-secondary: #555555;   /* Sekundärtext */
--color-text-muted:     #999999;   /* Platzhalter */
```

### Markenfarben (beide Modi)

```css
--color-brand-gold:     #F5C842;   /* Primärer Akzent – sparsam einsetzen */
--color-brand-gold-dim: #C49A20;   /* Hover auf Gold */

--color-accent-cyan:    #00B4D8;   /* Sekundärer Akzent – Links, Highlights */
--color-accent-cyan-dim:#0096B7;   /* Hover auf Cyan */

--color-wirkung:        #F5C842;   /* Wirkungskonto – immer Gold */
--color-success:        #4CAF7D;   /* Bezahlt, abgeschlossen */
--color-warning:        #F5A623;   /* Offen, ausstehend */
--color-error:          #E05555;   /* Fehler, abgelehnt */
```

### Farbregeln

- Gold (`--color-brand-gold`) maximal auf **5–10% der Fläche** – als Akzent, nie als Fläche
- Cyan nur für **interaktive Elemente** – Links, CTAs, aktive Zustände
- Reines Weiß `#FFFFFF` und reines Schwarz `#000000` **vermeiden** – immer leicht gebrochen
- Kein Blau außer Cyan – kein generisches Tech-Blau

---

## Typografie

### Schriftarten

```css
--font-sans:    'Inter', system-ui, sans-serif;   /* Alles */
--font-display: 'Inter', system-ui, sans-serif;   /* Große Headlines – gleiche Font, anderes Gewicht */
```

Inter in allen Gewichten. Keine zweite Schriftart einführen ohne Rücksprache.

### Größensystem (Mobile First)

```css
/* Display – Hero Headlines */
--text-display-xl:  clamp(2.5rem, 6vw, 5rem);     /* 40px → 80px */
--text-display-lg:  clamp(2rem, 4.5vw, 3.75rem);  /* 32px → 60px */
--text-display-md:  clamp(1.75rem, 3.5vw, 3rem);  /* 28px → 48px */

/* Text */
--text-xl:    1.25rem;   /* 20px – Große Subheadlines */
--text-lg:    1.125rem;  /* 18px – Einleitungstexte */
--text-base:  1rem;      /* 16px – Fließtext */
--text-sm:    0.875rem;  /* 14px – Labels, Captions */
--text-xs:    0.75rem;   /* 12px – Metadaten, Timestamps */
```

### Gewichte

```css
--font-black:      900;   /* Display-Headlines, max. Impact */
--font-bold:       700;   /* Überschriften, CTAs */
--font-semibold:   600;   /* Sub-Headlines, Labels */
--font-medium:     500;   /* Interaktive Elemente */
--font-regular:    400;   /* Fließtext */
--font-light:      300;   /* Sekundärer Text, groß */
```

### Typografieregeln

- Headlines auf dunklem Grund: `font-weight: 700–900`
- Headlines auf hellem Grund: `font-weight: 600–800`
- Zeilenhöhe Fließtext: `line-height: 1.6`
- Zeilenhöhe Headlines: `line-height: 1.1–1.2`
- Buchstabenabstand Headlines: `letter-spacing: -0.02em` (leicht enger)
- **Kein Text-Justify** – immer linksbündig oder zentriert

---

## Spacing-System

Basis-Einheit: `4px`. Alles in Vielfachen davon.

```css
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px    /* Standard innerer Abstand */
--space-5:   20px
--space-6:   24px    /* Standard zwischen Elementen */
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px    /* Sektionsabstand Mobile */
--space-20:  80px    /* Sektionsabstand Tablet */
--space-24:  96px    /* Sektionsabstand Desktop */
--space-32:  128px
```

---

## Border Radius

```css
--radius-sm:   6px;    /* Kleine Elemente: Tags, Badges */
--radius-md:   10px;   /* Standard: Inputs, kleine Karten */
--radius-lg:   16px;   /* Karten, Panels */
--radius-xl:   24px;   /* Große Karten, Modal */
--radius-2xl:  32px;   /* Hero-Elemente, Feature-Karten */
--radius-full: 9999px; /* Pills, Avatar, runde Buttons */
```

**Grundregel:** Lieber zu rund als zu eckig. Der Stil ist organisch-premium, nicht brutal-modern.

---

## Schatten & Tiefe

```css
/* Dark Mode */
--shadow-sm:   0 1px 3px rgba(0,0,0,0.4);
--shadow-md:   0 4px 16px rgba(0,0,0,0.5);
--shadow-lg:   0 8px 32px rgba(0,0,0,0.6);
--shadow-glow-gold: 0 0 20px rgba(245,200,66,0.15);   /* Gold-Glow für Wirkungselemente */

/* Light Mode */
--shadow-sm-light: 0 1px 3px rgba(0,0,0,0.08);
--shadow-md-light: 0 4px 16px rgba(0,0,0,0.10);
--shadow-lg-light: 0 8px 32px rgba(0,0,0,0.12);
```

---

## Komponenten-Definitionen

### Buttons

```
Primary (CTA):
  bg: --color-brand-gold
  text: #0A0A0A (dunkel auf Gold)
  radius: --radius-full
  padding: 12px 24px
  font-weight: 600
  hover: scale(1.02) + leicht heller

Secondary (Outline):
  bg: transparent
  border: 1px solid --color-bg-subtle
  text: --color-text-primary
  hover: bg → --color-bg-elevated

Ghost:
  bg: transparent
  text: --color-text-secondary
  hover: text → --color-text-primary
```

### Karten

```
Standard-Karte (Dark):
  bg: --color-bg-secondary
  border: 1px solid --color-bg-subtle
  radius: --radius-lg
  padding: --space-6
  hover: border-color → --color-brand-gold (subtle, 30% opacity)

Feature-Karte (groß):
  radius: --radius-2xl
  padding: --space-8 bis --space-10
  Bild oben, Text unten

Wirkungskonto-Karte:
  border-left: 3px solid --color-brand-gold
  Gold-Glow im Hintergrund (sehr subtil)
```

### Navigation

```
Desktop:
  bg: rgba(10,10,10,0.85) mit backdrop-blur(12px)
  height: 64px
  Logo links, Navigation Mitte, Actions rechts

Mobile:
  bg: --color-bg-primary
  height: 56px
  Logo links, Hamburger rechts
  Sidebar-Navigation (von links einfahren, nicht Overlay von oben)

Aktiver Nav-Link:
  color: --color-brand-gold
  Kein Underline, nur Farbe
```

### Badges / Wirkungsabzeichen

```
bg: rgba(245,200,66,0.15)
border: 1px solid rgba(245,200,66,0.3)
text: --color-brand-gold
radius: --radius-full
font-size: --text-xs
font-weight: 600
```

### Fortschrittsbalken (Gamification)

```
Track: --color-bg-subtle
Fill: linear-gradient(90deg, --color-brand-gold, --color-accent-cyan)
height: 6px
radius: --radius-full
Animation: ease-out, 600ms beim Einblenden
```

---

## Animationen

### Grundprinzipien

- Animationen **erklären** was passiert – sie sind keine Dekoration
- Dauer: **150ms** (Micro), **300ms** (Standard), **500ms** (Einblenden), **800ms** (Hero)
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` – schnell raus, sanft ankommen
- **Kein Autoplay ohne Nutzeraktion** außer auf der Hero-Sektion

### Standard-Übergänge

```css
/* Hover */
transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);

/* Einblenden (scroll-triggered) */
animation: fadeInUp 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Karten-Hover */
transform: translateY(-4px);
box-shadow: --shadow-lg;
```

### GSAP (für komplexe Animationen)

Nur für: Hero-Sektionen, Scroll-Storytelling (wie WerteWirken), Zahlen-Counter
Nicht für: einfache Hover-States, normale Übergänge

### Framer Motion (für React-Komponenten)

Für: Sidebar-Animationen, Modals, Tabs, List-Einblendungen
Standard-Variante:
```js
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
```

---

## Layout-System

### Breakpoints

```css
sm:   640px
md:   768px
lg:   1024px
xl:   1280px
2xl:  1536px
```

### Container

```css
max-width: 1280px
padding-x: 16px (mobile), 24px (tablet), 48px (desktop)
```

### Grid

```
Marketing-Seiten: 12-Spalten-Grid
Betriebssystem: Sidebar (240px) + Content (flex-grow)
Karten-Grid: 1 Spalte (mobile), 2 (tablet), 3 (desktop)
```

---

## Zweigeteiltes System

### Öffentliche Seiten (Marketing)
`Homepage, WerteWirken, Innenarchitektur, Erlebnisse, ExpertenNetzwerk`

- Hintergrund: Hell (`--color-bg-primary` light)
- Große Hero-Bilder (Vollbreite, kein Rand)
- Starke Typografie (Display-Größen)
- Sektionswechsel: Hell ↔ Dunkel (Kontrast durch Abschnitte)
- Referenz: BeBeBus für Bildsprache, Kinso für Prozessdarstellung

### Betriebssystem (App)
`Mein Bereich, Rechnungen, Projekte, Sammlungen, Community`

- Hintergrund: Dunkel (`--color-bg-primary` dark)
- Sidebar-Navigation links
- Dichten Informationsdarstellungen
- Wirkungskonto immer sichtbar (rechte Spalte)
- Gamification-Elemente: Badges, Fortschritt, Level

---

## Bildsprache

- **Menschen bei der Arbeit** – Handwerker, Architekten, echte Situationen (nicht Stockfotos)
- **Räume mit Stimmung** – Warmes Licht, Materialien sichtbar, keine sterilen Showrooms
- **Nahaufnahmen von Details** – Holzmaserung, Fugen, Hände die etwas halten
- **Keine generischen Büro-Bilder** – keine Laptops auf weißen Tischen
- Bilder immer mit `object-fit: cover` und definierten Seitenverhältnissen
- Standard-Verhältnisse: `16:9` (Hero), `4:3` (Karten), `1:1` (Avatare, Thumbnails)

---

## Was Claude Code NICHT tun soll

- Keine neuen Farben einführen die hier nicht definiert sind
- Kein reines `#000000` oder `#FFFFFF`
- Keine `inline-styles` außer dynamischen Werten (Animationen, berechnete Werte)
- Kein `!important` außer in Notfällen mit Kommentar
- Keine Schriftarten außer Inter einbinden
- Keine globalen CSS-Änderungen ohne expliziten Auftrag
- Animationsdauer nie unter 100ms oder über 1000ms (außer Hero)
- Border-Radius nie unter `--radius-sm` für sichtbare UI-Elemente

---

## Offene Designentscheidungen (zu klären)

- [ ] Dunkles oder helles Theme als Standard beim ersten Besuch?
- [ ] Manuelle Theme-Toggle Funktion für Nutzer?
- [ ] Primäre CTA-Farbe auf Marketing-Seiten: Gold oder Dunkel?
- [ ] Mobile Navigation: Sidebar oder Bottom-Tab-Bar im Betriebssystem?

---

*Letzte Aktualisierung: auf Basis der Plattform-Screenshots und Referenz-Sites (BeBeBus, Kinso) erstellt.*
*Vor Änderungen an diesem Dokument: Rücksprache mit Fabian.*
