import { Card } from '../../../components/ui/Card';

export function EmptyResults() {
  return (
    <Card className="border-dashed">
      <div className="py-6 text-center">
        <p className="text-sm font-medium text-slate-700">
          Your results will appear here
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Fill in the form and select "Check eligibility" to see your estimate.
        </p>
      </div>
    </Card>
  );
}