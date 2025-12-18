import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/useToast';

export function MobileUserButton() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out. Please try again.';
      toast.error(errorMessage);
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 px-2">
        <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
          {user?.firstName?.[0]?.toUpperCase() ||
            user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ||
            'U'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">
            {user?.fullName || user?.firstName || 'Account'}
          </div>
          <div className="text-muted-foreground truncate text-xs">
            {user?.primaryEmailAddress?.emailAddress}
          </div>
        </div>
      </div>
      <Button onClick={handleSignOut} variant="default" size="sm" className="w-full">
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
}
