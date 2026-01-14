"use client";

export default function SliderSectionShell({
  eyebrow,
  title,
  intro,
  children,
  maxWidth = "max-w-6xl",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <section className="bg-white py-24">
      <div className={`mx-auto ${maxWidth} px-6`}>
        {eyebrow && (
          <p className="text-sm font-medium text-slate-500 mb-3">
            {eyebrow}
          </p>
        )}

        <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
          {title}
        </h2>

        {intro && (
          <p className="mt-4 max-w-2xl text-lg text-slate-600 leading-relaxed">
            {intro}
          </p>
        )}
      </div>

      <div className="mt-16">{children}</div>
    </section>
  );
}
