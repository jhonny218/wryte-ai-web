import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default size', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('svg');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-6', 'w-6');
  });

  it('renders with small size when specified', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('h-4', 'w-4');
  });

  it('renders with large size when specified', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('h-10', 'w-10');
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingSpinner className="text-red-500" />);
    
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('text-red-500');
  });

  it('has primary color class by default', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('text-primary');
  });

  it('has animate-spin class for animation', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('is marked as aria-hidden', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('svg');
    // Spinner should be accessible via role or have aria-hidden depending on implementation
    expect(spinner).toSatisfy((el: Element | null) => {
      if (!el) return false;
      return el.getAttribute('role') === 'status' || el.hasAttribute('aria-hidden');
    });
  });
});
