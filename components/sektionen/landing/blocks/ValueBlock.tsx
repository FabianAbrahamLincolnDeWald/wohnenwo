"use client";

export default function ValueBlock({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-4xl font-semibold tracking-tight">
          {title}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-slate-600">
          {text}
        </p>
      </div>
    </section>
  );
}
