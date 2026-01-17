# Testing Guide

## Overview

This project uses **Vitest** for unit and integration tests, and **Playwright** for end-to-end tests. All unit tests are co-located with their components.

## Test Structure

```
src/
├── components/
│   ├── feedback/
│   │   ├── LoadingSpinner.tsx
│   │   ├── LoadingSpinner.test.tsx ✅
│   │   ├── EmptyState.tsx
│   │   └── EmptyState.test.tsx ✅
│   ├── layout/
│   │   ├── section-title.tsx
│   │   └── section-title.test.tsx ✅
│   └── data-table/
│       ├── column-header.tsx
│       ├── column-header.test.tsx ✅
│       ├── data-table.tsx
│       └── data-table.test.tsx ✅
├── test/
│   ├── setup.ts (Global test configuration)
│   └── utils/
│       └── test-utils.tsx (Custom render helpers)
└── vitest.config.ts
```

## Running Tests

### Unit Tests (Vitest)

```bash
# Run tests in watch mode (recommended for development)
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- LoadingSpinner.test.tsx

# Run tests matching a pattern
npm test -- feedback
```

### E2E Tests (Playwright)

```bash
# First time setup - install browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI (recommended for development)
npm run test:e2e:ui

# Run specific test file
npx playwright test authentication.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Debug mode
npx playwright test --debug

# View test report
npx playwright show-report
```

**Note**: E2E tests use mocked Clerk authentication and API responses. See `e2e/README.md` for details.

## Writing Tests

### Unit Test Example

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Testing with User Interactions

```tsx
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils/test-utils';
import { MyButton } from './MyButton';

describe('MyButton', () => {
  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    renderWithProviders(<MyButton onClick={handleClick} />);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Testing Components with React Router

```tsx
import { renderWithProviders } from '@/test/utils/test-utils';

// Component will be wrapped with MemoryRouter
renderWithProviders(
  <MyComponent />,
  { initialRoute: '/dashboard' }
);
```

### Testing Components with TanStack Query

```tsx
import { vi } from 'vitest';
import { renderWithProviders } from '@/test/utils/test-utils';
import { MyApiComponent } from './MyApiComponent';
import { MyApi } from './api';

// Mock the API
vi.mock('./api');

describe('MyApiComponent', () => {
  it('displays data when loaded', async () => {
    vi.mocked(MyApi.getData).mockResolvedValue({ name: 'Test' });
    
    renderWithProviders(<MyApiComponent />);
    
    expect(await screen.findByText('Test')).toBeInTheDocument();
  });
});
```

## Test Utilities

### `renderWithProviders()`

A custom render function that wraps components with necessary providers:
- `QueryClientProvider` (TanStack Query)
- `MemoryRouter` (React Router)

```tsx
import { renderWithProviders } from '@/test/utils/test-utils';

const { queryClient } = renderWithProviders(<MyComponent />);
```

### `createTestQueryClient()`

Creates a QueryClient configured for testing (no retries, no cache).

## Best Practices

### ✅ Do

- **Test user behavior, not implementation details**
  ```tsx
  // Good: Test what user sees
  expect(screen.getByText('Success')).toBeInTheDocument();
  
  // Bad: Test internal state
  expect(component.state.isLoading).toBe(false);
  ```

- **Use accessible queries (priority order)**
  1. `getByRole` - Best for accessibility
  2. `getByLabelText` - Good for forms
  3. `getByText` - Good for content
  4. `getByTestId` - Last resort

  ```tsx
  // Good
  screen.getByRole('button', { name: /submit/i });
  
  // Avoid
  screen.getByTestId('submit-button');
  ```

- **Use `userEvent` over `fireEvent`**
  ```tsx
  // Good: More realistic
  const user = userEvent.setup();
  await user.click(button);
  
  // Avoid: Too low-level
  fireEvent.click(button);
  ```

- **Test async operations with `waitFor`**
  ```tsx
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
  ```

### ❌ Don't

- Don't test third-party library internals (shadcn/ui, TanStack Query, etc.)
- Don't test CSS/styling (unless critical to functionality)
- Don't use arbitrary timeouts (`setTimeout`)
- Don't test implementation details (component state, functions)

## Coverage

View coverage report after running:

```bash
npm run test:coverage
```

Open `coverage/index.html` in your browser to see detailed coverage report.

### Coverage Exclusions

The following are excluded from coverage:
- `node_modules/`
- `src/test/`
- `src/components/ui/` (shadcn components)
- `src/components/homepage/` (marketing components)
- Type definition files (`*.d.ts`)
- Config files

## Debugging Tests

### VS Code

Add this to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal"
}
```

### Vitest UI

Run tests with the UI for better debugging:

```bash
npm run test:ui
```

### Playwright

Debug E2E tests:

```bash
npx playwright test --debug
npx playwright show-report
```

## Mocking

### Mock Functions

```tsx
import { vi } from 'vitest';

const mockFn = vi.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue('async value');
```

### Mock Modules

```tsx
vi.mock('@/lib/api-client');

// In test
vi.mocked(apiClient.get).mockResolvedValue({ data: [] });
```

### Mock Timers

```tsx
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// In test
vi.advanceTimersByTime(2000);
```

## CI/CD Integration

Tests run automatically in CI/CD pipelines. To set up GitHub Actions:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
```

## E2E Test Structure

E2E tests are located in the `e2e/` directory:

```
e2e/
├── fixtures/
│   └── auth.fixture.ts        # Auth state setup
├── tests/
│   ├── auth/                  # Authentication tests
│   ├── onboarding/            # Onboarding flow tests
│   └── dashboard/             # Dashboard tests
├── utils/
│   └── api-mocks.ts          # API mocking utilities
└── README.md
```

### E2E Test Example

```typescript
import { test, expect } from '../../fixtures/auth.fixture';
import { setupApiMocks } from '../../utils/api-mocks';

test.describe('My Feature', () => {
  test('user can complete action', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    await setupApiMocks(page);
    
    await page.goto('/org/test-org/dashboard');
    await page.getByRole('button', { name: /create/i }).click();
    
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

## Next Steps

1. ✅ Unit tests for `src/components` - **COMPLETE**
2. ✅ E2E tests for authentication & onboarding - **COMPLETE**
3. 🔄 Unit tests for `src/lib` utilities
4. 🔄 Integration tests for feature components
5. 🔄 E2E tests for titles, outlines, blogs, calendar

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [TanStack Query Testing](https://tanstack.com/query/latest/docs/react/guides/testing)

## Questions?

Review the test files in `src/components/` for examples of different testing patterns.
