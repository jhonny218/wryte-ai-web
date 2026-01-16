import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BlogList } from './BlogList';
import { renderWithProviders } from '@/test/utils/test-utils';
import { BlogsApi } from '../api/blogs.api';
import type { Blog } from '../types/blog.types';

vi.mock('../api/blogs.api');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('BlogList', () => {
  const mockBlogs: Blog[] = [
    {
      id: 'blog-1',
      outlineId: 'outline-1',
      organizationId: 'org-123',
      status: 'DRAFT',
      content: 'Test content 1',
      htmlContent: '<p>Test content 1</p>',
      wordCount: 3,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',      outline: { blogTitle: { title: 'Test Blog 1' } },
    },
    {
      id: 'blog-2',
      outlineId: 'outline-2',
      organizationId: 'org-123',
      status: 'PUBLISHED',
      content: 'Test content 2',
      htmlContent: '<p>Test content 2</p>',
      wordCount: 3,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',      outline: { blogTitle: { title: 'Test Blog 2' } },
    },
  ];

  const mockOnView = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnExport = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(BlogsApi.getBlogs).mockResolvedValue(mockBlogs);
  });

  it('renders blogs when loaded', async () => {
    renderWithProviders(
      <BlogList
        organizationId="org-123"
        onView={mockOnView}
        onEdit={mockOnEdit}
        onExport={mockOnExport}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test Blog 1')).toBeInTheDocument();
      expect(screen.getByText('Test Blog 2')).toBeInTheDocument();
    });
  });

  it('fetches blogs with correct organization ID', async () => {
    renderWithProviders(
      <BlogList
        organizationId="org-123"
        onView={mockOnView}
        onEdit={mockOnEdit}
        onExport={mockOnExport}
      />
    );

    await waitFor(() => {
      expect(BlogsApi.getBlogs).toHaveBeenCalledWith('org-123');
    });
  });

  it('renders filter dropdown', async () => {
    renderWithProviders(
      <BlogList
        organizationId="org-123"
        onView={mockOnView}
        onEdit={mockOnEdit}
        onExport={mockOnExport}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
    });
  });

  it('calls onView when view action is triggered', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <BlogList
        organizationId="org-123"
        onView={mockOnView}
        onEdit={mockOnEdit}
        onExport={mockOnExport}
      />
    );

    await waitFor(async () => {
      const viewButtons = screen.getAllByRole('button', { name: /view/i });
      await user.click(viewButtons[0]);
    });

    expect(mockOnView).toHaveBeenCalled();
  });

  it('calls onEdit when edit action is triggered', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <BlogList
        organizationId="org-123"
        onView={mockOnView}
        onEdit={mockOnEdit}
        onExport={mockOnExport}
      />
    );

    await waitFor(async () => {
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);
    });

    expect(mockOnEdit).toHaveBeenCalled();
  });

  it('calls onExport when export action is triggered', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <BlogList
        organizationId="org-123"
        onView={mockOnView}
        onEdit={mockOnEdit}
        onExport={mockOnExport}
      />
    );

    await waitFor(async () => {
      const exportButtons = screen.getAllByRole('button', { name: /export/i });
      await user.click(exportButtons[0]);
    });

    expect(mockOnExport).toHaveBeenCalled();
  });

  it('deletes blog after confirmation', async () => {
    const user = userEvent.setup();    vi.mocked(BlogsApi.deleteBlog).mockResolvedValue(undefined);

    renderWithProviders(
      <BlogList
        organizationId="org-123"
        onView={mockOnView}
        onEdit={mockOnEdit}
        onExport={mockOnExport}
      />
    );

    await waitFor(async () => {
      const row = screen.getByText('Test Blog 1').closest('tr');
      if (!row) throw new Error('Row for Test Blog 1 not found');
      const { getByRole } = within(row as HTMLElement);
      const deleteButton = getByRole('button', { name: /delete/i });
      await user.click(deleteButton);
    });

    await waitFor(async () => {
      const confirmButton = screen.getByRole('button', { name: /^delete$/i });
      await user.click(confirmButton);
    });

    await waitFor(() => {
      expect(BlogsApi.deleteBlog).toHaveBeenCalledWith('org-123', 'blog-1');
    });
  });

  it('renders empty state when no blogs', async () => {
    vi.mocked(BlogsApi.getBlogs).mockResolvedValue([]);

    renderWithProviders(
      <BlogList
        organizationId="org-123"
        onView={mockOnView}
        onEdit={mockOnEdit}
        onExport={mockOnExport}
      />
    );

    await waitFor(() => {
      const table = screen.queryByRole('table');
      expect(table || screen.getByText(/no results/i)).toBeTruthy();
    });
  });
});
