# Capitec Loan Eligibility Simulator

A responsive, production-grade loan simulation tool built for the Capitec Bank UX Developer Assessment. 

This application allows customers to explore credit options, calculate indicative repayments, and check their eligibility without affecting their credit score. It features a dynamic, rules-based form, an authentic visual identity aligned with Capitec's brand guidelines, and a fully mocked backend that simulates real-world credit bureau checks.

## Tech Stack

- **React 18 + TypeScript + Vite** — Fast, modern build tooling.
- **Tailwind CSS v4** — Brand tokens configured directly in `index.css` via the `@theme` directive.
- **React Hook Form + Zod** — Performant forms with schema validation dynamically generated from the API.
- **TanStack Query** — Server state management, caching, and error handling.
- **MSW (Mock Service Worker)** — Intercepts real network requests at the browser level. The same mocks power local development, deployment, and automated testing.
- **Vitest + React Testing Library** — Unit, component, and integration testing.

## Key Features

- **Dynamic Credit Product Tiers:** The form adapts its validation rules based on the selected credit tier (Short-Term Unsecured, Unsecured Credit, or Secured Credit).
- **Compliance-First Data Flow:** Customers **cannot** input their own credit score. The mock API simulates a bureau check at the time of submission.
- **Indicative Estimation:** No results are binding. All results are labeled as "Indicative" or "Estimated," accompanied by a prominent legal disclaimer.
- **Capitec Brand Identity:** Strict adherence to the Capitec color palette (`#00A651` Green, `#002B49` Navy), Inter typography, and modern UI elements like frosted-glass and squircle corners.
- **Fully Accessible:** WCAG AA contrast ratios, full keyboard navigation, focus management on error, and `aria-live` regions for screen readers.

## Architecture & Design Decisions

- **API-Driven Validation:** The frontend fetches rules from `/api/loans/validation-rules/:productId`. If Capitec updates the minimum age or maximum term for a product, the UI adapts instantly without a code deployment.
- **Simulated Bureau Check:** The mock API handler (`src/api/mock/handlers.ts`) simulates a credit bureau query, returning a realistic score and injecting it into the backend calculation engine.
- **Backend-Ready:** Swapping to a real Capitec backend is a one-line change in `src/api/loans.ts`. The UI and state layers do not need to be rewritten.

## Getting Started

```bash
# Clone the repository
git clone <your-repo-url>
cd loan-eligibility-simulator

# Install dependencies
npm install

# Start the development server
npm run dev

Open http://localhost:5173 in your browser. MSW will automatically start and intercept all /api/* requests.

## Testing

npm run test:run

- Coverage includes:

** Unit — amortisation, interest bands, eligibility logic, DTI/LTI.

** Component — form validation, error summary, successful submission, product switching.

** Integration — full submit flow with MSW, ending in rendered indicative results.

## Docker

- Build:

docker build -t loan-eligibility-simulator .

- Run:

docker run -p 8080:80 loan-eligibility-simulator

Open http://localhost:8080.


## Project Structure

src/
├── api/
│   ├── loans.ts               # API client (fetch wrapper)
│   └── mock/
│       ├── handlers.ts        # MSW handlers (includes bureau simulation)
│       ├── data.ts            # Credit products & dynamic validation rules
│       ├── browser.ts         # MSW worker for browser
│       └── server.ts          # MSW server for Vitest
├── components/
│   ├── ui/                    # Reusable design system (Capitec branded)
│   └── ErrorBoundary.tsx      # Global React error handler
├── features/
│   └── eligibility/
│       ├── EligibilityForm.tsx # Product selector, dynamic form
│       ├── useEligibility.ts   # TanStack Query hooks
│       └── results/            # EligibilitySummary, PaymentSchedule, etc.
├── lib/
│   ├── calculations.ts        # Math engine (amortisation, DTI, eligibility)
│   ├── format.ts              # Currency & date formatters
│   └── validation.ts          # Dynamic Zod schema builder
├── types/
│   └── loans.ts               # Domain TypeScript interfaces
├── App.tsx
├── main.tsx
└── index.css                  # Tailwind v4 theme & Capitec brand tokens


## Calculation Assumptions

- The API specification provided in the brief contained a few internal inconsistencies regarding exact output numbers (e.g., specific monthlyPayment rounding).

- To ensure mathematically accurate amortisation, we implemented standard financial formulas and documented the assumptions in the unit tests:

- Disposable Income: monthlyIncome - monthlyExpenses (excluding existing debt, which is factored into the DTI).

- Debt-to-Income (DTI): existingDebt / monthlyIncome * 100.

- Max Eligible Amount: 60% of annual income (capped at R300,000 for unsecured).

## Accessibility

- This project treats accessibility as a non-negotiable requirement:

- Screen Readers: aria-live="polite" announces when results are calculated. Form error summaries use role="alert" and automatically receive focus.

- Keyboard Navigation: A "Skip to main content" link is provided. All buttons, inputs, and interactive cards have visible focus rings using the Capitec brand green.

- Motion: Respects prefers-reduced-motion. Hover animations and smooth scrolling are disabled if the user has this OS setting enabled.

- Contrast: The Capitec Navy (#002B49) on white/light-grey backgrounds passes WCAG AA standards (> 7:1 ratio).
