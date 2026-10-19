export type EmploymentStatus = 'employed' | 'self_employed' | 'retired';
export type LoanPurpose = 'emergency' | 'groceries' | 'debt_consolidation' | 'home_improvement' | 'education' | 'medical' | 'other' | 'new_vehicle' | 'used_vehicle';
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
}

export interface LoanDetails {
  requestedAmount: number;
  loanTerm: number;
  loanPurpose: LoanPurpose;
}

// --- INPUT REQUESTS ---

export interface EligibilityRequest {
  productId: string;
  personalInfo: PersonalInfo;
  financialInfo: FinancialInfo;
  loanDetails: LoanDetails;
}

export interface RateRequest {
  loanAmount: number;
  loanTerm: number;
  creditScore: number;
  loanType: 'personal_loan' | 'vehicle_loan';
}

// --- API RESPONSES ---

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

// --- PRODUCTS & VALIDATION ---

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
    existingDebt: ValidationRule;
  };
  loanDetails: {
    requestedAmount: ValidationRule;
    loanTerm: ValidationRule;
  };
}