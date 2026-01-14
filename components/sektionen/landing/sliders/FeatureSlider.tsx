"use client";

import MobileFullBleedSnapSlider from "@/components/slider/MobileFullBleedSnapSlider";
import FeatureCard from "./FeatureCard";

export default function FeatureSlider({
  items,
}: {
  items: Array<{
    title: string;
    subtitle: React.ReactNode;
    onOpen: () => void;
  }>;
}) {
  return (
    <MobileFullBleedSnapSlider>
      {items.map((item, i) => (
        <FeatureCard
          key={i}
          title={item.title}
          subtitle={item.subtitle}
          onOpen={item.onOpen}
        />
      ))}
    </MobileFullBleedSnapSlider>
  );
}
