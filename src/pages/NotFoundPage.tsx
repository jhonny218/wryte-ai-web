import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useUserOrganization } from '@/hooks/useUserOrganization';
import { getOrgRoute } from '@/routes/routes';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: orgData } = useUserOrganization();

  // Check if we're in an org context by looking at the URL
  const isInOrgContext = location.pathname.startsWith('/org/');
  
  // Get the primary organization slug
  const primaryOrgSlug = orgData?.primaryOrganization?.slug;

  const handleBackToHome = () => {
    // If in org context and has a primary org, go to org dashboard
    if (isInOrgContext && primaryOrgSlug) {
      navigate(getOrgRoute(primaryOrgSlug, 'dashboard'));
    } else {
      navigate('/');
    }
  };

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>404</h1>
        <span className='font-medium'>Oops! Page Not Found!</span>
        <p className='text-muted-foreground text-center'>
          It seems like the page you're looking for <br />
          does not exist or might have been removed.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button onClick={handleBackToHome}>
            {isInOrgContext && primaryOrgSlug ? 'Back to Dashboard' : 'Back to Home'}
          </Button>
        </div>
      </div>
    </div>
  )
}
