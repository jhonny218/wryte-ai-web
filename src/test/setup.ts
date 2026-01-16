import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import React from 'react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.Clerk for tests
interface MockClerk {
  session?: {
    getToken: () => Promise<string | null>;
  };
  redirectToSignIn: () => void;
  openSignIn: () => void;
}

(globalThis as typeof globalThis & { window: { Clerk?: MockClerk } }).window.Clerk = {
  session: {
    getToken: vi.fn().mockResolvedValue('mock-token-123'),
  },
  redirectToSignIn: vi.fn(),
  openSignIn: vi.fn(),
};

// Mock IntersectionObserver (used by some UI libraries)
(globalThis as typeof globalThis & { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
} as unknown as typeof IntersectionObserver;

// Mock ResizeObserver (used by Tiptap and other editors)
(globalThis as typeof globalThis & { ResizeObserver?: typeof ResizeObserver }).ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as unknown as typeof ResizeObserver;

// Mock matchMedia (used by responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Polyfill pointer capture methods used by Radix/UI components in JSDOM
// JSDOM doesn't implement pointer capture methods; add no-op implementations
// to avoid runtime errors during tests where libraries check for these APIs.
const proto = (globalThis as typeof globalThis & { Element?: { prototype: Element } }).Element?.prototype ||
              (globalThis as typeof globalThis & { HTMLElement?: { prototype: HTMLElement } }).HTMLElement?.prototype;
if (proto) {
  if (typeof proto.hasPointerCapture !== 'function') {
    proto.hasPointerCapture = function () {
      return false;
    };
  }
  if (typeof proto.setPointerCapture !== 'function') {
    proto.setPointerCapture = function () {
      return;
    };
  }
  if (typeof proto.releasePointerCapture !== 'function') {
    proto.releasePointerCapture = function () {
      return;
    };
  }
}

// Polyfill scrollIntoView used by some components (Radix tries to call it)
if (proto && typeof proto.scrollIntoView !== 'function') {
  proto.scrollIntoView = function () {
    return;
  };
}

// Mock Radix Presence and compose-refs to avoid ref/setState cycles in JSDOM tests
// Some Radix internals use compose-refs which can trigger repeated updates in
// the jsdom environment. Mocking these to no-ops stabilizes tests.
try {
  vi.mock('@radix-ui/react-presence', () => {
    return {
      __esModule: true,
      Presence: ({ children }: { children: React.ReactNode }) => children,
    };
  });
} catch {
  // ignore if mocking isn't available in this environment
}

try {
  // Use a no-op composeRefs in tests to avoid triggering ref update cycles
  // that can cause "Maximum update depth exceeded" in JSDOM.
  vi.mock('@radix-ui/react-compose-refs', () => ({
    __esModule: true,
    composeRefs: (..._refs: unknown[]) => (_node?: unknown) => {
      // reference parameters to satisfy the linter about unused vars
      void _refs;
      void _node;
      // intentionally no-op
    },
  }));
} catch {
  // ignore
}

// We avoid mocking the full Radix Dialog implementation because it alters
// DOM semantics for many components. Instead we mock only the smaller
// internals (presence/compose-refs) above and polyfill missing browser APIs.

// Suppress console errors in tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Not implemented: HTMLFormElement.prototype.submit') ||
        args[0].includes('Could not parse CSS stylesheet'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
