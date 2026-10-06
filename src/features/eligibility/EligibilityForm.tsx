import { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/Button';
import { Fieldset } from '../../components/ui/Fieldset';
import { FormErrorSummary } from '../../components/ui/FormErrorSummary';
import { FormField } from '../../components/ui/FormField';
import { SelectInput } from '../../components/ui/SelectInput';
import { TextInput } from '../../components/ui/TextInput';
import { titleCase } from '../../lib/format';
import {
  buildEligibilitySchema,
  type EligibilityFormValues,
} from '../../lib/validation';
import type {
  EligibilityRequest,
  LoanProduct,
  ValidationRules,
} from '../../types/loans';

interface EligibilityFormProps {
  rules: ValidationRules;
  products: LoanProduct[];
  onSubmit: (values: EligibilityRequest) => void;
  isSubmitting?: boolean;
}

const DEFAULT_VALUES: Partial<EligibilityFormValues> = {
  personalInfo: {
    age: 35,
    employmentStatus: 'employed',
    employmentDuration: 24,
  },
  financialInfo: {
    monthlyIncome: 25000,
    monthlyExpenses: 15000,
    existingDebt: 5000,
    creditScore: 650,
  },
  loanDetails: {
    requestedAmount: 150000,
    loanTerm: 24,
    loanPurpose: 'home_improvement',
  },
};

export function EligibilityForm({
  rules,
  products,
  onSubmit,
  isSubmitting,
}: EligibilityFormProps) {
  const schema = useMemo(() => buildEligibilitySchema(rules), [rules]);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EligibilityFormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  });

  const availablePurposes = useMemo(() => {
    const all = new Set<string>();
    products.forEach((product) =>
      product.purposes.forEach((purpose) => all.add(purpose)),
    );
    return Array.from(all);
  }, [products]);

  const flattenedErrors = useMemo(() => {
    const list: Array<{ field: string; message: string }> = [];
    const walk = (obj: Record<string, unknown>, path = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        const nextPath = path ? `${path}.${key}` : key;
        if (value && typeof value === 'object' && 'message' in value) {
          const msg = (value as { message?: string }).message;
          if (msg) list.push({ field: nextPath, message: msg });
        } else if (value && typeof value === 'object') {
          walk(value as Record<string, unknown>, nextPath);
        }
      });
    };
    walk(errors as Record<string, unknown>);
    return list;
  }, [errors]);

  useEffect(() => {
    if (Object.keys(errors).length > 0 && errorSummaryRef.current) {
      errorSummaryRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      errorSummaryRef.current.focus();
    }
  }, [errors]);

  const onFormSubmit = (values: EligibilityFormValues) => {
    onSubmit(values as EligibilityRequest);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col gap-6"
      noValidate
    >
      <div ref={errorSummaryRef} tabIndex={-1} className="outline-none">
        <FormErrorSummary errors={flattenedErrors} />
      </div>

      <Fieldset
        legend="Personal information"
        description="Tell us a bit about yourself so we can assess your eligibility."
      >
        <FormField
          label="Age"
          htmlFor="age"
          required={rules.personalInfo.age.required}
          error={errors.personalInfo?.age?.message}
          hint={`Between ${rules.personalInfo.age.min} and ${rules.personalInfo.age.max} years`}
        >
          <TextInput
            id="age"
            type="number"
            inputMode="numeric"
            hasError={!!errors.personalInfo?.age}
            {...register('personalInfo.age', { valueAsNumber: true })}
          />
        </FormField>

        <FormField
          label="Employment status"
          htmlFor="employmentStatus"
          required={rules.personalInfo.employmentStatus.required}
          error={errors.personalInfo?.employmentStatus?.message}
        >
          <SelectInput
            id="employmentStatus"
            hasError={!!errors.personalInfo?.employmentStatus}
            {...register('personalInfo.employmentStatus')}
          >
            <option value="">Select status</option>
            {rules.personalInfo.employmentStatus.options?.map((option) => (
              <option key={option} value={option}>
                {titleCase(option)}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField
          label="Employment duration (months)"
          htmlFor="employmentDuration"
          required={rules.personalInfo.employmentDuration.required}
          error={errors.personalInfo?.employmentDuration?.message}
          hint={`Minimum ${rules.personalInfo.employmentDuration.min} months`}
        >
          <TextInput
            id="employmentDuration"
            type="number"
            inputMode="numeric"
            hasError={!!errors.personalInfo?.employmentDuration}
            {...register('personalInfo.employmentDuration', {
              valueAsNumber: true,
            })}
          />
        </FormField>
      </Fieldset>

      <Fieldset
        legend="Financial information"
        description="Monthly figures in South African Rand (ZAR)."
      >
        <FormField
          label="Monthly income (R)"
          htmlFor="monthlyIncome"
          required={rules.financialInfo.monthlyIncome.required}
          error={errors.financialInfo?.monthlyIncome?.message}
          hint={`Minimum R${rules.financialInfo.monthlyIncome.min?.toLocaleString()}`}
        >
          <TextInput
            id="monthlyIncome"
            type="number"
            step="0.01"
            inputMode="decimal"
            hasError={!!errors.financialInfo?.monthlyIncome}
            {...register('financialInfo.monthlyIncome', {
              valueAsNumber: true,
            })}
          />
        </FormField>

        <FormField
          label="Monthly expenses (R)"
          htmlFor="monthlyExpenses"
          required={rules.financialInfo.monthlyExpenses.required}
          error={errors.financialInfo?.monthlyExpenses?.message}
        >
          <TextInput
            id="monthlyExpenses"
            type="number"
            step="0.01"
            inputMode="decimal"
            hasError={!!errors.financialInfo?.monthlyExpenses}
            {...register('financialInfo.monthlyExpenses', {
              valueAsNumber: true,
            })}
          />
        </FormField>

        <FormField
          label="Existing debt (R)"
          htmlFor="existingDebt"
          error={errors.financialInfo?.existingDebt?.message}
        >
          <TextInput
            id="existingDebt"
            type="number"
            step="0.01"
            inputMode="decimal"
            hasError={!!errors.financialInfo?.existingDebt}
            {...register('financialInfo.existingDebt', {
              valueAsNumber: true,
            })}
          />
        </FormField>

        <FormField
          label="Credit score"
          htmlFor="creditScore"
          error={errors.financialInfo?.creditScore?.message}
          hint={`Optional — between ${rules.financialInfo.creditScore.min} and ${rules.financialInfo.creditScore.max}`}
        >
          <TextInput
            id="creditScore"
            type="number"
            inputMode="numeric"
            hasError={!!errors.financialInfo?.creditScore}
            {...register('financialInfo.creditScore', { valueAsNumber: true })}
          />
        </FormField>
      </Fieldset>

      <Fieldset
        legend="Loan details"
        description="Tell us how much you'd like to borrow and for how long."
      >
        <FormField
          label="Requested amount (R)"
          htmlFor="requestedAmount"
          required={rules.loanDetails.requestedAmount.required}
          error={errors.loanDetails?.requestedAmount?.message}
          hint={`R${rules.loanDetails.requestedAmount.min?.toLocaleString()} – R${rules.loanDetails.requestedAmount.max?.toLocaleString()}`}
        >
          <TextInput
            id="requestedAmount"
            type="number"
            step="0.01"
            inputMode="decimal"
            hasError={!!errors.loanDetails?.requestedAmount}
            {...register('loanDetails.requestedAmount', {
              valueAsNumber: true,
            })}
          />
        </FormField>

        <FormField
          label="Loan term (months)"
          htmlFor="loanTerm"
          required={rules.loanDetails.loanTerm.required}
          error={errors.loanDetails?.loanTerm?.message}
          hint={`Between ${rules.loanDetails.loanTerm.min} and ${rules.loanDetails.loanTerm.max} months`}
        >
          <TextInput
            id="loanTerm"
            type="number"
            inputMode="numeric"
            hasError={!!errors.loanDetails?.loanTerm}
            {...register('loanDetails.loanTerm', { valueAsNumber: true })}
          />
        </FormField>

        <FormField
          label="Loan purpose"
          htmlFor="loanPurpose"
          error={errors.loanDetails?.loanPurpose?.message}
        >
          <SelectInput
            id="loanPurpose"
            hasError={!!errors.loanDetails?.loanPurpose}
            {...register('loanDetails.loanPurpose')}
          >
            <option value="">Select purpose</option>
            {availablePurposes.map((purpose) => (
              <option key={purpose} value={purpose}>
                {titleCase(purpose)}
              </option>
            ))}
          </SelectInput>
        </FormField>
      </Fieldset>

      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:justify-end">
        <Button type="submit" size="lg" isLoading={isSubmitting}>
          Check eligibility
        </Button>
      </div>
    </form>
  );
}