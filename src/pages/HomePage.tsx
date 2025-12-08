import { Hero } from '@/components/homepage/Hero';
import { About } from '@/components/homepage/About';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { Features } from '@/components/homepage/Features';
import { Services } from '@/components/homepage/Services';
import { FAQ } from '@/components/homepage/FAQ';
import { ScrollToTop } from '@/components/homepage/ScrollToTop';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <FAQ />
      <ScrollToTop />
    </>
  );
}
