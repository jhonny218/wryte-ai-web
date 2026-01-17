import { Page } from '@playwright/test';

/**
 * Mock organization data for testing
 */
export const mockOrganization = {
  id: 'org_test123',
  slug: 'test-org',
  name: 'Test Organization',
  mission: 'Testing the application',
  description: 'A test organization for E2E tests',
  websiteUrl: 'https://test.example.com',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

/**
 * Mock user data
 */
export const mockUser = {
  id: 'user_db_test123',
  clerkId: 'user_test123',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

/**
 * Mock title data
 */
export const mockTitle = {
  id: 'title_test123',
  organizationId: 'org_test123',
  title: 'Test Blog Post Title',
  keywords: ['test', 'automation'],
  scheduledDate: '2026-02-01T00:00:00.000Z',
  status: 'draft',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

/**
 * Setup API route mocking for common endpoints
 */
export async function setupApiMocks(page: Page) {
  // Mock user organizations endpoint
  await page.route('**/api/v1/users/me/organizations', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        hasOrganizations: true,
        primaryOrganization: mockOrganization,
        organizations: [mockOrganization],
      }),
    });
  });

  // Mock current user endpoint
  await page.route('**/api/v1/users/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser),
    });
  });

  // Mock user sync endpoint
  await page.route('**/api/v1/users/sync', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser),
    });
  });

  // Mock health check
  await page.route('**/health', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'ok', database: 'connected' }),
    });
  });
}

/**
 * Mock empty organizations (for onboarding flow)
 */
export async function setupNoOrganizationMocks(page: Page) {
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

  await page.route('**/api/v1/users/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser),
    });
  });
}

/**
 * Mock organization creation
 */
export async function mockOrganizationCreation(page: Page) {
  await page.route('**/api/v1/organizations', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ data: mockOrganization }),
      });
    }
  });
}

/**
 * Mock dashboard stats
 */
export async function mockDashboardData(page: Page, orgSlug: string = 'test-org') {
  await page.route(`**/api/v1/organizations/${orgSlug}/stats`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        totalTitles: 10,
        totalOutlines: 5,
        totalBlogs: 3,
        scheduledThisWeek: 2,
      }),
    });
  });
}

/**
 * Mock titles list
 */
export async function mockTitlesList(page: Page, orgSlug: string = 'test-org') {
  await page.route(`**/api/v1/organizations/${orgSlug}/titles*`, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [mockTitle],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
          },
        }),
      });
    }
  });
}

/**
 * Mock title creation
 */
export async function mockTitleCreation(page: Page, orgSlug: string = 'test-org') {
  await page.route(`**/api/v1/organizations/${orgSlug}/titles`, async (route) => {
    if (route.request().method() === 'POST') {
      const postData = route.request().postDataJSON();
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            ...mockTitle,
            ...postData,
            id: `title_${Date.now()}`,
          },
        }),
      });
    }
  });
}
