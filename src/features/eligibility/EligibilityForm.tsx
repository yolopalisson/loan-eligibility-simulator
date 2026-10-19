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
import { buildEligibilitySchema } from '../../lib/validation';
import type { EligibilityRequest, LoanProduct, ValidationRules } from '../../types/loans';

interface EligibilityFormProps {
  products: LoanProduct[];
  rules: ValidationRules;
  selectedProductId: string;
  onProductChange: (id: string) => void;
  onSubmit: (values: EligibilityRequest) => void;
  isSubmitting?: boolean;
}

export function EligibilityForm({
  products,
  rules,
  selectedProductId,
  onProductChange,
  onSubmit,
  isSubmitting,
}: EligibilityFormProps) {
  const schema = useMemo(() => buildEligibilitySchema(rules), [rules]);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EligibilityRequest>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  useEffect(() => {
    const product = products.find(p => p.id === selectedProductId);
    
    // Update the form values when product changes
    reset({
      productId: selectedProductId,
      personalInfo: { age: 35, employmentStatus: 'employed', employmentDuration: 24 },
      financialInfo: { monthlyIncome: 25000, monthlyExpenses: 15000, existingDebt: 5000 },
      loanDetails: {
        requestedAmount: product ? Math.floor((product.minAmount + product.maxAmount) / 2) : 150000,
        loanTerm: product ? Math.floor((product.minTerm + product.maxTerm) / 2) : 24,
        loanPurpose: product?.purposes[0] || 'other',
      },
    });
  }, [selectedProductId, products, reset]);

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
      errorSummaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      errorSummaryRef.current.focus();
    }
  }, [errors]);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      {/* HIDDEN INPUT TO REGISTER PRODUCT ID FOR ZOD */}
      <input type="hidden" {...register('productId')} value={selectedProductId} />

      <div ref={errorSummaryRef} tabIndex={-1} className="outline-none">
        <FormErrorSummary errors={flattenedErrors} />
      </div>

      <Fieldset legend="Select your product" description="Choose the credit product that best suits your needs.">
        <div className="sm:col-span-2">
          <SelectInput
            value={selectedProductId}
            onChange={(e) => {
              onProductChange(e.target.value);
              setValue('productId', e.target.value); // Sync with RHF
            }}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </SelectInput>
          {selectedProduct && (
            <p className="mt-2 text-sm text-capitec-navy-light">{selectedProduct.description}</p>
          )}
        </div>
      </Fieldset>

      <Fieldset legend="Personal information">
        <FormField label="Age" htmlFor="age" required error={errors.personalInfo?.age?.message}>
          <TextInput id="age" type="number" hasError={!!errors.personalInfo?.age} {...register('personalInfo.age', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Employment status" htmlFor="employmentStatus" required error={errors.personalInfo?.employmentStatus?.message}>
          <SelectInput id="employmentStatus" hasError={!!errors.personalInfo?.employmentStatus} {...register('personalInfo.employmentStatus')}>
            <option value="">Select status</option>
            {rules.personalInfo.employmentStatus.options?.map((option) => (
              <option key={option} value={option}>{titleCase(option)}</option>
            ))}
          </SelectInput>
        </FormField>
        <FormField label="Employment duration (months)" htmlFor="employmentDuration" required error={errors.personalInfo?.employmentDuration?.message}>
          <TextInput id="employmentDuration" type="number" hasError={!!errors.personalInfo?.employmentDuration} {...register('personalInfo.employmentDuration', { valueAsNumber: true })} />
        </FormField>
      </Fieldset>

      <Fieldset legend="Financial information">
        <FormField label="Monthly income (R)" htmlFor="monthlyIncome" required error={errors.financialInfo?.monthlyIncome?.message}>
          <TextInput id="monthlyIncome" type="number" step="0.01" hasError={!!errors.financialInfo?.monthlyIncome} {...register('financialInfo.monthlyIncome', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Monthly expenses (R)" htmlFor="monthlyExpenses" required error={errors.financialInfo?.monthlyExpenses?.message}>
          <TextInput id="monthlyExpenses" type="number" step="0.01" hasError={!!errors.financialInfo?.monthlyExpenses} {...register('financialInfo.monthlyExpenses', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Existing debt (R)" htmlFor="existingDebt" error={errors.financialInfo?.existingDebt?.message}>
          <TextInput id="existingDebt" type="number" step="0.01" hasError={!!errors.financialInfo?.existingDebt} {...register('financialInfo.existingDebt', { valueAsNumber: true })} />
        </FormField>

        <div className="sm:col-span-2 rounded-xl border border-capitec-green-light bg-capitec-green-light/50 p-4">
          <p className="text-sm font-semibold text-capitec-navy">Credit check notice</p>
          <p className="mt-1 text-sm text-capitec-navy-light">
            Your credit score will be securely queried from one or more credit bureaus when you submit your application. This will not affect your score.
          </p>
        </div>
      </Fieldset>

      <Fieldset legend="Loan details">
        <FormField label="Requested amount (R)" htmlFor="requestedAmount" required error={errors.loanDetails?.requestedAmount?.message} hint={`Min: R${rules.loanDetails.requestedAmount.min} | Max: R${rules.loanDetails.requestedAmount.max}`}>
          <TextInput id="requestedAmount" type="number" step="0.01" hasError={!!errors.loanDetails?.requestedAmount} {...register('loanDetails.requestedAmount', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Loan term (months)" htmlFor="loanTerm" required error={errors.loanDetails?.loanTerm?.message} hint={`Min: ${rules.loanDetails.loanTerm.min} | Max: ${rules.loanDetails.loanTerm.max}`}>
          <TextInput id="loanTerm" type="number" hasError={!!errors.loanDetails?.loanTerm} {...register('loanDetails.loanTerm', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Loan purpose" htmlFor="loanPurpose" required error={errors.loanDetails?.loanPurpose?.message}>
          <SelectInput id="loanPurpose" hasError={!!errors.loanDetails?.loanPurpose} {...register('loanDetails.loanPurpose')}>
            <option value="">Select purpose</option>
            {selectedProduct?.purposes.map((purpose) => (
              <option key={purpose} value={purpose}>{titleCase(purpose)}</option>
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