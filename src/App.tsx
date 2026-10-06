import { useEffect, useRef, useState } from 'react';
import { EligibilityForm } from './features/eligibility/EligibilityForm';
import { EmptyResults } from './features/eligibility/results/EmptyResults';
import { EligibilityResults } from './features/eligibility/results/EligibilityResults';
import { ResultsSkeleton } from './features/eligibility/results/ResultsSkeleton';
import {
  useCalculateRate,
  useCheckEligibility,
  useLoanProducts,
  useValidationRules,
} from './features/eligibility/useEligibility';
import type { EligibilityRequest } from './types/loans';

export default function App() {
  const rules = useValidationRules();
  const products = useLoanProducts();
  const eligibility = useCheckEligibility();
  const rate = useCalculateRate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [lastSubmission, setLastSubmission] = useState<EligibilityRequest | null>(
    null,
  );

  // After eligibility succeeds, fetch the payment schedule using the actual form values
  useEffect(() => {
    if (eligibility.data && lastSubmission) {
      rate.mutate({
        loanAmount: eligibility.data.recommendedLoan.recommendedAmount,
        loanTerm: lastSubmission.loanDetails.loanTerm,
        creditScore: lastSubmission.financialInfo.creditScore ?? 650,
        loanType: 'personal_loan',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eligibility.data, lastSubmission]);

  // On mobile, scroll results into view once they arrive
  useEffect(() => {
    if (eligibility.data && resultsRef.current && window.innerWidth < 1024) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [eligibility.data]);

  if (rules.isLoading || products.isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">Loading simulator…</div>
    );
  }

  if (rules.isError || products.isError) {
    return (
      <div className="p-8 text-center text-red-600">
        Could not load the simulator configuration. Please try again.
      </div>
    );
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg"
      >
        Skip to main content
      </a>

      <main
        id="main-content"
        className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12"
      >
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Loan Eligibility Simulator
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Get an instant estimate of your eligibility and what your monthly
            repayments could look like.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <EligibilityForm
              rules={rules.data!}
              products={products.data!.products}
              isSubmitting={eligibility.isPending}
              onSubmit={(values) => {
                setLastSubmission(values);
                eligibility.mutate(values);
              }}
            />

            {eligibility.isError && (
              <p className="mt-4 text-sm text-red-600">
                {(eligibility.error as Error).message}
              </p>
            )}
          </div>

          <div
            ref={resultsRef}
            aria-busy={eligibility.isPending}
            aria-live="polite"
            className="scroll-mt-4 lg:sticky lg:top-6"
          >
            {eligibility.isPending && <ResultsSkeleton />}

            {!eligibility.isPending && !eligibility.data && <EmptyResults />}

            {eligibility.data && (
              <EligibilityResults
                eligibility={eligibility.data}
                rate={rate.data}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}