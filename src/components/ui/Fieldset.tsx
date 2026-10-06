import type { ReactNode } from 'react';

interface FieldsetProps {
  legend: string;
  description?: string;
  children: ReactNode;
}

export function Fieldset({ legend, description, children }: FieldsetProps) {
  return (
    <fieldset
      className="
        squircle
        border border-white/50 bg-white/60 p-5 sm:p-6
        backdrop-blur-xl
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.7)]
        transition-all duration-300 ease-out
        hover:-translate-y-0.5
        hover:bg-white/70
        hover:shadow-[0_16px_32px_-16px_rgba(15,23,42,0.25),0_10px_20px_-12px_rgba(15,23,42,0.15)]
      "
    >
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-900">{legend}</h3>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}