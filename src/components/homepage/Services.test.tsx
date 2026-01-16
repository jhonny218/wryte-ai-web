import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Services } from './Services';

describe('Services', () => {
  it('renders services section', () => {
    const { container } = render(<Services />);
    const section = container.querySelector('section#services');
    expect(section).toBeInTheDocument();
  });

  it('renders main heading with gradient text', () => {
    render(<Services />);

    expect(screen.getByText('Client-Centric')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<Services />);

    const description = screen.getByText(/Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis dolor./i);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-muted-foreground', 'mt-4', 'mb-8', 'text-xl');
  });

  it('renders all three service cards', () => {
    render(<Services />);

    expect(screen.getByText('Code Collaboration')).toBeInTheDocument();
    expect(screen.getByText('Project Management')).toBeInTheDocument();
    expect(screen.getByText('Task Automation')).toBeInTheDocument();
  });

  it('renders service descriptions', () => {
    const { container } = render(<Services />);

    const descriptions = container.querySelectorAll('.text-md.mt-2');
    expect(descriptions.length).toBe(3);
  });

  it('renders service icons', () => {
    const { container } = render(<Services />);

    const icons = container.querySelectorAll('.bg-secondary\\/20');
    expect(icons.length).toBe(3);
  });

  it('renders the cube-leg image', () => {
    render(<Services />);

    const image = screen.getByAltText('About services');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
  });

  it('has correct grid layout', () => {
    const { container } = render(<Services />);

    const grid = container.querySelector('.grid.place-items-center.gap-8.lg\\:grid-cols-\\[1fr_1fr\\]');
    expect(grid).toBeInTheDocument();
  });

  it('renders cards with correct styling', () => {
    const { container } = render(<Services />);

    const cards = container.querySelectorAll('.bg-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('has proper container and padding classes', () => {
    const { container } = render(<Services />);
    const section = container.querySelector('section');

    expect(section).toHaveClass('container', 'py-20');
  });

  it('renders heading with correct size classes', () => {
    const { container } = render(<Services />);

    const heading = container.querySelector('h2');
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'md:text-4xl');
  });

  it('renders gradient text with correct classes', () => {
    const { container } = render(<Services />);

    const gradientText = container.querySelector('.from-secondary\\/60');
    expect(gradientText).toHaveClass('to-secondary', 'bg-linear-to-b', 'bg-clip-text', 'text-transparent');
  });

  it('organizes services in flex column with gap', () => {
    const { container } = render(<Services />);

    const flexContainer = container.querySelector('.flex.flex-col.gap-8');
    expect(flexContainer).toBeInTheDocument();
  });
});
