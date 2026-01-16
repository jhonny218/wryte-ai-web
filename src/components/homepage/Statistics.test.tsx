import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Statistics } from './Statistics';

describe('Statistics', () => {
  it('renders statistics section', () => {
    const { container } = render(<Statistics />);
    const section = container.querySelector('section#statistics');
    expect(section).toBeInTheDocument();
  });

  it('renders all four statistics', () => {
    render(<Statistics />);

    expect(screen.getByText('2.7K+')).toBeInTheDocument();
    expect(screen.getByText('1.8K+')).toBeInTheDocument();
    expect(screen.getByText('112')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('renders all statistics descriptions', () => {
    render(<Statistics />);

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Subscribers')).toBeInTheDocument();
    expect(screen.getByText('Downloads')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('displays statistics in correct grid layout', () => {
    const { container } = render(<Statistics />);
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-2', 'gap-8', 'lg:grid-cols-4');
  });

  it('applies correct styling to quantity numbers', () => {
    render(<Statistics />);

    const quantity = screen.getByText('2.7K+');
    expect(quantity.tagName).toBe('H2');
    expect(quantity).toHaveClass('text-3xl', 'font-bold', 'sm:text-4xl');
  });

  it('applies correct styling to descriptions', () => {
    render(<Statistics />);

    const description = screen.getByText('Users');
    expect(description.tagName).toBe('P');
    expect(description).toHaveClass('text-muted-foreground', 'text-xl');
  });

  it('centers text for each statistic', () => {
    const { container } = render(<Statistics />);
    const statCards = container.querySelectorAll('.space-y-2.text-center');
    expect(statCards.length).toBe(4);
  });
});
