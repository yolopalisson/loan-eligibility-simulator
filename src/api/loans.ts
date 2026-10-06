import type {
  EligibilityRequest,
  EligibilityResponse,
  LoanProduct,
  RateRequest,
  RateResponse,
  ValidationRules,
} from '../types/loans';

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message ?? 'Something went wrong');
  }

  return response.json() as Promise<T>;
}

export function getLoanProducts(): Promise<{ products: LoanProduct[] }> {
  return request('/api/loans/products');
}

export function getValidationRules(): Promise<ValidationRules> {
  return request('/api/loans/validation-rules');
}

export function checkEligibility(
  payload: EligibilityRequest,
): Promise<EligibilityResponse> {
  return request('/api/loans/eligibility', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function calculateLoanRate(payload: RateRequest): Promise<RateResponse> {
  return request('/api/loans/calculate-rate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}