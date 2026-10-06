import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { validationRules } from '../../api/mock/data';
import { loanProducts } from '../../api/mock/data';
import { EligibilityForm } from './EligibilityForm';

describe('EligibilityForm', () => {
  it('renders all three fieldsets', () => {
    render(
      <EligibilityForm
        rules={validationRules}
        products={loanProducts}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByText('Personal information')).toBeInTheDocument();
    expect(screen.getByText('Financial information')).toBeInTheDocument();
    expect(screen.getByText('Loan details')).toBeInTheDocument();
  });

  it('shows an error summary when age is out of range', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <EligibilityForm
        rules={validationRules}
        products={loanProducts}
        onSubmit={onSubmit}
      />,
    );

    const ageInput = screen.getByLabelText(/age/i);
    await user.clear(ageInput);
    await user.type(ageInput, '12');
    await user.click(screen.getByRole('button', { name: /check eligibility/i }));

    expect(
      await screen.findByText(/age must be between 18 and 65/i),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <EligibilityForm
        rules={validationRules}
        products={loanProducts}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole('button', { name: /check eligibility/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const submitted = onSubmit.mock.calls[0][0];
    expect(submitted.personalInfo.age).toBe(35);
    expect(submitted.loanDetails.requestedAmount).toBe(150000);
  });
});