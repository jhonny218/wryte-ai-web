// Lightweight New Relic browser initializer (dynamic, consent-gated).
// Reads VITE_NEW_RELIC_BROWSER_LICENSE_KEY and other optional VITE_ vars.

type NewRelicGlobal = Window & {
  NREUM?: Record<string, unknown> & {
    init?: Record<string, unknown>;
    loader_config?: Record<string, unknown>;
    info?: Record<string, unknown>;
  };
  newrelic?: { setApplicationName?: (name: string) => void } & Record<string, unknown>;
};

export function initNewRelic(consent: boolean): void {
  const licenseRaw = import.meta.env.VITE_NEW_RELIC_BROWSER_LICENSE_KEY;
  const license = typeof licenseRaw === 'string' && licenseRaw.length > 0 ? licenseRaw : undefined;
  if (!license) return;
  if (!consent) return;

  const appName = (import.meta.env.VITE_NEW_RELIC_APP_NAME as string) ?? `wryte-ai-web-${import.meta.env.VITE_APP_ENV ?? 'local'}`;
  const accountID = import.meta.env.VITE_NEW_RELIC_ACCOUNT_ID as string | undefined;
  const applicationID = import.meta.env.VITE_NEW_RELIC_APPLICATION_ID as string | undefined;

  const win = window as NewRelicGlobal;

  // Minimal safe config placed on window prior to loading the agent
  win.NREUM = win.NREUM ?? {};
  win.NREUM.init = {
    distributed_tracing: { enabled: true },
    performance: { capture_measures: true },
    browser_consent_mode: { enabled: false },
    privacy: { cookies_enabled: true },
  };

  win.NREUM.loader_config = {
    licenseKey: String(license),
    applicationID: applicationID ?? undefined,
    accountID: accountID ?? undefined,
    beacon: 'bam.nr-data.net',
    errorBeacon: 'bam.nr-data.net',
  };

  win.NREUM.info = {
    beacon: 'bam.nr-data.net',
    errorBeacon: 'bam.nr-data.net',
    licenseKey: String(license),
    applicationID: applicationID ?? undefined,
    sa: 1,
  };

  // Load New Relic loader script asynchronously
  const script = document.createElement('script');
  script.type = 'application/javascript';
  script.async = true;
  script.src = 'https://js-agent.newrelic.com/nr-loader-spa-1.308.0.min.js';
  document.head.appendChild(script);

  // Post-load best-effort: set application name if API available
  script.addEventListener('load', () => {
    try {
      const nr = win.newrelic ?? win.NREUM;
      if (nr && typeof (nr as { setApplicationName?: unknown }).setApplicationName === 'function') {
        (nr as { setApplicationName: (name: string) => void }).setApplicationName(appName);
      }
    } catch {
      // intentionally ignore errors here
    }
  });
}

export default initNewRelic;
