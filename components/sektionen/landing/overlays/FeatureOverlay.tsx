"use client";

import { OverlayModal } from "@/components/overlay";

export default function FeatureOverlay({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: {
    title: string;
    headline: string;
    paras: Array<string | React.ReactNode>;
    link?: { href: string; label: string };
    card?: any;
  };
}) {
  return (
    <OverlayModal
      open={open}
      onClose={onClose}
      title={data.title}
      headline={data.headline}
    >
      {data.paras}
    </OverlayModal>
  );
}
