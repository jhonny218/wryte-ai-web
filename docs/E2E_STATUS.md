# Playwright E2E Testing - Current Status & Next Steps

## ✅ What's Working

### Infrastructure

- ✅ Playwright installed and configured
- ✅ Test directory structure created
- ✅ **Smoke tests: 12/12 passing (100%)**
- ✅ **Auth tests: 3/3 passing (1 skipped - needs real Clerk)**
- ✅ Dev server auto-starts with tests
- ✅ Multi-browser testing (Chrome, Firefox, Safari)
- ✅ HTML reports with screenshots/videos

### Completed & Passing Tests

**Smoke Tests (12/12 ✅)**

```bash
npx playwright test basic.spec.ts
```

- ✓ Homepage loads successfully
- ✓ App has correct title
- ✓ Invalid route handling
- ✓ Dev server is running and responsive
- All passing across Chrome, Firefox, and Safari

**Authentication Tests (3/3 ✅, 1 skipped)**

```bash
npx playwright test authentication.spec.ts
```

- ✓ Authenticated user can access dashboard route
- ✓ Homepage loads correctly
- ✓ API requests include authentication token when authenticated
- ⊘ Unauthenticated redirect (skipped - requires real Clerk integration)

## ⚠️ Known Issues & Limitations

### Clerk Authentication Mocking

The main challenge is that your app uses **@clerk/clerk-react** which has complex client-side state management that's difficult to fully mock in E2E tests.

**Current Issues:**

1. **SignedIn/SignedOut components** - These use internal Clerk context that's hard to mock
2. **Protected routes** - ProtectedRoute component relies on Clerk's context
3. **Real-time auth state** - Clerk maintains WebSocket connections and session state

**Why This Happens:**

- Clerk's React components deeply integrate with their backend
- They use internal context providers that check real auth state
- Simple `window.Clerk` mocking doesn't fully replicate the React context

## 🎯 Recommended Approaches

### Option 1: Integration with Real Clerk (Recommended)

Use Clerk's actual test environment:

```typescript
// Use real Clerk test keys
const CLERK_TEST_PUBLISHABLE_KEY = process.env.CLERK_TEST_PUBLISHABLE_KEY;

// Create actual test users via Clerk API before tests
// Sign in with real credentials in tests
```

**Pros:**

- Tests real authentication flow
- No mocking complexity
- More reliable tests

**Cons:**

- Requires Clerk test environment setup
- Tests run slower
- Need to manage test users

### Option 2: Test Without Full Auth (Current Approach)

Focus on testing **public pages** and **component behavior** rather than full auth flows:

```typescript
// Test public pages
test('homepage loads', async ({ page }) => {
  await page.goto('/');
  // Test homepage content
});

// Test components in isolation (unit tests better for this)
// Focus E2E on user journeys that don't require complex auth
```

**Pros:**

- Simpler setup
- Faster tests
- Good for smoke testing

**Cons:**

- Can't test full authenticated user journeys
- Limited coverage of real user flows

### Option 3: Mock at Router Level

Instead of mocking Clerk, mock at the route level:

```typescript
// In tests, directly navigate to pages and mock API responses
// Skip Clerk auth checks entirely
await page.route('**/api/**', mockApiHandler);
await page.goto('/org/test-org/dashboard', { waitUntil: 'networkidle' });
```

**Pros:**

- Tests the UI/UX
- Doesn't fight with Clerk
- Good for visual regression testing

**Cons:**

- Doesn't test real auth integration
- API mocking can be complex

## 📋 Recommended Next Steps

### Immediate (Do This Now)

1. **Keep the smoke tests** - They verify basic functionality

   ```bash
   npm run test:e2e -- basic.spec.ts
   ```

2. **Create API-focused E2E tests** - Test with mocked APIs, skip auth complexity

   ```typescript
   // Test dashboard with mocked data
   test('dashboard shows stats', async ({ page }) => {
     await page.route('**/api/**', mockHandler);
     await page.goto('/org/test-org/dashboard');
     // Verify UI renders correctly
   });
   ```

3. **Focus on component unit tests** - Use Vitest for auth-heavy components
   - Already have good coverage with Vitest
   - Easier to mock Clerk in unit tests
   - Faster feedback loop

### Short Term (Next Week)

1. **Set up Clerk test environment** (if budget allows)
   - Create Clerk test instance
   - Get test API keys
   - Create helper to sign in real test users

2. **Write integration tests for key flows**
   - Onboarding (with real Clerk)
   - Dashboard navigation
   - Content creation

### Long Term (Future)

1. **Visual regression testing** with Playwright

   ```typescript
   await expect(page).toHaveScreenshot('dashboard.png');
   ```

2. **Performance testing**

   ```typescript
   const metrics = await page.evaluate(() => window.performance.timing);
   ```

3. **Accessibility testing**
   ```typescript
   const accessibilityScan = await new AxeBuilder({ page }).analyze();
   ```

## 🚀 What You Can Do Right Now

### Run Working Tests

```bash
# Run smoke tests (these work!)
npx playwright test basic.spec.ts

# Run with UI
npx playwright test basic.spec.ts --ui

# Run in headed mode
npx playwright test basic.spec.ts --headed
```

### Add More Smoke Tests

Focus on testing non-auth pages and basic functionality:

```typescript
// e2e/tests/smoke/navigation.spec.ts
test('homepage has navigation', async ({ page }) => {
  await page.goto('/');
  // Check for nav elements
});

test('homepage has hero section', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
```

### Test Public Pages

```typescript
// Test your marketing/homepage thoroughly
test('features section displays', async ({ page }) => {
  await page.goto('/');
  await page.locator('[id="features"]').scrollIntoViewIfNeeded();
  // Verify features content
});
```

## 📚 Files to Reference

- **Working smoke tests**: `e2e/tests/smoke/basic.spec.ts`
- **Auth fixture** (needs real Clerk): `e2e/fixtures/auth.fixture.ts`
- **API mocks**: `e2e/utils/api-mocks.ts`
- **Config**: `playwright.config.ts`

## 💡 Alternative: Use Vitest for "E2E-style" Tests

Since you already have great Vitest setup, consider "integration-style" tests:

```typescript
// src/pages/Dashboard.integration.test.tsx
import { renderWithProviders } from '@/test/utils/test-utils';
import { DashboardPage } from './DashboardPage';

test('dashboard page full integration', async () => {
  // Mock all APIs
  vi.mock('@/api/dashboard');

  // Render full page
  const { user } = renderWithProviders(<DashboardPage />);

  // Interact like a user
  await user.click(screen.getByRole('button', { name: /create/ }));

  // Verify outcome
  expect(screen.getByText('Created')).toBeInTheDocument();
});
```

**Benefits:**

- Faster than Playwright
- Easier to mock Clerk
- Better debugging
- Same test coverage for user behavior

## 🎯 Bottom Line

**For now:**

1. Use the smoke tests to verify basic functionality
2. Continue using Vitest for component/integration tests (you're doing great here!)
3. When ready, set up real Clerk test environment for full E2E

**Your current Vitest tests are actually MORE valuable** for testing auth flows because they're easier to mock and debug.

Playwright is best for:

- Visual regression testing
- Cross-browser testing
- Performance testing
- Testing public-facing pages

---

Need help with any of these approaches? Let me know which direction you want to go!
