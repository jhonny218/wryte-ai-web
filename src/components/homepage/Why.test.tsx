import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Why } from './Why';

describe('Why', () => {
  it('renders why section', () => {
    const { container } = render(<Why />);
    const section = container.querySelector('section#why');
    expect(section).toBeInTheDocument();
  });

  it('renders badge', () => {
    render(<Why />);

    expect(screen.getByText('Why Choose Wryte AI')).toBeInTheDocument();
  });

  it('renders main heading with gradient text', () => {
    render(<Why />);

    expect(screen.getByText('Not Just Another')).toBeInTheDocument();
    expect(screen.getByText('AI Writing Tool')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<Why />);

    expect(screen.getByText(/While others give you a blank box and generic outputs/i)).toBeInTheDocument();
  });

  it('renders all four feature cards', () => {
    render(<Why />);

    expect(screen.getByText('Complete Workflow')).toBeInTheDocument();
    expect(screen.getByText('Brand Voice Precision')).toBeInTheDocument();
    expect(screen.getByText('SEO-First Approach')).toBeInTheDocument();
    expect(screen.getByText('Calendar Intelligence')).toBeInTheDocument();
  });

  it('renders feature descriptions', () => {
    render(<Why />);

    expect(screen.getByText(/From strategy and planning to writing and publishing/i)).toBeInTheDocument();
    expect(screen.getByText(/AI that actually sounds like you/i)).toBeInTheDocument();
    expect(screen.getByText(/Every blog is optimized for search engines/i)).toBeInTheDocument();
    expect(screen.getByText(/Plan months ahead with visual calendar/i)).toBeInTheDocument();
  });

  it('renders lucide icons for each feature', () => {
    const { container } = render(<Why />);

    const iconWrappers = container.querySelectorAll('.flex.h-12.w-12.items-center.justify-center.rounded-xl');
    expect(iconWrappers.length).toBe(4);
  });

  it('has correct grid layout for cards', () => {
    const { container } = render(<Why />);

    const grid = container.querySelector('.grid.gap-6.md\\:grid-cols-2');
    expect(grid).toBeInTheDocument();
  });

  it('renders dashboard image', () => {
    render(<Why />);

    const image = screen.getByAltText('Wryte AI Dashboard');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
  });

  it('image is hidden on mobile', () => {
    const { container } = render(<Why />);

    const imageContainer = container.querySelector('.relative.hidden.lg\\:block');
    expect(imageContainer).toBeInTheDocument();
  });

  it('has proper container and padding', () => {
    const { container } = render(<Why />);
    const section = container.querySelector('section');

    expect(section).toHaveClass('container', 'py-20');
  });

  it('heading has correct styling', () => {
    const { container } = render(<Why />);

    const heading = container.querySelector('h2');
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'md:text-4xl', 'lg:text-5xl');
  });

  it('subtitle has correct styling', () => {
    render(<Why />);

    const subtitle = screen.getByText(/While others give you a blank box/i);
    expect(subtitle).toHaveClass('text-muted-foreground', 'mt-4', 'text-lg', 'md:text-xl');
  });

  it('gradient text has correct classes', () => {
    const { container } = render(<Why />);

    const gradientText = container.querySelector('.from-secondary\\/60');
    expect(gradientText).toHaveClass('to-secondary', 'bg-gradient-to-b', 'bg-clip-text', 'text-transparent');
  });

  it('badge has secondary variant', () => {
    render(<Why />);

    const badge = screen.getByText('Why Choose Wryte AI');
    expect(badge).toHaveClass('mb-2');
  });

  it('cards have hover effects', () => {
    const { container } = render(<Why />);

    const cards = container.querySelectorAll('.hover\\:shadow-xl');
    expect(cards.length).toBe(4);
  });

  it('cards have gradient blur effects', () => {
    const { container } = render(<Why />);

    const blurEffects = container.querySelectorAll('.blur-2xl');
    expect(blurEffects.length).toBeGreaterThan(0);
  });

  it('centers the heading section', () => {
    const { container } = render(<Why />);

    const headingContainer = container.querySelector('.mx-auto.mb-16.max-w-4xl.text-center');
    expect(headingContainer).toBeInTheDocument();
  });

  it('has responsive grid layout', () => {
    const { container } = render(<Why />);

    const mainGrid = container.querySelector('.grid.items-center.gap-8.lg\\:grid-cols-2');
    expect(mainGrid).toBeInTheDocument();
  });

  it('Complete Workflow card has secondary color', () => {
    const { container } = render(<Why />);

    const secondaryCards = container.querySelectorAll('.border-secondary\\/20');
    expect(secondaryCards.length).toBe(3);
  });

  it('Brand Voice Precision card has primary color', () => {
    const { container } = render(<Why />);

    const primaryCards = container.querySelectorAll('.border-primary\\/20');
    expect(primaryCards.length).toBe(2);
  });

  it('icon wrappers have transition effects', () => {
    const { container } = render(<Why />);

    const iconWrappers = container.querySelectorAll('.transition-all.group-hover\\:scale-110');
    expect(iconWrappers.length).toBe(4);
  });

  it('card descriptions have correct styling', () => {
    const { container } = render(<Why />);

    const descriptions = container.querySelectorAll('.text-muted-foreground.text-sm');
    expect(descriptions.length).toBe(4);
  });

  it('image has border and rounded corners', () => {
    render(<Why />);

    const image = screen.getByAltText('Wryte AI Dashboard');
    expect(image).toHaveClass('border-secondary/20', 'relative', 'w-full', 'rounded-xl', 'border', 'object-cover', 'shadow-2xl');
  });

  it('image container has gradient background', () => {
    const { container } = render(<Why />);

    const gradientBg = container.querySelector('.from-secondary\\/20.to-primary\\/20');
    expect(gradientBg).toBeInTheDocument();
  });

  it('has proper spacing and max width', () => {
    const { container } = render(<Why />);

    const spacingContainer = container.querySelector('.max-w-8xl.mx-auto.space-y-8');
    expect(spacingContainer).toBeInTheDocument();
  });
});
