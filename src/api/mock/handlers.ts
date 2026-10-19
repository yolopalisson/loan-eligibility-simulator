import { http, HttpResponse } from 'msw';
import { calculateEligibility, calculateRate } from '../../lib/calculations';
import type { EligibilityRequest } from '../../types/loans';
import { creditProducts, getRulesForProduct } from './data';

const API_BASE = '/api';

export const handlers = [
  http.get(`${API_BASE}/loans/products`, () => {
    return HttpResponse.json({ products: creditProducts });
  }),

  http.get(`${API_BASE}/loans/validation-rules/:productId`, ({ params }) => {
    const productId = params.productId as string;
    const rules = getRulesForProduct(productId);
    return HttpResponse.json(rules);
  }),

  http.post(`${API_BASE}/loans/eligibility`, async ({ request }) => {
    const body = (await request.json()) as EligibilityRequest;
    
    // Simulate credit bureau query
    const simulatedCreditScore = 650; 

    // FIX: Pass the score as the second argument, not inside financialInfo
    const result = calculateEligibility(body, simulatedCreditScore);
    
    return HttpResponse.json(result);
  }),

  http.post(`${API_BASE}/loans/calculate-rate`, async ({ request }) => {
    const body = (await request.json()) as any;
    
    // Simulate credit bureau query
    const simulatedCreditScore = 650;

    const result = calculateRate({
      ...body,
      creditScore: simulatedCreditScore,
    });
    
    return HttpResponse.json(result);
  }),
];