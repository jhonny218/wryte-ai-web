import { Outlet, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import ROUTES from './routes'

export default function ProtectedRoute() {
  return (
    <>
      <SignedIn>
        <Outlet />
      </SignedIn>
      <SignedOut>
        <Navigate to={ROUTES.SIGN_IN} replace />
      </SignedOut>
    </>
  )
}
