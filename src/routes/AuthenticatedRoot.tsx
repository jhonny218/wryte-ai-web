import { Navigate } from 'react-router-dom';
import ROUTES from './routes';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { useAuth } from '@clerk/clerk-react';
import { useUserOrganizations } from '@/features/organization';

export function AuthenticatedRoot() {
  const { isSignedIn, isLoaded } = useAuth();
  const { data: orgData, isLoading: orgLoading, isError } = useUserOrganizations();

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

  // Handle error state
  if (isError || !orgData) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  // If user has no organization, redirect to onboarding
  if (!orgData.hasOrganizations || !orgData.primaryOrganization) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  // If user has an organization, redirect to their primary organization dashboard
  return <Navigate to={`${ROUTES.ORG_INDEX}/${orgData.primaryOrganization.slug}`} replace />;
}
