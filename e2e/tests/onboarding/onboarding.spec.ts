import { test, expect } from '../../fixtures/auth.fixture';
import { setupNoOrganizationMocks, mockOrganizationCreation } from '../../utils/api-mocks';

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    await setupNoOrganizationMocks(page);
    await mockOrganizationCreation(page);
  });

  test('new user without organization is redirected to onboarding', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    await page.goto('/');

    // Should redirect to onboarding when no organization exists
    await expect(page).toHaveURL('/onboarding', { timeout: 5000 });
  });

  test('onboarding step 1 shows organization form', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    await page.goto('/onboarding');

    // Check for step 1 form fields
    await expect(page.getByLabel(/organization name/i)).toBeVisible();
    await expect(page.getByLabel(/mission/i)).toBeVisible();
    await expect(page.getByLabel(/description/i)).toBeVisible();
    await expect(page.getByLabel(/website url/i)).toBeVisible();
  });

  test('step 1 validation prevents progression with empty fields', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    await page.goto('/onboarding');

    // Try to proceed without filling required fields
    const nextButton = page.getByRole('button', { name: /next|continue/i });
    await nextButton.click();

    // Should show validation errors
    await expect(page.getByText(/required/i).first()).toBeVisible();
    
    // Should still be on step 1
    await expect(page.getByLabel(/organization name/i)).toBeVisible();
  });

  test('complete onboarding step 1 with valid data', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    await page.goto('/onboarding');

    // Fill step 1 form
    await page.getByLabel(/organization name/i).fill('Test Company');
    await page.getByLabel(/mission/i).fill('To test the application thoroughly');
    await page.getByLabel(/description/i).fill('A comprehensive test organization for E2E testing');
    await page.getByLabel(/website url/i).fill('https://test-company.example.com');

    // Click next
    await page.getByRole('button', { name: /next|continue/i }).click();

    // Should proceed to step 2 - Content Settings page
    await expect(page.getByRole('heading', { name: /content settings/i })).toBeVisible({ timeout: 5000 });
  });

  test('step 2 shows content strategy form', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    await page.goto('/onboarding');

    // Fill step 1 quickly
    await page.getByLabel(/organization name/i).fill('Test Company');
    await page.getByLabel(/mission/i).fill('Testing mission');
    await page.getByLabel(/description/i).fill('Testing description');
    await page.getByLabel(/website url/i).fill('https://test.example.com');
    await page.getByRole('button', { name: /next|continue/i }).click();

    // Verify step 2 fields - Content Settings page
    await expect(page.getByRole('heading', { name: /content settings/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Primary Keywords')).toBeVisible();
    await expect(page.getByText(/brand tone/i)).toBeVisible();
    await expect(page.getByText(/target audience/i)).toBeVisible();
  });

  test('can navigate back from step 2 to step 1', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    await page.goto('/onboarding');

    // Complete step 1
    await page.getByLabel(/organization name/i).fill('Test Company');
    await page.getByLabel(/mission/i).fill('Testing mission');
    await page.getByLabel(/description/i).fill('Testing description');
    await page.getByLabel(/website url/i).fill('https://test.example.com');
    await page.getByRole('button', { name: /next|continue/i }).click();

    // Now on step 2 - Content Settings page
    await expect(page.getByRole('heading', { name: /content settings/i })).toBeVisible({ timeout: 5000 });

    // Click back button
    await page.getByRole('button', { name: /back/i }).click();

    // Should be back on step 1
    await expect(page.getByLabel(/organization name/i)).toBeVisible();

    // Form data should be preserved
    await expect(page.getByLabel(/organization name/i)).toHaveValue('Test Company');
  });

  test('complete full onboarding flow and redirect to dashboard', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage;

    // Mock successful organization creation with redirect
    await page.route('**/api/v1/organizations', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              id: 'org_new123',
              slug: 'test-company',
              name: 'Test Company',
            },
          }),
        });
      }
    });

    // Mock the organizations endpoint to return the new org after creation
    await page.route('**/api/v1/users/me/organizations', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          hasOrganizations: true,
          primaryOrganization: {
            id: 'org_new123',
            slug: 'test-company',
            name: 'Test Company',
          },
          organizations: [
            {
              id: 'org_new123',
              slug: 'test-company',
              name: 'Test Company',
            },
          ],
        }),
      });
    });

    await page.goto('/onboarding');

    // Fill step 1
    await page.getByLabel(/organization name/i).fill('Test Company');
    await page.getByLabel(/mission/i).fill('Our testing mission');
    await page.getByLabel(/description/i).fill('A test organization');
    await page.getByLabel(/website url/i).fill('https://test.example.com');
    await page.getByRole('button', { name: /next|continue/i }).click();

    // Wait for step 2 - Content Settings page
    await expect(page.getByRole('heading', { name: /content settings/i })).toBeVisible({ timeout: 5000 });

    // Fill primary keywords using tag input (textbox + Add button)
    const keywordsInput = page.getByPlaceholder(/add a primary keyword/i);
    await keywordsInput.fill('testing');
    await page.locator('button:has-text("Add")').first().click();

    // Select at least one posting day (required field)
    await page.getByRole('checkbox', { name: 'MON' }).check();

    // Submit the form - button is "Create Organization"
    await page.getByRole('button', { name: /create organization/i }).click();

    // Should redirect to the new organization's dashboard
    await expect(page).toHaveURL(/\/org\/test-company/, { timeout: 10000 });
  });

  test('shows loading state during organization creation', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Mock slow API response
    await page.route('**/api/v1/organizations', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 'org_new123',
            slug: 'test-company',
            name: 'Test Company',
          },
        }),
      });
    });

    await page.goto('/onboarding');

    // Quickly fill step 1
    await page.getByLabel(/organization name/i).fill('Test Company');
    await page.getByLabel(/mission/i).fill('Testing mission');
    await page.getByLabel(/description/i).fill('Testing description');
    await page.getByLabel(/website url/i).fill('https://test.example.com');
    await page.getByRole('button', { name: /next|continue/i }).click();

    // Wait for step 2
    await expect(page.getByRole('heading', { name: /content settings/i })).toBeVisible({ timeout: 5000 });

    // Fill required fields for step 2
    const keywordsInput = page.getByPlaceholder(/add a primary keyword/i);
    await keywordsInput.fill('testing');
    await page.locator('button:has-text("Add")').first().click();
    await page.getByRole('checkbox', { name: 'MON' }).check();

    // Submit step 2
    await page.getByRole('button', { name: /create organization/i }).click();

    // Should show loading indicator - button should be disabled during submission
    const submitButton = page.getByRole('button', { name: /create organization|creating/i });
    await expect(submitButton).toBeDisabled();
  });

  test('handles API errors during organization creation', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    // Mock API error
    await page.route('**/api/v1/organizations', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    await page.goto('/onboarding');

    // Fill step 1
    await page.getByLabel(/organization name/i).fill('Test Company');
    await page.getByLabel(/mission/i).fill('Testing mission');
    await page.getByLabel(/description/i).fill('Testing description');
    await page.getByLabel(/website url/i).fill('https://test.example.com');
    await page.getByRole('button', { name: /next|continue/i }).click();

    // Wait for step 2
    await expect(page.getByRole('heading', { name: /content settings/i })).toBeVisible({ timeout: 5000 });

    // Fill required fields for step 2
    const keywordsInput = page.getByPlaceholder(/add a primary keyword/i);
    await keywordsInput.fill('testing');
    await page.locator('button:has-text("Add")').first().click();
    await page.getByRole('checkbox', { name: 'MON' }).check();

    // Submit the form
    await page.getByRole('button', { name: /create organization/i }).click();

    // Should show error message
    await expect(page.getByText(/error|failed/i)).toBeVisible({ timeout: 5000 });
  });
});
