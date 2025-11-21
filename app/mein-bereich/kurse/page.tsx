// app/mein-bereich/kurse/page.tsx

import DashboardCard from "@/components/mein-bereich/DashboardCard";

export default function KursePage() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        eyebrow="Status"
        title="Bald verfügbar"
        description="Hier findest du deine Kurse rund um WohnenWo, Transparenz und Gestaltung."
      >
        Bald siehst du hier deine gebuchten Kurse, Module und vertiefenden Inhalte.
      </DashboardCard>
    </section>
  );
}
