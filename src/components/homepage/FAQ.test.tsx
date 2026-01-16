import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FAQ } from './FAQ';

describe('FAQ', () => {
  it('renders FAQ section', () => {
    const { container } = render(<FAQ />);
    const section = container.querySelector('section#faq');
    expect(section).toBeInTheDocument();
  });

  it('renders main heading', () => {
    render(<FAQ />);

    expect(screen.getByText('Frequently Asked')).toBeInTheDocument();
    expect(screen.getByText('Questions')).toBeInTheDocument();
  });

  it('renders all six FAQ questions', () => {
    render(<FAQ />);

    expect(screen.getByText("How does Wryte AI learn my company's voice and style?")).toBeInTheDocument();
    expect(screen.getByText('Can I edit the AI-generated content before publishing?')).toBeInTheDocument();
    expect(screen.getByText('What CMS platforms does Wryte AI integrate with?')).toBeInTheDocument();
    expect(screen.getByText('How does the SEO optimization work?')).toBeInTheDocument();
    expect(screen.getByText('Is my company data and content secure?')).toBeInTheDocument();
    expect(screen.getByText('Can multiple team members collaborate on blog creation?')).toBeInTheDocument();
  });

  it('does not show answers initially', () => {
    render(<FAQ />);

    const answer = screen.queryByText(/During onboarding, you provide your company information/i);
    expect(answer).not.toBeInTheDocument();
  });

  it('shows answer when question is clicked', async () => {
    const user = userEvent.setup();
    render(<FAQ />);

    const question = screen.getByText("How does Wryte AI learn my company's voice and style?");
    await user.click(question);

    const answer = screen.getByText(/During onboarding, you provide your company information/i);
    expect(answer).toBeVisible();
  });

  it('hides answer when question is clicked again', async () => {
    const user = userEvent.setup();
    render(<FAQ />);

    const question = screen.getByText("How does Wryte AI learn my company's voice and style?");
    await user.click(question);

    const answer = screen.getByText(/During onboarding, you provide your company information/i);
    expect(answer).toBeVisible();

    await user.click(question);
    const answerAfterSecondClick = screen.queryByText(/During onboarding, you provide your company information/i);
    expect(answerAfterSecondClick).not.toBeInTheDocument();
  });

  it('renders "Still have questions?" section', () => {
    render(<FAQ />);

    expect(screen.getByText(/Still have questions?/i)).toBeInTheDocument();
  });

  it('renders contact link', () => {
    render(<FAQ />);

    const contactLink = screen.getByText('Contact us');
    expect(contactLink).toBeInTheDocument();
    expect(contactLink.tagName).toBe('A');
    expect(contactLink).toHaveAttribute('href', '#');
  });

  it('has correct styling on heading', () => {
    const { container } = render(<FAQ />);

    const heading = container.querySelector('h2');
    expect(heading).toHaveClass('mb-4', 'text-3xl', 'font-bold', 'md:text-4xl');
  });

  it('renders accordion with correct type', () => {
    const { container } = render(<FAQ />);

    const accordion = container.querySelector('[class*="AccordionRoot"]');
    expect(accordion).toBeInTheDocument();
  });

  it('gradient text has correct styling', () => {
    const { container } = render(<FAQ />);

    const gradientText = container.querySelector('.from-secondary\\/60');
    expect(gradientText).toHaveClass('to-secondary', 'bg-gradient-to-b', 'bg-clip-text', 'text-transparent');
  });

  it('contact link has correct styling', () => {
    render(<FAQ />);

    const contactLink = screen.getByText('Contact us');
    expect(contactLink).toHaveClass('text-primary', 'border-primary', 'transition-all', 'hover:border-b-2');
  });

  it('renders all accordion items with correct values', () => {
    const { container } = render(<FAQ />);

    const items = container.querySelectorAll('[data-radix-collection-item]');
    expect(items.length).toBe(6);
  });

  it('accordion triggers are left-aligned', () => {
    const { container } = render(<FAQ />);

    const triggers = container.querySelectorAll('.text-left');
    expect(triggers.length).toBeGreaterThan(0);
  });

  it('has proper container and padding', () => {
    const { container } = render(<FAQ />);
    const section = container.querySelector('section');

    expect(section).toHaveClass('container', 'py-20');
  });
});
