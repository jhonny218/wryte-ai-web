import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScrollToTop } from './ScrollToTop';

describe('ScrollToTop', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });

    window.scroll = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('does not show button when page is at top', () => {
    render(<ScrollToTop />);

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('shows button when scrolled past 400px', async () => {
    render(<ScrollToTop />);

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 500,
    });

    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  it('hides button when scrolled back to top', async () => {
    render(<ScrollToTop />);

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 500,
    });
    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 200,
    });
    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  it('scrolls to top when button is clicked', async () => {
    const user = userEvent.setup();
    render(<ScrollToTop />);

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 500,
    });
    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const button = screen.getByRole('button');
    await user.click(button);

    expect(window.scroll).toHaveBeenCalledWith({
      top: 0,
      left: 0,
    });
  });

  it('has correct styling classes', async () => {
    render(<ScrollToTop />);

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 500,
    });
    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveClass('fixed', 'right-4', 'bottom-4', 'opacity-90', 'shadow-md');
    });
  });

  it('renders ArrowUpToLine icon', async () => {
    render(<ScrollToTop />);

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 500,
    });
    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('h-4', 'w-4');
    });
  });

  it('button has icon size variant', async () => {
    render(<ScrollToTop />);

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 500,
    });
    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });
});
