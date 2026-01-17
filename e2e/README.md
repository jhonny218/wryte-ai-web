# E2E Testing with Playwright

## Overview

This directory contains end-to-end tests using Playwright. Tests simulate real user interactions with mocked backend responses.

## Directory Structure

```
e2e/
├── fixtures/
│   └── auth.fixture.ts        # Auth state setup (authenticated/unauthenticated)
├── tests/
│   ├── auth/
│   │   └── authentication.spec.ts
│   ├── onboarding/
│   │   └── onboarding.spec.ts
│   └── dashboard/
│       └── dashboard.spec.ts
├── utils/
│   └── api-mocks.ts          # API response mocking utilities
└── README.md
```

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (recommended for development)
npm run test:e2e:ui

# Run specific test file
npx playwright test auth/authentication.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run with specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Debug mode
npx playwright test --debug

# View test report
npx playwright show-report
```

## First Time Setup

Install Playwright browsers:

```bash
npx playwright install
```

## Writing Tests

### Using Auth Fixtures

```typescript
import { test, expect } from '../../fixtures/auth.fixture';

test('my test', async ({ authenticatedPage }) => {
  const page = authenticatedPage;
  // Page is already authenticated
  await page.goto('/org/test-org/dashboard');
});
```

### Mocking API Responses

```typescript
import { setupApiMocks } from '../../utils/api-mocks';

test.beforeEach(async ({ authenticatedPage }) => {
  await setupApiMocks(authenticatedPage);
});
```

### Custom API Mocks

```typescript
test('custom mock', async ({ authenticatedPage }) => {
  const page = authenticatedPage;
  
  await page.route('**/api/v1/custom-endpoint', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: 'custom response' }),
    });
  });
  
  await page.goto('/my-page');
});
```

## Authentication

Tests use mocked Clerk authentication. Two fixtures are available:

- `authenticatedPage` - Page with authenticated user
- `unauthenticatedPage` - Page without authentication

The mock includes:
- User ID: `user_test123`
- Email: `test@example.com`
- Name: `Test User`
- JWT Token: `mock-test-token-123`

## Best Practices

1. **Use page object pattern** for complex pages
2. **Mock API responses** for predictable tests
3. **Use accessible queries** (`getByRole`, `getByLabel`) over test IDs
4. **Wait for conditions** instead of fixed timeouts
5. **Test user journeys** not implementation details
6. **Keep tests independent** - each test should work in isolation

## CI/CD Integration

Tests run automatically in CI with:
- Retry on failure (2 retries)
- Serial execution (no parallel)
- Full trace and video on failure

## Debugging

### Visual Debugging

```bash
npx playwright test --debug
```

### View traces

```bash
npx playwright show-trace trace.zip
```

### Screenshots

Screenshots are automatically captured on failure in `test-results/`

## Common Issues

### Port Already in Use

If dev server fails to start, kill existing processes:

```bash
lsof -ti:5173 | xargs kill -9
```

### Slow Tests

- Check network tab in UI mode
- Reduce unnecessary waits
- Mock slow API endpoints

### Flaky Tests

- Avoid fixed timeouts
- Use `waitFor` conditions
- Increase timeout for slow operations

## Next Steps

Add tests for:
- [ ] Title creation/editing
- [ ] Outline creation/editing
- [ ] Blog creation/editing
- [ ] Calendar interactions
- [ ] Settings updates
- [ ] Error states
- [ ] Mobile views

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
