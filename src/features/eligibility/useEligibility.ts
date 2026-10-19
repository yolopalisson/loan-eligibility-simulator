import { useMutation, useQuery } from '@tanstack/react-query';
import {
  calculateLoanRate,
  checkEligibility,
  getLoanProducts,
  getProductValidationRules,
} from '../../api/loans';
import type {
  EligibilityRequest,
  EligibilityResponse,
  RateRequest,
} from '../../types/loans';

export function useLoanProducts() {
  return useQuery({
    queryKey: ['loan-products'],
    queryFn: getLoanProducts,
    staleTime: Infinity,
  });
}

export function useProductRules(productId?: string) {
  return useQuery({
    queryKey: ['validation-rules', productId],
    queryFn: () => getProductValidationRules(productId!),
    enabled: !!productId,
    staleTime: Infinity,
  });
}

export function useCheckEligibility(options?: {
  onSuccess?: (data: EligibilityResponse) => void;
}) {
  return useMutation({
    mutationFn: (payload: EligibilityRequest) => checkEligibility(payload),
    onSuccess: options?.onSuccess,
  });
}

export function useCalculateRate() {
  return useMutation({
    mutationFn: (payload: RateRequest) => calculateLoanRate(payload),
  });
}