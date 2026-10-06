import type {
  EligibilityRequest,
  EligibilityResponse,
  PaymentScheduleItem,
  RateResponse,
} from '../types/loans';

const round2 = (value: number) => Math.round(value * 100) / 100;

export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number,
): number {
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    return principal / termMonths;
  }

  const factor = Math.pow(1 + monthlyRate, termMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function generatePaymentSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
): PaymentScheduleItem[] {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termMonths);
  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;

  return Array.from({ length: termMonths }, (_, index) => {
    const month = index + 1;
    const interest = balance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPaid);

    return {
      month,
      payment: round2(monthlyPayment),
      principal: round2(principalPaid),
      interest: round2(interest),
      balance: round2(balance),
    };
  });
}

export function getInterestRate(
  creditScore: number,
  loanType: 'personal_loan' | 'vehicle_loan',
): number {
  if (loanType === 'vehicle_loan') {
    if (creditScore >= 750) return 8.5;
    if (creditScore >= 700) return 10.0;
    if (creditScore >= 650) return 12.0;
    if (creditScore >= 600) return 14.0;
    return 15.0;
  }

  if (creditScore >= 750) return 10.5;
  if (creditScore >= 700) return 11.5;
  if (creditScore >= 650) return 12.5;
  if (creditScore >= 600) return 14.5;
  return 18.5;
}

export function calculateRate(request: {
  loanAmount: number;
  loanTerm: number;
  creditScore: number;
  loanType: 'personal_loan' | 'vehicle_loan';
}): RateResponse {
  const interestRate = getInterestRate(request.creditScore, request.loanType);
  const monthlyPayment = calculateMonthlyPayment(
    request.loanAmount,
    interestRate,
    request.loanTerm,
  );
  const totalRepayment = monthlyPayment * request.loanTerm;
  const totalInterest = totalRepayment - request.loanAmount;

  return {
    interestRate,
    monthlyPayment: round2(monthlyPayment),
    totalInterest: round2(totalInterest),
    totalRepayment: round2(totalRepayment),
    paymentSchedule: generatePaymentSchedule(
      request.loanAmount,
      interestRate,
      request.loanTerm,
    ),
  };
}

export function calculateEligibility(
  request: EligibilityRequest,
): EligibilityResponse {
  const {
    monthlyIncome,
    monthlyExpenses,
    existingDebt,
    creditScore = 650,
  } = request.financialInfo;

  const { requestedAmount, loanTerm } = request.loanDetails;

  const disposableIncome = monthlyIncome - monthlyExpenses;
  const annualIncome = monthlyIncome * 12;
  const debtToIncomeRatio =
    monthlyIncome > 0 ? (existingDebt / monthlyIncome) * 100 : 0;

  // Assumption from the spec example: maxAmount = 60% of annual income, capped at R300k.
  const maxAmount = Math.min(annualIncome * 0.6, 300_000);
  const loanToIncomeRatio =
    annualIncome > 0 ? (maxAmount / annualIncome) * 100 : 0;

  const rateResult = calculateRate({
    loanAmount: requestedAmount,
    loanTerm,
    creditScore,
    loanType: 'personal_loan',
  });

  const isEligible =
    disposableIncome > 0 &&
    debtToIncomeRatio <= 40 &&
    requestedAmount <= maxAmount &&
    creditScore >= 600;

  const approvalLikelihood = Math.min(
    95,
    Math.max(
      10,
      Math.round(
        100 -
          debtToIncomeRatio * 1.5 -
          (requestedAmount / maxAmount) * 20 +
          (creditScore - 600) / 10,
      ),
    ),
  );

  const riskCategory =
    approvalLikelihood >= 75 ? 'low' : approvalLikelihood >= 50 ? 'medium' : 'high';

  const affordabilityScore =
    disposableIncome >= 15_000
      ? 'excellent'
      : disposableIncome >= 8_000
        ? 'good'
        : disposableIncome >= 3_000
          ? 'fair'
          : 'poor';

  return {
    eligibilityResult: {
      isEligible,
      approvalLikelihood,
      riskCategory,
      decisionReason: isEligible
        ? 'Strong income-to-expense ratio and manageable existing debt'
        : 'Requested amount or debt obligations exceed affordability thresholds',
    },
    recommendedLoan: {
      maxAmount: round2(maxAmount),
      recommendedAmount: round2(Math.min(requestedAmount, maxAmount)),
      interestRate: rateResult.interestRate,
      monthlyPayment: rateResult.monthlyPayment,
      totalRepayment: rateResult.totalRepayment,
    },
    affordabilityAnalysis: {
      disposableIncome: round2(disposableIncome),
      debtToIncomeRatio: round2(debtToIncomeRatio),
      loanToIncomeRatio: round2(loanToIncomeRatio),
      affordabilityScore,
    },
  };
}