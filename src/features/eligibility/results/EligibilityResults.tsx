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
      <EligibilitySummary result={eligibility.eligibilityResult} />
      <RecommendedLoan loan={eligibility.recommendedLoan} />
      <AffordabilityAnalysis analysis={eligibility.affordabilityAnalysis} />
      {rate?.paymentSchedule && (
        <PaymentSchedule schedule={rate.paymentSchedule} />
      )}
    </div>
  );
}