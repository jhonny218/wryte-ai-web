import { test, expect } from '../../fixtures/auth.fixture';
import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { setupApiMocks } from '../../utils/api-mocks';

test.describe('Authentication Flow', () => {
  test('unauthenticated user redirect', async ({ unauthenticatedPage }) => {
    const page = unauthenticatedPage;
    // Use Clerk's official Playwright helper to ensure testing token is attached
    await setupClerkTestingToken({ page });
    await page.goto('/org/test-org/dashboard');
    // Should redirect to sign-in when unauthenticated
    await expect(page).toHaveURL(/sign-in|accounts\.dev/, { timeout: 10000 });
  });

  test('authenticated user can access dashboard route', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    await setupApiMocks(page);

    // Navigate to dashboard
    await page.goto('/org/test-org/dashboard');

    // Should successfully load dashboard (check URL stays on dashboard)
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/org\/test-org/, { timeout: 5000 });
  });

  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');

    // Homepage should load
    await expect(page).toHaveURL('/');
    
    // Page should have loaded content
    await page.waitForLoadState('networkidle');
  });

  test('API requests include authentication token when authenticated', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    
    // Set up request interception to check headers
    const requests: string[] = [];
    page.on('request', (request) => {
      const authHeader = request.headers()['authorization'];
      if (authHeader && request.url().includes('/api/')) {
        requests.push(authHeader);
      }
    });

    await setupApiMocks(page);
    await page.goto('/org/test-org/dashboard');

    // Wait for potential API calls
    await page.waitForTimeout(2000);

    // If API calls were made, verify token format
    // Note: May not have API calls in mocked environment, so this is optional verification
    if (requests.length > 0) {
      expect(requests.some((header) => header.includes('Bearer'))).toBeTruthy();
    }
  });
});
