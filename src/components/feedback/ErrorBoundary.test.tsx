import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { ErrorBoundary } from './ErrorBoundary';

describe('ErrorBoundary', () => {
  it('renders fallback when a child throws and reload button calls window.location.reload', () => {
    const originalLocation = window.location;
    const reloadMock = vi.fn();
    // Replace window.location with a configurable mock that includes reload
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload: reloadMock },
    });

    const Bomb = () => {
      throw new Error('boom');
    };

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /reload page/i });
    btn.click();
    expect(reloadMock).toHaveBeenCalled();

    // restore original location
    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
  });
});
