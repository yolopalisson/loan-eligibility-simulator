export type EmploymentStatus =
  | 'employed'
  | 'self_employed'
  | 'unemployed'
  | 'retired';

export type LoanPurpose =
  | 'debt_consolidation'
  | 'home_improvement'
  | 'education'
  | 'medical'
  | 'other'
  | 'new_vehicle'
  | 'used_vehicle';

export type RiskCategory = 'low' | 'medium' | 'high';
export type AffordabilityScore = 'excellent' | 'good' | 'fair' | 'poor';

export interface PersonalInfo {
  age: number;
  employmentStatus: EmploymentStatus;
  employmentDuration: number;
}

export interface FinancialInfo {
  monthlyIncome: number;
  monthlyExpenses: number;
  existingDebt: number;
  creditScore?: number;
}

export interface LoanDetails {
  requestedAmount: number;
  loanTerm: number;
  loanPurpose: LoanPurpose;
}

export interface EligibilityRequest {
  personalInfo: PersonalInfo;
  financialInfo: FinancialInfo;
  loanDetails: LoanDetails;
}

export interface EligibilityResponse {
  eligibilityResult: {
    isEligible: boolean;
    approvalLikelihood: number;
    riskCategory: RiskCategory;
    decisionReason: string;
  };
  recommendedLoan: {
    maxAmount: number;
    recommendedAmount: number;
    interestRate: number;
    monthlyPayment: number;
    totalRepayment: number;
  };
  affordabilityAnalysis: {
    disposableIncome: number;
    debtToIncomeRatio: number;
    loanToIncomeRatio: number;
    affordabilityScore: AffordabilityScore;
  };
}

export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  interestRateRange: { min: number; max: number };
  purposes: LoanPurpose[];
}

export interface RateRequest {
  loanAmount: number;
  loanTerm: number;
  creditScore: number;
  loanType: 'personal_loan' | 'vehicle_loan';
}

export interface PaymentScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface RateResponse {
  interestRate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  paymentSchedule: PaymentScheduleItem[];
}

export interface ValidationRule {
  min?: number;
  max?: number;
  required: boolean;
  errorMessage: string;
  options?: string[];
}

export interface ValidationRules {
  personalInfo: {
    age: ValidationRule;
    employmentStatus: ValidationRule;
    employmentDuration: ValidationRule;
  };
  financialInfo: {
    monthlyIncome: ValidationRule;
    monthlyExpenses: ValidationRule;
    creditScore: ValidationRule;
  };
  loanDetails: {
    requestedAmount: ValidationRule;
    loanTerm: ValidationRule;
  };
}