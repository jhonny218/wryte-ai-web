// Lightweight New Relic browser initializer (dynamic, consent-gated)
// Reads VITE_NEW_RELIC_BROWSER_LICENSE_KEY and other optional VITE_ vars.
export function initNewRelic(consent: boolean) {
  const license = import.meta.env.VITE_NEW_RELIC_BROWSER_LICENSE_KEY as string | undefined;
  if (!license) return;
  if (!consent) return;

  const appName = (import.meta.env.VITE_NEW_RELIC_APP_NAME as string) || `wryte-ai-web-${import.meta.env.VITE_APP_ENV ?? 'local'}`;
  const accountID = import.meta.env.VITE_NEW_RELIC_ACCOUNT_ID as string | undefined;
  const applicationID = import.meta.env.VITE_NEW_RELIC_APPLICATION_ID as string | undefined;

  // Minimal safe config placed on window prior to loading the agent
  ;(window as any).NREUM = (window as any).NREUM || {};
  ;(window as any).NREUM.init = {
    distributed_tracing: { enabled: true },
    performance: { capture_measures: true },
    browser_consent_mode: { enabled: false },
    privacy: { cookies_enabled: true },
  };

  ;(window as any).NREUM.loader_config = {
    licenseKey: String(license),
    applicationID: applicationID || undefined,
    accountID: accountID || undefined,
    beacon: 'bam.nr-data.net',
    errorBeacon: 'bam.nr-data.net',
  };

  ;(window as any).NREUM.info = {
    beacon: 'bam.nr-data.net',
    errorBeacon: 'bam.nr-data.net',
    licenseKey: String(license),
    applicationID: applicationID || undefined,
    sa: 1,
  };

  // Load New Relic loader script asynchronously
  const s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = 'https://js-agent.newrelic.com/nr-loader-spa-1.308.0.min.js';
  document.head.appendChild(s);

  // Post-load best-effort: set application name if API available
  s.addEventListener('load', () => {
    try {
      const nr = (window as any).newrelic || (window as any).NREUM;
      if ((window as any).newrelic && typeof (window as any).newrelic.setApplicationName === 'function') {
        (window as any).newrelic.setApplicationName(appName);
      }
    } catch (e) {
      // silent
    }
  });
}

export default initNewRelic;
