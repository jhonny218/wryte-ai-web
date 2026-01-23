import { Hero } from '@/components/homepage/Hero';
import { Mission } from '@/components/homepage/Mission';
import { Why } from '@/components/homepage/Why';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { Features } from '@/components/homepage/Features';
import { Services } from '@/components/homepage/Services';
import { FAQ } from '@/components/homepage/FAQ';
import { ScrollToTop } from '@/components/homepage/ScrollToTop';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from '@/hooks/useToast';

type HomePageLocationState = {
  from?: string;
  message?: string;
} | null;

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    // If navigated here due to backend/org fetch error, show a toast message
    const state = location.state as HomePageLocationState;
    if (state?.from === 'org_error') {
      const msg = state?.message || 'Temporary server error. Please try again later.';
      toast.error(msg);
      // Clear the location state to avoid repeated toasts on history navigation
      try {
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      } catch {
        // ignore
      }
    }
  }, [location]);

  return (
    <>
      <Hero />
      <Mission />
      <Why />
      <HowItWorks />
      <Features />
      <Services />
      <FAQ />
      <ScrollToTop />
    </>
  );
}
