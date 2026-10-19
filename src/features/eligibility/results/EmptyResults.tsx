import { Card } from '../../../components/ui/Card';

export function EmptyResults() {
  return (
    <Card className="border-dashed border-capitec-gray">
      <div className="py-6 text-center">
        <p className="text-sm font-medium text-capitec-navy">
          Your results will appear here
        </p>
        <p className="mt-1 text-sm text-capitec-navy-light">
          Fill in the form and select “Check eligibility” to see your indicative estimate.
        </p>
      </div>
    </Card>
  );
}