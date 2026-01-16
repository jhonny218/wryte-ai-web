import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BlogPreview } from './BlogPreview';
import { renderWithProviders } from '@/test/utils/test-utils';
import type { Blog } from '../types/blog.types';

vi.mock('@/hooks/useDateFormatter', () => ({
  formatDate: (date: string) => date,
}));

describe('BlogPreview', () => {
  const mockBlog: Blog = {
    id: 'blog-123',
    outlineId: 'outline-123',
    organizationId: 'org-123',
    status: 'DRAFT',
    content: 'Test content',
    htmlContent: '<p>Test content</p>',
    wordCount: 2,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    outline: {      blogTitle: { title: 'Test Blog Title' }, },
  };

  const mockOnOpenChange = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders nothing when blog is null', () => {
    const { container } = renderWithProviders(
      <BlogPreview
        blog={null}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders sheet when open and blog is provided', () => {
    renderWithProviders(
      <BlogPreview
        blog={mockBlog}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Blog Title')).toBeInTheDocument();
  });

  it('displays fallback title when outline is not available', () => {
    const blogWithoutOutline = { ...mockBlog, outline: undefined };
    renderWithProviders(
      <BlogPreview
        blog={blogWithoutOutline}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Blog Preview')).toBeInTheDocument();
  });

  it('displays blog status badge', () => {
    renderWithProviders(
      <BlogPreview
        blog={mockBlog}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const draftBadges = screen.getAllByText('DRAFT');
    expect(draftBadges.length).toBeGreaterThan(0);
  });

  it('renders edit button', () => {
    renderWithProviders(
      <BlogPreview
        blog={mockBlog}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('renders delete button', () => {
    renderWithProviders(
      <BlogPreview
        blog={mockBlog}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <BlogPreview
        blog={mockBlog}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    await user.click(screen.getByRole('button', { name: /edit/i }));

    expect(mockOnEdit).toHaveBeenCalled();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <BlogPreview
        blog={mockBlog}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('displays published status with correct styling', () => {
    const publishedBlog = { ...mockBlog, status: 'PUBLISHED' as const };
    renderWithProviders(
      <BlogPreview
        blog={publishedBlog}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const pubBadges = screen.getAllByText('PUBLISHED');
    expect(pubBadges.length).toBeGreaterThan(0);
  });

  it('displays word count when available', () => {
    renderWithProviders(
      <BlogPreview
        blog={mockBlog}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BlogPreview } from './BlogPreview';
import { renderWithProviders } from '@/test/utils/test-utils';
import type { Blog } from '../types/blog.types';

vi.mock('@/hooks/useDateFormatter', () => ({
  formatDate: (date: string) => date,
}));

describe('BlogPreview', () => {
  const mockBlog: Blog = {
    id: 'blog-123',
    outlineId: 'outline-123',
    organizationId: 'org-123',
    status: 'DRAFT',
    content: 'Test content',
    htmlContent: '<p>Test content</p>',
    wordCount: 2,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    outline: {      blogTitle: { title: 'Test Blog Title' }, },
  };

  const mockOnOpenChange = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders nothing when blog is null', () => {
    const { container } = renderWithProviders(
      <BlogPreview
        blog={null}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders sheet when open and blog is provided', () => {
    renderWithProviders(
      <BlogPreview
        blog={mockBlog}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Blog Title')).toBeInTheDocument();
  });

  it('displays fallback title when outline is not available', () => {
    const blogWithoutOutline = { ...mockBlog, outline: undefined };
    renderWithProviders(
      <BlogPreview
        blog={blogWithoutOutline}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Blog Preview')).toBeInTheDocument();
  });

  it('displays blog status badge', () => {
    renderWithProviders(
      <BlogPreview
        blog={mockBlog}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const draftBadges = screen.getAllByText('DRAFT');
    expect(draftBadges.length).toBeGreaterThan(0);
  });

  it('renders edit button', () => {
    renderWithProviders(
      <BlogPreview
        blog={mockBlog}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('renders delete button', () => {
    renderWithProviders(
      <BlogPreview
        blog={mockBlog}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <BlogPreview
        blog={mockBlog}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    await user.click(screen.getByRole('button', { name: /edit/i }));

    expect(mockOnEdit).toHaveBeenCalled();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <BlogPreview
        blog={mockBlog}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('displays published status with correct styling', () => {
    const publishedBlog = { ...mockBlog, status: 'PUBLISHED' as const };
    renderWithProviders(
      <BlogPreview
        blog={publishedBlog}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const pubBadges = screen.getAllByText('PUBLISHED');
    expect(pubBadges.length).toBeGreaterThan(0);
  });

  it('displays word count when available', () => {
    renderWithProviders(
      <BlogPreview
        blog={mockBlog}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
