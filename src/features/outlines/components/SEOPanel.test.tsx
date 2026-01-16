import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SEOPanel } from './SEOPanel';
import { renderWithProviders } from '@/test/utils/test-utils';

describe('SEOPanel', () => {
  const mockOnKeywordsChange = vi.fn();
  const mockOnMetaDescriptionChange = vi.fn();
  const mockOnSuggestedImagesChange = vi.fn();

  it('renders SEO keywords section', () => {
    renderWithProviders(
      <SEOPanel
        keywords={[]}
        suggestedImages={[]}
        onKeywordsChange={mockOnKeywordsChange}
        onMetaDescriptionChange={mockOnMetaDescriptionChange}
        onSuggestedImagesChange={mockOnSuggestedImagesChange}
      />
    );

    expect(screen.getByText('SEO Keywords')).toBeInTheDocument();
  });

  it('renders meta description section', () => {
    renderWithProviders(
      <SEOPanel
        keywords={[]}
        suggestedImages={[]}
        onKeywordsChange={mockOnKeywordsChange}
        onMetaDescriptionChange={mockOnMetaDescriptionChange}
        onSuggestedImagesChange={mockOnSuggestedImagesChange}
      />
    );

    expect(screen.getByText('Meta Description')).toBeInTheDocument();
  });

  it('renders suggested images section', () => {
    renderWithProviders(
      <SEOPanel
        keywords={[]}
        suggestedImages={[]}
        onKeywordsChange={mockOnKeywordsChange}
        onMetaDescriptionChange={mockOnMetaDescriptionChange}
        onSuggestedImagesChange={mockOnSuggestedImagesChange}
      />
    );

    expect(screen.getByText('Suggested Images')).toBeInTheDocument();
  });

  it('displays existing keywords', () => {
    renderWithProviders(
      <SEOPanel
        keywords={['react', 'typescript']}
        suggestedImages={[]}
        onKeywordsChange={mockOnKeywordsChange}
        onMetaDescriptionChange={mockOnMetaDescriptionChange}
        onSuggestedImagesChange={mockOnSuggestedImagesChange}
      />
    );

    const inputs = screen.getAllByPlaceholderText(/keyword/i);
    expect(inputs[0]).toHaveValue('react');
    expect(inputs[1]).toHaveValue('typescript');
  });

  it('displays meta description value', () => {
    renderWithProviders(
      <SEOPanel
        keywords={[]}
        metaDescription="Test meta description"
        suggestedImages={[]}
        onKeywordsChange={mockOnKeywordsChange}
        onMetaDescriptionChange={mockOnMetaDescriptionChange}
        onSuggestedImagesChange={mockOnSuggestedImagesChange}
      />
    );

    const textarea = screen.getByPlaceholderText(/description/i);
    expect(textarea).toHaveValue('Test meta description');
  });

  it('displays suggested images', () => {
    renderWithProviders(
      <SEOPanel
        keywords={[]}
        suggestedImages={['image1.jpg', 'image2.jpg']}
        onKeywordsChange={mockOnKeywordsChange}
        onMetaDescriptionChange={mockOnMetaDescriptionChange}
        onSuggestedImagesChange={mockOnSuggestedImagesChange}
      />
    );

    const inputs = screen.getAllByPlaceholderText(/image url or description/i);
    expect(inputs[0]).toHaveValue('image1.jpg');
    expect(inputs[1]).toHaveValue('image2.jpg');
  });

  it('adds new keyword when add button is clicked', async () => {
    renderWithProviders(
      <SEOPanel
        keywords={['react']}
        suggestedImages={[]}
        onKeywordsChange={mockOnKeywordsChange}
        onMetaDescriptionChange={mockOnMetaDescriptionChange}
        onSuggestedImagesChange={mockOnSuggestedImagesChange}
      />
    );

    await userEvent.setup().click(screen.getByRole('button', { name: /add keyword/i }));

    expect(mockOnKeywordsChange).toHaveBeenCalledWith(['react', '']);
  });

  it('updates keyword when input changes', async () => {
    renderWithProviders(
      <SEOPanel
        keywords={['react']}
        suggestedImages={[]}
        onKeywordsChange={mockOnKeywordsChange}
        onMetaDescriptionChange={mockOnMetaDescriptionChange}
        onSuggestedImagesChange={mockOnSuggestedImagesChange}
      />
    );

    const input = screen.getByPlaceholderText(/keyword/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'typescript' } });

    expect(mockOnKeywordsChange).toHaveBeenLastCalledWith(['typescript']);
  });

  it('removes keyword when remove button is clicked', async () => {
    renderWithProviders(
      <SEOPanel
        keywords={['react', 'typescript']}
        suggestedImages={[]}
        onKeywordsChange={mockOnKeywordsChange}
        onMetaDescriptionChange={mockOnMetaDescriptionChange}
        onSuggestedImagesChange={mockOnSuggestedImagesChange}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: '' });
    await userEvent.setup().click(removeButtons[0]);

    expect(mockOnKeywordsChange).toHaveBeenCalledWith(['typescript']);
  });

  it('updates meta description when textarea changes', async () => {
    renderWithProviders(
      <SEOPanel
        keywords={[]}
        metaDescription=""
        suggestedImages={[]}
        onKeywordsChange={mockOnKeywordsChange}
        onMetaDescriptionChange={mockOnMetaDescriptionChange}
        onSuggestedImagesChange={mockOnSuggestedImagesChange}
      />
    );

    const textarea = screen.getByPlaceholderText(/description/i);
    await userEvent.setup().type(textarea, 'New description');

    expect(mockOnMetaDescriptionChange).toHaveBeenCalled();
  });

  it('adds new suggested image when add button is clicked', async () => {
    renderWithProviders(
      <SEOPanel
        keywords={[]}
        suggestedImages={['image1.jpg']}
        onKeywordsChange={mockOnKeywordsChange}
        onMetaDescriptionChange={mockOnMetaDescriptionChange}
        onSuggestedImagesChange={mockOnSuggestedImagesChange}
      />
    );

    await userEvent.setup().click(screen.getByRole('button', { name: /add image/i }));

    expect(mockOnSuggestedImagesChange).toHaveBeenCalledWith(['image1.jpg', '']);
  });

  it('updates suggested image when input changes', async () => {
    renderWithProviders(
      <SEOPanel
        keywords={[]}
        suggestedImages={['image1.jpg']}
        onKeywordsChange={mockOnKeywordsChange}
        onMetaDescriptionChange={mockOnMetaDescriptionChange}
        onSuggestedImagesChange={mockOnSuggestedImagesChange}
      />
    );

    const input = screen.getByPlaceholderText(/image url or description/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'image2.jpg' } });

    expect(mockOnSuggestedImagesChange).toHaveBeenLastCalledWith(['image2.jpg']);
  });

  it('removes suggested image when remove button is clicked', async () => {
    renderWithProviders(
      <SEOPanel
        keywords={[]}
        suggestedImages={['image1.jpg', 'image2.jpg']}
        onKeywordsChange={mockOnKeywordsChange}
        onMetaDescriptionChange={mockOnMetaDescriptionChange}
        onSuggestedImagesChange={mockOnSuggestedImagesChange}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: '' });
    // Click the first remove button in the images section
    await userEvent.setup().click(removeButtons[0]);

    expect(mockOnSuggestedImagesChange).toHaveBeenCalledWith(['image2.jpg']);
  });
});
