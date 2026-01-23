import { Navigate } from 'react-router-dom';
import ROUTES from './routes';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { useAuth } from '@clerk/clerk-react';
import { useUserOrganizations } from '@/features/organization';

export function AuthenticatedRoot() {
  const { isSignedIn, isLoaded } = useAuth();
  const { data: orgData, isLoading: orgLoading, isError, error } = useUserOrganizations();

  // Wait for organization data to load
  if (!isLoaded || orgLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If user is not signed in, redirect to sign-in page
  if (!isSignedIn) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  // Handle error state: if fetching organizations errored (server/backend issue),
  // redirect the user back to the public landing page so they are not stuck
  // inside the authenticated/onboarding flow. If data is simply missing
  // (no orgData), continue to onboarding flow.
  if (isError) {
    // Forward the server error message to the landing page so it can show user feedback
    const message =
      typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: unknown }).message === 'string'
        ? (error as { message: string }).message
        : 'Server error. Please try again later.';
    return (
      <Navigate
        to={ROUTES.HOME}
        replace
        state={{ from: 'org_error', message }}
      />
    );
  }

  if (!orgData) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  // If user has no organization, redirect to onboarding
  if (!orgData.hasOrganizations || !orgData.primaryOrganization) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  // If user has an organization, redirect to their primary organization dashboard
  return <Navigate to={`${ROUTES.ORG_INDEX}/${orgData.primaryOrganization.slug}`} replace />;
}
