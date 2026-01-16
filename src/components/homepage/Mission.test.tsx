import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Mission } from './Mission';

describe('Mission', () => {
  it('renders mission section', () => {
    const { container } = render(<Mission />);
    const section = container.querySelector('section#mission');
    expect(section).toBeInTheDocument();
  });

  it('renders "Our Mission" badge', () => {
    render(<Mission />);

    expect(screen.getByText('Our Mission')).toBeInTheDocument();
  });

  it('renders main heading with gradient text', () => {
    render(<Mission />);

    expect(screen.getByText('Empower Every Company to')).toBeInTheDocument();
    expect(screen.getByText('Tell Their Story')).toBeInTheDocument();
  });

  it('renders mission description', () => {
    render(<Mission />);

    expect(screen.getByText(/We believe great content shouldn't be a luxury/i)).toBeInTheDocument();
  });

  it('renders three value proposition cards', () => {
    render(<Mission />);

    expect(screen.getByText('Quality at Scale')).toBeInTheDocument();
    expect(screen.getByText('Time Freedom')).toBeInTheDocument();
    expect(screen.getByText('Human + AI')).toBeInTheDocument();
  });

  it('renders value proposition descriptions', () => {
    render(<Mission />);

    expect(screen.getByText(/Consistent, professional content without compromising quality/i)).toBeInTheDocument();
    expect(screen.getByText(/Hours of work reduced to minutes with AI assistance/i)).toBeInTheDocument();
    expect(screen.getByText(/AI amplifies your creativity, you stay in control/i)).toBeInTheDocument();
  });

  it('renders lucide icons for value propositions', () => {
    const { container } = render(<Mission />);

    const iconWrappers = container.querySelectorAll('.flex.h-10.w-10.items-center.justify-center.rounded-lg');
    expect(iconWrappers.length).toBe(3);
  });

  it('has correct grid layout for value propositions', () => {
    const { container } = render(<Mission />);

    const grid = container.querySelector('.grid.gap-4.pt-4.md\\:grid-cols-3');
    expect(grid).toBeInTheDocument();
  });

  it('has proper container and padding', () => {
    const { container } = render(<Mission />);
    const section = container.querySelector('section');

    expect(section).toHaveClass('container', 'py-20');
  });

  it('heading has correct styling', () => {
    const { container } = render(<Mission />);

    const heading = container.querySelector('h2');
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'md:text-4xl', 'lg:text-5xl');
  });

  it('description has correct styling', () => {
    render(<Mission />);

    const description = screen.getByText(/We believe great content shouldn't be a luxury/i);
    expect(description).toHaveClass('text-muted-foreground', 'max-w-3xl', 'text-lg', 'leading-relaxed', 'md:text-xl');
  });

  it('gradient text has correct classes', () => {
    render(<Mission />);

    const gradientText = screen.getByText('Tell Their Story');
    expect(gradientText).toHaveClass('from-secondary', 'to-primary', 'bg-gradient-to-r', 'bg-clip-text', 'text-transparent');
  });

  it('badge has correct styling', () => {
    render(<Mission />);

    const badge = screen.getByText('Our Mission');
    expect(badge).toHaveClass('bg-primary/10', 'text-primary', 'hover:bg-primary/20', 'mb-2');
  });

  it('renders background blur effects', () => {
    const { container } = render(<Mission />);

    const blurEffects = container.querySelectorAll('.blur-3xl');
    expect(blurEffects.length).toBe(2);
  });

  it('has gradient background on main container', () => {
    const { container } = render(<Mission />);

    const gradientContainer = container.querySelector('.bg-gradient-to-br');
    expect(gradientContainer).toBeInTheDocument();
    expect(gradientContainer).toHaveClass('from-primary/5', 'via-background', 'to-secondary/5');
  });

  it('has border and rounded corners on container', () => {
    const { container } = render(<Mission />);

    const mainContainer = container.querySelector('.rounded-3xl.border');
    expect(mainContainer).toBeInTheDocument();
  });

  it('value proposition titles are semibold', () => {
    render(<Mission />);

    const title = screen.getByText('Quality at Scale');
    expect(title).toHaveClass('font-semibold');
  });

  it('value proposition descriptions have correct styling', () => {
    render(<Mission />);

    const description = screen.getByText(/Consistent, professional content/i);
    expect(description).toHaveClass('text-muted-foreground', 'text-sm');
  });

  it('Target icon wrapper has secondary background', () => {
    const { container } = render(<Mission />);

    const targetWrapper = container.querySelector('.bg-secondary\\/20');
    expect(targetWrapper).toBeInTheDocument();
  });

  it('Clock icon wrapper has primary background', () => {
    const { container } = render(<Mission />);

    const clockWrapper = container.querySelector('.bg-primary\\/20');
    expect(clockWrapper).toBeInTheDocument();
  });

  it('renders items with flex layout and gap', () => {
    const { container } = render(<Mission />);

    const flexItems = container.querySelectorAll('.flex.items-start.gap-3');
    expect(flexItems.length).toBe(3);
  });

  it('has proper spacing and max width', () => {
    const { container } = render(<Mission />);

    const spacingContainer = container.querySelector('.max-w-8xl.mx-auto.space-y-24.sm\\:space-y-32');
    expect(spacingContainer).toBeInTheDocument();
  });
});
