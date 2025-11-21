type DashboardCardProps = {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
};

export function DashboardCard({ eyebrow, title, children }: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.15em] text-slate-400 mb-1">
          {eyebrow}
        </p>
      )}
      <h2 className="text-sm font-semibold text-slate-900 mb-1">{title}</h2>
      {children && (
        <div className="text-xs text-slate-500 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}
