import { describe, expect, it } from 'vitest';
import {
  calculateEligibility,
  calculateMonthlyPayment,
  calculateRate,
  generatePaymentSchedule,
  getInterestRate,
} from './calculations';

describe('calculateMonthlyPayment', () => {
  it('matches the amortisation formula for a standard loan', () => {
    const payment = calculateMonthlyPayment(150000, 12.5, 24);
    expect(payment).toBeCloseTo(7089.5, 1);
  });

  it('handles zero interest by dividing principal by term', () => {
    expect(calculateMonthlyPayment(12000, 0, 12)).toBe(1000);
  });
});

describe('generatePaymentSchedule', () => {
  it('produces one row per month', () => {
    const schedule = generatePaymentSchedule(150000, 12.5, 24);
    expect(schedule).toHaveLength(24);
  });

  it('ends at a zero balance', () => {
    const schedule = generatePaymentSchedule(150000, 12.5, 24);
    expect(schedule[schedule.length - 1].balance).toBeCloseTo(0, 0);
  });

  it('starts with interest-dominant payments', () => {
    const schedule = generatePaymentSchedule(150000, 12.5, 24);
    expect(schedule[0].interest).toBeGreaterThan(0);
    expect(schedule[0].principal).toBeGreaterThan(0);
  });
});

describe('getInterestRate', () => {
  it('returns a higher rate for lower credit scores', () => {
    expect(getInterestRate(500, 'personal_loan')).toBeGreaterThan(
      getInterestRate(800, 'personal_loan'),
    );
  });

  it('returns lower rates for vehicle loans at the same score', () => {
    expect(getInterestRate(700, 'vehicle_loan')).toBeLessThan(
      getInterestRate(700, 'personal_loan'),
    );
  });
});

describe('calculateRate', () => {
  it('returns a consistent total repayment', () => {
    const result = calculateRate({
      loanAmount: 150000,
      loanTerm: 24,
      creditScore: 650,
      loanType: 'personal_loan',
    });
    expect(result.totalRepayment).toBeCloseTo(
      result.monthlyPayment * 24,
      0,
    );
    expect(result.totalInterest).toBeCloseTo(
      result.totalRepayment - 150000,
      0,
    );
  });
});

describe('calculateEligibility', () => {
  const baseRequest = {
    personalInfo: {
      age: 35,
      employmentStatus: 'employed' as const,
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
      loanPurpose: 'home_improvement' as const,
    },
  };

  it('marks a strong applicant as eligible', () => {
    const result = calculateEligibility(baseRequest);
    expect(result.eligibilityResult.isEligible).toBe(true);
    expect(result.eligibilityResult.riskCategory).toBe('low');
  });

  it('rejects an applicant with negative disposable income', () => {
    const result = calculateEligibility({
      ...baseRequest,
      financialInfo: { ...baseRequest.financialInfo, monthlyExpenses: 30000 },
    });
    expect(result.eligibilityResult.isEligible).toBe(false);
  });

  it('rejects a request above the maximum eligible amount', () => {
    const result = calculateEligibility({
      ...baseRequest,
      loanDetails: { ...baseRequest.loanDetails, requestedAmount: 400000 },
    });
    expect(result.eligibilityResult.isEligible).toBe(false);
  });
});