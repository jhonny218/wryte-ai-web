import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { RootLayout } from '../layouts/RootLayout'
import { DashboardLayout } from '../layouts/DashboardLayout'

// Pages
import HomePage from '../pages/HomePage'
import OnboardingPage from '../pages/OnboardingPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={
          <>
            <SignedOut>
              <HomePage />
            </SignedOut>
            <SignedIn>
              {/* Check if user has org, if not -> onboarding, else -> dashboard */}
              <Navigate to="/onboarding" replace />
            </SignedIn>
          </>
        } />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Onboarding Wizard */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Org Dashboard (Slug-based routing) */}
        <Route path="/org/:slug" element={<DashboardLayout />}>
          {/* <Route index element={<OrganizationDashboardPage />} />
          
          <Route path="settings" element={<SettingsPage />} />
          
          <Route path="titles" element={<TitleGenerationPage />} />
          
          <Route path="calendar" element={<CalendarPage />} />
          
          <Route path="titles/:titleId/outline" element={<OutlineEditorPage />} />
          
          <Route path="outlines/:outlineId/blog" element={<BlogEditorPage />} /> */}
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function ProtectedRoute() {
  return (
    <>
      <SignedIn>
        <Outlet />
      </SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  )
}