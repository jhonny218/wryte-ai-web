import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { RootLayout } from '../layouts/RootLayout';
import { WryteLayout } from '../layouts/WryteLayout';
import ProtectedRoute from './ProtectedRoute';
import { AuthenticatedRoot } from './AuthenticatedRoot';
import ROUTES from './routes';

// Pages
import HomePage from '@/pages/HomePage';
import OnboardingPage from '@/pages/OnboardingPage';
import NotFoundPage from '@/pages/NotFoundPage';
import DashboardPage from '@/pages/DashboardPage';
import OrganizationPage from '@/pages/OrganizationPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<RootLayout />}>
        <Route
          index
          element={
            <>
              <SignedOut>
                <HomePage />
              </SignedOut>
              <SignedIn>
                <AuthenticatedRoot />
              </SignedIn>
            </>
          }
        />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Onboarding Wizard */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Org Dashboard (Slug-based routing) */}
        <Route path={ROUTES.ORG} element={<WryteLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.CALENDAR} element={<div>Calendar Page</div>} />
          <Route path={ROUTES.TITLES} element={<div>Titles Page</div>} />
          <Route path={ROUTES.OUTLINES} element={<div>Outlines Page</div>} />
          <Route path={ROUTES.BLOGS} element={<div>Blogs Page</div>} />
          <Route path={ROUTES.CONTENT_STRATEGY} element={<div>Content Strategy Page</div>} />
          <Route path={ROUTES.ORGANIZATION} element={<OrganizationPage />} />
          <Route path={ROUTES.HELP_CENTER} element={<div>Help Center Page</div>} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
