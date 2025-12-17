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

          {/* <Route path="settings" element={<SettingsPage />} />
          
          <Route path="titles" element={<TitleGenerationPage />} />
          
          <Route path="calendar" element={<CalendarPage />} />
          
          <Route path="titles/:titleId/outline" element={<OutlineEditorPage />} />
          
          <Route path="outlines/:outlineId/blog" element={<BlogEditorPage />} /> */}
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
