// app/mein-bereich/page.tsx
import DashboardCard from "@/components/mein-bereich/DashboardCard";

export default function MeinBereichHomePage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        eyebrow="Übersicht"
        title="Dein Wirkungsbereich"
        description="Behalte deine laufenden Kurse, Trainings und Sammlungen im Blick."
        href="/mein-bereich/kurse"
        badge="Neu"
      />

      <DashboardCard
        eyebrow="Lernen"
        title="Aktive Kurse"
        description="Steige dort ein, wo du zuletzt aufgehört hast, und vertiefe dein Wissen."
        href="/mein-bereich/kurse"
      />

      <DashboardCard
        eyebrow="Training"
        title="Dein Training"
        description="Baue dir Routinen, die deine Arbeit, Gesundheit und Kreativität stärken."
        href="/mein-bereich/training"
      />

      <DashboardCard
        eyebrow="Inspiration"
        title="Sammlungen"
        description="Speichere Räume, Projekte und Ideen, die du später vertiefen möchtest."
        href="/mein-bereich/sammlungen"
      />

      <DashboardCard
        eyebrow="Community"
        title="Jobs & Community"
        description="Finde Menschen, Projekte und Aufträge, die zu deiner Haltung passen."
        href="/mein-bereich/community"
      />

      <DashboardCard
        eyebrow="Transparenz"
        title="Wirkungsfonds & Transparenzrechner"
        description="Bald kannst du hier nachvollziehen, wie Wertschöpfung in deinem Netzwerk fließt."
      >
        <p>
          Dieser Bereich ist im Aufbau. Er wird dir zeigen, wie deine Arbeit,
          dein Beitrag und die gemeinsamen Projekte miteinander verbunden sind.
        </p>
      </DashboardCard>
    </div>
  );
}
