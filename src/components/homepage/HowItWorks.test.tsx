import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HowItWorks } from './HowItWorks';

describe('HowItWorks', () => {
  it('renders how it works section', () => {
    const { container } = render(<HowItWorks />);
    const section = container.querySelector('section#howItWorks');
    expect(section).toBeInTheDocument();
  });

  it('renders main heading with gradient text', () => {
    render(<HowItWorks />);

    expect(screen.getByText('How It')).toBeInTheDocument();
    expect(screen.getByText('Works')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<HowItWorks />);

    expect(screen.getByText(/From onboarding to publication, create SEO-optimized blogs/i)).toBeInTheDocument();
  });

  it('renders all four step cards', () => {
    render(<HowItWorks />);

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    expect(screen.getByText('Step 4')).toBeInTheDocument();
  });

  it('renders step titles', () => {
    render(<HowItWorks />);

    expect(screen.getByText('Onboarding')).toBeInTheDocument();
    expect(screen.getByText('Plan & Schedule')).toBeInTheDocument();
    expect(screen.getByText('Design Layout')).toBeInTheDocument();
    expect(screen.getByText('Generate & Publish')).toBeInTheDocument();
  });

  it('renders step descriptions', () => {
    render(<HowItWorks />);

    expect(screen.getByText(/Share your company info, target audience/i)).toBeInTheDocument();
    expect(screen.getByText(/AI generates blog titles based on your inputs/i)).toBeInTheDocument();
    expect(screen.getByText(/Review AI-generated blog structure with sections/i)).toBeInTheDocument();
    expect(screen.getByText(/AI writes your complete SEO-optimized blog/i)).toBeInTheDocument();
  });

  it('renders lucide icons for each step', () => {
    const { container } = render(<HowItWorks />);

    const iconWrappers = container.querySelectorAll('.flex.h-16.w-16.items-center.justify-center.rounded-2xl');
    expect(iconWrappers.length).toBe(4);
  });

  it('has correct grid layout', () => {
    const { container } = render(<HowItWorks />);

    const grid = container.querySelector('.grid.gap-8.md\\:grid-cols-2.lg\\:grid-cols-4');
    expect(grid).toBeInTheDocument();
  });

  it('has proper container and padding', () => {
    const { container } = render(<HowItWorks />);
    const section = container.querySelector('section');

    expect(section).toHaveClass('container', 'py-20');
  });

  it('heading has correct styling', () => {
    const { container } = render(<HowItWorks />);

    const heading = container.querySelector('h2');
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'md:text-4xl', 'lg:text-5xl');
  });

  it('subtitle has correct styling', () => {
    render(<HowItWorks />);

    const subtitle = screen.getByText(/From onboarding to publication/i);
    expect(subtitle).toHaveClass('text-muted-foreground', 'mt-4', 'text-lg', 'md:text-xl');
  });

  it('gradient text has correct classes', () => {
    const { container } = render(<HowItWorks />);

    const gradientText = container.querySelector('.from-secondary\\/60');
    expect(gradientText).toHaveClass('to-secondary', 'bg-linear-to-b', 'bg-clip-text', 'text-transparent');
  });

  it('step 1 has primary color styling', () => {
    render(<HowItWorks />);

    const step1Badge = screen.getByText('Step 1');
    expect(step1Badge).toHaveClass('text-primary');
  });

  it('step 2 has secondary color styling', () => {
    render(<HowItWorks />);

    const step2Badge = screen.getByText('Step 2');
    expect(step2Badge).toHaveClass('text-secondary');
  });

  it('cards have hover effects', () => {
    const { container } = render(<HowItWorks />);

    const cards = container.querySelectorAll('.hover\\:shadow-2xl');
    expect(cards.length).toBe(4);
  });

  it('cards have gradient backgrounds', () => {
    const { container } = render(<HowItWorks />);

    const gradientCards = container.querySelectorAll('.bg-gradient-to-br');
    expect(gradientCards.length).toBeGreaterThan(0);
  });

  it('centers the heading section', () => {
    const { container } = render(<HowItWorks />);

    const headingContainer = container.querySelector('.mx-auto.mb-16.max-w-2xl.text-center');
    expect(headingContainer).toBeInTheDocument();
  });

  it('renders blur effects on cards', () => {
    const { container } = render(<HowItWorks />);

    const blurEffects = container.querySelectorAll('.blur-3xl');
    expect(blurEffects.length).toBe(4);
  });

  it('icon wrappers have transition effects', () => {
    const { container } = render(<HowItWorks />);

    const iconWrappers = container.querySelectorAll('.transition-all.group-hover\\:scale-110');
    expect(iconWrappers.length).toBe(4);
  });

  it('step labels have correct font styling', () => {
    render(<HowItWorks />);

    const step1 = screen.getByText('Step 1');
    expect(step1).toHaveClass('text-sm', 'font-semibold');
  });

  it('card titles have correct styling', () => {
    render(<HowItWorks />);

    const onboardingTitle = screen.getByText('Onboarding');
    expect(onboardingTitle).toHaveClass('text-xl');
  });

  it('card descriptions have correct styling', () => {
    const { container } = render(<HowItWorks />);

    const descriptions = container.querySelectorAll('.text-base.leading-relaxed');
    expect(descriptions.length).toBe(4);
  });
});
