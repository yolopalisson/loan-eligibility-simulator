import { Card } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';

export function ResultsSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-hidden="true">
      <Card>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </Card>
      <Card title="Recommended loan">
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </Card>
      <Card title="Affordability analysis">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-3 h-2 w-full" />
        <Skeleton className="mt-3 h-2 w-2/3" />
      </Card>
    </div>
  );
}