import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useToast, { toast } from './useToast';
import { toast as sonnerToast } from 'sonner';

// Mock sonner
vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  }),
}));

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('hook', () => {
    it('returns toast and sonnerToast objects', () => {
      const { result } = renderHook(() => useToast());

      expect(result.current).toHaveProperty('toast');
      expect(result.current).toHaveProperty('sonnerToast');
    });

    it('toast object has all required methods', () => {
      const { result } = renderHook(() => useToast());

      expect(result.current.toast).toHaveProperty('success');
      expect(result.current.toast).toHaveProperty('error');
      expect(result.current.toast).toHaveProperty('info');
      expect(result.current.toast).toHaveProperty('warning');
      expect(result.current.toast).toHaveProperty('raw');
      expect(result.current.toast).toHaveProperty('loading');
    });
  });

  describe('toast.success', () => {
    it('calls sonnerToast.success with string message', () => {
      toast.success('Success message');

      expect(sonnerToast.success).toHaveBeenCalledWith('Success message');
    });

    it('calls sonnerToast.success with ReactNode message', () => {
      const reactNode = { type: 'div', props: {} };
      toast.success(reactNode as never);

      expect(sonnerToast.success).toHaveBeenCalledWith(reactNode);
    });
  });

  describe('toast.error', () => {
    it('calls sonnerToast.error with string message', () => {
      toast.error('Error message');

      expect(sonnerToast.error).toHaveBeenCalledWith('Error message');
    });

    it('calls sonnerToast.error with ReactNode message', () => {
      const reactNode = { type: 'div', props: {} };
      toast.error(reactNode as never);

      expect(sonnerToast.error).toHaveBeenCalledWith(reactNode);
    });
  });

  describe('toast.info', () => {
    it('calls sonnerToast with string message', () => {
      toast.info('Info message');

      expect(sonnerToast).toHaveBeenCalledWith('Info message');
    });
  });

  describe('toast.warning', () => {
    it('calls sonnerToast with string message', () => {
      toast.warning('Warning message');

      expect(sonnerToast).toHaveBeenCalledWith('Warning message');
    });
  });

  describe('toast.raw', () => {
    it('calls sonnerToast with string message', () => {
      toast.raw('Raw message');

      expect(sonnerToast).toHaveBeenCalledWith('Raw message');
    });
  });

  describe('toast.loading', () => {
    it('calls sonnerToast.loading with string message', () => {
      toast.loading('Loading message');

      expect(sonnerToast.loading).toHaveBeenCalledWith('Loading message');
    });

    it('calls sonnerToast.loading with ReactNode message', () => {
      const reactNode = { type: 'div', props: {} };
      toast.loading(reactNode as never);

      expect(sonnerToast.loading).toHaveBeenCalledWith(reactNode);
    });
  });
});
