import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TitleDetailsDialog } from './TitleDetailsDialog';
import { renderWithProviders } from '@/test/utils/test-utils';
import type { Title } from '@/features/titles/types/title.types';

vi.mock('@/hooks/useDateFormatter', () => ({
  formatDate: (date: string) => date,
}));

describe('TitleDetailsDialog', () => {
  const mockTitle: Title = {
    id: 'title-123',
    title: 'Test Title',
    scheduledDate: '2024-01-15',
    status: 'PENDING',
    organizationId: 'org-123',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    aiGenerationContext: 'This is AI context',
  };

  const mockOnOpenChange = vi.fn();
  const mockOnApprove = vi.fn();
  const mockOnReject = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders nothing when title is null', () => {
    const { container } = renderWithProviders(
      <TitleDetailsDialog
        title={null}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders dialog when open and title is provided', () => {
    renderWithProviders(
      <TitleDetailsDialog
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('displays title status badge', () => {
    renderWithProviders(
      <TitleDetailsDialog
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('displays scheduled date', () => {
    renderWithProviders(
      <TitleDetailsDialog
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText(/scheduled for/i)).toBeInTheDocument();
  });

  it('displays AI generation context when available', () => {
    renderWithProviders(
      <TitleDetailsDialog
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText('AI Generation Context')).toBeInTheDocument();
    expect(screen.getByText('This is AI context')).toBeInTheDocument();
  });

  it('renders approve button when onApprove is provided', () => {
    renderWithProviders(
      <TitleDetailsDialog
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onApprove={mockOnApprove}
      />
    );

    expect(screen.getByRole('button', { name: /approve/i })).toBeInTheDocument();
  });

  it('renders reject button when onReject is provided', () => {
    renderWithProviders(
      <TitleDetailsDialog
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onReject={mockOnReject}
      />
    );

    expect(screen.getByRole('button', { name: /reject/i })).toBeInTheDocument();
  });

  it('renders edit button when onEdit is provided', () => {
    renderWithProviders(
      <TitleDetailsDialog
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('renders delete button when onDelete is provided', () => {
    renderWithProviders(
      <TitleDetailsDialog
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls onApprove when approve button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TitleDetailsDialog
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onApprove={mockOnApprove}
      />
    );

    await user.click(screen.getByRole('button', { name: /approve/i }));

    expect(mockOnApprove).toHaveBeenCalledWith(mockTitle);
  });

  it('calls onReject when reject button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TitleDetailsDialog
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onReject={mockOnReject}
      />
    );

    await user.click(screen.getByRole('button', { name: /reject/i }));

    expect(mockOnReject).toHaveBeenCalledWith(mockTitle);
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TitleDetailsDialog
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
      />
    );

    await user.click(screen.getByRole('button', { name: /edit/i }));

    expect(mockOnEdit).toHaveBeenCalledWith(mockTitle);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TitleDetailsDialog
        title={mockTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
        onDelete={mockOnDelete}
      />
    );

    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(mockOnDelete).toHaveBeenCalledWith(mockTitle);
  });

  it('displays approved status with correct variant', () => {
    const approvedTitle = { ...mockTitle, status: 'APPROVED' as const };
    renderWithProviders(
      <TitleDetailsDialog
        title={approvedTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('displays rejected status with correct variant', () => {
    const rejectedTitle = { ...mockTitle, status: 'REJECTED' as const };
    renderWithProviders(
      <TitleDetailsDialog
        title={rejectedTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('displays draft status with correct variant', () => {
    const draftTitle = { ...mockTitle, status: 'DRAFT' as const };
    renderWithProviders(
      <TitleDetailsDialog
        title={draftTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText('Draft')).toBeInTheDocument();
  });
});
