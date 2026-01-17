import { test, expect } from '@playwright/test';
import { setupApiMocks } from '../../utils/api-mocks';

test.describe('Basic App Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    // Set up API mocks so authenticated user has an organization
    await setupApiMocks(page);

    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Authenticated user with organization gets redirected to their org dashboard
    // Unauthenticated user stays on homepage or gets redirected to sign-in
    // Just verify the page loaded successfully
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('app has correct title', async ({ page }) => {
    await page.goto('/');
    
    // Check for title or app name
    await expect(page).toHaveTitle(/Wryte|AI/);
  });

  test('invalid route handling', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-12345');
    
    // Wait for page to finish loading/redirecting
    await page.waitForLoadState('networkidle');
    
    // App should either show a 404 page, redirect to home, or show some error state
    // Just verify the page loaded without crashing
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('dev server is running and responsive', async ({ page }) => {
    const response = await page.goto('/');
    
    expect(response?.ok()).toBeTruthy();
    expect(response?.status()).toBe(200);
  });
});
