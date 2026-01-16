import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrganizationInfoForm } from './OrganizationInfoForm';
import { renderWithProviders } from '@/test/utils/test-utils';
import { useForm } from 'react-hook-form';
import type { OnboardingFormData } from '@/lib/validations/organization';

function TestWrapper({ onNext }: { onNext: () => void }) {
  const form = useForm<OnboardingFormData>({
    defaultValues: {
      name: '',
      mission: '',
      description: '',
      websiteUrl: '',
    },
  });

  return <OrganizationInfoForm form={form} onNext={onNext} />;
}

describe('OrganizationInfoForm', () => {
  it('renders organization information heading', () => {
    const mockOnNext = vi.fn();
    renderWithProviders(<TestWrapper onNext={mockOnNext} />);

    expect(screen.getByText('Organization Information')).toBeInTheDocument();
  });

  it('renders description text', () => {
    const mockOnNext = vi.fn();
    renderWithProviders(<TestWrapper onNext={mockOnNext} />);

    expect(screen.getByText(/tell us about your organization/i)).toBeInTheDocument();
  });

  it('renders organization name field', () => {
    const mockOnNext = vi.fn();
    renderWithProviders(<TestWrapper onNext={mockOnNext} />);

    expect(screen.getByLabelText(/organization name/i)).toBeInTheDocument();
  });

  it('renders mission statement field', () => {
    const mockOnNext = vi.fn();
    renderWithProviders(<TestWrapper onNext={mockOnNext} />);

    expect(screen.getByLabelText(/mission statement/i)).toBeInTheDocument();
  });

  it('renders description field', () => {
    const mockOnNext = vi.fn();
    renderWithProviders(<TestWrapper onNext={mockOnNext} />);

    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('renders website URL field', () => {
    const mockOnNext = vi.fn();
    renderWithProviders(<TestWrapper onNext={mockOnNext} />);

    expect(screen.getByLabelText(/website url/i)).toBeInTheDocument();
  });

  it('renders next button', () => {
    const mockOnNext = vi.fn();
    renderWithProviders(<TestWrapper onNext={mockOnNext} />);

    expect(screen.getByRole('button', { name: /next step/i })).toBeInTheDocument();
  });

  it('calls onNext when next button is clicked', async () => {
    const mockOnNext = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<TestWrapper onNext={mockOnNext} />);

    await user.click(screen.getByRole('button', { name: /next step/i }));

    expect(mockOnNext).toHaveBeenCalled();
  });

  it('allows typing in organization name field', async () => {
    const mockOnNext = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<TestWrapper onNext={mockOnNext} />);

    const input = screen.getByLabelText(/organization name/i) as HTMLInputElement;
    await user.type(input, 'Test Organization');

    expect(input.value).toBe('Test Organization');
  });

  it('allows typing in mission field', async () => {
    const mockOnNext = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<TestWrapper onNext={mockOnNext} />);

    const textarea = screen.getByLabelText(/mission statement/i) as HTMLTextAreaElement;
    await user.type(textarea, 'Test mission');

    expect(textarea.value).toBe('Test mission');
  });

  it('marks required fields with asterisk', () => {
    const mockOnNext = vi.fn();
    renderWithProviders(<TestWrapper onNext={mockOnNext} />);

    const requiredElements = screen.getAllByText('*');
    expect(requiredElements.length).toBeGreaterThan(0);
  });
});
