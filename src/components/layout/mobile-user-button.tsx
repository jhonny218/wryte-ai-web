import { useUser, useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MobileUserButton() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Sign out error:', error)
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 px-2">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
          {user?.firstName?.[0]?.toUpperCase() || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">
            {user?.fullName || user?.firstName || 'Account'}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {user?.primaryEmailAddress?.emailAddress}
          </div>
        </div>
      </div>
      <Button
        onClick={handleSignOut}
        variant="default"
        size="sm"
        className="w-full"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  )
}
