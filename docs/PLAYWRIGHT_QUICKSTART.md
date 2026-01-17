# Playwright E2E Testing - Quick Start Guide

## 🚀 Setup Complete!

Your E2E testing environment is ready. Here's what was created:

## 📁 File Structure

```
wryte-ai-web/
├── playwright.config.ts              ✅ Main configuration
├── e2e/
│   ├── fixtures/
│   │   └── auth.fixture.ts          ✅ Auth helpers (authenticated/unauthenticated pages)
│   ├── tests/
│   │   ├── auth/
│   │   │   └── authentication.spec.ts  ✅ 6 auth tests
│   │   ├── onboarding/
│   │   │   └── onboarding.spec.ts      ✅ 9 onboarding tests
│   │   └── dashboard/
│   │       └── dashboard.spec.ts       ✅ 8 dashboard tests
│   ├── utils/
│   │   └── api-mocks.ts             ✅ API mocking utilities
│   └── README.md                    ✅ Detailed documentation
```

## 🎯 What's Included

### Authentication Tests (6 tests)

- ✅ Unauthenticated redirect to sign-in
- ✅ Authenticated access to protected routes
- ✅ User profile information display
- ✅ Homepage for unauthenticated users
- ✅ Auth token in API requests
- ✅ 401 response handling

### Onboarding Tests (9 tests)

- ✅ New user redirect to onboarding
- ✅ Step 1 form display
- ✅ Form validation
- ✅ Step 1 completion
- ✅ Step 2 form display
- ✅ Navigation between steps
- ✅ Complete flow with dashboard redirect
- ✅ Loading states
- ✅ Error handling

### Dashboard Tests (8 tests)

- ✅ Dashboard loads with organization
- ✅ Sidebar navigation visible
- ✅ Navigate to Titles
- ✅ Navigate to Outlines
- ✅ Navigate to Blogs
- ✅ Navigate to Calendar
- ✅ Stats display
- ✅ Missing organization handling

## 🏃 Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI (recommended for development)
npm run test:e2e:ui

# Run specific test file
npx playwright test authentication.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Run only failed tests
npx playwright test --last-failed
```

## 🔧 Key Features

### 1. Mocked Clerk Authentication

```typescript
// Authenticated test
test('my test', async ({ authenticatedPage }) => {
  const page = authenticatedPage;
  // User is already signed in!
});

// Unauthenticated test
test('public page', async ({ unauthenticatedPage }) => {
  const page = unauthenticatedPage;
  // No auth state
});
```

### 2. API Response Mocking

```typescript
import { setupApiMocks, mockDashboardData } from '../../utils/api-mocks';

test.beforeEach(async ({ authenticatedPage }) => {
  await setupApiMocks(authenticatedPage);
  await mockDashboardData(authenticatedPage);
});
```

### 3. Custom Mock Helpers

```typescript
import { mockOrganizationCreation, mockTitlesList, mockTitleCreation } from '../../utils/api-mocks';
```

## 📝 Writing New Tests

### Step 1: Create test file

```bash
# Create in appropriate directory
touch e2e/tests/titles/create-title.spec.ts
```

### Step 2: Use template

```typescript
import { test, expect } from '../../fixtures/auth.fixture';
import { setupApiMocks } from '../../utils/api-mocks';

test.describe('Title Creation', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await setupApiMocks(authenticatedPage);
  });

  test('creates a new title', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    await page.goto('/org/test-org/titles');
    await page.getByRole('button', { name: /create/i }).click();
    await page.getByLabel(/title/i).fill('New Blog Title');
    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByText('New Blog Title')).toBeVisible();
  });
});
```

### Step 3: Run your test

```bash
npx playwright test create-title.spec.ts --headed
```

## 🎨 Mock Data Available

```typescript
// From api-mocks.ts
mockOrganization; // Test org data
mockUser; // Test user data
mockTitle; // Sample title data

// Helper functions
setupApiMocks(); // Basic endpoints
setupNoOrganizationMocks(); // For onboarding tests
mockOrganizationCreation(); // Mock POST /organizations
mockDashboardData(); // Mock dashboard stats
mockTitlesList(); // Mock titles endpoint
mockTitleCreation(); // Mock title creation
```

## 🐛 Debugging Tips

### View test in browser

```bash
npx playwright test --headed --debug
```

### Pause in test

```typescript
await page.pause(); // Stops execution, opens inspector
```

### Check what's on page

```typescript
await page.screenshot({ path: 'debug.png' });
console.log(await page.content()); // HTML dump
```

### View trace

```bash
npx playwright show-report
```

## 📊 Test Reports

After running tests:

```bash
npx playwright show-report
```

Reports include:

- Test results
- Screenshots on failure
- Video recordings (on failure)
- Network logs
- Console logs

## 🚦 Next Steps

### Priority: Add These Tests

1. **Titles Management**
   - Create title
   - Edit title
   - Delete title
   - Schedule title

2. **Outlines Management**
   - Create outline
   - Edit sections
   - Add/remove points

3. **Blogs Management**
   - Create blog
   - Rich text editor
   - Save draft
   - Publish

4. **Calendar**
   - View events
   - Navigate months
   - Reschedule

5. **Settings**
   - Update organization
   - Update content strategy

### Templates for Each

Copy and adapt existing tests:

- `authentication.spec.ts` → Template for auth flows
- `onboarding.spec.ts` → Template for multi-step forms
- `dashboard.spec.ts` → Template for navigation tests

## 💡 Best Practices

1. **Use accessible queries**

   ```typescript
   // Good
   page.getByRole('button', { name: /submit/i });
   page.getByLabel('Email');

   // Avoid
   page.locator('#submit-btn');
   ```

2. **Wait for conditions, not time**

   ```typescript
   // Good
   await expect(page.getByText('Success')).toBeVisible();

   // Bad
   await page.waitForTimeout(3000);
   ```

3. **Test user behavior, not implementation**

   ```typescript
   // Good
   await page.getByRole('button', { name: /sign in/i }).click();

   // Bad
   await page.evaluate(() => window.signIn());
   ```

4. **Keep tests independent**
   - Each test should work in isolation
   - Don't rely on test execution order
   - Clean up after tests if needed

## 🔗 Resources

- **E2E Documentation**: `e2e/README.md`
- **Playwright Docs**: https://playwright.dev/
- **Test Examples**: All files in `e2e/tests/`
- **Mock Utilities**: `e2e/utils/api-mocks.ts`

## ❓ Common Issues

### Tests fail immediately

- Make sure dev server is running or will auto-start
- Check `playwright.config.ts` baseURL matches your dev server

### Timeouts

- Increase timeout in config for slow operations
- Check if API mocks are set up correctly

### Can't find elements

- Use `--headed` mode to see what's on page
- Check selector with `page.pause()`

---

🎉 **You're all set!** Run `npm run test:e2e:ui` to see your tests in action.
