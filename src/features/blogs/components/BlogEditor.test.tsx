import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BlogEditor } from './BlogEditor';
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

vi.mock('./RichTextEditor', () => ({  RichTextEditor: ({ content, onChange }: { content: string; onChange: (value: string) => void }) => (
    <textarea
      data-testid="rich-text-editor"
      value={content}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe('BlogEditor', () => {
  const mockBlog: Blog = {
    id: 'blog-123',
    outlineId: 'outline-123',
    organizationId: 'org-123',
    status: 'DRAFT',
    content: 'Test blog content',
    htmlContent: '<p>Test blog content</p>',
    wordCount: 3,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    outline: {      blogTitle: { title: 'Test Blog Title' }, },
  };

  const mockOnOpenChange = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when blog is null and not open', () => {
    const { container } = renderWithProviders(
      <BlogEditor
        blog={null}
        organizationId="org-123"
        open={false}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  it('renders sheet when open', () => {
    renderWithProviders(
      <BlogEditor
        blog={mockBlog}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText('Edit Blog')).toBeInTheDocument();
  });

  it('displays blog title', () => {
    renderWithProviders(
      <BlogEditor
        blog={mockBlog}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText(/test blog title/i)).toBeInTheDocument();
  });

  it('renders rich text editor', () => {
    renderWithProviders(
      <BlogEditor
        blog={mockBlog}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByTestId('rich-text-editor')).toBeInTheDocument();
  });

  it('displays initial content in editor', () => {
    renderWithProviders(
      <BlogEditor
        blog={mockBlog}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const editor = screen.getByTestId('rich-text-editor') as HTMLTextAreaElement;
    // The editor receives the HTML content (htmlContent) from the component
    expect(editor.value).toBe('<p>Test blog content</p>');
  });

  it('renders save button', () => {
    renderWithProviders(
      <BlogEditor
        blog={mockBlog}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    renderWithProviders(
      <BlogEditor
        blog={mockBlog}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onOpenChange when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <BlogEditor
        blog={mockBlog}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('submits updated blog data', async () => {
    const user = userEvent.setup();    vi.mocked(BlogsApi.updateBlog).mockResolvedValue(undefined);

    renderWithProviders(
      <BlogEditor
        blog={mockBlog}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />
    );

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(BlogsApi.updateBlog).toHaveBeenCalled();
    });
  });

  it('displays word count', () => {
    renderWithProviders(
      <BlogEditor
        blog={mockBlog}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText(/3 words/i)).toBeInTheDocument();
  });

  it('displays status badge', async () => {
    renderWithProviders(
      <BlogEditor
        blog={mockBlog}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Status badge is rendered in the Preview tab — switch to Preview
    const user = userEvent.setup();
    const previewTrigger = screen.queryByRole('tab', { name: /preview/i }) || screen.queryByText(/preview/i);
    if (previewTrigger) {
      await user.click(previewTrigger as Element);
    }

    // Match case-insensitively to be robust; scope to the preview article
    const article = screen.getByRole('article');
    expect(within(article).getByText(/draft/i)).toBeInTheDocument();
  });

  it('renders status selector', () => {
    renderWithProviders(
      <BlogEditor
        blog={mockBlog}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('autosaves content after debounce', async () => {
    vi.useFakeTimers();
    vi.mocked(BlogsApi.updateBlog).mockResolvedValue(undefined);

    try {
      renderWithProviders(
        <BlogEditor
          blog={mockBlog}
          organizationId="org-123"
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      );

      const editor = screen.getByTestId('rich-text-editor') as HTMLTextAreaElement;

      // Change content synchronously
      fireEvent.change(editor, { target: { value: '<p>Updated content</p>' } });

      // Advance timers to trigger debounce (2s) inside async act
      await act(async () => {
        vi.advanceTimersByTime(2000);
        // allow any microtasks to flush
        await Promise.resolve();
      });

      expect(BlogsApi.updateBlog).toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

});
