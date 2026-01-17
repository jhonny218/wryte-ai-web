import { Page } from '@playwright/test';

/**
 * Common test helpers for E2E tests
 */

/**
 * Fill a form field by label
 */
export async function fillFormField(page: Page, label: string | RegExp, value: string) {
  await page.getByLabel(label).fill(value);
}

/**
 * Click a button by name/text
 */
export async function clickButton(page: Page, name: string | RegExp) {
  await page.getByRole('button', { name }).click();
}

/**
 * Wait for navigation to complete
 */
export async function waitForNavigation(page: Page, urlPattern: string | RegExp) {
  await page.waitForURL(urlPattern, { timeout: 10000 });
}

/**
 * Wait for toast/notification message
 */
export async function waitForToast(page: Page, message: string | RegExp) {
  // Adjust selector based on your toast implementation (sonner)
  const toast = page.locator('[data-sonner-toast], .sonner-toast, [role="status"]', {
    hasText: message,
  });
  await toast.waitFor({ state: 'visible', timeout: 5000 });
}

/**
 * Dismiss toast/notification
 */
export async function dismissToast(page: Page) {
  const closeButton = page.locator('[data-sonner-toast] button[aria-label*="close"], .sonner-toast button').first();
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }
}

/**
 * Fill date picker
 */
export async function fillDatePicker(page: Page, label: string | RegExp, date: string) {
  // Adjust based on your date picker implementation
  await page.getByLabel(label).click();
  await page.getByLabel(label).fill(date);
}

/**
 * Select dropdown/combobox option
 */
export async function selectOption(page: Page, label: string | RegExp, option: string) {
  await page.getByLabel(label).click();
  await page.getByRole('option', { name: option }).click();
}

/**
 * Upload file
 */
export async function uploadFile(page: Page, label: string | RegExp, filePath: string) {
  const fileInput = page.getByLabel(label);
  await fileInput.setInputFiles(filePath);
}

/**
 * Wait for data table to load
 */
export async function waitForDataTable(page: Page) {
  await page.locator('table, [role="table"]').waitFor({ state: 'visible', timeout: 10000 });
}

/**
 * Get table row by text
 */
export async function getTableRowByText(page: Page, text: string | RegExp) {
  return page.locator('tr, [role="row"]', { hasText: text });
}

/**
 * Click table row action (edit, delete, etc.)
 */
export async function clickRowAction(page: Page, rowText: string | RegExp, actionName: string | RegExp) {
  const row = await getTableRowByText(page, rowText);
  await row.getByRole('button', { name: actionName }).click();
}

/**
 * Wait for modal/dialog to open
 */
export async function waitForModal(page: Page, title?: string | RegExp) {
  const modal = page.locator('[role="dialog"], .dialog, .modal');
  await modal.waitFor({ state: 'visible', timeout: 5000 });
  
  if (title) {
    await modal.getByRole('heading', { name: title }).waitFor({ state: 'visible' });
  }
}

/**
 * Close modal/dialog
 */
export async function closeModal(page: Page) {
  // Try common close patterns
  const closeBtn = page.locator('[role="dialog"] button[aria-label*="close"], [role="dialog"] button:has-text("Cancel")').first();
  await closeBtn.click();
}

/**
 * Wait for loading spinner to disappear
 */
export async function waitForLoadingToFinish(page: Page) {
  // Wait for any loading spinners to disappear
  const spinner = page.locator('[data-testid="loading"], .loading-spinner, [role="status"]');
  await spinner.waitFor({ state: 'detached', timeout: 15000 }).catch(() => {
    // Ignore if no spinner found
  });
}

/**
 * Check if element exists (without throwing error)
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  return (await page.locator(selector).count()) > 0;
}

/**
 * Scroll to element
 */
export async function scrollToElement(page: Page, selector: string) {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * Take debug screenshot with timestamp
 */
export async function debugScreenshot(page: Page, name: string) {
  const timestamp = Date.now();
  await page.screenshot({ path: `debug-${name}-${timestamp}.png`, fullPage: true });
}

/**
 * Log page console messages (useful for debugging)
 */
export function logConsoleMessages(page: Page) {
  page.on('console', (msg) => {
    console.log(`[BROWSER ${msg.type()}]`, msg.text());
  });
}

/**
 * Log network requests (useful for debugging)
 */
export function logNetworkRequests(page: Page) {
  page.on('request', (request) => {
    console.log(`[REQUEST] ${request.method()} ${request.url()}`);
  });
  page.on('response', (response) => {
    console.log(`[RESPONSE] ${response.status()} ${response.url()}`);
  });
}

/**
 * Click navigation link by name
 */
export async function navigateToPage(page: Page, linkName: string | RegExp) {
  await page.getByRole('link', { name: linkName }).click();
}

/**
 * Assert URL contains path
 */
export async function assertUrlContains(page: Page, path: string) {
  const url = page.url();
  if (!url.includes(path)) {
    throw new Error(`Expected URL to contain "${path}", but got "${url}"`);
  }
}

/**
 * Retry action with timeout
 */
export async function retryAction<T>(
  action: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await action();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error('Retry action failed');
}
