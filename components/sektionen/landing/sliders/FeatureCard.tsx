"use client";

export default function FeatureCard({
  title,
  subtitle,
  onOpen,
}: {
  title: string;
  subtitle: React.ReactNode;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="
        w-[280px] md:w-[360px] lg:w-[420px]
        text-left
        rounded-3xl
        bg-slate-100
        p-6
        hover:bg-slate-200/70
        transition
      "
    >
      <h3 className="text-xl font-semibold tracking-tight text-slate-900">
        {title}
      </h3>

      <p className="mt-4 text-slate-600 leading-relaxed">
        {subtitle}
      </p>
    </button>
  );
}
