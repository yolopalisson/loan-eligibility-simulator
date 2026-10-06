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
        className={`w-full rounded-xl border bg-white/70 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none backdrop-blur transition
          placeholder:text-slate-400
          disabled:bg-slate-50 disabled:text-slate-400
          ${
            hasError
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
          }
          ${className}`}
      />
    );
  },
);

TextInput.displayName = 'TextInput';