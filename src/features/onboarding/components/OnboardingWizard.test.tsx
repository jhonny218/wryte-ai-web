import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';

// Mock navigate — attach mock to globalThis to avoid hoisting issues
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  const _navigate = vi.fn();
  (globalThis as unknown as Record<string, unknown>).__mockNavigate = _navigate;
  return {
    ...actual,
    useNavigate: () => _navigate,
  };
});

// Mock toast — attach mocks to globalThis to avoid hoisting issues
vi.mock('@/hooks/useToast', () => {
  const success = vi.fn();
  const error = vi.fn();
  (globalThis as unknown as Record<string, unknown>).__mockToast = { success, error };
  return {
    toast: {
      success,
      error,
    },
  };
});

// We'll mock child form components to keep tests focused on wizard logic
vi.mock('./OrganizationInfoForm', () => ({
  OrganizationInfoForm: ({ onNext, form }: { onNext: () => void; form?: { setValue?: (k: string, v: unknown) => void } }) => (
    <div>
      <button
        onClick={() => {
          // populate required fields so validation passes in handleNext
          try {
            form.setValue('name', 'Org Name');
            form.setValue('mission', 'Mission');
            form.setValue('description', 'Description');
            form.setValue('websiteUrl', 'https://example.com');
          } catch {
            /* ignore if form not provided */
          }
          onNext();
        }}
      >
        {'Next'}
      </button>
    </div>
  ),
}));

vi.mock('./ContentSettingsForm', () => ({
  ContentSettingsForm: ({ form, onBack, onSubmit, isSubmitting }: { form?: { setValue?: (k: string, v: unknown) => void }; onBack: () => void; onSubmit: () => Promise<void> | void; isSubmitting?: boolean }) => (
    <div>
      <button onClick={() => onBack()}>{'Back'}</button>
      <button
        onClick={async () => {
          // set required content settings fields so validation passes inside the wizard
          try {
            form.setValue('primaryKeywords', ['kw']);
            form.setValue('secondaryKeywords', []);
            form.setValue('postingDaysOfWeek', ['MON']);
            form.setValue('tone', '');
            form.setValue('targetAudience', '');
            form.setValue('industry', '');
            form.setValue('goals', []);
            form.setValue('competitorUrls', []);
            form.setValue('topicsToAvoid', []);
            form.setValue('preferredLength', '');
          } catch {
            // ignore if form not provided in some tests
          }
          await onSubmit();
        }}
      >
        {'Submit'}
      </button>
      <div data-testid="isSubmitting">{String(isSubmitting)}</div>
    </div>
  ),
}));

// Mock apiClient and expose the mock on globalThis
vi.mock('@/lib/api-client', () => {
  const post = vi.fn();
  (globalThis as unknown as Record<string, unknown>).__mockApiPost = post;
  return {
    apiClient: {
      post,
    },
  };
});

import { OnboardingWizard } from './OnboardingWizard';

// Helper getters to access mocks attached to globalThis without using `any`
const getMockApiPost = () =>
  (globalThis as unknown as Record<string, unknown>).__mockApiPost as
    | { mockResolvedValueOnce?: (v: unknown) => void; mockRejectedValueOnce?: (v: unknown) => void }
    | undefined;

const getMockToast = () =>
  (globalThis as unknown as Record<string, unknown>).__mockToast as
    | { success?: (...args: unknown[]) => unknown; error?: (...args: unknown[]) => unknown }
    | undefined;

const getMockNavigate = () => (globalThis as unknown as Record<string, unknown>).__mockNavigate as ((...a: unknown[]) => unknown) | undefined;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('OnboardingWizard', () => {
  it('switches steps when Next is clicked and updates progress indicator', async () => {
    renderWithProviders(<OnboardingWizard />);

    // Step 1 indicator should have primary styling
    const first = screen.getByText('1');
    const second = screen.getByText('2');
    expect(first.closest('div')).toHaveClass('border-primary');
    // Click Next
    await userEvent.click(screen.getByRole('button', { name: /next/i }));

    // Now step 2 indicator should have primary styling
    expect(second.closest('div')).toHaveClass('border-primary');
  });

  it('creates organization and navigates when API returns slug', async () => {
    // apiClient.post resolves to { data: { slug } }
    getMockApiPost()?.mockResolvedValueOnce({ data: { slug: 'new-org' } });

    renderWithProviders(<OnboardingWizard />);

    // Move to step 2
    await userEvent.click(screen.getByRole('button', { name: /next/i }));

    // Submit
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(getMockToast()?.success).toHaveBeenCalledWith('Organization created successfully!');
      expect(getMockNavigate()).toHaveBeenCalledWith('/org/new-org', { replace: true });
    });
  });

  it('shows error toast when API returns without slug', async () => {
    getMockApiPost()?.mockResolvedValueOnce({ data: {} });

    renderWithProviders(<OnboardingWizard />);

    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(getMockToast()?.error).toHaveBeenCalledWith(
        'Organization created but no slug received. Please contact support.'
      );
    });
  });

  it('shows API error message when mutation fails', async () => {
    getMockApiPost()?.mockRejectedValueOnce({ response: { data: { message: 'bad request' } } });

    renderWithProviders(<OnboardingWizard />);

    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(getMockToast()?.error).toHaveBeenCalledWith('bad request');
    });
  });
});

