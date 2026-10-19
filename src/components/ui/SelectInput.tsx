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
        className={`w-full rounded-xl border bg-white/70 px-3 py-2 text-sm text-capitec-navy shadow-sm outline-none backdrop-blur transition
          disabled:bg-capitec-gray
          ${
            hasError
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-capitec-gray focus:border-capitec-green focus:ring-2 focus:ring-capitec-green-light'
          }
          ${className}`}
      >
        {children}
      </select>
    );
  },
);
SelectInput.displayName = 'SelectInput';