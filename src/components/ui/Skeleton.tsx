interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-capitec-gray/80 ${className}`}
      aria-hidden="true"
    />
  );
}