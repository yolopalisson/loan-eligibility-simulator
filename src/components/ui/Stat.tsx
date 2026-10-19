interface StatProps {
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'positive' | 'negative';
}

export function Stat({ label, value, hint, tone = 'default' }: StatProps) {
  const valueColor =
    tone === 'positive'
      ? 'text-capitec-green'
      : tone === 'negative'
        ? 'text-red-600'
        : 'text-capitec-navy';

  return (
    <div className="rounded-xl bg-capitec-gray/50 p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-capitec-navy-light">
        {label}
      </dt>
      <dd className={`mt-1 text-lg font-semibold ${valueColor}`}>{value}</dd>
      {hint && <p className="mt-0.5 text-xs text-capitec-navy-light">{hint}</p>}
    </div>
  );
}