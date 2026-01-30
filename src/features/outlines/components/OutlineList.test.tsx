import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen, within, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';

// Store job status callbacks for testing
let jobStatusCallbacks: Array<{
  jobId: string | null;
  enabled: boolean;
  onComplete?: () => void;
  onError?: (error: string) => void;
}> = [];

// Mocks
vi.mock('@/components/data-table/data-table', () => ({
  DataTable: ({ data, columns }: { data: Array<Record<string, unknown>>; columns: { __handlers: Record<string, (id: string) => void> } }) => {
    return (
      <div data-testid="data-table">
        {data.map((row) => (
          <div key={String((row as Record<string, unknown>).id)} data-testid={`row-${String((row as Record<string, unknown>).id)}`}>
            <div>{(row as Record<string, unknown>).blogTitle?.title ?? (row as Record<string, unknown>).id}</div>
            <div data-testid={`status-${String((row as Record<string, unknown>).id)}`}>{String((row as Record<string, unknown>).status)}</div>
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

vi.mock('@/features/jobs/hooks/useJobStatus', () => ({
  useJobStatus: vi.fn((options: {
    jobId: string | null;
    enabled: boolean;
    onComplete?: () => void;
    onError?: (error: string) => void;
  }) => {
    jobStatusCallbacks.push(options);
  }),
}));

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
    jobStatusCallbacks = [];
    (OutlinesApi.getOutlines as ReturnType<typeof vi.fn>).mockResolvedValue(outlines);
    (OutlinesApi.deleteOutline as ReturnType<typeof vi.fn>).mockResolvedValue({});
    (OutlinesApi.updateOutline as ReturnType<typeof vi.fn>).mockResolvedValue({});
    (OutlinesApi.createOutlines as ReturnType<typeof vi.fn>).mockResolvedValue({ jobId: 'job-1' });
    (BlogsApi.createBlog as ReturnType<typeof vi.fn>).mockResolvedValue({ jobId: 'blog-job-1' });
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

  it('shows error toast when delete mutation fails', async () => {
    (OutlinesApi.deleteOutline as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Delete failed'));

    renderWithProviders(<OutlineList organizationId="org1" onView={() => {}} onEdit={() => {}} />);

    // Click delete on first row
    await userEvent.click(await screen.findByTestId('delete-a1'));

    // Confirm delete
    const dialog = await screen.findByRole('alertdialog');
    const { getByRole } = within(dialog as HTMLElement);
    await userEvent.click(getByRole('button', { name: /^Delete$/i }));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to delete outline');
    });
  });

  it('shows error toast when update status mutation fails', async () => {
    (OutlinesApi.updateOutline as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Update failed'));

    renderWithProviders(<OutlineList organizationId="org1" onView={() => {}} onEdit={() => {}} />);

    // Click approve for first outline
    await userEvent.click(await screen.findByTestId('approve-a1'));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to approve outline. Please try again.');
    });
  });

  it('approves outline with jobId and sets blog job state', async () => {
    (BlogsApi.createBlog as ReturnType<typeof vi.fn>).mockResolvedValue({ jobId: 'blog-job-123' });

    renderWithProviders(<OutlineList organizationId="org1" onView={() => {}} onEdit={() => {}} />);

    await userEvent.click(await screen.findByTestId('approve-a1'));

    await waitFor(() => {
      expect(BlogsApi.createBlog).toHaveBeenCalledWith('a1');
      expect(mockToast.success).toHaveBeenCalledWith('Outline approved and blog generation started');
    });
  });

  it('approves outline without jobId shows simple success', async () => {
    (BlogsApi.createBlog as ReturnType<typeof vi.fn>).mockResolvedValue({});

    renderWithProviders(<OutlineList organizationId="org1" onView={() => {}} onEdit={() => {}} />);

    await userEvent.click(await screen.findByTestId('approve-a1'));

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith('Outline approved');
    });
  });

  it('shows error when rejecting outline without blogTitleId', async () => {
    const outlinesWithMissingBlogTitleId: Outline[] = [
      {
        id: 'a1',
        blogTitleId: undefined,
        blogTitle: undefined,
        status: 'PENDING',
      } as Outline,
    ];
    (OutlinesApi.getOutlines as ReturnType<typeof vi.fn>).mockResolvedValue(outlinesWithMissingBlogTitleId);

    renderWithProviders(<OutlineList organizationId="org1" onView={() => {}} onEdit={() => {}} />);

    await userEvent.click(await screen.findByTestId('reject-a1'));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Outline not found or missing blog title');
    });
  });

  it('shows error when reject API returns no jobId', async () => {
    (OutlinesApi.createOutlines as ReturnType<typeof vi.fn>).mockResolvedValue({});

    renderWithProviders(<OutlineList organizationId="org1" onView={() => {}} onEdit={() => {}} />);

    await userEvent.click(await screen.findByTestId('reject-a2'));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(expect.stringContaining('Failed to get job ID'));
    });
  });

  it('shows error toast when reject fails', async () => {
    (OutlinesApi.deleteOutline as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Reject failed'));

    renderWithProviders(<OutlineList organizationId="org1" onView={() => {}} onEdit={() => {}} />);

    await userEvent.click(await screen.findByTestId('reject-a2'));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to reject outline. Please try again.');
    });
  });

  it('filters outlines by status', async () => {
    renderWithProviders(<OutlineList organizationId="org1" onView={() => {}} onEdit={() => {}} />);

    // Wait for outlines to load
    await screen.findByTestId('row-a1');

    // Open filter dropdown
    await userEvent.click(screen.getByRole('button', { name: /status/i }));

    // Select APPROVED filter
    await userEvent.click(screen.getByRole('menuitemradio', { name: /approved/i }));

    // Only approved outline should be visible
    await waitFor(() => {
      expect(screen.queryByTestId('row-a1')).not.toBeInTheDocument();
      expect(screen.getByTestId('row-a2')).toBeInTheDocument();
    });
  });

  it('cancels delete dialog', async () => {
    renderWithProviders(<OutlineList organizationId="org1" onView={() => {}} onEdit={() => {}} />);

    // Click delete on first row
    await userEvent.click(await screen.findByTestId('delete-a1'));

    // Dialog should open
    const dialog = await screen.findByRole('alertdialog');
    expect(dialog).toBeInTheDocument();

    // Click cancel
    const { getByRole } = within(dialog as HTMLElement);
    await userEvent.click(getByRole('button', { name: /cancel/i }));

    // Dialog should close, delete should not be called
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
    expect(OutlinesApi.deleteOutline).not.toHaveBeenCalled();
  });

  it('triggers reject job onComplete callback', async () => {
    renderWithProviders(<OutlineList organizationId="org1" onView={() => {}} onEdit={() => {}} />);

    // Trigger reject to set up job status
    await userEvent.click(await screen.findByTestId('reject-a2'));

    await waitFor(() => {
      expect(OutlinesApi.createOutlines).toHaveBeenCalled();
    });

    // Find the reject job callback and trigger onComplete
    const rejectCallback = jobStatusCallbacks.find(cb => cb.jobId === 'job-1');
    expect(rejectCallback).toBeDefined();
    if (rejectCallback?.onComplete) {
      await rejectCallback.onComplete();
    }

    expect(mockToast.success).toHaveBeenCalledWith(expect.stringContaining('New outline created'));
  });

  it('triggers reject job onError callback', async () => {
    renderWithProviders(<OutlineList organizationId="org1" onView={() => {}} onEdit={() => {}} />);

    // Trigger reject to set up job status
    await userEvent.click(await screen.findByTestId('reject-a2'));

    await waitFor(() => {
      expect(OutlinesApi.createOutlines).toHaveBeenCalled();
    });

    // Find the reject job callback and trigger onError
    const rejectCallback = jobStatusCallbacks.find(cb => cb.jobId === 'job-1');
    if (rejectCallback?.onError) {
      rejectCallback.onError('Job failed');
    }

    expect(mockToast.error).toHaveBeenCalledWith('Job failed');
  });

  it('triggers blog job onComplete callback', async () => {
    (BlogsApi.createBlog as ReturnType<typeof vi.fn>).mockResolvedValue({ jobId: 'blog-job-1' });

    renderWithProviders(<OutlineList organizationId="org1" onView={() => {}} onEdit={() => {}} />);

    // Trigger approve to set up blog job status
    await userEvent.click(await screen.findByTestId('approve-a1'));

    await waitFor(() => {
      expect(BlogsApi.createBlog).toHaveBeenCalled();
    });

    // Find the blog job callback and trigger onComplete
    const blogCallback = jobStatusCallbacks.find(cb => cb.jobId === 'blog-job-1');
    if (blogCallback?.onComplete) {
      await blogCallback.onComplete();
    }

    expect(mockToast.success).toHaveBeenCalledWith(expect.stringContaining('Blog created'));
  });

  it('triggers blog job onError callback', async () => {
    (BlogsApi.createBlog as ReturnType<typeof vi.fn>).mockResolvedValue({ jobId: 'blog-job-1' });

    renderWithProviders(<OutlineList organizationId="org1" onView={() => {}} onEdit={() => {}} />);

    // Trigger approve to set up blog job status
    await userEvent.click(await screen.findByTestId('approve-a1'));

    await waitFor(() => {
      expect(BlogsApi.createBlog).toHaveBeenCalled();
    });

    // Find the blog job callback and trigger onError
    const blogCallback = jobStatusCallbacks.find(cb => cb.jobId === 'blog-job-1');
    if (blogCallback?.onError) {
      blogCallback.onError('Blog creation failed');
    }

    expect(mockToast.error).toHaveBeenCalledWith('Blog creation failed');
  });

  it('handles onError with empty error message', async () => {
    renderWithProviders(<OutlineList organizationId="org1" onView={() => {}} onEdit={() => {}} />);

    // Trigger reject to set up job status
    await userEvent.click(await screen.findByTestId('reject-a2'));

    await waitFor(() => {
      expect(OutlinesApi.createOutlines).toHaveBeenCalled();
    });

    // Find the reject job callback and trigger onError with empty string
    const rejectCallback = jobStatusCallbacks.find(cb => cb.jobId === 'job-1');
    if (rejectCallback?.onError) {
      rejectCallback.onError('');
    }

    expect(mockToast.error).toHaveBeenCalledWith('Failed to create new outline.');
  });
});


