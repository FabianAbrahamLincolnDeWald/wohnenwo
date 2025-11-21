type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="space-y-1 mb-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-slate-500 max-w-xl">{description}</p>
      )}
    </header>
  );
}
