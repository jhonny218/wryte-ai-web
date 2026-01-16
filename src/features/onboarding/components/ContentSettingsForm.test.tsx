import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContentSettingsForm } from './ContentSettingsForm';
import { renderWithProviders } from '@/test/utils/test-utils';
import { useForm } from 'react-hook-form';
import type { OnboardingFormData } from '@/lib/validations/organization';

function TestWrapper({
  onBack,
  onSubmit,
  isSubmitting,
}: {
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const form = useForm<OnboardingFormData>({
    defaultValues: {
      primaryKeywords: [],
      secondaryKeywords: [],
      postingDaysOfWeek: [],
      tone: '',
      targetAudience: '',
      industry: '',
      goals: [],
      competitorUrls: [],
      topicsToAvoid: [],
      preferredLength: '',
    },
  });

  return (
    <ContentSettingsForm
      form={form}
      onBack={onBack}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
}

describe('ContentSettingsForm', () => {
  it('renders content settings heading', () => {
    renderWithProviders(
      <TestWrapper onBack={vi.fn()} onSubmit={vi.fn()} isSubmitting={false} />
    );

    expect(screen.getByText('Content Settings')).toBeInTheDocument();
  });

  it('renders description text', () => {
    renderWithProviders(
      <TestWrapper onBack={vi.fn()} onSubmit={vi.fn()} isSubmitting={false} />
    );

    expect(screen.getByText(/define your content strategy/i)).toBeInTheDocument();
  });

  it('renders primary keywords field', () => {
    renderWithProviders(
      <TestWrapper onBack={vi.fn()} onSubmit={vi.fn()} isSubmitting={false} />
    );

    expect(screen.getByLabelText(/primary keywords/i)).toBeInTheDocument();
  });

  it('renders back button', () => {
    renderWithProviders(
      <TestWrapper onBack={vi.fn()} onSubmit={vi.fn()} isSubmitting={false} />
    );

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderWithProviders(
      <TestWrapper onBack={vi.fn()} onSubmit={vi.fn()} isSubmitting={false} />
    );

    expect(screen.getByRole('button', { name: /create organization/i })).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    const mockOnBack = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <TestWrapper onBack={mockOnBack} onSubmit={vi.fn()} isSubmitting={false} />
    );

    await user.click(screen.getByRole('button', { name: /back/i }));

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('calls onSubmit when submit button is clicked', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <TestWrapper onBack={vi.fn()} onSubmit={mockOnSubmit} isSubmitting={false} />
    );

    await user.click(screen.getByRole('button', { name: /create organization/i }));

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('disables buttons when submitting', () => {
    renderWithProviders(
      <TestWrapper onBack={vi.fn()} onSubmit={vi.fn()} isSubmitting={true} />
    );

    expect(screen.getByRole('button', { name: /back/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled();
  });

  it('shows creating text when submitting', () => {
    renderWithProviders(
      <TestWrapper onBack={vi.fn()} onSubmit={vi.fn()} isSubmitting={true} />
    );

    expect(screen.getByText(/creating/i)).toBeInTheDocument();
  });

  it('can add and remove primary keyword via Enter and remove button', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TestWrapper onBack={vi.fn()} onSubmit={vi.fn()} isSubmitting={false} />
    );

    const input = screen.getByPlaceholderText('Add a primary keyword');
    await user.type(input, 'focus-key{Enter}');

    // Badge should appear
    const badge = await screen.findByText('focus-key');
    expect(badge).toBeInTheDocument();

    // Remove the badge
    const removeBtn = badge.parentElement?.querySelector('button');
    expect(removeBtn).toBeTruthy();
    if (removeBtn) await user.click(removeBtn);
    expect(screen.queryByText('focus-key')).not.toBeInTheDocument();
  });

  it('can add and remove goals, competitor urls, and topics to avoid', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TestWrapper onBack={vi.fn()} onSubmit={vi.fn()} isSubmitting={false} />
    );

    // Goals
    const goalsInput = screen.getByPlaceholderText('e.g., Lead Gen, Brand Awareness');
    await user.type(goalsInput, 'Lead Gen{Enter}');
    expect(await screen.findByText('Lead Gen')).toBeInTheDocument();
    const goalBadge = screen.getByText('Lead Gen');
    const goalRemove = goalBadge.parentElement?.querySelector('button');
    if (goalRemove) await user.click(goalRemove);
    expect(screen.queryByText('Lead Gen')).not.toBeInTheDocument();

    // Competitor URLs
    const compInput = screen.getByPlaceholderText('https://competitor.com');
    await user.type(compInput, 'https://ex.com{Enter}');
    expect(await screen.findByText('https://ex.com')).toBeInTheDocument();
    const compBadge = screen.getByText('https://ex.com');
    const compRemove = compBadge.parentElement?.querySelector('button');
    if (compRemove) await user.click(compRemove);
    expect(screen.queryByText('https://ex.com')).not.toBeInTheDocument();

    // Topics to avoid
    const topicInput = screen.getByPlaceholderText('e.g., Politics, Religion');
    await user.type(topicInput, 'Politics{Enter}');
    expect(await screen.findByText('Politics')).toBeInTheDocument();
    const topicBadge = screen.getByText('Politics');
    const topicRemove = topicBadge.parentElement?.querySelector('button');
    if (topicRemove) await user.click(topicRemove);
    expect(screen.queryByText('Politics')).not.toBeInTheDocument();
  });

  it('toggles posting day checkboxes and selects preferred length and tone', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TestWrapper onBack={vi.fn()} onSubmit={vi.fn()} isSubmitting={false} />
    );

    // Toggle MON checkbox
    const mon = screen.getByLabelText('MON') as HTMLInputElement;
    expect(mon.checked).toBe(false);
    await user.click(mon);
    expect(mon.checked).toBe(true);

    // Select preferred length
    const select = screen.getByLabelText('Preferred Content Length (Optional)') as HTMLSelectElement;
    await user.selectOptions(select, 'LONG_FORM');
    expect(select.value).toBe('LONG_FORM');

    // Select tone
    const tone = screen.getByLabelText('Brand Tone (Optional)') as HTMLSelectElement;
    await user.selectOptions(tone, 'friendly');
    expect(tone.value).toBe('friendly');
  });
});
