import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useIsMobile } from './useIsMobile';

describe('useIsMobile', () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>;  let listeners: ((this: MediaQueryList, ev: MediaQueryListEvent) => void)[];

  beforeEach(() => {
    listeners = [];
    mockMatchMedia = vi.fn();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    listeners = [];
  });

  const createMockMediaQueryList = (matches: boolean): MediaQueryList => {
    const mql = {
      matches,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),      addEventListener: vi.fn((event: string, listener: () => void) => {
        if (event === 'change') {
          listeners.push(listener);
        }
      }),      removeEventListener: vi.fn((event: string, listener: () => void) => {
        if (event === 'change') {
          listeners = listeners.filter((l) => l !== listener);
        }
      }),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;

    return mql;
  };

  describe('initial state', () => {
    it('returns false when window width is >= 768px', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      mockMatchMedia.mockReturnValue(createMockMediaQueryList(false));

      const { result } = renderHook(() => useIsMobile());

      await waitFor(() => {
        expect(result.current).toBe(false);
      });
    });

    it('returns true when window width is < 768px', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      mockMatchMedia.mockReturnValue(createMockMediaQueryList(true));

      const { result } = renderHook(() => useIsMobile());

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('returns false for window width exactly at 768px', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      mockMatchMedia.mockReturnValue(createMockMediaQueryList(false));

      const { result } = renderHook(() => useIsMobile());

      await waitFor(() => {
        expect(result.current).toBe(false);
      });
    });

    it('returns true for window width at 767px', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 767,
      });

      mockMatchMedia.mockReturnValue(createMockMediaQueryList(true));

      const { result } = renderHook(() => useIsMobile());

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });
  });

  describe('matchMedia setup', () => {
    it('calls matchMedia with correct breakpoint query', () => {
      mockMatchMedia.mockReturnValue(createMockMediaQueryList(false));

      renderHook(() => useIsMobile());

      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)');
    });

    it('registers change event listener', () => {
      const mql = createMockMediaQueryList(false);
      mockMatchMedia.mockReturnValue(mql);

      renderHook(() => useIsMobile());

      expect(mql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('responsive behavior', () => {
    it('updates when window is resized from desktop to mobile', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const mql = createMockMediaQueryList(false);
      mockMatchMedia.mockReturnValue(mql);

      const { result } = renderHook(() => useIsMobile());

      await waitFor(() => {
        expect(result.current).toBe(false);
      });

      // Simulate resize to mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      // Trigger the change event
      listeners.forEach((listener) => {
        listener.call(mql, {} as MediaQueryListEvent);
      });

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('updates when window is resized from mobile to desktop', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      const mql = createMockMediaQueryList(true);
      mockMatchMedia.mockReturnValue(mql);

      const { result } = renderHook(() => useIsMobile());

      await waitFor(() => {
        expect(result.current).toBe(true);
      });

      // Simulate resize to desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      // Trigger the change event
      listeners.forEach((listener) => {
        listener.call(mql, {} as MediaQueryListEvent);
      });

      await waitFor(() => {
        expect(result.current).toBe(false);
      });
    });

    it('handles multiple resize events', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const mql = createMockMediaQueryList(false);
      mockMatchMedia.mockReturnValue(mql);

      const { result } = renderHook(() => useIsMobile());

      await waitFor(() => {
        expect(result.current).toBe(false);
      });

      // Resize to mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      listeners.forEach((listener) => listener.call(mql, {} as MediaQueryListEvent));

      await waitFor(() => {
        expect(result.current).toBe(true);
      });

      // Resize back to desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });
      listeners.forEach((listener) => listener.call(mql, {} as MediaQueryListEvent));

      await waitFor(() => {
        expect(result.current).toBe(false);
      });

      // Resize to tablet/mobile again
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });
      listeners.forEach((listener) => listener.call(mql, {} as MediaQueryListEvent));

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });
  });

  describe('cleanup', () => {
    it('removes event listener on unmount', () => {
      const mql = createMockMediaQueryList(false);
      mockMatchMedia.mockReturnValue(mql);

      const { unmount } = renderHook(() => useIsMobile());

      expect(mql.addEventListener).toHaveBeenCalled();

      unmount();

      expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('does not update state after unmount', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const mql = createMockMediaQueryList(false);
      mockMatchMedia.mockReturnValue(mql);

      const { result, unmount } = renderHook(() => useIsMobile());

      await waitFor(() => {
        expect(result.current).toBe(false);
      });

      unmount();

      // Try to trigger change after unmount
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      // Should not throw or cause issues
      expect(() => {
        listeners.forEach((listener) => listener.call(mql, {} as MediaQueryListEvent));
      }).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('handles very small screen widths', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      mockMatchMedia.mockReturnValue(createMockMediaQueryList(true));

      const { result } = renderHook(() => useIsMobile());

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('handles very large screen widths', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 2560,
      });

      mockMatchMedia.mockReturnValue(createMockMediaQueryList(false));

      const { result } = renderHook(() => useIsMobile());

      await waitFor(() => {
        expect(result.current).toBe(false);
      });
    });

    it('handles boundary at 767px (last mobile width)', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 767,
      });

      mockMatchMedia.mockReturnValue(createMockMediaQueryList(true));

      const { result } = renderHook(() => useIsMobile());

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });
  });

  describe('return value coercion', () => {
    it('coerces undefined initial value to false', async () => {
      // Ensure a deterministic window width for this test so initial value
      // isn't influenced by previous tests altering `window.innerWidth`.
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      mockMatchMedia.mockReturnValue(createMockMediaQueryList(false));

      const { result } = renderHook(() => useIsMobile());

      // Initially undefined, should be coerced to false by !!
      expect(result.current).toBe(false);

      // After effect runs
      await waitFor(() => {
        expect(result.current).toBe(false);
      });
    });

    it('always returns boolean true or false', async () => {
      mockMatchMedia.mockReturnValue(createMockMediaQueryList(true));

      const { result } = renderHook(() => useIsMobile());

      await waitFor(() => {
        expect(typeof result.current).toBe('boolean');
        expect(result.current === true || result.current === false).toBe(true);
      });
    });
  });
});
