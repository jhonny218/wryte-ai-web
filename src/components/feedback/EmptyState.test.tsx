import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from './EmptyState';
import { FileText } from 'lucide-react';

describe('EmptyState', () => {
  it('renders with default props', () => {
    render(<EmptyState />);
    
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
    expect(screen.getByText('There is no content to show right now.')).toBeInTheDocument();
  });

  it('renders with custom title and description', () => {
    render(
      <EmptyState 
        title="No blogs found" 
        description="Start by creating your first blog post"
      />
    );
    
    expect(screen.getByText('No blogs found')).toBeInTheDocument();
    expect(screen.getByText('Start by creating your first blog post')).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    render(<EmptyState icon={FileText} />);
    
    // Lucide icons render as SVGs
    const container = screen.getByText('Nothing here yet').parentElement;
    const svg = container?.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders default placeholder when no icon provided', () => {
    render(<EmptyState />);
    
    const placeholder = screen.getByText('Nothing here yet').parentElement?.querySelector('.rounded-full');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveClass('h-12', 'w-12');
  });

  it('renders action button when provided', () => {
    const handleClick = vi.fn();
    
    render(
      <EmptyState 
        action={{
          label: 'Create New',
          onClick: handleClick,
        }}
      />
    );
    
    const button = screen.getByRole('button', { name: /create new/i });
    expect(button).toBeInTheDocument();
  });

  it('calls action onClick when button is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(
      <EmptyState 
        action={{
          label: 'Create New',
          onClick: handleClick,
        }}
      />
    );
    
    const button = screen.getByRole('button', { name: /create new/i });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('renders button with correct variant', () => {
    render(
      <EmptyState 
        action={{
          label: 'Action',
          onClick: vi.fn(),
          variant: 'outline',
        }}
      />
    );
    
    const button = screen.getByRole('button', { name: /action/i });
    expect(button).toBeInTheDocument();
  });

  it('does not render action button when not provided', () => {
    render(<EmptyState />);
    
    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('centers content with proper layout classes', () => {
    const { container } = render(<EmptyState />);
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
  });
});
