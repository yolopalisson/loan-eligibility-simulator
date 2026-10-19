import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { baseValidationRules, creditProducts } from '../../api/mock/data';
import { EligibilityForm } from './EligibilityForm';

describe('EligibilityForm', () => {
  it('renders all fieldsets', () => {
    render(
      <EligibilityForm
        products={creditProducts}
        rules={baseValidationRules}
        selectedProductId="unsecured"
        onProductChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByText('Select your product')).toBeInTheDocument();
    expect(screen.getByText('Personal information')).toBeInTheDocument();
  });

  it('submits valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <EligibilityForm
        products={creditProducts}
        rules={baseValidationRules}
        selectedProductId="unsecured"
        onProductChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole('button', { name: /check eligibility/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const submitted = onSubmit.mock.calls[0][0];
    expect(submitted.productId).toBe('unsecured');
    expect(submitted.personalInfo.age).toBe(35);
  });
});