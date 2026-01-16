import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortableHeader } from './column-header';
import { renderWithProviders } from '@/test/utils/test-utils';
import type { Column } from '@tanstack/react-table';
import type { Mock } from 'vitest';

// Mock column for testing
const createMockColumn = () => ({
  toggleSorting: vi.fn(),
  getIsSorted: vi.fn(() => false) as Mock,
});

describe('SortableHeader', () => {
  it('renders label correctly', () => {
    const column = createMockColumn() as unknown as Column<unknown, unknown>;
    
    renderWithProviders(<SortableHeader column={column} label="Title" />);
    
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('renders sort icon', () => {
    const column = createMockColumn() as unknown as Column<unknown, unknown>;
    
    renderWithProviders(<SortableHeader column={column} label="Title" />);
    
    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('calls toggleSorting when clicked', async () => {
    const user = userEvent.setup();
    const column = createMockColumn() as unknown as Column<unknown, unknown>;
    
    renderWithProviders(<SortableHeader column={column} label="Title" />);
    
    const button = screen.getByRole('button', { name: /title/i });
    await user.click(button);
    
    expect(column.toggleSorting).toHaveBeenCalledOnce();
  });

  it('toggles sorting to descending when currently ascending', async () => {
    const user = userEvent.setup();
    const column = createMockColumn() as unknown as Column<unknown, unknown>;
    (column.getIsSorted as Mock).mockReturnValue('asc');
    
    renderWithProviders(<SortableHeader column={column} label="Title" />);
    
    const button = screen.getByRole('button', { name: /title/i });
    await user.click(button);
    
    expect(column.toggleSorting).toHaveBeenCalledWith(true);
  });

  it('toggles sorting to ascending when currently not sorted', async () => {
    const user = userEvent.setup();
    const column = createMockColumn() as unknown as Column<unknown, unknown>;
    (column.getIsSorted as Mock).mockReturnValue(false);
    
    renderWithProviders(<SortableHeader column={column} label="Title" />);
    
    const button = screen.getByRole('button', { name: /title/i });
    await user.click(button);
    
    expect(column.toggleSorting).toHaveBeenCalledWith(false);
  });

  it('renders with ghost variant', () => {
    const column = createMockColumn() as unknown as Column<unknown, unknown>;
    
    renderWithProviders(<SortableHeader column={column} label="Title" />);
    
    const button = screen.getByRole('button', { name: /title/i });
    expect(button).toBeInTheDocument();
  });

  it('has hover styles applied', () => {
    const column = createMockColumn() as unknown as Column<unknown, unknown>;
    
    renderWithProviders(<SortableHeader column={column} label="Title" />);
    
    const button = screen.getByRole('button', { name: /title/i });
    expect(button).toHaveClass('hover:bg-primary/10', 'hover:text-primary');
  });
});
