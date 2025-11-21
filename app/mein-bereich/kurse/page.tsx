import { PageHeader } from "@/components/mein-bereich/PageHeader";
import { DashboardCard } from "@/components/mein-bereich/DashboardCard";

export default function KursePage() {
  return (
    <>
      <PageHeader
        title="Kurse"
        description="Hier findest du deine Kurse rund um WohnenWo, Transparenz und Gestaltung."
      />
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard eyebrow="Status" title="Bald verfügbar">
          Bald siehst du hier deine gebuchten Kurse und Module.
        </DashboardCard>
      </section>
    </>
  );
}
