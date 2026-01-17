import { clerkSetup } from '@clerk/testing/playwright';
import { test as setup, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to store authenticated session state
export const AUTH_FILE = join(__dirname, '../playwright/.clerk/user.json');

setup.describe.configure({ mode: 'serial' });

setup('global clerk setup', async () => {
  await clerkSetup();
});

setup('authenticate and save state', async ({ page }) => {
  // Setup the testing token to bypass bot detection
  const { setupClerkTestingToken } = await import('@clerk/testing/playwright');
  await setupClerkTestingToken({ page });

  // Navigate to the app
  await page.goto('/');

  // Wait for Clerk to load
  await page.waitForFunction(() => window.Clerk?.loaded === true, { timeout: 15000 });

  // Check if already signed in (from previous session)
  const isAlreadySignedIn = await page.evaluate(() => window.Clerk?.user !== null);

  if (!isAlreadySignedIn) {
    console.log('Not signed in, performing UI-based sign-in...');

    // Click the Sign In button on the landing page
    const signInButton = page.getByRole('button', { name: /sign in/i });
    await expect(signInButton).toBeVisible({ timeout: 5000 });
    await signInButton.click();

    // Wait for Clerk's sign-in modal/page to appear
    // Clerk typically renders a modal with email input
    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    // Fill in the email
    await emailInput.fill(process.env.E2E_CLERK_USER_USERNAME!);

    // Click continue/next
    const continueButton = page.getByRole('button', { name: /continue/i });
    await continueButton.click();

    // Wait for password input
    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toBeVisible({ timeout: 10000 });

    // Fill in the password
    await passwordInput.fill(process.env.E2E_CLERK_USER_PASSWORD!);

    // Click sign in (Clerk's button has a specific class)
    const submitButton = page.locator('button.cl-formButtonPrimary');
    await submitButton.click();

    // Wait for sign-in to complete (user should be redirected)
    await page.waitForFunction(
      () => window.Clerk?.user !== null && window.Clerk?.user !== undefined,
      { timeout: 15000 }
    );
  }

  console.log('Sign-in complete!');

  // Verify authentication
  const user = await page.evaluate(() => {
    const u = window.Clerk?.user;
    return u ? { id: (u as { id: string }).id } : null;
  });
  console.log('Authenticated user:', JSON.stringify(user));

  if (!user) {
    throw new Error('Sign-in failed: user is null after sign-in flow');
  }

  // Wait for any redirects to complete
  await page.waitForLoadState('networkidle');

  // Save the authentication state
  await page.context().storageState({ path: AUTH_FILE });
  console.log('Saved auth state to:', AUTH_FILE);
});
