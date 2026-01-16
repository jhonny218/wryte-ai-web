import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { renderWithProviders } from '@/test/utils/test-utils';
import type { Title } from '../types/title.types';
import * as toastHook from '@/hooks/useToast';

vi.mock('@/hooks/useToast', () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockToInputDate = (date: string) => (date ? date.slice(0, 10) : '');

vi.mock('@/hooks/useDateFormatter', () => ({
  useDateFormatter: () => ({
    toInputDate: mockToInputDate,
  }),
}));

// Mock the Sheet UI primitives to avoid rendering Radix internals during unit tests.
// The real Sheet uses Radix which can trigger ref update cycles in JSDOM.
vi.mock('@/components/ui/sheet', () => ({
  __esModule: true,
  Sheet: (props: { children?: React.ReactNode }) => React.createElement('div', {}, props.children),
  SheetContent: (props: { children?: React.ReactNode }) => React.createElement('div', {}, props.children),
  SheetHeader: (props: { children?: React.ReactNode }) => React.createElement('div', {}, props.children),
  SheetTitle: (props: { children?: React.ReactNode }) => React.createElement('div', {}, props.children),
  SheetDescription: (props: { children?: React.ReactNode }) => React.createElement('div', {}, props.children),
  SheetFooter: (props: { children?: React.ReactNode }) => React.createElement('div', {}, props.children),
}));

import { EditTitleSheet } from './EditTitleSheet';

describe('EditTitleSheet', () => {
  const mockTitle: Title = {
    id: 'title-123',
    title: 'Test Title',
    scheduledDate: '2024-01-15',
    organizationId: 'org-123',
    status: 'PENDING',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  const mockOnOpenChange = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSave.mockResolvedValue(undefined);
  });

  it('renders nothing when title is null', () => {
    const { container } = renderWithProviders(
      <EditTitleSheet
        title={null}
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders sheet when open and title is provided', () => {
    renderWithProviders(
      <EditTitleSheet
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Edit Title')).toBeInTheDocument();
  });

  it('displays title description', () => {
    renderWithProviders(
      <EditTitleSheet
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(
      screen.getByText("Make changes to the title and scheduled date. Click save when you're done.")
    ).toBeInTheDocument();
  });

  it('populates form with title data', () => {
    renderWithProviders(
      <EditTitleSheet
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    const titleInput = screen.getByLabelText(/^title$/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/scheduled date/i) as HTMLInputElement;

    expect(titleInput.value).toBe('Test Title');
    expect(dateInput.value).toBe('2024-01-15');
  });

  it('renders cancel and save buttons', () => {
    renderWithProviders(
      <EditTitleSheet
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('calls onOpenChange when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EditTitleSheet
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('allows editing the title field', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EditTitleSheet
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    const titleInput = screen.getByLabelText(/^title$/i) as HTMLInputElement;
    await user.clear(titleInput);
    await user.type(titleInput, 'New Title');

    expect(titleInput.value).toBe('New Title');
  });

  it('allows editing the scheduled date field', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EditTitleSheet
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    const dateInput = screen.getByLabelText(/scheduled date/i) as HTMLInputElement;
    await user.clear(dateInput);
    await user.type(dateInput, '2024-12-25');

    expect(dateInput.value).toBe('2024-12-25');
  });

  it('calls onSave with updated data when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EditTitleSheet
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    const titleInput = screen.getByLabelText(/^title$/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Title');

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith('title-123', {
        title: 'Updated Title',
        scheduledDate: '2024-01-15',
      });
    });
  });

  it('closes sheet after successful save', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EditTitleSheet
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('shows error message when title is empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EditTitleSheet
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    const titleInput = screen.getByLabelText(/^title$/i);
    await user.clear(titleInput);
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('shows error message when title is too long', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EditTitleSheet
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    const titleInput = screen.getByLabelText(/^title$/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'a'.repeat(201));
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByText('Title is too long')).toBeInTheDocument();
    });
  });

  it('displays error toast when save fails', async () => {
    const user = userEvent.setup();
    mockOnSave.mockRejectedValue(new Error('Save failed'));

    renderWithProviders(
      <EditTitleSheet
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(toastHook.toast.error).toHaveBeenCalledWith('Failed to save title. Please try again.');
    });
  });

  it('disables buttons while submitting', async () => {
    const user = userEvent.setup();
    mockOnSave.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithProviders(
      <EditTitleSheet
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    await user.click(saveButton);

    expect(screen.getByRole('button', { name: /saving\.\.\./i })).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('resets form when title changes', () => {
    const { rerender } = renderWithProviders(
      <EditTitleSheet
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    const newTitle: Title = {
      ...mockTitle,
      id: 'title-456',
      title: 'New Title',
      scheduledDate: '2024-02-20',
    };

    rerender(
      <EditTitleSheet
        title={newTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    const titleInput = screen.getByLabelText(/^title$/i) as HTMLInputElement;
    expect(titleInput.value).toBe('New Title');
  });
});
