import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../../App';

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

describe('Eligibility flow', () => {
  it('renders results after submitting the form', async () => {
    const user = userEvent.setup();
    renderApp();

    // 1. Wait for the initial API calls (products + dynamic rules) to resolve
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /check eligibility/i }),
      ).toBeInTheDocument(),
    );

    // 2. Submit the form with defaults
    await user.click(screen.getByRole('button', { name: /check eligibility/i }));

    // 3. Wait for the eligibility API call to resolve and render results
    await waitFor(() =>
      expect(screen.getByText(/indicative offer/i)).toBeInTheDocument(),
    );

    // 4. Assert the new UI text and components
    expect(screen.getByText(/affordability analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/likely eligible/i)).toBeInTheDocument();
    expect(screen.getByText(/important:/i)).toBeInTheDocument(); // The amber disclaimer
  });
});