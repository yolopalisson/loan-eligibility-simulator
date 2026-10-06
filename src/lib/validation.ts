import { z } from 'zod';
import type { ValidationRules } from '../types/loans';

export function buildEligibilitySchema(rules: ValidationRules) {
  const { personalInfo, financialInfo, loanDetails } = rules;

  return z.object({
    personalInfo: z.object({
      age: z
        .number({ invalid_type_error: personalInfo.age.errorMessage })
        .min(personalInfo.age.min ?? 0, personalInfo.age.errorMessage)
        .max(personalInfo.age.max ?? 150, personalInfo.age.errorMessage),

      employmentStatus: z.enum(
        (personalInfo.employmentStatus.options ?? []) as [
          string,
          ...string[],
        ],
        { errorMap: () => ({ message: personalInfo.employmentStatus.errorMessage }) },
      ),

      employmentDuration: z
        .number({ invalid_type_error: personalInfo.employmentDuration.errorMessage })
        .min(
          personalInfo.employmentDuration.min ?? 0,
          personalInfo.employmentDuration.errorMessage,
        ),
    }),

    financialInfo: z.object({
      monthlyIncome: z
        .number({ invalid_type_error: financialInfo.monthlyIncome.errorMessage })
        .min(
          financialInfo.monthlyIncome.min ?? 0,
          financialInfo.monthlyIncome.errorMessage,
        ),

      monthlyExpenses: z
        .number({ invalid_type_error: financialInfo.monthlyExpenses.errorMessage })
        .min(
          financialInfo.monthlyExpenses.min ?? 0,
          financialInfo.monthlyExpenses.errorMessage,
        ),

      existingDebt: z.number().min(0, 'Existing debt cannot be negative'),

      creditScore: z
        .number()
        .min(
          financialInfo.creditScore.min ?? 300,
          financialInfo.creditScore.errorMessage,
        )
        .max(
          financialInfo.creditScore.max ?? 850,
          financialInfo.creditScore.errorMessage,
        )
        .optional()
        .or(z.literal(0)),
    }),

    loanDetails: z.object({
      requestedAmount: z
        .number({ invalid_type_error: loanDetails.requestedAmount.errorMessage })
        .min(
          loanDetails.requestedAmount.min ?? 0,
          loanDetails.requestedAmount.errorMessage,
        )
        .max(
          loanDetails.requestedAmount.max ?? Number.MAX_SAFE_INTEGER,
          loanDetails.requestedAmount.errorMessage,
        ),

      loanTerm: z
        .number({ invalid_type_error: loanDetails.loanTerm.errorMessage })
        .min(loanDetails.loanTerm.min ?? 0, loanDetails.loanTerm.errorMessage)
        .max(loanDetails.loanTerm.max ?? 120, loanDetails.loanTerm.errorMessage),

      loanPurpose: z.string().min(1, 'Please select a loan purpose'),
    }),
  });
}

export type EligibilityFormValues = z.infer<
  ReturnType<typeof buildEligibilitySchema>
>;