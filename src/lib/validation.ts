import { z } from 'zod';
import type { ValidationRules } from '../types/loans';

export function buildEligibilitySchema(rules: ValidationRules) {
  const { personalInfo, financialInfo, loanDetails } = rules;

  return z.object({
    productId: z.string().min(1, 'Product is required'),
    personalInfo: z.object({
      age: z.number().min(personalInfo.age.min ?? 0, personalInfo.age.errorMessage).max(personalInfo.age.max ?? 150, personalInfo.age.errorMessage),
      employmentStatus: z.enum((personalInfo.employmentStatus.options ?? []) as [string, ...string[]]),
      employmentDuration: z.number().min(personalInfo.employmentDuration.min ?? 0, personalInfo.employmentDuration.errorMessage),
    }),
    financialInfo: z.object({
      monthlyIncome: z.number().min(financialInfo.monthlyIncome.min ?? 0, financialInfo.monthlyIncome.errorMessage),
      monthlyExpenses: z.number().min(financialInfo.monthlyExpenses.min ?? 0, financialInfo.monthlyExpenses.errorMessage),
      existingDebt: z.number().min(0, 'Existing debt cannot be negative'),
      // creditScore removed
    }),
    loanDetails: z.object({
      requestedAmount: z.number().min(loanDetails.requestedAmount.min ?? 0, loanDetails.requestedAmount.errorMessage).max(loanDetails.requestedAmount.max ?? Number.MAX_SAFE_INTEGER, loanDetails.requestedAmount.errorMessage),
      loanTerm: z.number().min(loanDetails.loanTerm.min ?? 0, loanDetails.loanTerm.errorMessage).max(loanDetails.loanTerm.max ?? 120, loanDetails.loanTerm.errorMessage),
      loanPurpose: z.string().min(1, 'Please select a loan purpose'),
    }),
  });
}

export type EligibilityFormValues = z.infer<ReturnType<typeof buildEligibilitySchema>>;