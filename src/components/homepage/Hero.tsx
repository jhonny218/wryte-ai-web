import { Button } from '@/components/ui/button.tsx';
import { buttonVariants } from '@/components/ui/button.tsx';
import { HeroCards } from './HeroCards';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

export const Hero = () => {
  return (
    <section className="relative container grid place-items-center gap-10 py-20 md:py-32 lg:grid-cols-2">
      <div className="space-y-6 text-center lg:text-start">
        <main className="text-5xl font-bold md:text-6xl">
          <h1 className="inline">
            <span className="from-secondary/60 to-secondary inline bg-linear-to-b bg-clip-text text-transparent">
              Wryte AI
            </span>{' '}
            landing page
          </h1>{' '}
          for{' '}
          <h2 className="inline">
            <span className="from-primary/60 to-primary inline bg-gradient-to-r bg-clip-text text-transparent">
              React
            </span>{' '}
            developers
          </h2>
        </main>

        <p className="text-muted-foreground mx-auto text-xl md:w-10/12 lg:mx-0">
          Build your React landing page effortlessly with the required sections to your project.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3">Get Started</Button>

          <a
            rel="noreferrer noopener"
            href="https://github.com/jhonny218/wryte-ai-web.git"
            target="_blank"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: 'outline',
            })}`}
          >
            Github Repository
            <GitHubLogoIcon className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="relative">
        <HeroCards />
      </div>
    </section>
  );
};
