interface StatProps {
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'positive' | 'negative';
}

export function Stat({ label, value, hint, tone = 'default' }: StatProps) {
  const valueColor =
    tone === 'positive'
      ? 'text-emerald-600'
      : tone === 'negative'
        ? 'text-red-600'
        : 'text-slate-900';

  return (
    <div className="rounded-xl bg-white/50 p-4 backdrop-blur">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className={`mt-1 text-lg font-semibold ${valueColor}`}>{value}</dd>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}