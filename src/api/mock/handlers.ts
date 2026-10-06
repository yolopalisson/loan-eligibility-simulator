import { http, HttpResponse } from 'msw';
import { calculateEligibility, calculateRate } from '../../lib/calculations';
import type { EligibilityRequest } from '../../types/loans';
import { loanProducts, validationRules } from './data';

const API_BASE = '/api';

export const handlers = [
  http.get(`${API_BASE}/loans/products`, () => {
    return HttpResponse.json({ products: loanProducts });
  }),

  http.get(`${API_BASE}/loans/validation-rules`, () => {
    return HttpResponse.json(validationRules);
  }),

  http.post(`${API_BASE}/loans/eligibility`, async ({ request }) => {
    const body = (await request.json()) as EligibilityRequest;

    if (!body?.personalInfo || !body?.financialInfo || !body?.loanDetails) {
      return HttpResponse.json(
        { message: 'Invalid eligibility request payload' },
        { status: 400 },
      );
    }

    const result = calculateEligibility(body);
    return HttpResponse.json(result);
  }),

  http.post(`${API_BASE}/loans/calculate-rate`, async ({ request }) => {
    const body = (await request.json()) as {
      loanAmount: number;
      loanTerm: number;
      creditScore: number;
      loanType: 'personal_loan' | 'vehicle_loan';
    };

    if (
      typeof body?.loanAmount !== 'number' ||
      typeof body?.loanTerm !== 'number' ||
      typeof body?.creditScore !== 'number' ||
      !body?.loanType
    ) {
      return HttpResponse.json(
        { message: 'Invalid rate calculation payload' },
        { status: 400 },
      );
    }

    const result = calculateRate(body);
    return HttpResponse.json(result);
  }),
];