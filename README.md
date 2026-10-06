# Loan Eligibility Simulator

A responsive React + TypeScript app that simulates a bank-style loan eligibility
check. Users input their personal, financial, and loan details, and receive an
estimated eligibility outcome, recommended loan terms, affordability analysis,
and a month-by-month payment schedule.

Built for the Capitec Bank "Software Engineer: UX Developer" brief.

## Stack

- **React 18 + TypeScript + Vite** — fast dev server and modern build
- **Tailwind CSS** — responsive design system
- **React Hook Form + Zod** — performant forms with schema validation driven by the API
- **TanStack Query** — server state, caching, loading and error states
- **MSW (Mock Service Worker)** — mocks the four spec endpoints in dev and tests
- **Vitest + React Testing Library** — unit and integration tests
- **Docker + Nginx** — production container

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:5173>.

The app runs entirely client-side. All API endpoints are mocked with MSW
according to `LoanEligibilitySimulatorEndpoints.md`.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run Vitest once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Lint the source |

## API contract

The app consumes four endpoints defined in the spec:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/loans/products` | Available loan products |
| `GET` | `/api/loans/validation-rules` | Dynamic form validation rules |
| `POST` | `/api/loans/eligibility` | Eligibility decision |
| `POST` | `/api/loans/calculate-rate` | Interest rate + amortisation schedule |

In development, these are handled by `src/api/mock/handlers.ts`. In tests,
`src/api/mock/server.ts` intercepts the same routes for integration tests.

Swapping to a real backend is a one-file change: update `src/api/loans.ts` to
point at the real base URL. The hook and component layers do not need to change.

## Project structure

```
src/
  api/
    loans.ts                 API client
    mock/
      browser.ts             MSW worker for the browser
      server.ts              MSW server for tests
      handlers.ts            Endpoint handlers
      data.ts                Products + validation rules
  components/
    ui/                      Reusable UI primitives
    ErrorBoundary.tsx
  features/
    eligibility/
      EligibilityForm.tsx
      useEligibility.ts
      results/
        EligibilitySummary.tsx
        RecommendedLoan.tsx
        AffordabilityAnalysis.tsx
        PaymentSchedule.tsx
        EligibilityResults.tsx
        ResultsSkeleton.tsx
        EmptyResults.tsx
  lib/
    calculations.ts          Eligibility + amortisation engine
    format.ts                Currency / percent / title-case helpers
    validation.ts            Zod schema built from API rules
  types/
    loans.ts                 Domain types
  App.tsx
  main.tsx
```

## Design decisions

### Validation driven by the API

The form schema is not hardcoded. `buildEligibilitySchema()` in
`src/lib/validation.ts` constructs a Zod schema from the `validation-rules`
response. If Capitec changes the min/max ranges on the backend, the UI adapts
with no code changes.

### Calculation assumptions

The API spec's example response is internally inconsistent in a few places.
The values we ship are derived from these documented assumptions:

- `disposableIncome` = `monthlyIncome - monthlyExpenses` (existing debt is
  reported separately through the DTI ratio).
- `debtToIncomeRatio` = `existingDebt / monthlyIncome * 100`.
- `loanToIncomeRatio` = `maxAmount / (monthlyIncome * 12) * 100`.
- `maxAmount` = `60% of annual income`, capped at `R300,000`.
- Interest rate bands are interpolated from the loan product's
  `interestRateRange` based on the applicant's credit score.

All of these live in `src/lib/calculations.ts` and are covered by unit tests.

### Accessibility

- Skip-to-content link
- Form error summary with `role="alert"` and programmatic focus on failure
- `aria-busy` on the results region while requests are in flight
- `aria-live="polite"` so assistive tech announces new results
- Respects `prefers-reduced-motion`

### Responsive design

- Form and results sit side by side on large screens; the results column
  sticks to the top while the form scrolls.
- On mobile, the layout stacks and results scroll into view after submission.
- The amortisation schedule renders as a table on desktop and as cards on
  small screens.

## Testing

```bash
npm run test:run
```

Coverage includes:

- **Unit** — amortisation, interest bands, eligibility logic, DTI/LTI.
- **Component** — form validation, error summary, successful submission.
- **Integration** — full submit flow with MSW, ending in rendered results.

## Docker

Build:

```bash
docker build -t loan-eligibility-simulator .
```

Run:

```bash
docker run -p 8080:80 loan-eligibility-simulator
```

Open <http://localhost:8080>.

The container serves the production build through Nginx with SPA fallback,
gzip, cache headers for hashed assets, and basic security headers.

## Assumptions & limitations

- No real backend; MSW provides deterministic mock data.
- Eligibility is a simulation, not a credit decision.
- Credit score is optional; when omitted, an average band is used.
- Currency is ZAR and locale is en-ZA throughout.