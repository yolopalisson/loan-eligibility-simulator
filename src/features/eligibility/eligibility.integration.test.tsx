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

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /check eligibility/i }),
      ).toBeInTheDocument(),
    );

    await user.click(screen.getByRole('button', { name: /check eligibility/i }));

    await waitFor(() =>
      expect(screen.getByText(/recommended loan/i)).toBeInTheDocument(),
    );

    expect(screen.getByText(/affordability analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/likely eligible/i)).toBeInTheDocument();
  });
});