import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from './api-client';

describe('apiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Reset window.Clerk
    // @ts-expect-error Allow test to delete possibly-undefined property
    delete (window as unknown as Record<string, unknown>).Clerk;
  });

  it('adds Authorization header when Clerk token exists', async () => {
    const mockGetToken = vi.fn().mockResolvedValue('tok-123');
    // @ts-expect-error Allow attaching Clerk for tests
    window.Clerk = { session: { getToken: mockGetToken } };

    const request = { headers: {} } as unknown as Record<string, unknown>;

    // call the interceptor manually
    type InterceptorHandler = { fulfilled?: (cfg: unknown) => Promise<unknown> | unknown; rejected?: (err: unknown) => Promise<unknown> | unknown };
    const handlers = ((apiClient as unknown) as { interceptors: { request: { handlers: InterceptorHandler[] } } }).interceptors.request.handlers;
    const firstHandler = handlers[0];
    const cfg = await (firstHandler.fulfilled as (c: unknown) => Promise<Record<string, unknown>>)(request);

    expect((cfg.headers as Record<string, unknown>).Authorization).toBe('Bearer tok-123');
    expect(mockGetToken).toHaveBeenCalled();
  });

  it('does not add Authorization header when no token', async () => {
    // no Clerk
    const request = { headers: {} } as unknown as Record<string, unknown>;
    const handlers = ((apiClient as unknown) as { interceptors: { request: { handlers: Array<Record<string, unknown>> } } }).interceptors.request.handlers as Array<InterceptorHandler>;
    const cfg = await (handlers[0].fulfilled as (c: unknown) => Promise<Record<string, unknown>>)(request);

    expect((cfg.headers as Record<string, unknown>).Authorization).toBeUndefined();
  });

  it('redirects to sign-in when response is 401 and Clerk redirect available', async () => {
    const redirectSpy = vi.fn();
    // assign Clerk on window for the test
    (window as unknown as Record<string, unknown>).Clerk = { redirectToSignIn: redirectSpy };

    const error = { response: { status: 401 } };

    // call the response error handler
    const resHandlers = ((apiClient as unknown) as { interceptors: { response: { handlers: InterceptorHandler[] } } }).interceptors.response.handlers;
    await expect((resHandlers[0].rejected as (e: unknown) => Promise<unknown>)(error)).rejects.toBe(error);

    expect(redirectSpy).toHaveBeenCalled();
  });

  it('falls back to location.href when Clerk redirect not available', async () => {
    // no Clerk
    // Replace window.location with a mock that captures href assignments
    // @ts-expect-error Allow deleting possibly-undefined property
    delete (window as unknown as Record<string, unknown>).Clerk;
    const origLocation = window.location;
    let assignedHref: string | null = null;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        get href() {
          return assignedHref;
        },
        set href(v: string) {
          assignedHref = v;
        },
      },
    });

    const error = { response: { status: 401 } };
    const resHandlers2 = ((apiClient as unknown) as { interceptors: { response: { handlers: InterceptorHandler[] } } }).interceptors.response.handlers;
    await expect((resHandlers2[0].rejected as (e: unknown) => Promise<unknown>)(error)).rejects.toBe(error);

    expect(assignedHref).toBe('/');

    // restore original location
    Object.defineProperty(window, 'location', { configurable: true, value: origLocation });
  });
});

// Ensure modules are reset so our mocks apply before the module under test is imported
vi.resetModules();

// Mock the env module before importing the api client
vi.mock('../config/env', () => ({
  env: {
    VITE_API_URL: 'https://api.test',
  },
}));

describe('api-client', () => {
  const originalClerk = (globalThis as unknown as Record<string, unknown>).Clerk;

  beforeEach(() => {
    // reset any handlers if tests mutate them
    // Nothing required here for axios interceptors since we import a fresh module after resetModules in the top-level
  });

  afterEach(() => {
    // restore global Clerk
    (globalThis as unknown as Record<string, unknown>).Clerk = originalClerk;
    vi.clearAllMocks();
  });

  it('has the expected defaults from env', () => {
    const defaults = (apiClient as unknown as { defaults: Record<string, unknown> }).defaults;
    expect(defaults.baseURL).toBe('https://api.test');
    expect(defaults.timeout).toBe(10000);
    expect((defaults.headers as Record<string, unknown>)['Content-Type']).toBe('application/json');
  });

  it('request interceptor adds Authorization header when token exists', async () => {
    // Provide a fake Clerk that returns a token
    const mockGetToken = vi.fn(async () => 'tok-123');
    (globalThis as unknown as Record<string, unknown>).Clerk = {
      session: {
        getToken: mockGetToken,
      },
    };

    const reqHandlers2 = ((apiClient as unknown) as { interceptors: { request: { handlers: InterceptorHandler[] } } }).interceptors.request.handlers;

    const reqHandler = reqHandlers2.find((h) => h && typeof h.fulfilled === 'function');

    expect(reqHandler).toBeDefined();

    const config = { headers: {} };
    const result = await (reqHandler!.fulfilled as (c: unknown) => Promise<Record<string, unknown>>)(config);

    expect(mockGetToken).toHaveBeenCalled();
    expect((result.headers as Record<string, unknown>).Authorization).toBe('Bearer tok-123');
  });

  it('response interceptor triggers redirectToSignIn on 401', async () => {
    // Provide a fake Clerk with redirectToSignIn spy
    const redirectSpy = vi.fn();
    (globalThis as unknown as Record<string, unknown>).Clerk = {
      redirectToSignIn: redirectSpy,
    };

    const resHandlers3 = ((apiClient as unknown) as { interceptors: { response: { handlers: InterceptorHandler[] } } }).interceptors.response.handlers;

    const resHandler = resHandlers3.find((h) => h && typeof h.rejected === 'function');

    expect(resHandler).toBeDefined();

    const err = { response: { status: 401 } };

    // The rejected handler returns a Promise.reject; call and catch to allow assertions
    await expect((resHandler!.rejected as (e: unknown) => Promise<unknown>)(err)).rejects.toEqual(err);

    expect(redirectSpy).toHaveBeenCalled();
  });
});
