import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OutlineEditor } from './OutlineEditor';
import { renderWithProviders } from '@/test/utils/test-utils';
import { OutlinesApi } from '../api/outlines.api';
import type { Outline } from '../types/outline.types';

vi.mock('../api/outlines.api');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('OutlineEditor', () => {
  const mockOutline: Outline = {
    id: 'outline-123',
    blogTitleId: 'title-123',
    status: 'PENDING',
    seoKeywords: ['keyword1', 'keyword2'],
    metaDescription: 'Test meta description',
    suggestedImages: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    blogTitle: {
      id: 'title-123',
      title: 'Test Title',
    },
    structure: {
      structure: {
        introduction: {
          summary: 'Test introduction',
          keyPoints: ['Point 1', 'Point 2'],
        },
        sections: [],
        conclusion: {
          summary: 'Test conclusion',
          cta: 'Test CTA',
        },
      },
    },
  };

  const mockOnOpenChange = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when outline is null and not open', () => {
    const { container } = renderWithProviders(
      <OutlineEditor
        outline={null}
        organizationId="org-123"
        open={false}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  it('renders sheet when open', () => {
    renderWithProviders(
      <OutlineEditor
        outline={mockOutline}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText('Edit Outline')).toBeInTheDocument();
  });

  it('displays outline title', () => {
    renderWithProviders(
      <OutlineEditor
        outline={mockOutline}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText(/test title/i)).toBeInTheDocument();
  });

  it('renders tabs for Structure and SEO', () => {
    renderWithProviders(
      <OutlineEditor
        outline={mockOutline}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByRole('tab', { name: /structure/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /seo/i })).toBeInTheDocument();
  });

  it('renders save button', () => {
    renderWithProviders(
      <OutlineEditor
        outline={mockOutline}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    renderWithProviders(
      <OutlineEditor
        outline={mockOutline}
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
      <OutlineEditor
        outline={mockOutline}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('displays introduction summary', () => {
    renderWithProviders(
      <OutlineEditor
        outline={mockOutline}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const summaryTextarea = screen.getByDisplayValue('Test introduction');
    expect(summaryTextarea).toBeInTheDocument();
  });

  it('submits updated outline data', async () => {
    const user = userEvent.setup();
    vi.mocked(OutlinesApi.updateOutline).mockResolvedValue(
      undefined as unknown as Awaited<ReturnType<typeof OutlinesApi.updateOutline>>
    );

    renderWithProviders(
      <OutlineEditor
        outline={mockOutline}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />
    );

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(OutlinesApi.updateOutline).toHaveBeenCalled();
    });
  });

  it('switches to SEO tab when clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OutlineEditor
        outline={mockOutline}
        organizationId="org-123"
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    await user.click(screen.getByRole('tab', { name: /seo/i }));

    expect(screen.getByText('SEO Keywords')).toBeInTheDocument();
  });
});
