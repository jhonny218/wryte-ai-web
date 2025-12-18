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
import SettingsPage from '@/pages/SettingsPage';
import CalendarPage from '@/pages/CalendarPage';
import TitlesPage from '@/pages/TitlesPage';
import OutlinesPage from '@/pages/OutlinesPage';
import BlogsPage from '@/pages/BlogsPage';
import HelpCenterPage from '@/pages/HelpCenterPage';

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
          <Route path={ROUTES.CALENDAR} element={<CalendarPage />} />
          <Route path={ROUTES.TITLES} element={<TitlesPage />} />
          <Route path={ROUTES.OUTLINES} element={<OutlinesPage />} />
          <Route path={ROUTES.BLOGS} element={<BlogsPage />} />
          <Route path={ROUTES.CONTENT_STRATEGY} element={<SettingsPage />} />
          <Route path={ROUTES.ORGANIZATION} element={<OrganizationPage />} />
          <Route path={ROUTES.HELP_CENTER} element={<HelpCenterPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
