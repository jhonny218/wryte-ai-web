import { test, expect } from '../../fixtures/auth.fixture';
import { setupApiMocks, mockDashboardData } from '../../utils/api-mocks';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    await setupApiMocks(page);
    await mockDashboardData(page);
  });

  test('dashboard loads and displays organization name', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    await page.goto('/org/test-org/dashboard');

    // Check for main dashboard heading
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 10000 });
  });

  test('sidebar navigation is visible', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    await page.goto('/org/test-org/dashboard');

    // Check for sidebar navigation links - the sidebar contains links like Dashboard, Calendar, Titles
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('link', { name: 'Calendar' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Titles' })).toBeVisible();
  });

  test('can navigate to titles page from dashboard', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    await page.goto('/org/test-org/dashboard');

    // Find and click titles link
    const titlesLink = page.getByRole('link', { name: /titles/i });
    await titlesLink.click();

    // Should navigate to titles page
    await expect(page).toHaveURL(/\/org\/test-org\/titles/);
  });

  test('can navigate to outlines page from dashboard', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    await page.goto('/org/test-org/dashboard');

    // Find and click outlines link
    const outlinesLink = page.getByRole('link', { name: /outlines/i });
    await outlinesLink.click();

    // Should navigate to outlines page
    await expect(page).toHaveURL(/\/org\/test-org\/outlines/);
  });

  test('can navigate to blogs page from dashboard', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    await page.goto('/org/test-org/dashboard');

    // Find and click blogs link
    const blogsLink = page.getByRole('link', { name: /blogs/i });
    await blogsLink.click();

    // Should navigate to blogs page
    await expect(page).toHaveURL(/\/org\/test-org\/blogs/);
  });

  test('can navigate to calendar page from dashboard', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    await page.goto('/org/test-org/dashboard');

    // Find and click calendar link
    const calendarLink = page.getByRole('link', { name: /calendar/i });
    await calendarLink.click();

    // Should navigate to calendar page
    await expect(page).toHaveURL(/\/org\/test-org\/calendar/);
  });

  test('dashboard displays stats when available', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    await page.goto('/org/test-org/dashboard');

    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');

    // Stats cards should be visible - Total Content, Scheduled, Total Views
    await expect(page.getByRole('heading', { name: 'Total Content' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Scheduled' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Total Views' })).toBeVisible();
  });

  test('handles missing organization gracefully', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Mock organization not found - need to unroute first to override beforeEach mock
    await page.unroute('**/api/v1/users/me/organizations');
    await page.route('**/api/v1/users/me/organizations', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          hasOrganizations: false,
          primaryOrganization: null,
          organizations: [],
        }),
      });
    });

    // Navigate to root first - AuthenticatedRoot checks organization status and redirects
    await page.goto('/');

    // Should redirect to onboarding when no organization exists
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 5000 });
  });
});
