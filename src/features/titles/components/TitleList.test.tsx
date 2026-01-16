import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
// Mock the EditTitleSheet to avoid Radix internals during tests and provide
// a lightweight controlled interface for opening/editing titles.
vi.mock('./EditTitleSheet', () => {
  return {
    __esModule: true,
    EditTitleSheet: ({ title, open, onSave }: { title?: { id?: string; title?: string; scheduledDate?: string }; open?: boolean; onSave?: (id: string, data: { title?: string; scheduledDate?: string }) => void }) => {
      if (!open || !title) return null;
      return (
        React.createElement('div', null,
          React.createElement('h2', null, 'Edit Title'),
          React.createElement('label', { htmlFor: 'title' }, 'Title'),
          React.createElement('input', { id: 'title', 'aria-label': 'Title', defaultValue: title.title }),
          React.createElement('button', { onClick: () => onSave?.(title.id ?? '', { title: (document.getElementById('title') as HTMLInputElement).value, scheduledDate: title.scheduledDate }) }, 'Save changes')
        )
      );
    },
  };
});

import { TitleList } from './TitleList';
import { renderWithProviders } from '@/test/utils/test-utils';
import { TitlesApi } from '../api/titles.api';
import { OutlinesApi } from '@/features/outlines/api/outlines.api';
import type { Title } from '../types/title.types';
import * as toastHook from '@/hooks/useToast';

vi.mock('../api/titles.api');
vi.mock('@/features/outlines/api/outlines.api');
vi.mock('@/hooks/useToast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('@/hooks/useDateFormatter', () => ({
  formatDate: (date: string) => date,
  useDateFormatter: () => ({
    formatDate: (date: string) => date,
    toInputDate: (date?: string) => date ?? '',
  }),
}));

describe('TitleList', () => {
  const mockTitles: Title[] = [
    {
      id: 'title-1',
      title: 'Test Title 1',
      scheduledDate: '2024-01-15',
      organizationId: 'org-123',
      status: 'PENDING',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: 'title-2',
      title: 'Test Title 2',
      scheduledDate: '2024-01-20',
      organizationId: 'org-123',
      status: 'APPROVED',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(TitlesApi.getTitles).mockResolvedValue(mockTitles);
  });

  it('displays loading spinner while fetching titles', () => {
    vi.mocked(TitlesApi.getTitles).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithProviders(<TitleList organizationId="org-123" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays titles when loaded successfully', async () => {
    renderWithProviders(<TitleList organizationId="org-123" />);

    await waitFor(() => {
      expect(screen.getByText('Test Title 1')).toBeInTheDocument();
      expect(screen.getByText('Test Title 2')).toBeInTheDocument();
    });
  });

  it('displays card title and description', async () => {
    renderWithProviders(<TitleList organizationId="org-123" />);

    await waitFor(() => {
      expect(screen.getByText('Generated Titles')).toBeInTheDocument();
      expect(screen.getByText('2 titles available')).toBeInTheDocument();
    });
  });

  it('displays empty state when no titles exist', async () => {
    vi.mocked(TitlesApi.getTitles).mockResolvedValue([]);

    renderWithProviders(<TitleList organizationId="org-123" />);

    await waitFor(() => {
      expect(screen.getByText('No titles yet')).toBeInTheDocument();
      expect(screen.getByText('Generate your first batch of titles to get started.')).toBeInTheDocument();
    });
  });

  it('displays error state when fetching fails', async () => {
    vi.mocked(TitlesApi.getTitles).mockRejectedValue(new Error('Failed to fetch'));

    renderWithProviders(<TitleList organizationId="org-123" />);

    await waitFor(() => {
      expect(screen.getByText('Error loading titles')).toBeInTheDocument();
      expect(screen.getByText('There was a problem loading the titles. Please try again.')).toBeInTheDocument();
    });
  });

  it('filters titles by status', async () => {
    renderWithProviders(<TitleList organizationId="org-123" statusFilter="PENDING" />);

    await waitFor(() => {
      expect(screen.getByText('Test Title 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Title 2')).not.toBeInTheDocument();
    });
  });

  it('shows all titles when filter is ALL', async () => {
    renderWithProviders(<TitleList organizationId="org-123" statusFilter="ALL" />);

    await waitFor(() => {
      expect(screen.getByText('Test Title 1')).toBeInTheDocument();
      expect(screen.getByText('Test Title 2')).toBeInTheDocument();
    });
  });

  it('fetches titles with correct organization ID', async () => {
    renderWithProviders(<TitleList organizationId="org-123" />);

    await waitFor(() => {
      expect(TitlesApi.getTitles).toHaveBeenCalledWith('org-123');
    });
  });

  it('does not fetch when organization ID is empty', () => {
    renderWithProviders(<TitleList organizationId="" />);

    expect(TitlesApi.getTitles).not.toHaveBeenCalled();
  });

  it('displays singular title count when only one title', async () => {
    vi.mocked(TitlesApi.getTitles).mockResolvedValue([mockTitles[0]]);

    renderWithProviders(<TitleList organizationId="org-123" />);

    await waitFor(() => {
      expect(screen.getByText('1 title available')).toBeInTheDocument();
    });
  });

  it('approves title and creates outline', async () => {
    const user = userEvent.setup();
    vi.mocked(TitlesApi.updateTitle).mockResolvedValue({} as Title);
    vi.mocked(OutlinesApi.createOutlines).mockResolvedValue({ jobId: 'job-123' });

    renderWithProviders(<TitleList organizationId="org-123" />);

    await waitFor(async () => {
      const row = screen.getByText('Test Title 1').closest('tr');
      const approveButton = within(row as HTMLElement).getByRole('button', { name: /approve/i });
      await user.click(approveButton);
    });

    await waitFor(() => {
      expect(TitlesApi.updateTitle).toHaveBeenCalled();
      expect(OutlinesApi.createOutlines).toHaveBeenCalled();
      expect(toastHook.toast.success).toHaveBeenCalledWith('Title approved and outline creation started');
    });
  });

  it('reject does nothing when title has no scheduledDate', async () => {
    const user = userEvent.setup();
    // return a title without scheduledDate
    vi.mocked(TitlesApi.getTitles).mockResolvedValueOnce([
      { id: 'no-sched-1', title: 'NoSched', status: 'PENDING', organizationId: 'org-123' } as Title,
    ]);

    renderWithProviders(<TitleList organizationId="org-123" />);

    await waitFor(async () => {
      const row = screen.getByText('NoSched').closest('tr');
      const rejectButton = within(row as HTMLElement).getByRole('button', { name: /reject/i });
      await user.click(rejectButton);
    });

    // Since there's no scheduledDate, delete/create should not be called
    expect(TitlesApi.deleteTitle).not.toHaveBeenCalled();
    expect(TitlesApi.createTitles).not.toHaveBeenCalled();
  });

  it('deletes title after confirmation', async () => {
    const user = userEvent.setup();
    vi.mocked(TitlesApi.deleteTitle).mockResolvedValue(undefined);

    renderWithProviders(<TitleList organizationId="org-123" />);

    await waitFor(async () => {
      const row = screen.getByText('Test Title 1').closest('tr');
      const deleteButton = within(row as HTMLElement).getByRole('button', { name: /delete/i });
      await user.click(deleteButton);
    });

    await waitFor(async () => {
      expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
      const confirmButton = screen.getByRole('button', { name: /^delete$/i });
      await user.click(confirmButton);
    });

    await waitFor(() => {
      expect(TitlesApi.deleteTitle).toHaveBeenCalledWith('org-123', 'title-1');
      expect(toastHook.toast.success).toHaveBeenCalledWith('Title deleted successfully');
    });
  });

  it('cancels delete when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TitleList organizationId="org-123" />);

    await waitFor(async () => {
      const row = screen.getByText('Test Title 1').closest('tr');
      const deleteButton = within(row as HTMLElement).getByRole('button', { name: /delete/i });
      await user.click(deleteButton);
    });

    await waitFor(async () => {
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
    });

    expect(TitlesApi.deleteTitle).not.toHaveBeenCalled();
  });

  it('opens edit sheet when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TitleList organizationId="org-123" />);

    const titleNode = await screen.findByText('Test Title 1');
    const row = titleNode.closest('tr') as HTMLElement;
    const editButton = within(row).getByRole('button', { name: /edit/i });
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Edit Title')).toBeInTheDocument();
    });
  });

  it('updates title successfully', async () => {
    const user = userEvent.setup();
    vi.mocked(TitlesApi.updateTitle).mockResolvedValue({} as Title);

    renderWithProviders(<TitleList organizationId="org-123" />);

    const titleNode = await screen.findByText('Test Title 1');
    const row = titleNode.closest('tr') as HTMLElement;
    const editButton = within(row).getByRole('button', { name: /edit/i });
    await user.click(editButton);

    await waitFor(async () => {
      const titleInput = screen.getByLabelText(/^title$/i) as HTMLInputElement;
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
      const saveButton = screen.getByRole('button', { name: /save changes/i });
      await user.click(saveButton);
    });

    await waitFor(() => {
      expect(TitlesApi.updateTitle).toHaveBeenCalledWith('org-123', 'title-1', {
        title: 'Updated Title',
        scheduledDate: '2024-01-15',
      });
      expect(toastHook.toast.success).toHaveBeenCalledWith('Title updated successfully');
    });
  });
});
