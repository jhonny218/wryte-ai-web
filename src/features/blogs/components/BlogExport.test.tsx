import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toast } from 'sonner';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BlogExport } from './BlogExport';
import { renderWithProviders } from '@/test/utils/test-utils';
import type { Blog } from '../types/blog.types';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('BlogExport', () => {
  const mockBlog: Blog = {
    id: 'blog-123',
    outlineId: 'outline-123',
    organizationId: 'org-123',
    status: 'PUBLISHED',
    content: '# Test Blog\n\nThis is test content.',
    htmlContent: '<h1>Test Blog</h1><p>This is test content.</p>',
    wordCount: 5,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    outline: {      blogTitle: { title: 'Test Blog Title' }, },
  };

  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when blog is null', () => {
    const { container } = renderWithProviders(
      <BlogExport blog={null} open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders dialog when open and blog is provided', () => {
    renderWithProviders(
      <BlogExport blog={mockBlog} open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.getByText(/export blog/i)).toBeInTheDocument();
  });

  it('displays format selector', () => {
    renderWithProviders(
      <BlogExport blog={mockBlog} open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays copy button', () => {
    renderWithProviders(
      <BlogExport blog={mockBlog} open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });

  it('displays download button', () => {
    renderWithProviders(
      <BlogExport blog={mockBlog} open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('copies markdown content to clipboard', async () => {
    const user = userEvent.setup();
    navigator.clipboard.writeText = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <BlogExport blog={mockBlog} open={true} onOpenChange={mockOnOpenChange} />
    );

    await user.click(screen.getByRole('button', { name: /copy/i }));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockBlog.content);
  });

  it('shows success icon after copying', async () => {
    const user = userEvent.setup();
    navigator.clipboard.writeText = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <BlogExport blog={mockBlog} open={true} onOpenChange={mockOnOpenChange} />
    );

    await user.click(screen.getByRole('button', { name: /copy/i }));

    // The button text should change to show copied state
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
  });

  it('changes format when selector is used', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <BlogExport blog={mockBlog} open={true} onOpenChange={mockOnOpenChange} />
    );

    const select = screen.getByRole('combobox');
    await user.click(select);

    const htmlOption = screen.getByRole('option', { name: /html/i });
    await user.click(htmlOption);

    // Mock clipboard and verify the format changed by checking if copy uses HTML content
    navigator.clipboard.writeText = vi.fn().mockResolvedValue(undefined);
    await user.click(screen.getByRole('button', { name: /copy/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockBlog.htmlContent);
  });

  it('renders close button', () => {
    renderWithProviders(
      <BlogExport blog={mockBlog} open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('calls onOpenChange when close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <BlogExport blog={mockBlog} open={true} onOpenChange={mockOnOpenChange} />
    );

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('downloads file and shows success toast', async () => {
    const user = userEvent.setup();
    // mock createObjectURL to avoid real blob handling
    const createSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);

    renderWithProviders(
      <BlogExport blog={mockBlog} open={true} onOpenChange={mockOnOpenChange} />
    );

    await user.click(screen.getByRole('button', { name: /download/i }));

    expect(createSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalled();
    // toast.success mocked in module; ensure it was called with expected message
    expect(toast.success).toHaveBeenCalled();

    createSpy.mockRestore();
    revokeSpy.mockRestore();
  });

  it('shows error toast when clipboard write fails', async () => {
    const user = userEvent.setup();
    navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('fail'));

    renderWithProviders(
      <BlogExport blog={mockBlog} open={true} onOpenChange={mockOnOpenChange} />
    );

    await user.click(screen.getByRole('button', { name: /copy/i }));

    expect(toast.error).toHaveBeenCalledWith('Failed to copy content');
  });

  it('exports plain text format with HTML tags stripped', async () => {
    const user = userEvent.setup();
    navigator.clipboard.writeText = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <BlogExport blog={mockBlog} open={true} onOpenChange={mockOnOpenChange} />
    );

    // Select plain text format
    const select = screen.getByRole('combobox');
    await user.click(select);
    const textOption = screen.getByRole('option', { name: /plain text/i });
    await user.click(textOption);

    // Copy content and verify HTML was stripped
    await user.click(screen.getByRole('button', { name: /copy/i }));

    // The copied content should be plain text without HTML tags
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    const copiedContent = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(copiedContent).not.toContain('<h1>');
    expect(copiedContent).not.toContain('<p>');
    expect(copiedContent).toContain('Test Blog');
    expect(copiedContent).toContain('This is test content.');
  });

  it('calls onOpenChange when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <BlogExport blog={mockBlog} open={true} onOpenChange={mockOnOpenChange} />
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('handles blog without outline title gracefully', () => {
    const blogWithoutTitle: Blog = {
      ...mockBlog,
      outline: undefined,
    };

    renderWithProviders(
      <BlogExport blog={blogWithoutTitle} open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.getByText(/export your blog content/i)).toBeInTheDocument();
  });

  it('handles blog with empty content', async () => {
    const user = userEvent.setup();
    const blogWithEmptyContent: Blog = {
      ...mockBlog,
      content: '',
      htmlContent: '',
    };
    navigator.clipboard.writeText = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <BlogExport blog={blogWithEmptyContent} open={true} onOpenChange={mockOnOpenChange} />
    );

    await user.click(screen.getByRole('button', { name: /copy/i }));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
  });

  it('shows truncated preview for long content', () => {
    const longContent = 'A'.repeat(600);
    const blogWithLongContent: Blog = {
      ...mockBlog,
      content: longContent,
    };

    renderWithProviders(
      <BlogExport blog={blogWithLongContent} open={true} onOpenChange={mockOnOpenChange} />
    );

    // Preview should show truncation indicator
    expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
  });
});
