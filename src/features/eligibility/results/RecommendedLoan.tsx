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
      title="Recommended loan"
      description="Based on your inputs, this is the offer we'd estimate for you."
    >
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Stat label="Recommended amount" value={formatCurrency(loan.recommendedAmount)} />
        <Stat label="Maximum eligible" value={formatCurrency(loan.maxAmount)} />
        <Stat label="Interest rate" value={formatPercent(loan.interestRate, 2)} />
        <Stat label="Monthly repayment" value={formatCurrency(loan.monthlyPayment)} />
        <Stat
          label="Total repayment"
          value={formatCurrency(loan.totalRepayment)}
          hint="Principal + interest over the term"
        />
        <Stat
          label="Total interest"
          value={formatCurrency(loan.totalRepayment - loan.recommendedAmount)}
        />
      </dl>
    </Card>
  );
}