import type { EligibilityResponse, RateResponse } from '../../../types/loans';
import { AffordabilityAnalysis } from './AffordabilityAnalysis';
import { EligibilitySummary } from './EligibilitySummary';
import { PaymentSchedule } from './PaymentSchedule';
import { RecommendedLoan } from './RecommendedLoan';
import { Card } from '../../../components/ui/Card';

interface Props {
  eligibility: EligibilityResponse;
  rate?: RateResponse;
}

export function EligibilityResults({ eligibility, rate }: Props) {
  const isEligible = eligibility.eligibilityResult.isEligible;

  return (
    <div className="flex flex-col gap-5">
      {/* Indicative Disclaimer */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <strong>Important:</strong> The results below are an <strong>indicative estimate</strong> only. Your final offer is subject to a full credit and affordability assessment.
      </div>

      {/* Always show the summary and affordability analysis */}
      <EligibilitySummary result={eligibility.eligibilityResult} />
      <AffordabilityAnalysis analysis={eligibility.affordabilityAnalysis} />

      {/* Conditional Rendering based on eligibility */}
      {isEligible ? (
        <>
          <RecommendedLoan loan={eligibility.recommendedLoan} />
          {rate?.paymentSchedule && (
            <PaymentSchedule schedule={rate.paymentSchedule} />
          )}
        </>
      ) : (
        <Card title="How to improve your chances" description="Based on your current financial profile, consider the following steps:">
          <ul className="mt-4 space-y-3 text-sm text-capitec-navy-light">
            <li className="flex items-start gap-2">
              <span className="text-capitec-green font-bold">✓</span>
              <span><strong>Reduce the requested amount.</strong> Try applying for a smaller loan that better aligns with your current income.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-capitec-green font-bold">✓</span>
              <span><strong>Pay off existing debt.</strong> Lowering your monthly debt obligations will improve your Debt-to-Income ratio.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-capitec-green font-bold">✓</span>
              <span><strong>Extend the loan term.</strong> A longer term reduces the monthly repayment amount, making it more affordable.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-capitec-green font-bold">✓</span>
              <span><strong>Increase your income.</strong> If your income increases, your maximum eligible amount will also rise.</span>
            </li>
          </ul>
        </Card>
      )}
    </div>
  );
}