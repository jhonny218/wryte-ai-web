// Centralized route path constants
export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  ONBOARDING: '/onboarding',
  ORG_INDEX: '/org',
  ORG: '/org/:slug',
} as const;

export type RouteKey = keyof typeof ROUTES;

export default ROUTES;
