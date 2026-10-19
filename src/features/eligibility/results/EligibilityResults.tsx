import type { EligibilityResponse, RateResponse } from '../../../types/loans';
import { AffordabilityAnalysis } from './AffordabilityAnalysis';
import { EligibilitySummary } from './EligibilitySummary';
import { PaymentSchedule } from './PaymentSchedule';
import { RecommendedLoan } from './RecommendedLoan';

interface Props {
  eligibility: EligibilityResponse;
  rate?: RateResponse;
}

export function EligibilityResults({ eligibility, rate }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Indicative Disclaimer */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <strong>Important:</strong> The results below are an <strong>indicative estimate</strong> only. Your final offer is subject to a full credit and affordability assessment.
      </div>

      <EligibilitySummary result={eligibility.eligibilityResult} />
      <RecommendedLoan loan={eligibility.recommendedLoan} />
      <AffordabilityAnalysis analysis={eligibility.affordabilityAnalysis} />
      {rate?.paymentSchedule && (
        <PaymentSchedule schedule={rate.paymentSchedule} />
      )}
    </div>
  );
}