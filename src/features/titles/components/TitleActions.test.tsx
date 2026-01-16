import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TitleActions } from './TitleActions';
import { renderWithProviders } from '@/test/utils/test-utils';
import { TitlesApi } from '../api/titles.api';
import { useJobStatus } from '../../jobs/hooks/useJobStatus';
import * as toastHook from '@/hooks/useToast';
import type { Job, CreateTitlesJobResponse } from '../../jobs/types/job.types';

vi.mock('../api/titles.api');
vi.mock('../../jobs/hooks/useJobStatus');
vi.mock('@/hooks/useToast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('TitleActions', () => {
  const mockOnStatusFilterChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useJobStatus).mockReturnValue({
      job: undefined,
      isLoading: false,
      isPolling: false,
    });
  });

  it('renders status filter dropdown', () => {
    renderWithProviders(
      <TitleActions
        organizationId="org-123"
        onStatusFilterChange={mockOnStatusFilterChange}
      />
    );

    expect(screen.getByRole('button', { name: /status: all/i })).toBeInTheDocument();
  });

  it('renders create title button', () => {
    renderWithProviders(
      <TitleActions
        organizationId="org-123"
        onStatusFilterChange={mockOnStatusFilterChange}
      />
    );

    expect(screen.getByRole('button', { name: /create title/i })).toBeInTheDocument();
  });

  it('opens dialog when create title button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TitleActions
        organizationId="org-123"
        onStatusFilterChange={mockOnStatusFilterChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /create title/i }));

    await waitFor(() => {
      expect(screen.getByText(/pick a scheduled date for the new title/i)).toBeInTheDocument();
    });
  });

  it('shows status filter options when dropdown is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TitleActions
        organizationId="org-123"
        onStatusFilterChange={mockOnStatusFilterChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /status: all/i }));

    await waitFor(() => {
      expect(screen.getByRole('menuitemradio', { name: /^all$/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitemradio', { name: /approved/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitemradio', { name: /pending/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitemradio', { name: /rejected/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitemradio', { name: /draft/i })).toBeInTheDocument();
    });
  });

  it('calls onStatusFilterChange when status filter is changed', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TitleActions
        organizationId="org-123"
        onStatusFilterChange={mockOnStatusFilterChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /status: all/i }));
    await user.click(screen.getByRole('menuitemradio', { name: /approved/i }));

    expect(mockOnStatusFilterChange).toHaveBeenCalledWith('APPROVED');
  });

  it('displays date input in create title dialog', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TitleActions
        organizationId="org-123"
        onStatusFilterChange={mockOnStatusFilterChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /create title/i }));

    await waitFor(() => {
      const dateInput = screen.getByLabelText(/scheduled date/i);
      expect(dateInput).toBeInTheDocument();
      expect(dateInput).toHaveAttribute('type', 'date');
    });
  });

  it('allows changing the date in create title dialog', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TitleActions
        organizationId="org-123"
        onStatusFilterChange={mockOnStatusFilterChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /create title/i }));

    await waitFor(async () => {
      const dateInput = screen.getByLabelText(/scheduled date/i) as HTMLInputElement;
      await user.clear(dateInput);
      await user.type(dateInput, '2024-12-25');
      expect(dateInput.value).toBe('2024-12-25');
    });
  });

  it('disables create button while job is polling', () => {
    vi.mocked(useJobStatus).mockReturnValue({
      job: { id: 'job-123', status: 'PENDING' } as Job,
      isLoading: false,
      isPolling: true,
    });

    renderWithProviders(
      <TitleActions
        organizationId="org-123"
        onStatusFilterChange={mockOnStatusFilterChange}
      />
    );

    const createButton = screen.getByRole('button', { name: /creating/i });
    expect(createButton).toBeDisabled();
  });

  it('shows loading spinner when job is polling', () => {
    vi.mocked(useJobStatus).mockReturnValue({
      job: { id: 'job-123', status: 'PENDING' } as Job,
      isLoading: false,
      isPolling: true,
    });

    renderWithProviders(
      <TitleActions
        organizationId="org-123"
        onStatusFilterChange={mockOnStatusFilterChange}
      />
    );

    expect(screen.getByText(/creating\.\.\./i)).toBeInTheDocument();
  });

  it('creates title with selected date when create button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(TitlesApi.createTitles).mockResolvedValue({ jobId: 'job-123', status: 'PENDING' } as CreateTitlesJobResponse);

    renderWithProviders(
      <TitleActions
        organizationId="org-123"
        onStatusFilterChange={mockOnStatusFilterChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /create title/i }));

    await waitFor(async () => {
      const createDialogButton = screen.getByRole('button', { name: /^create$/i });
      await user.click(createDialogButton);
    });

    await waitFor(() => {
      expect(TitlesApi.createTitles).toHaveBeenCalled();
    });
  });

  it('displays error toast when title creation fails', async () => {
    const user = userEvent.setup();
    vi.mocked(TitlesApi.createTitles).mockRejectedValue(new Error('Failed to create'));

    renderWithProviders(
      <TitleActions
        organizationId="org-123"
        onStatusFilterChange={mockOnStatusFilterChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /create title/i }));

    await waitFor(async () => {
      const createDialogButton = screen.getByRole('button', { name: /^create$/i });
      await user.click(createDialogButton);
    });

    await waitFor(() => {
      expect(toastHook.toast.error).toHaveBeenCalled();
    });
  });

  it('closes dialog when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TitleActions
        organizationId="org-123"
        onStatusFilterChange={mockOnStatusFilterChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /create title/i }));

    await waitFor(async () => {
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
    });

    await waitFor(() => {
      expect(screen.queryByText(/pick a scheduled date for the new title/i)).not.toBeInTheDocument();
    });
  });
});
