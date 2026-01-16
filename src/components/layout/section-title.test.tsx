import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionTitle } from './section-title';

describe('SectionTitle', () => {
  it('renders title correctly', () => {
    render(<SectionTitle title="Test Title" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<SectionTitle title="Test Title" subtitle="Test subtitle description" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test subtitle description')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<SectionTitle title="Test Title" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    
    // Check that subtitle paragraph doesn't exist
    const subtitleElement = screen.queryByText(/test subtitle/i);
    expect(subtitleElement).not.toBeInTheDocument();
  });

  it('applies gradient text styles to title', () => {
    render(<SectionTitle title="Test Title" />);
    
    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('bg-gradient-to-r', 'bg-clip-text', 'text-transparent');
  });

  it('renders decorative bar', () => {
    const { container } = render(<SectionTitle title="Test Title" />);
    
    // Check for the decorative gradient bar
    const bar = container.querySelector('.h-1.w-12');
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveClass('bg-gradient-to-r', 'rounded-full');
  });

  it('applies correct text size to title', () => {
    render(<SectionTitle title="Test Title" />);
    
    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('text-4xl', 'font-bold');
  });

  it('applies muted foreground style to subtitle', () => {
    render(<SectionTitle title="Test Title" subtitle="Test subtitle" />);
    
    const subtitle = screen.getByText('Test subtitle');
    expect(subtitle).toHaveClass('text-muted-foreground', 'text-lg');
  });

  it('renders with proper structure', () => {
    const { container } = render(<SectionTitle title="Test Title" subtitle="Subtitle" />);
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('mb-8');
  });
});
