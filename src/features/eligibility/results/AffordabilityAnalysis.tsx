import { Card } from '../../../components/ui/Card';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { Stat } from '../../../components/ui/Stat';
import { formatCurrency, formatPercent, titleCase } from '../../../lib/format';
import type { EligibilityResponse } from '../../../types/loans';

interface Props {
  analysis: EligibilityResponse['affordabilityAnalysis'];
}

export function AffordabilityAnalysis({ analysis }: Props) {
  const {
    disposableIncome,
    debtToIncomeRatio,
    loanToIncomeRatio,
    affordabilityScore,
  } = analysis;

  const dtiTone =
    debtToIncomeRatio <= 20 ? 'success' : debtToIncomeRatio <= 40 ? 'warning' : 'danger';

  const scoreTone =
    affordabilityScore === 'excellent' || affordabilityScore === 'good'
      ? 'success'
      : affordabilityScore === 'fair'
        ? 'warning'
        : 'danger';

  return (
    <Card
      title="Affordability analysis"
      description="How comfortably your income can support this loan."
    >
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Stat
          label="Disposable income"
          value={formatCurrency(disposableIncome)}
          tone={disposableIncome > 0 ? 'positive' : 'negative'}
          hint="Income minus expenses"
        />
        <Stat
          label="Debt-to-income ratio"
          value={formatPercent(debtToIncomeRatio)}
          tone={dtiTone === 'danger' ? 'negative' : 'default'}
        />
      </dl>

      <div className="mt-5 space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">Debt-to-income</span>
            <span className="text-slate-500">Lender limit 40%</span>
          </div>
          <ProgressBar value={debtToIncomeRatio} tone={dtiTone} label="Debt to income" />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">Loan-to-income</span>
            <span className="text-slate-500">Based on maximum eligible</span>
          </div>
          <ProgressBar value={loanToIncomeRatio} tone="info" label="Loan to income" />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Affordability score
        </p>
        <div className="mt-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${
              scoreTone === 'success'
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                : scoreTone === 'warning'
                  ? 'bg-amber-50 text-amber-700 ring-amber-200'
                  : 'bg-red-50 text-red-700 ring-red-200'
            }`}
          >
            {titleCase(affordabilityScore)}
          </span>
        </div>
      </div>
    </Card>
  );
}