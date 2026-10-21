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
  if (monthlyRate === 0) return principal / termMonths;
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
    
    // Fix: Apply round2 to the balance to prevent floating point drift
    balance = round2(Math.max(0, balance - principalPaid));

    return {
      month,
      payment: round2(monthlyPayment),
      principal: round2(principalPaid),
      interest: round2(interest),
      balance,
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
  creditScore: number
): EligibilityResponse {
  const { monthlyIncome, monthlyExpenses, existingDebt } = request.financialInfo;
  const { requestedAmount, loanTerm } = request.loanDetails;
  const { productId } = request;

  // 1. Base Calculations
  const disposableIncome = monthlyIncome - monthlyExpenses;
  const annualIncome = monthlyIncome * 12;
  const debtToIncomeRatio = monthlyIncome > 0 ? (existingDebt / monthlyIncome) * 100 : 0;

  // 2. Calculate the new loan's rate and monthly payment
  const rateResult = calculateRate({
    loanAmount: requestedAmount,
    loanTerm,
    creditScore,
    loanType: productId === 'secured' ? 'vehicle_loan' : 'personal_loan',
  });

  // 3. Affordability & Ratios (Fixed per external review)
  const disposableAfterNewLoan = disposableIncome - rateResult.monthlyPayment;
  
  // LTI is now based on the requested amount vs annual income (fixing the hardcoded 60% issue)
  const loanToIncomeRatio = annualIncome > 0 ? (requestedAmount / annualIncome) * 100 : 0;

  // 4. Product-Specific Tier Limits
  let maxAmount = 300_000;
  if (productId === 'short_term') {
    maxAmount = 8_000;
  } else if (productId === 'secured') {
    maxAmount = 1_500_000;
  } else {
    // Unsecured: 60% of annual income, capped at R300k
    maxAmount = Math.min(annualIncome * 0.6, 300_000);
  }

  // 5. Dynamic Eligibility Logic & Decision Reasons
  let isEligible = true;
  let decisionReason = 'Strong income-to-expense ratio and manageable existing debt.';

  if (disposableIncome <= 0) {
    isEligible = false;
    decisionReason = 'Your monthly expenses exceed your monthly income.';
  } else if (debtToIncomeRatio > 40) {
    isEligible = false;
    decisionReason = 'Your existing debt obligations are too high compared to your income.';
  } else if (requestedAmount > maxAmount) {
    isEligible = false;
    decisionReason = `The requested amount exceeds the maximum eligible amount of R${maxAmount.toLocaleString()} for this product.`;
  } else if (disposableAfterNewLoan <= 0) {
    isEligible = false;
    decisionReason = 'You cannot afford the monthly repayment on this new loan based on your disposable income.';
  } else if (creditScore < 600) {
    isEligible = false;
    decisionReason = 'Your credit score does not meet the minimum requirement for this product.';
  }

  // 6. Scoring based on the pass/fail state
  const approvalLikelihood = isEligible 
    ? Math.min(95, Math.max(75, 100 - Math.round(loanToIncomeRatio))) 
    : 10;

  const riskCategory = approvalLikelihood >= 75 ? 'low' : approvalLikelihood >= 50 ? 'medium' : 'high';
  
  // Affordability score is now based on what is left AFTER the new loan
  const affordabilityScore = 
    disposableAfterNewLoan >= 15_000 ? 'excellent'
      : disposableAfterNewLoan >= 8_000 ? 'good'
        : disposableAfterNewLoan >= 3_000 ? 'fair' : 'poor';

  return {
    eligibilityResult: {
      isEligible,
      approvalLikelihood,
      riskCategory,
      decisionReason,
    },
    recommendedLoan: {
      maxAmount: round2(maxAmount),
      recommendedAmount: round2(Math.min(requestedAmount, maxAmount)),
      interestRate: rateResult.interestRate,
      monthlyPayment: rateResult.monthlyPayment,
      totalRepayment: rateResult.totalRepayment,
    },
    affordabilityAnalysis: {
      disposableIncome: round2(disposableIncome), // The raw disposable income before the new loan
      debtToIncomeRatio: round2(debtToIncomeRatio),
      loanToIncomeRatio: round2(loanToIncomeRatio),
      affordabilityScore,
    },
  };
}