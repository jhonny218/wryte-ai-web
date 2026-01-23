# Wryte AI - Web Client

## Overview

Wryte AI is an AI-powered blog generator that helps companies create high-quality, SEO-optimized content aligned with their brand voice. This repository (`wryte-ai-web`) contains the frontend application.

## Tech Stack

This project is built with a modern, type-safe stack designed for scalability and performance:

- **Framework**: [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) (Server State)
- **Routing**: [React Router](https://reactrouter.com/)
- **Authentication**: [Clerk](https://clerk.com/)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd wryte-ai-web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Environment variables

Add a `.env` or `.env.production` in the project root for runtime config. Vite exposes variables with the `VITE_` prefix to the client. The app validates some vars at startup via `src/config/env.ts`.

Required (for app to run):

- `VITE_API_URL` — base API URL (must be a valid URL).
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key for authentication.
- `VITE_APP_ENV` — one of `development`, `staging`, `production` (defaults to `development`).

Optional telemetry / New Relic (client-side):

- `VITE_NEW_RELIC_BROWSER_LICENSE_KEY` — browser license key for New Relic Browser (place in `.env.production` or CI secrets). The app will initialize the New Relic agent only when this value exists and when the user has granted analytics consent.
- `VITE_NEW_RELIC_APPLICATION_ID` — (optional) New Relic application id to attach to the loader config.
- `VITE_NEW_RELIC_ACCOUNT_ID` — (optional) New Relic account id to attach to the loader config.
- `VITE_NEW_RELIC_APP_NAME` — (optional) readable application name used after agent load.

Consent and privacy: this repo uses a simple consent gate keyed by `analytics_consent` in `localStorage`. Set `localStorage.setItem('analytics_consent','granted')` to opt into telemetry locally for testing. In production, implement a consent UI and call the initializer only after the user grants permission.

## Project Structure

```
src/
├── components/        # Shared UI components
├── features/          # Feature-based modules (Onboarding, Blog, Dashboard)
├── hooks/             # Custom React hooks
├── lib/               # Utilities and configurations
├── pages/             # Route components
└── types/             # Global TypeScript definitions
```

## Roadmap

- [x] Project Initialization
- [x] Authentication Setup (Clerk)
- [x] Onboarding Flow
- [x] Blog Title Generation
- [x] Calendar View
- [x] Blog Layout Editor
- [x] Full Blog Generation

## Telemetry & Observability

- The New Relic initializer lives in `src/telemetry/newrelic.ts` and is invoked from `src/main.tsx` when a license key is present and consent is granted.
- If you enable New Relic in production, enable production source maps so stack traces can be symbolicated. Edit `vite.config.ts` and add `build: { sourcemap: true }` under the exported config (only for production builds).
- CI: upload generated source maps (.map files) to New Relic after `vite build`. Use a secure CI secret for the New Relic API key and the official sourcemap upload API or `newrelic` CLI. Do NOT publish `.map` files to a public CDN.

Example (CI) upload note:

Use your CI secrets to call the New Relic sourcemap upload endpoint or their CLI. Ensure the `version` you upload matches the browser `application`/`release` you set in the agent config.

## Running / Build / Preview

Common npm scripts (see `package.json`):

- `npm run dev` — starts vite dev server
- `npm run build` — runs `tsc -b` then `vite build`
- `npm run preview` — previews the production build locally
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run format` — Prettier

## Testing

- Unit & integration: `npm run test` (Vitest)
- Coverage: `npm run test:coverage`
- E2E (Playwright): `npm run test:e2e`

## Error Reporting

- Add a top-level React Error Boundary to capture render errors and forward them to your RUM provider (e.g., call `newrelic.noticeError(err)` or use provider SDK helpers). Recommended file locations: create `src/components/ErrorBoundary.tsx` and wrap `<App />` in `src/main.tsx`.

## Verification / Troubleshooting

1. For local testing enable consent and the license key in `.env.production` (or set `import.meta.env` via your environment) and run a preview build:

```bash
npm run build
npm run preview
```

2. In browser DevTools, check for `window.NREUM` or `window.newrelic` and network calls to `bam.nr-data.net` or `js-agent.newrelic.com`.
3. Trigger a test error and verify it appears in New Relic (or that the agent sent an error payload without PII).

## Where to look in the code

- New Relic initializer: `src/telemetry/newrelic.ts`
- Bootstrap & init: `src/main.tsx`
- Environment schema: `src/config/env.ts`
