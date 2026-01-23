import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { env } from './config/env';
import { initNewRelic } from './telemetry/newrelic';

// Import your Publishable Key
const PUBLISHABLE_KEY = env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

// Consent check for analytics: read from localStorage key `analytics_consent` === 'granted'
const analyticsConsent = typeof window !== 'undefined' && localStorage.getItem('analytics_consent') === 'granted';

// Initialize New Relic dynamically when a license key is present and user has consented
if (import.meta.env.VITE_NEW_RELIC_BROWSER_LICENSE_KEY && (env.VITE_APP_ENV === 'production' || env.VITE_APP_ENV === 'staging')) {
  initNewRelic(analyticsConsent);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>
);
