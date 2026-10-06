import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function Card({
  title,
  description,
  actions,
  children,
  className = '',
  interactive = true,
}: CardProps) {
  const base = [
    'squircle border border-white/50 bg-white/60 p-5 sm:p-6',
    'backdrop-blur-xl',
    'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.7)]',
  ];

  const interactiveClasses = interactive
    ? [
        'transition-all duration-300 ease-out',
        'hover:-translate-y-0.5',
        'hover:bg-white/70',
        'hover:shadow-[0_16px_32px_-16px_rgba(15,23,42,0.25),0_10px_20px_-12px_rgba(15,23,42,0.15)]',
      ]
    : [];

  return (
    <section className={[...base, ...interactiveClasses, className].join(' ')}>
      {(title || actions) && (
        <header className="mb-5 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}