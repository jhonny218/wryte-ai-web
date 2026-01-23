import { Navigate, useNavigate } from 'react-router-dom';
import ROUTES from './routes';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { useUserOrganizations } from '@/features/organization';
import { useEffect } from 'react';
import { toast } from '@/hooks/useToast';

export function AuthenticatedRoot() {
  const { isSignedIn, isLoaded } = useAuth();
  const { data: orgData, isLoading: orgLoading, isError, error } = useUserOrganizations();
  const navigate = useNavigate();
  const { signOut } = useClerk();

  useEffect(() => {
    if (!isError) return;

    const doSignOut = async () => {
      const message =
        typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: unknown }).message === 'string'
          ? (error as { message: string }).message
          : 'Server error. Please try again later.';

      try {
        await signOut();
      } catch {
        // ignore signOut errors
      }

      // show toast on landing explaining the issue
      toast.error(message);
      navigate(ROUTES.HOME, { replace: true });
    };

    doSignOut();
  }, [isError, signOut, error, navigate]);

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

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
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
