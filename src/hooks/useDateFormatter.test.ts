import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDateFormatter, formatDate, toInputDate, fromInputDate } from './useDateFormatter';

describe('useDateFormatter', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('hook', () => {
    it('returns formatDate, toInputDate, and fromInputDate functions', () => {
      const { result } = renderHook(() => useDateFormatter());

      expect(result.current).toHaveProperty('formatDate');
      expect(result.current).toHaveProperty('toInputDate');
      expect(result.current).toHaveProperty('fromInputDate');
      expect(typeof result.current.formatDate).toBe('function');
      expect(typeof result.current.toInputDate).toBe('function');
      expect(typeof result.current.fromInputDate).toBe('function');
    });
  });

  describe('formatDate', () => {
    it('formats database date string correctly', () => {
      const result = formatDate('2026-01-20 00:00:00');
      expect(result).toBe('Jan 20, 2026');
    });

    it('formats ISO date string correctly', () => {
      const result = formatDate('2026-01-20T00:00:00Z');
      expect(result).toBe('Jan 20, 2026');
    });

    it('handles date without Z suffix', () => {
      const result = formatDate('2026-01-20T00:00:00');
      expect(result).toBe('Jan 20, 2026');
    });

    it('returns "-" for null input', () => {
      const result = formatDate(null);
      expect(result).toBe('-');
    });

    it('returns "-" for undefined input', () => {
      const result = formatDate(undefined);
      expect(result).toBe('-');
    });

    it('returns "-" for empty string', () => {
      const result = formatDate('');
      expect(result).toBe('-');
    });

    it('returns "-" for invalid date string', () => {
      const result = formatDate('not-a-date');
      expect(result).toBe('-');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid date string:', 'not-a-date');
    });

    it('applies custom date format options', () => {
      const result = formatDate('2026-01-20 00:00:00', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      expect(result).toBe('January 20, 2026');
    });

    it('handles dates with time component', () => {
      const result = formatDate('2026-03-15 14:30:45');
      expect(result).toBe('Mar 15, 2026');
    });
  });

  describe('toInputDate', () => {
    it('converts database date string to YYYY-MM-DD format', () => {
      const result = toInputDate('2026-01-20 00:00:00');
      expect(result).toBe('2026-01-20');
    });

    it('converts ISO date string to YYYY-MM-DD format', () => {
      const result = toInputDate('2026-01-20T00:00:00Z');
      expect(result).toBe('2026-01-20');
    });

    it('handles date without Z suffix', () => {
      const result = toInputDate('2026-01-20T00:00:00');
      expect(result).toBe('2026-01-20');
    });

    it('returns empty string for null input', () => {
      const result = toInputDate(null);
      expect(result).toBe('');
    });

    it('returns empty string for undefined input', () => {
      const result = toInputDate(undefined);
      expect(result).toBe('');
    });

    it('returns empty string for empty string', () => {
      const result = toInputDate('');
      expect(result).toBe('');
    });

    it('returns empty string for invalid date string', () => {
      const result = toInputDate('invalid-date');
      expect(result).toBe('');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid date string:', 'invalid-date');
    });

    it('handles dates with time component', () => {
      const result = toInputDate('2026-03-15 09:30:00');
      expect(result).toBe('2026-03-15');
    });

    it('preserves date consistency (no timezone shift)', () => {
      const inputDate = '2026-12-25 00:00:00';
      const result = toInputDate(inputDate);
      expect(result).toBe('2026-12-25');
    });
  });

  describe('fromInputDate', () => {
    it('returns input date as-is for valid YYYY-MM-DD format', () => {
      const result = fromInputDate('2026-01-20');
      expect(result).toBe('2026-01-20');
    });

    it('returns empty string for empty input', () => {
      const result = fromInputDate('');
      expect(result).toBe('');
    });

    it('handles various valid date formats', () => {
      expect(fromInputDate('2026-12-31')).toBe('2026-12-31');
      expect(fromInputDate('2026-01-01')).toBe('2026-01-01');
    });
  });

  describe('edge cases and error handling', () => {
    it('formatDate catches errors and returns "-"', () => {
      // Mock Date constructor to throw
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor(...args: unknown[]) {
          if (args.length > 0 && args[0] === 'throw-error') {
            throw new Error('Test error');
          }
          super(...args);
        }
      } as never;

      const result = formatDate('throw-error');
      expect(result).toBe('-');

      global.Date = originalDate;
    });

    it('toInputDate catches errors and returns empty string', () => {
      // Mock Date constructor to throw
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor(...args: unknown[]) {
          if (args.length > 0 && args[0] === 'throw-error') {
            throw new Error('Test error');
          }
          super(...args);
        }
      } as never;

      const result = toInputDate('throw-error');
      expect(result).toBe('');

      global.Date = originalDate;
    });

    it('handles whitespace in date strings', () => {
      const result = formatDate('  2026-01-20 00:00:00  ');
      expect(result).toBe('Jan 20, 2026');
    });

    it('handles dates across year boundaries', () => {
      expect(toInputDate('2025-12-31 23:59:59')).toBe('2025-12-31');
      expect(toInputDate('2026-01-01 00:00:00')).toBe('2026-01-01');
    });
  });

  describe('UTC consistency', () => {
    it('formatDate uses UTC timezone to avoid shifts', () => {
      // The function explicitly uses UTC timeZone option
      const result = formatDate('2026-06-15 00:00:00');
      expect(result).toBe('Jun 15, 2026');
    });

    it('toInputDate extracts date from UTC ISO string', () => {
      // The function uses toISOString which is in UTC
      const result = toInputDate('2026-06-15 12:00:00');
      expect(result).toBe('2026-06-15');
    });
  });
});
