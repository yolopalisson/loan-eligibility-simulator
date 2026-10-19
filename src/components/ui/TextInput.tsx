import { forwardRef, type InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className = '', hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`w-full rounded-xl border bg-white/70 px-3 py-2 text-sm text-capitec-navy shadow-sm outline-none backdrop-blur transition
          placeholder:text-capitec-navy-light/50
          disabled:bg-capitec-gray disabled:text-capitec-navy-light
          ${
            hasError
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-capitec-gray focus:border-capitec-green focus:ring-2 focus:ring-capitec-green-light'
          }
          ${className}`}
      />
    );
  },
);
TextInput.displayName = 'TextInput';