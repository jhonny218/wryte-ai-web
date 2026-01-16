import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders hero section', () => {
    const { container } = render(<Hero />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('renders main heading', () => {
    render(<Hero />);

    expect(screen.getByText('Create Blogs')).toBeInTheDocument();
    expect(screen.getByText('On Autopilot')).toBeInTheDocument();
  });

  it('renders AI-Powered Blog Generation badge', () => {
    render(<Hero />);

    expect(screen.getByText('AI-Powered Blog Generation')).toBeInTheDocument();
  });

  it('renders slogan with brand colors', () => {
    render(<Hero />);

    const wryteTexts = screen.getAllByText('Wryte');
    expect(wryteTexts.length).toBe(2);
    expect(screen.getByText(/Better,/i)).toBeInTheDocument();
    expect(screen.getByText(/Faster/i)).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<Hero />);

    expect(screen.getByText(/From strategy to publication—AI-powered blog generation/i)).toBeInTheDocument();
  });

  it('renders Get Started Free button', () => {
    render(<Hero />);

    const button = screen.getByRole('button', { name: /get started free/i });
    expect(button).toBeInTheDocument();
  });

  it('renders View on GitHub link', () => {
    render(<Hero />);

    const githubLink = screen.getByRole('link', { name: /view on github/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/jhonny218/wryte-ai-web.git');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('renders Wryte AI logo', () => {
    render(<Hero />);

    const logo = screen.getByAltText('Wryte AI Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src');
  });

  it('renders statistics section', () => {
    render(<Hero />);

    expect(screen.getByText('10K+')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();

    expect(screen.getByText('50M+')).toBeInTheDocument();
    expect(screen.getByText('Words Generated')).toBeInTheDocument();

    expect(screen.getByText('99%')).toBeInTheDocument();
    expect(screen.getByText('Satisfaction')).toBeInTheDocument();
  });

  it('has correct grid layout for stats', () => {
    const { container } = render(<Hero />);

    const statsGrid = container.querySelector('.grid.grid-cols-3.gap-8.pt-8');
    expect(statsGrid).toBeInTheDocument();
  });

  it('renders Sparkles icon in badge', () => {
    const { container } = render(<Hero />);

    const badge = container.querySelector('.inline-flex.items-center');
    const svg = badge?.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders ArrowRight icon in CTA button', () => {
    render(<Hero />);

    const button = screen.getByRole('button', { name: /get started free/i });
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders GitHubLogoIcon in GitHub link', () => {
    render(<Hero />);

    const githubLink = screen.getByRole('link', { name: /view on github/i });
    const svg = githubLink.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has background gradient effects', () => {
    const { container } = render(<Hero />);

    const gradients = container.querySelectorAll('.absolute.rounded-full');
    expect(gradients.length).toBeGreaterThan(0);
  });

  it('heading has correct styling', () => {
    const { container } = render(<Hero />);

    const heading = container.querySelector('h1');
    expect(heading?.tagName).toBe('H1');
    expect(heading).toHaveClass('text-5xl', 'font-bold');
  });

  it('gradient text in heading has correct classes', () => {
    render(<Hero />);

    const gradientText = screen.getByText('On Autopilot');
    expect(gradientText).toHaveClass('from-secondary', 'to-primary', 'bg-gradient-to-r', 'bg-clip-text', 'text-transparent');
  });

  it('renders flex layout for CTA buttons', () => {
    const { container } = render(<Hero />);

    const ctaContainer = container.querySelector('.flex.flex-col.gap-4.sm\\:flex-row');
    expect(ctaContainer).toBeInTheDocument();
  });

  it('has proper container and padding', () => {
    const { container } = render(<Hero />);
    const section = container.querySelector('section');

    expect(section).toHaveClass('relative', 'container', 'py-20');
  });

  it('logo has glow effect wrapper', () => {
    const { container } = render(<Hero />);

    const glowEffect = container.querySelector('.group.relative.flex.items-center.justify-center');
    expect(glowEffect).toBeInTheDocument();
  });

  it('description text has correct styling', () => {
    render(<Hero />);

    const description = screen.getByText(/From strategy to publication/i);
    expect(description).toHaveClass('text-muted-foreground');
  });

  it('stats numbers have correct styling', () => {
    render(<Hero />);

    const statNumber = screen.getByText('10K+');
    expect(statNumber).toHaveClass('text-secondary', 'text-3xl', 'font-bold');
  });

  it('renders responsive layout classes', () => {
    const { container } = render(<Hero />);

    const mainLayout = container.querySelector('.flex.flex-col.items-center.gap-12.lg\\:flex-row');
    expect(mainLayout).toBeInTheDocument();
  });
});
