// Centralized route path constants
export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  ONBOARDING: '/onboarding',
  ORG_INDEX: '/org',
  ORG: '/org/:slug',
  // Org sub-routes (relative paths)
  DASHBOARD: 'dashboard',
  CALENDAR: 'calendar',
  TITLES: 'titles',
  OUTLINES: 'outlines',
  BLOGS: 'blogs',
  CONTENT_STRATEGY: 'settings/content-strategy',
  ORGANIZATION: 'settings/organization',
  HELP_CENTER: 'help-center',
} as const;

// Helper to build org-scoped routes
export function getOrgRoute(slug: string, path?: string): string {
  const base = `/org/${slug}`;
  return path ? `${base}/${path}` : base;
}

export type RouteKey = keyof typeof ROUTES;

export default ROUTES;
