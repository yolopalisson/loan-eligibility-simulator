import { Card } from '../../../components/ui/Card';
import { Stat } from '../../../components/ui/Stat';
import { formatCurrency, formatPercent } from '../../../lib/format';
import type { EligibilityResponse } from '../../../types/loans';

interface Props {
  loan: EligibilityResponse['recommendedLoan'];
}

export function RecommendedLoan({ loan }: Props) {
  return (
    <Card
      title="Indicative Offer"
      description="Based on your inputs, this is the estimate we would provide."
    >
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Stat label="Estimated Amount" value={formatCurrency(loan.recommendedAmount)} />
        <Stat label="Maximum Eligible" value={formatCurrency(loan.maxAmount)} />
        <Stat label="Indicative Interest Rate" value={formatPercent(loan.interestRate, 2)} />
        <Stat label="Estimated Monthly Repayment" value={formatCurrency(loan.monthlyPayment)} />
        <Stat
          label="Estimated Total Repayment"
          value={formatCurrency(loan.totalRepayment)}
          hint="Principal + interest over the term"
        />
        <Stat
          label="Estimated Total Interest"
          value={formatCurrency(loan.totalRepayment - loan.recommendedAmount)}
        />
      </dl>
    </Card>
  );
}