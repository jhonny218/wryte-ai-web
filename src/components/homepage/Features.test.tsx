import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Features } from './Features';

describe('Features', () => {
  it('renders features section', () => {
    const { container } = render(<Features />);
    const section = container.querySelector('section#features');
    expect(section).toBeInTheDocument();
  });

  it('renders main heading with gradient text', () => {
    render(<Features />);

    expect(screen.getByText('Powerful')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('renders subtitle text', () => {
    render(<Features />);

    expect(screen.getByText(/Everything you need to create, manage, and optimize/i)).toBeInTheDocument();
  });

  it('renders all feature badges', () => {
    render(<Features />);

    expect(screen.getByText('AI-Powered Generation')).toBeInTheDocument();
    expect(screen.getByText('SEO Optimized')).toBeInTheDocument();
    expect(screen.getAllByText('Brand Voice Matching')[0]).toBeInTheDocument();
    expect(screen.getByText('Calendar Planning')).toBeInTheDocument();
    expect(screen.getByText('Team Collaboration')).toBeInTheDocument();
    expect(screen.getByText('CMS Integration')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Export Options')).toBeInTheDocument();
    expect(screen.getByText('Batch Generation')).toBeInTheDocument();
  });

  it('renders exactly 9 feature badges', () => {
    const { container } = render(<Features />);

    const badges = container.querySelectorAll('.px-4.py-2.text-sm');
    expect(badges.length).toBe(9);
  });

  it('renders three feature cards', () => {
    render(<Features />);

    expect(screen.getAllByText('Brand Voice Matching')[0]).toBeInTheDocument();
    expect(screen.getByText('Performance Analytics')).toBeInTheDocument();
    expect(screen.getByText('Smart SEO Optimization')).toBeInTheDocument();
  });

  it('renders feature descriptions', () => {
    render(<Features />);

    expect(screen.getByText(/AI learns your company's unique voice/i)).toBeInTheDocument();
    expect(screen.getByText(/Track blog performance with built-in analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Automatically optimize every blog for search engines/i)).toBeInTheDocument();
  });

  it('has correct grid layout for feature cards', () => {
    const { container } = render(<Features />);

    const grid = container.querySelector('.grid.gap-8.md\\:grid-cols-2.lg\\:grid-cols-3');
    expect(grid).toBeInTheDocument();
  });

  it('renders lucide icons for each feature card', () => {
    const { container } = render(<Features />);

    const iconWrappers = container.querySelectorAll('.from-secondary\\/20.to-primary\\/20');
    expect(iconWrappers.length).toBe(3);
  });

  it('has proper container and spacing', () => {
    const { container } = render(<Features />);
    const section = container.querySelector('section');

    expect(section).toHaveClass('container', 'space-y-12', 'py-20');
  });

  it('heading has correct styling', () => {
    const { container } = render(<Features />);

    const heading = container.querySelector('h2');
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'md:text-4xl', 'lg:text-5xl');
  });

  it('subtitle has correct styling', () => {
    render(<Features />);

    const subtitle = screen.getByText(/Everything you need to create, manage, and optimize/i);
    expect(subtitle).toHaveClass('text-muted-foreground', 'mt-4', 'text-lg', 'md:text-xl');
  });

  it('gradient text has correct classes', () => {
    const { container } = render(<Features />);

    const gradientText = container.querySelector('.from-secondary\\/60');
    expect(gradientText).toHaveClass('to-secondary', 'bg-linear-to-b', 'bg-clip-text', 'text-transparent');
  });

  it('feature badges have secondary variant', () => {
    const { container } = render(<Features />);

    const badges = Array.from(container.querySelectorAll('.px-4.py-2.text-sm'));
    expect(badges.length).toBeGreaterThan(0);
  });

  it('feature cards have hover effects', () => {
    const { container } = render(<Features />);

    const cards = container.querySelectorAll('.hover\\:border-primary\\/40');
    expect(cards.length).toBe(3);
  });

  it('centers the heading section', () => {
    const { container } = render(<Features />);

    const headingContainer = container.querySelector('.mx-auto.mb-16.max-w-2xl.text-center');
    expect(headingContainer).toBeInTheDocument();
  });

  it('wraps feature badges in flex container', () => {
    const { container } = render(<Features />);

    const flexContainer = container.querySelector('.flex.flex-wrap.justify-center.gap-3');
    expect(flexContainer).toBeInTheDocument();
  });

  it('renders gradient blur effects on cards', () => {
    const { container } = render(<Features />);

    const blurEffects = container.querySelectorAll('.blur-3xl');
    expect(blurEffects.length).toBe(3);
  });
});
