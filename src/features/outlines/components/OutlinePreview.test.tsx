import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';

// Mock formatDate to keep tests deterministic and avoid locale/timezone flakiness
vi.mock('@/hooks/useDateFormatter', () => ({
  formatDate: () => 'Jan 1, 2024',
}));

import { OutlinePreview } from './OutlinePreview';
import type { Outline } from '../types/outline.types';

describe('OutlinePreview', () => {
  const baseOutline: Outline = {
    id: 'o1',
    blogTitleId: 't1',
    structure: {
      title: 'Structure wrapper',
      structure: {
        introduction: {
          summary: 'Intro summary',
          keyPoints: ['kp1', 'kp2'],
        },
        sections: [
          {
            heading: 'Section 1',
            subheadings: ['Sub 1'],
            points: ['Point A'],
          },
        ],
        conclusion: {
          summary: 'Conclusion summary',
          cta: 'Sign up',
        },
        suggestedImages: ['img1.png'],
      },
      seoKeywords: ['kw1', 'kw2'],
      metaDescription: 'Meta text',
    },
    seoKeywords: ['kw1', 'kw2'],
    metaDescription: 'Meta text',
    suggestedImages: ['img1.png'],
    status: 'APPROVED',
    createdAt: '2024-01-01 00:00:00',
    updatedAt: '2024-01-02 00:00:00',
    blogTitle: { id: 't1', title: 'Test Outline' },
  } as unknown as Outline;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when outline is null', () => {
    const { container } = renderWithProviders(
      <OutlinePreview outline={null} open={true} onOpenChange={() => {}} onEdit={() => {}} onDelete={() => {}} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders sheet when open and outline is provided', () => {
    renderWithProviders(
      <OutlinePreview outline={baseOutline} open={true} onOpenChange={() => {}} onEdit={() => {}} onDelete={() => {}} />
    );

    expect(screen.getByText('Test Outline')).toBeInTheDocument();
    expect(screen.getByText(/content outline and structure/i)).toBeInTheDocument();
  });

  it('displays fallback title when blogTitle is not available', () => {
    const outlineWithoutTitle = { ...baseOutline, blogTitle: undefined } as unknown as Outline;
    renderWithProviders(
      <OutlinePreview outline={outlineWithoutTitle} open={true} onOpenChange={() => {}} onEdit={() => {}} onDelete={() => {}} />
    );

    expect(screen.getByText('Outline Preview')).toBeInTheDocument();
  });

  it('renders full outline and calls edit/delete handlers', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onOpenChange = vi.fn();

    renderWithProviders(
      <OutlinePreview outline={baseOutline} open={true} onOpenChange={onOpenChange} onEdit={onEdit} onDelete={onDelete} />
    );

    // Basic content
    expect(screen.getByText('Test Outline')).toBeInTheDocument();
    expect(screen.getByText(/content outline and structure/i)).toBeInTheDocument();

    // Created/Updated labels are present (avoid asserting exact date strings)
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();

    // Introduction
    expect(screen.getByText('Intro summary')).toBeInTheDocument();
    expect(screen.getByText('kp1')).toBeInTheDocument();

    // Section
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Sub 1')).toBeInTheDocument();
    expect(screen.getByText('Point A')).toBeInTheDocument();

    // Conclusion and CTA
    expect(screen.getByText('Conclusion summary')).toBeInTheDocument();
    expect(screen.getByText(/Sign up/i)).toBeInTheDocument();

    // SEO keywords and meta description
    expect(screen.getByText('kw1')).toBeInTheDocument();
    expect(screen.getByText('Meta text')).toBeInTheDocument();

    // Suggested images
    expect(screen.getByText('img1.png')).toBeInTheDocument();

    // Actions
    await user.click(screen.getByRole('button', { name: /edit outline/i }));
    expect(onEdit).toHaveBeenCalled();

    await user.click(screen.getByLabelText('Delete'));
    expect(onDelete).toHaveBeenCalled();
  });
});
