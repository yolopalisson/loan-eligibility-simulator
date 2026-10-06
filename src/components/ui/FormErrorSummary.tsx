interface FormErrorSummaryProps {
  errors: Array<{ field: string; message: string }>;
}

export function FormErrorSummary({ errors }: FormErrorSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-xl border border-red-200 bg-red-50 p-4"
    >
      <h2 className="text-sm font-semibold text-red-800">
        Please fix the following before continuing:
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
        {errors.map((error) => (
          <li key={error.field}>{error.message}</li>
        ))}
      </ul>
    </div>
  );
}