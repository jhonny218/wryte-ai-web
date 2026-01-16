import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen, within } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';

// Mocks
vi.mock('@/components/data-table/data-table', () => ({
  DataTable: ({ data, columns }: { data: Array<Record<string, unknown>>; columns: { __handlers: Record<string, (id: string) => void> } }) => {
    return (
      <div>
        {data.map((row) => (
          <div key={String((row as Record<string, unknown>).id)} data-testid={`row-${String((row as Record<string, unknown>).id)}`}>
            <div>{(row as Record<string, unknown>).blogTitle?.title ?? (row as Record<string, unknown>).id}</div>
            <div>{(row as Record<string, unknown>).status}</div>
            <button data-testid={`view-${String((row as Record<string, unknown>).id)}`} onClick={() => columns.__handlers.onView((row as Record<string, unknown>).id as string)}>
              View
            </button>
            <button data-testid={`edit-${String((row as Record<string, unknown>).id)}`} onClick={() => columns.__handlers.onEdit((row as Record<string, unknown>).id as string)}>
              Edit
            </button>
            <button data-testid={`delete-${String((row as Record<string, unknown>).id)}`} onClick={() => columns.__handlers.onDelete((row as Record<string, unknown>).id as string)}>
              Delete
            </button>
            <button data-testid={`approve-${String((row as Record<string, unknown>).id)}`} onClick={() => columns.__handlers.onApprove((row as Record<string, unknown>).id as string)}>
              Approve
            </button>
            <button data-testid={`reject-${String((row as Record<string, unknown>).id)}`} onClick={() => columns.__handlers.onReject((row as Record<string, unknown>).id as string)}>
              Reject
            </button>
          </div>
        ))}
      </div>
    );
  },
}));

vi.mock('./outline-columns', () => ({
  createOutlineColumns: (
    onView: (id: string) => void,
    onEdit: (id: string) => void,
    onDelete: (id: string) => void,
    onApprove: (id: string) => void,
    onReject: (id: string) => void
  ) => ({
    __handlers: { onView, onEdit, onDelete, onApprove, onReject },
  }),
}));

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() } }));

vi.mock('@/features/jobs/hooks/useJobStatus', () => ({ useJobStatus: vi.fn(() => {}) }));

vi.mock('../api/outlines.api', () => ({
  OutlinesApi: {
    getOutlines: vi.fn(),
    deleteOutline: vi.fn(),
    updateOutline: vi.fn(),
    createOutlines: vi.fn(),
  },
}));

vi.mock('@/features/blogs/api/blogs.api', () => ({
  BlogsApi: { createBlog: vi.fn() },
}));

import { OutlineList } from './OutlineList';
import { OutlinesApi } from '../api/outlines.api';
import { BlogsApi } from '@/features/blogs/api/blogs.api';
import type { Outline } from '../types/outline.types';
import { toast as mockToast } from 'sonner';

describe('OutlineList', () => {
  const outlines: Outline[] = [
    {
      id: 'a1',
      blogTitleId: 't1',
      blogTitle: { id: 't1', title: 'First' },
      status: 'PENDING',
    } as Outline,
    {
      id: 'a2',
      blogTitleId: 't2',
      blogTitle: { id: 't2', title: 'Second' },
      status: 'APPROVED',
    } as Outline,
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    OutlinesApi.getOutlines.mockResolvedValue(outlines);
    OutlinesApi.deleteOutline.mockResolvedValue({});
    OutlinesApi.updateOutline.mockResolvedValue({});
    OutlinesApi.createOutlines.mockResolvedValue({ jobId: 'job-1' });
    BlogsApi.createBlog.mockResolvedValue({});
  });

  it('renders outlines and calls view/edit handlers', async () => {
    const onView = vi.fn();
    const onEdit = vi.fn();

    renderWithProviders(<OutlineList organizationId="org1" onView={onView} onEdit={onEdit} />);

    // Ensure rows render
    expect(await screen.findByTestId('row-a1')).toBeInTheDocument();
    expect(await screen.findByTestId('row-a2')).toBeInTheDocument();

    // Titles and statuses
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(screen.getByText('APPROVED')).toBeInTheDocument();

    // View -> should call onView with the outline object
    await userEvent.click(screen.getByTestId('view-a1'));
    expect(onView).toHaveBeenCalledWith(expect.objectContaining({ id: 'a1' }));

    // Edit -> should call onEdit with the outline object
    await userEvent.click(screen.getByTestId('edit-a2'));
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: 'a2' }));
  });

  it('handles delete with confirmation', async () => {
    const onView = vi.fn();
    const onEdit = vi.fn();

    renderWithProviders(<OutlineList organizationId="org1" onView={onView} onEdit={onEdit} />);

    // Click delete on first row
    await userEvent.click(await screen.findByTestId('delete-a1'));

    // Confirm dialog should open
    expect(screen.getByText('Delete Outline')).toBeInTheDocument();

    // Click the confirm Delete button inside dialog (match partial text)
    await screen.findByText(/Are you sure you want to delete this outline\?/i);
    const dialog = await screen.findByRole('alertdialog');
    const { getByRole } = within(dialog as HTMLElement);
    const confirmBtn = getByRole('button', { name: /^Delete$/i });
    await userEvent.click(confirmBtn);

    // OutlinesApi.deleteOutline should have been called
    await expect(OutlinesApi.deleteOutline).toHaveBeenCalledWith('org1', 'a1');
    expect(mockToast.success).toHaveBeenCalled();
  });

  it('approves outline and starts blog creation', async () => {
    renderWithProviders(<OutlineList organizationId="org1" onView={() => {}} onEdit={() => {}} />);

    // Click approve for first outline
    await userEvent.click(await screen.findByTestId('approve-a1'));

    // Wait for createBlog to be called
    await expect(BlogsApi.createBlog).toHaveBeenCalledWith('a1');
    expect(mockToast.success).toHaveBeenCalled();
  });

  it('rejects outline and triggers new outline creation job', async () => {
    renderWithProviders(<OutlineList organizationId="org1" onView={() => {}} onEdit={() => {}} />);

    // Click reject for second outline
    await userEvent.click(await screen.findByTestId('reject-a2'));

    // createOutlines should be called with organizationId and blogTitleId
    await expect(OutlinesApi.createOutlines).toHaveBeenCalledWith('org1', 't2');
    expect(mockToast.info).toHaveBeenCalled();
  });
});


