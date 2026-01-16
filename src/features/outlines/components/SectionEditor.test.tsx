import { describe, it, expect, vi } from 'vitest';
import { screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SectionEditor } from './SectionEditor';
import { renderWithProviders } from '@/test/utils/test-utils';
import type { OutlineSection } from '../types/outline.types';

describe('SectionEditor', () => {
  const mockSection: OutlineSection = {
    heading: 'Test Heading',
    subheadings: ['Subheading 1', 'Subheading 2'],
    points: ['Point 1', 'Point 2'],
  };

  const mockOnChange = vi.fn();
  const mockOnRemove = vi.fn();

  it('renders section with heading', () => {
    renderWithProviders(
      <SectionEditor
        section={mockSection}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />
    );

    const input = screen.getByDisplayValue('Test Heading');
    expect(input).toBeInTheDocument();
  });

  it('displays section number badge', () => {
    renderWithProviders(
      <SectionEditor
        section={mockSection}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('Section 1')).toBeInTheDocument();
  });

  it('displays correct section number for different indices', () => {
    renderWithProviders(
      <SectionEditor
        section={mockSection}
        index={2}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('Section 3')).toBeInTheDocument();
  });

  it('renders all subheadings', () => {
    renderWithProviders(
      <SectionEditor
        section={mockSection}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByDisplayValue('Subheading 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Subheading 2')).toBeInTheDocument();
  });

  it('renders all points', () => {
    renderWithProviders(
      <SectionEditor
        section={mockSection}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByDisplayValue('Point 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Point 2')).toBeInTheDocument();
  });

  it('calls onChange when heading is updated', async () => {
    renderWithProviders(
      <SectionEditor
        section={mockSection}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />
    );

    const input = screen.getByDisplayValue('Test Heading');
    fireEvent.change(input, { target: { value: 'New Heading' } });

    expect(mockOnChange).toHaveBeenCalled();
    const headingCalls = mockOnChange.mock.calls as unknown[][];
    expect(
      headingCalls.some((call) => call[0] === 0 && call[1] && (call[1] as OutlineSection).heading === 'New Heading')
    ).toBe(true);
  });

  it('calls onRemove when remove button is clicked', async () => {
    renderWithProviders(
      <SectionEditor
        section={mockSection}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />
    );

    // Find the section remove button (should be the first X button)
    const removeButtons = screen.getAllByRole('button');
    const sectionRemoveButton = removeButtons.find(btn =>
      btn.querySelector('svg') && btn.className.includes('text-destructive')
    );

    if (sectionRemoveButton) {
      await userEvent.setup().click(sectionRemoveButton);
      expect(mockOnRemove).toHaveBeenCalledWith(0);
    }
  });

  it('adds new subheading when add button is clicked', async () => {
    renderWithProviders(
      <SectionEditor
        section={mockSection}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />
    );

    const subheadingLabel = screen.getByText(/Subheadings/i);
    const subheadingContainer = subheadingLabel.closest('div');
    await userEvent.setup().click(within(subheadingContainer as HTMLElement).getByRole('button', { name: /add/i }));

    expect(mockOnChange).toHaveBeenCalledWith(0, {
      ...mockSection,
      subheadings: ['Subheading 1', 'Subheading 2', ''],
    });
  });

  it('updates subheading when input changes', async () => {
    renderWithProviders(
      <SectionEditor
        section={mockSection}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />
    );

    const input = screen.getByDisplayValue('Subheading 1');
    fireEvent.change(input, { target: { value: 'Updated Subheading' } });

    expect(mockOnChange).toHaveBeenCalled();
    const subCalls = mockOnChange.mock.calls as unknown[][];
    expect(
      subCalls.some((call) => {
        const maybeSection = call[1] as OutlineSection | undefined;
        return call[0] === 0 && maybeSection && Array.isArray(maybeSection.subheadings) && maybeSection.subheadings[0] === 'Updated Subheading';
      })
    ).toBe(true);
  });

  it('adds new point when add button is clicked', async () => {
    renderWithProviders(
      <SectionEditor
        section={mockSection}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />
    );

    const pointsLabel = screen.getByText(/Content Points/i);
    const pointsContainer = pointsLabel.closest('div');
    await userEvent.setup().click(within(pointsContainer as HTMLElement).getByRole('button', { name: /add/i }));

    expect(mockOnChange).toHaveBeenCalled();    const addPointCalls = mockOnChange.mock.calls as unknown[][];
    expect(
      addPointCalls.some((call) => {
        const maybeSection = call[1] as OutlineSection | undefined;
        return call[0] === 0 && maybeSection && Array.isArray(maybeSection.points) && maybeSection.points.length === 3;
      })
    ).toBe(true);
  });

  it('updates point when input changes', async () => {
    renderWithProviders(
      <SectionEditor
        section={mockSection}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />
    );

    const input = screen.getByDisplayValue('Point 1');
    fireEvent.change(input, { target: { value: 'Updated Point' } });

    expect(mockOnChange).toHaveBeenCalled();
    const pointCalls = mockOnChange.mock.calls as unknown[][];
    expect(
      pointCalls.some((call) => {
        const maybeSection = call[1] as OutlineSection | undefined;
        return call[0] === 0 && maybeSection && Array.isArray(maybeSection.points) && maybeSection.points[0] === 'Updated Point';
      })
    ).toBe(true);
  });

  it('handles section without subheadings', () => {
    const sectionWithoutSubheadings: OutlineSection = {
      heading: 'Test Heading',
      points: [],
    };

    renderWithProviders(
      <SectionEditor
        section={sectionWithoutSubheadings}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByDisplayValue('Test Heading')).toBeInTheDocument();
  });

  it('handles section without points', () => {
    const sectionWithoutPoints: OutlineSection = {
      heading: 'Test Heading',
      subheadings: ['Subheading 1'],
    };

    renderWithProviders(
      <SectionEditor
        section={sectionWithoutPoints}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByDisplayValue('Test Heading')).toBeInTheDocument();
  });
});
