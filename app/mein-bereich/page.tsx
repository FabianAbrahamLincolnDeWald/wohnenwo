import { PageHeader } from "@/components/mein-bereich/PageHeader";
import { DashboardCard } from "@/components/mein-bereich/DashboardCard";

export default function MeinBereichHomePage() {
  return (
    <>
      <PageHeader
        title="Debug 999"
        description="Willkommen in deinem persönlichen WohnenWo-Bereich. Hier findest du deine Projekte, Anfragen und Trainings auf einen Blick."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard eyebrow="Übersicht" title="Aktive Projekte">
          Hier erscheinen deine laufenden WohnenWo-Projekte.
        </DashboardCard>

        <DashboardCard eyebrow="Training" title="Transparenz &amp; Wirkung">
          Module und Sessions rund um deine transparente Wirtschaftskultur.
        </DashboardCard>

        <DashboardCard eyebrow="Community" title="Netzwerk &amp; Jobs">
          Zugang zu Fachkräften, Partnern und möglichen Aufträgen.
        </DashboardCard>
      </section>
    </>
  );
}
