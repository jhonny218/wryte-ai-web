/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, Page } from '@playwright/test';
import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright';

/**
 * Path to authenticated session state (used by playwright config)
 */
export const AUTH_FILE = 'playwright/.clerk/user.json';

/**
 * Extended test fixture with auth helpers
 *
 * authenticatedPage: Uses the pre-authenticated storage state from global setup.
 *   The auth is handled via storageState in playwright.config.ts
 *
 * unauthenticatedPage: Signs out any existing session for tests that need unauthenticated state
 */
export const test = base.extend<{
  authenticatedPage: Page;
  unauthenticatedPage: Page;
}>({
  // authenticatedPage just uses the storage state from config - already authenticated
  authenticatedPage: async ({ page }, use) => {
    // Setup testing token for bot detection bypass
    await setupClerkTestingToken({ page });
    // Don't navigate here - let each test navigate after setting up mocks
    await use(page);
  },

  // unauthenticatedPage signs out to ensure clean unauthenticated state
  unauthenticatedPage: async ({ page, context }, use) => {
    // Clear storage state to remove auth
    await context.clearCookies();

    // Setup testing token
    await setupClerkTestingToken({ page });

    // Navigate to app first to get access to localStorage
    await page.goto('/');

    // Clear localStorage to remove Clerk's cached auth
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Reload to apply cleared state
    await page.reload();

    // Wait for Clerk to load in unauthenticated state
    await page.waitForFunction(() => window.Clerk?.loaded === true, { timeout: 10000 });

    // Verify user is signed out
    const isSignedIn = await page.evaluate(() => window.Clerk?.user !== null);
    if (isSignedIn) {
      // If still signed in, explicitly sign out
      await clerk.signOut({ page });
      await page.waitForFunction(() => window.Clerk?.user === null, { timeout: 10000 });
    }

    await use(page);
  },
});

export { expect } from '@playwright/test';
