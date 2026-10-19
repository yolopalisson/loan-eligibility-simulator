import type { LoanProduct, ValidationRules } from '../../types/loans';

export const creditProducts: LoanProduct[] = [
  {
    id: 'short_term',
    name: 'Short-Term Unsecured',
    description: 'Quick access to smaller amounts, repayable within 6 months.',
    minAmount: 500,
    maxAmount: 8000,
    minTerm: 1,
    maxTerm: 6,
    interestRateRange: { min: 15.0, max: 25.0 },
    purposes: ['emergency', 'groceries', 'other'],
  },
  {
    id: 'unsecured',
    name: 'Unsecured Credit',
    description: 'Flexible personal financing without collateral.',
    minAmount: 8001,
    maxAmount: 250000,
    minTerm: 12,
    maxTerm: 84,
    interestRateRange: { min: 10.5, max: 18.5 },
    purposes: ['debt_consolidation', 'home_improvement', 'education', 'medical', 'other'],
  },
  {
    id: 'secured',
    name: 'Secured Credit',
    description: 'Larger amounts backed by an asset (e.g., vehicle).',
    minAmount: 250001,
    maxAmount: 1500000,
    minTerm: 12,
    maxTerm: 84,
    interestRateRange: { min: 8.5, max: 15.0 },
    purposes: ['new_vehicle', 'used_vehicle', 'home_improvement'],
  },
];

export const baseValidationRules: ValidationRules = {
  personalInfo: {
    age: { min: 18, max: 65, required: true, errorMessage: 'Age must be between 18 and 65' },
    employmentStatus: { required: true, options: ['employed', 'self_employed', 'retired'], errorMessage: 'Please select your employment status' },
    employmentDuration: { min: 3, required: true, errorMessage: 'Minimum 3 months employment required' },
  },
  financialInfo: {
    monthlyIncome: { min: 5000, required: true, errorMessage: 'Minimum monthly income of R5,000 required' },
    monthlyExpenses: { min: 0, required: true, errorMessage: 'Please enter your monthly expenses' },
    existingDebt: { min: 0, required: false, errorMessage: 'Existing debt cannot be negative' },
  },
  loanDetails: {
    requestedAmount: { min: 500, max: 1500000, required: true, errorMessage: 'Please enter a valid amount' },
    loanTerm: { min: 1, max: 84, required: true, errorMessage: 'Please enter a valid term' },
  },
};

export function getRulesForProduct(productId: string): ValidationRules {
  const product = creditProducts.find(p => p.id === productId) || creditProducts[1];
  
  return {
    ...baseValidationRules,
    loanDetails: {
      ...baseValidationRules.loanDetails,
      requestedAmount: {
        min: product.minAmount,
        max: product.maxAmount,
        required: true,
        errorMessage: `Amount must be between R${product.minAmount.toLocaleString()} and R${product.maxAmount.toLocaleString()}`
      },
      loanTerm: {
        min: product.minTerm,
        max: product.maxTerm,
        required: true,
        errorMessage: `Term must be between ${product.minTerm} and ${product.maxTerm} months`
      }
    }
  };
}