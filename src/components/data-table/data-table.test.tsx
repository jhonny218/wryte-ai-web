import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from './data-table';
import { renderWithProviders } from '@/test/utils/test-utils';
import type { ColumnDef } from '@tanstack/react-table';

interface TestData {
  id: string;
  name: string;
  status: string;
}

const mockColumns: ColumnDef<TestData>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];

const mockData: TestData[] = [
  { id: '1', name: 'Item 1', status: 'Active' },
  { id: '2', name: 'Item 2', status: 'Inactive' },
];

describe('DataTable', () => {
  it('renders table with data', () => {
    renderWithProviders(
      <DataTable columns={mockColumns} data={mockData} />
    );
    
    // Check headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    
    // Check data
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('displays "No results" when data is empty', () => {
    renderWithProviders(
      <DataTable columns={mockColumns} data={[]} />
    );
    
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('renders all rows', () => {
    renderWithProviders(
      <DataTable columns={mockColumns} data={mockData} />
    );
    
    const rows = screen.getAllByRole('row');
    // +1 for header row
    expect(rows).toHaveLength(mockData.length + 1);
  });

  it('renders pagination controls', () => {
    renderWithProviders(
      <DataTable columns={mockColumns} data={mockData} />
    );
    
    expect(screen.getByText(/2.*row\(s\) total/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('applies default sorting', () => {
    interface TestDataWithDate {
      id: string;
      name: string;
      status: string;
      createdAt: string;
    }

    const dataWithDates: TestDataWithDate[] = [
      { id: '1', name: 'Item 1', status: 'Active', createdAt: '2024-01-01' },
      { id: '2', name: 'Item 2', status: 'Inactive', createdAt: '2024-01-02' },
    ];

    const columnsWithDate: ColumnDef<TestDataWithDate>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
      },
    ];

    renderWithProviders(
      <DataTable 
        columns={columnsWithDate} 
        data={dataWithDates}
        defaultSortColumn="createdAt"
        defaultSortDesc={true}
      />
    );
    
    // Table should render with data
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders table with border and rounded corners', () => {
    const { container } = renderWithProviders(
      <DataTable columns={mockColumns} data={mockData} />
    );
    
    const tableWrapper = container.querySelector('.rounded-md.border');
    expect(tableWrapper).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    renderWithProviders(
      <DataTable columns={mockColumns} data={mockData} />
    );
    
    const previousButton = screen.getByRole('button', { name: /previous/i });
    expect(previousButton).toBeDisabled();
  });

  it('disables next button when all data fits on one page', () => {
    renderWithProviders(
      <DataTable columns={mockColumns} data={mockData} />
    );
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('enables pagination buttons with large datasets', () => {
    // Create dataset larger than default page size
    const largeData: TestData[] = Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Item ${i + 1}`,
      status: i % 2 === 0 ? 'Active' : 'Inactive',
    }));

    renderWithProviders(
      <DataTable columns={mockColumns} data={largeData} />
    );
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeEnabled();
  });

  it('navigates between pages when clicking pagination buttons', async () => {
    const user = userEvent.setup();
    
    // Create dataset larger than default page size (10)
    const largeData: TestData[] = Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Item ${i + 1}`,
      status: i % 2 === 0 ? 'Active' : 'Inactive',
    }));

    renderWithProviders(
      <DataTable columns={mockColumns} data={largeData} />
    );
    
    // Initially on first page
    const previousButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
    
    // Click next to go to page 2
    await user.click(nextButton);
    
    // Now previous should be enabled
    expect(previousButton).toBeEnabled();
    
    // Click previous to go back to page 1
    await user.click(previousButton);
    
    expect(previousButton).toBeDisabled();
  });
});
