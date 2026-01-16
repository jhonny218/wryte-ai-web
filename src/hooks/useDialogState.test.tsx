import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useDialogState from './useDialogState';

describe('useDialogState', () => {
  describe('initialization', () => {
    it('initializes with null by default', () => {
      const { result } = renderHook(() => useDialogState());

      expect(result.current[0]).toBeNull();
    });

    it('initializes with provided initial state', () => {
      const { result } = renderHook(() => useDialogState<'approve' | 'reject'>('approve'));

      expect(result.current[0]).toBe('approve');
    });

    it('initializes with boolean true', () => {
      const { result } = renderHook(() => useDialogState<boolean>(true));

      expect(result.current[0]).toBe(true);
    });

    it('initializes with boolean false', () => {
      const { result } = renderHook(() => useDialogState<boolean>(false));

      expect(result.current[0]).toBe(false);
    });
  });

  describe('toggle behavior with string values', () => {
    it('sets value when null', () => {
      const { result } = renderHook(() => useDialogState<'approve' | 'reject'>());

      act(() => {
        result.current[1]('approve');
      });

      expect(result.current[0]).toBe('approve');
    });

    it('toggles to null when same value is set', () => {
      const { result } = renderHook(() => useDialogState<'approve' | 'reject'>());

      act(() => {
        result.current[1]('approve');
      });

      expect(result.current[0]).toBe('approve');

      act(() => {
        result.current[1]('approve');
      });

      expect(result.current[0]).toBeNull();
    });

    it('changes value when different value is set', () => {
      const { result } = renderHook(() => useDialogState<'approve' | 'reject'>());

      act(() => {
        result.current[1]('approve');
      });

      expect(result.current[0]).toBe('approve');

      act(() => {
        result.current[1]('reject');
      });

      expect(result.current[0]).toBe('reject');
    });

    it('sets to null explicitly', () => {
      const { result } = renderHook(() => useDialogState<'approve' | 'reject'>('approve'));

      act(() => {
        result.current[1](null);
      });

      expect(result.current[0]).toBeNull();
    });
  });

  describe('toggle behavior with boolean values', () => {
    it('sets true when null', () => {
      const { result } = renderHook(() => useDialogState<boolean>());

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
    });

    it('toggles to null when same boolean value is set', () => {
      const { result } = renderHook(() => useDialogState<boolean>(true));

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBeNull();
    });

    it('changes from true to false', () => {
      const { result } = renderHook(() => useDialogState<boolean>(true));

      act(() => {
        result.current[1](false);
      });

      expect(result.current[0]).toBe(false);
    });

    it('changes from false to true', () => {
      const { result } = renderHook(() => useDialogState<boolean>(false));

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
    });
  });

  describe('multiple state changes', () => {
    it('handles sequence of state changes correctly', () => {
      const { result } = renderHook(() => useDialogState<'create' | 'edit' | 'delete'>());

      // Start at null
      expect(result.current[0]).toBeNull();

      // Set to 'create'
      act(() => {
        result.current[1]('create');
      });
      expect(result.current[0]).toBe('create');

      // Toggle 'create' back to null
      act(() => {
        result.current[1]('create');
      });
      expect(result.current[0]).toBeNull();

      // Set to 'edit'
      act(() => {
        result.current[1]('edit');
      });
      expect(result.current[0]).toBe('edit');

      // Change to 'delete'
      act(() => {
        result.current[1]('delete');
      });
      expect(result.current[0]).toBe('delete');

      // Explicitly set to null
      act(() => {
        result.current[1](null);
      });
      expect(result.current[0]).toBeNull();
    });
  });

  describe('return value structure', () => {
    it('returns tuple with value and setter', () => {
      const { result } = renderHook(() => useDialogState<'open' | 'close'>());

      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current).toHaveLength(2);
      expect(typeof result.current[0] === 'string' || result.current[0] === null).toBe(true);
      expect(typeof result.current[1]).toBe('function');
    });

    it('maintains constant setter reference', () => {
      const { result, rerender } = renderHook(() => useDialogState<'a' | 'b'>());

      const initialSetter = result.current[1];

      act(() => {
        result.current[1]('a');
      });
      rerender();

      expect(result.current[1]).toBe(initialSetter);
    });
  });

  describe('edge cases', () => {
    it('handles rapid consecutive calls', () => {
      const { result } = renderHook(() => useDialogState<'yes' | 'no'>());

      act(() => {
        result.current[1]('yes');
        result.current[1]('yes');
        result.current[1]('yes');
      });

      // After three toggles of 'yes': set -> null -> set
      expect(result.current[0]).toBe('yes');
    });

    it('handles null to null transition', () => {
      const { result } = renderHook(() => useDialogState<'option'>());

      expect(result.current[0]).toBeNull();

      act(() => {
        result.current[1](null);
      });

      expect(result.current[0]).toBeNull();
    });
  });

  describe('type safety examples', () => {
    it('works with string union types', () => {
      const { result } = renderHook(() =>
        useDialogState<'approve' | 'reject'>()
      );

      act(() => {
        result.current[1]('approve');
      });

      expect(result.current[0]).toBe('approve');
    });

    it('works with boolean type', () => {
      const { result } = renderHook(() => useDialogState<boolean>());

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
    });

    it('works with wide string union', () => {
      const { result } = renderHook(() =>
        useDialogState<'create' | 'update' | 'delete' | 'view'>()
      );

      act(() => {
        result.current[1]('create');
      });

      expect(result.current[0]).toBe('create');

      act(() => {
        result.current[1]('update');
      });

      expect(result.current[0]).toBe('update');
    });
  });
});
