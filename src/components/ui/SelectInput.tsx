import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ className = '', hasError, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        {...props}
        className={`w-full rounded-xl border bg-white/70 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none backdrop-blur transition
          disabled:bg-slate-50
          ${
            hasError
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
          }
          ${className}`}
      >
        {children}
      </select>
    );
  },
);

SelectInput.displayName = 'SelectInput';