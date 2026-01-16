import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTitleDialog } from './CreateTitleDialog';
import { renderWithProviders } from '@/test/utils/test-utils';

describe('CreateTitleDialog', () => {
  const mockDate = new Date('2024-01-15');
  const mockOnOpenChange = vi.fn();
  const mockOnCreate = vi.fn();

  it('renders nothing when date is null', () => {
    const { container } = renderWithProviders(
      <CreateTitleDialog
        date={null}
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreate={mockOnCreate}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders dialog when open and date is provided', () => {
    renderWithProviders(
      <CreateTitleDialog
        date={mockDate}
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreate={mockOnCreate}
      />
    );

    // Date formatting may vary by timezone/environment; accept any day in January 2024
    expect(screen.getByText(/create title for january \d{1,2}, 2024/i)).toBeInTheDocument();
  });

  it('displays confirmation message when not creating', () => {
    renderWithProviders(
      <CreateTitleDialog
        date={mockDate}
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreate={mockOnCreate}
        isCreating={false}
      />
    );

    expect(
      screen.getByText(/would you like to generate a title for this date/i)
    ).toBeInTheDocument();
  });

  it('displays loading state when creating', () => {
    renderWithProviders(
      <CreateTitleDialog
        date={mockDate}
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreate={mockOnCreate}
        isCreating={true}
      />
    );

    expect(screen.getByText(/creating title\.\.\. please wait\./i)).toBeInTheDocument();
  });

  it('renders cancel and create buttons', () => {
    renderWithProviders(
      <CreateTitleDialog
        date={mockDate}
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreate={mockOnCreate}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^create title$/i })).toBeInTheDocument();
  });

  it('calls onCreate when create button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CreateTitleDialog
        date={mockDate}
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreate={mockOnCreate}
      />
    );

    await user.click(screen.getByRole('button', { name: /^create title$/i }));

    expect(mockOnCreate).toHaveBeenCalledWith(mockDate);
  });

  it('disables buttons when creating', () => {
    renderWithProviders(
      <CreateTitleDialog
        date={mockDate}
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreate={mockOnCreate}
        isCreating={true}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /creating\.\.\./i })).toBeDisabled();
  });

  it('shows spinner icon when creating', () => {
    renderWithProviders(
      <CreateTitleDialog
        date={mockDate}
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreate={mockOnCreate}
        isCreating={true}
      />
    );

    const button = screen.getByRole('button', { name: /creating\.\.\./i });
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('prevents closing dialog when creating', async () => {
    renderWithProviders(
      <CreateTitleDialog
        date={mockDate}
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreate={mockOnCreate}
        isCreating={true}
      />
    );

    // Try to close via cancel button (should be disabled)
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(cancelButton).toBeDisabled();
  });

  it('allows closing dialog when not creating', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CreateTitleDialog
        date={mockDate}
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreate={mockOnCreate}
        isCreating={false}
      />
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
