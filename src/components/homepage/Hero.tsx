import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { ArrowRight, Sparkles } from 'lucide-react';
import logo from '@/assets/logo.png';

export const Hero = () => {
  return (
    <section className="relative container py-20">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-secondary/20 blur-[120px]" />
        <div className="absolute right-0 top-1/4 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Main content */}
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Left side - Logo */}
          <div className="flex w-full flex-1 items-center justify-center lg:justify-start">
            <div className="group relative">
              {/* Glow effect behind logo */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-secondary/30 to-primary/30 opacity-75 blur-2xl transition-all duration-500 group-hover:opacity-100 group-hover:blur-3xl" />
              
              {/* Logo container */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/80 to-background/60 p-8 backdrop-blur-sm ring-1 ring-white/10 transition-all duration-500 group-hover:scale-105 group-hover:ring-white/20">
                <img
                  src={logo}
                  alt="Wryte AI Logo"
                  className="h-auto w-64 md:w-80 lg:w-96"
                />
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex w-full flex-1 flex-col space-y-8 text-center lg:text-left relative">
            {/* Shadow effect */}
            <div className="shadow"></div>
            
            {/* Badge */}
            <div className="inline-flex items-center justify-center gap-2 self-center rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary ring-1 ring-secondary/20 lg:self-start">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Blog Generation</span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
                Create Blogs{' '}
                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  On Autopilot
                </span>
              </h1>
              
              {/* Slogan */}
              <div className="relative inline-block">
                <div className="absolute -inset-2 bg-gradient-to-r from-secondary/20 via-primary/20 to-secondary/20 blur-xl" />
                <p className="relative text-2xl md:text-3xl font-bold tracking-tight">
                  <span className="text-secondary">Wryte</span> Better,{' '}
                  <span className="text-primary">Wryte</span> Faster
                </p>
              </div>
              
              <p className="mx-auto text-xl text-muted-foreground md:text-2xl lg:mx-0 lg:max-w-xl">
                From strategy to publication—AI-powered blog generation tailored to your company's voice, audience, and goals.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button size="lg" className="group text-base">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <a
                rel="noreferrer noopener"
                href="https://github.com/jhonny218/wryte-ai-web.git"
                target="_blank"
                className={buttonVariants({
                  variant: 'outline',
                  size: 'lg',
                })}
              >
                <GitHubLogoIcon className="mr-2 h-5 w-5" />
                View on GitHub
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-secondary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-secondary">50M+</div>
                <div className="text-sm text-muted-foreground">Words Generated</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-secondary">99%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
