import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { MobileUserButton } from './mobile-user-button'
import { useIsMobile } from '@/hooks/useIsMobile'

export function NavUser() {
  const { user } = useUser()
  const isMobile = useIsMobile()

  return (
    <div className="w-full px-2">
      <SignedOut>
        <div className="px-2">
          <SignInButton mode="modal">
            <button className="w-full rounded-md border px-3 py-2 text-sm">Sign In</button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        {isMobile ? (
          <MobileUserButton />
        ) : (
          <div className="flex items-center gap-3">
            <UserButton 
              userProfileMode="modal"
              appearance={{
                elements: {
                  userButtonPopoverCard: "z-[9999]",
                  userButtonPopoverActionButton: "hover:bg-accent",
                }
              }}
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">
                {user?.fullName || user?.firstName || 'Account'}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </div>
            </div>
          </div>
        )}
      </SignedIn>
    </div>
  )
}
