import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import type { EligibilityResponse } from '../../../types/loans';
import { titleCase } from '../../../lib/format';

interface Props {
  result: EligibilityResponse['eligibilityResult'];
}

export function EligibilitySummary({ result }: Props) {
  const { isEligible, approvalLikelihood, riskCategory, decisionReason } = result;

  const riskTone =
    riskCategory === 'low'
      ? 'success'
      : riskCategory === 'medium'
        ? 'warning'
        : 'danger';

  const likelihoodTone =
    approvalLikelihood >= 75
      ? 'success'
      : approvalLikelihood >= 50
        ? 'warning'
        : 'danger';

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={isEligible ? 'success' : 'danger'}>
              {isEligible ? 'Likely eligible' : 'Not eligible'}
            </Badge>
            <Badge tone={riskTone}>{titleCase(riskCategory)} risk</Badge>
          </div>
          <p className="mt-3 text-sm text-slate-600">{decisionReason}</p>
        </div>

        <div className="w-full sm:w-56">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Approval likelihood
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {approvalLikelihood}%
          </p>
          <div className="mt-2">
            <ProgressBar
              value={approvalLikelihood}
              tone={likelihoodTone}
              label="Approval likelihood"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}