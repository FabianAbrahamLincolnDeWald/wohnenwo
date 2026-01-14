import WohnenWoOrbitNavbar from "@/components/navigation/WohnenWoOrbitNavbar";
import TransformHero from "@/components/sektionen/landing/hero/TransformHero";
import Sektor02_FeatureSlider from "@/components/sektionen/landing/sections/Sektor02_FeatureSlider";
import Sektor03_RessourcenSection from "@/components/sektionen/landing/sections/Sektor03_RessourcenSection";
import Sektor04_DesignDifferenceSection from "@/components/sektionen/landing/sections/Sektor04_DesignDifferenceSection";

export default function HomePage() {
  return (
    <main className="relative bg-white text-slate-900 antialiased">
      <WohnenWoOrbitNavbar />

      <TransformHero
        title={<>Willkommen in einer neuen Ära wirtschaftlicher Zusammenarbeit</>}
        description={
          <>
            Hier trifft Gestaltung auf Handwerk, und Unternehmer auf Kunde, um
            gemeinsam zu handeln und zu wirken – ehrlich, offen, menschlich und
            sinnstiftend.
          </>
        }
      />

      <Sektor02_FeatureSlider />
      <Sektor03_RessourcenSection />
      <Sektor04_DesignDifferenceSection />

    </main>
  );
}
