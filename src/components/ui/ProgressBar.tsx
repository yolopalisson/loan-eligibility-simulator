interface ProgressBarProps {
  value: number;
  tone?: 'success' | 'warning' | 'danger' | 'info';
  label?: string;
}

const toneClasses = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-indigo-500',
};

export function ProgressBar({ value, tone = 'info', label }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-2 w-full overflow-hidden rounded-full bg-slate-200/70"
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${toneClasses[tone]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}