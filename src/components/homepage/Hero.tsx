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
        <div className="bg-secondary/20 absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]" />
        <div className="bg-primary/10 absolute top-1/4 right-0 h-[300px] w-[300px] rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Main content */}
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Left side - Logo */}
          <div className="flex w-full flex-1 items-center justify-center lg:justify-start">
            <div className="group relative flex items-center justify-center">
              {/* Glow effect behind logo (kept for subtle emphasis) */}
              <div className="from-secondary/30 to-primary/30 absolute -inset-6 rounded-full bg-gradient-to-r opacity-60 blur-3xl transition-all duration-500 group-hover:opacity-100" />

              {/* Plain larger logo (no frame) */}
              <img
                src={logo}
                alt="Wryte AI Logo"
                className="relative h-auto w-[360px] object-contain sm:w-[520px] md:w-[720px] lg:w-[980px]"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="relative flex w-full flex-1 flex-col space-y-8 text-center lg:text-left">
            {/* Shadow effect */}
            <div className="shadow"></div>

            {/* Badge */}
            <div className="bg-secondary/10 text-secondary ring-secondary/20 inline-flex items-center justify-center gap-2 self-center rounded-full px-4 py-2 text-sm font-medium ring-1 lg:self-start">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Blog Generation</span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl leading-tight font-bold md:text-6xl lg:text-7xl">
                Create Blogs{' '}
                <span className="from-secondary to-primary bg-gradient-to-r bg-clip-text text-transparent">
                  On Autopilot
                </span>
              </h1>

              {/* Slogan */}
              <div className="relative inline-block">
                <div className="from-secondary/20 via-primary/20 to-secondary/20 absolute -inset-2 bg-gradient-to-r blur-xl" />
                <p className="relative text-2xl font-bold tracking-tight md:text-3xl">
                  <span className="text-secondary">Wryte</span> Better,{' '}
                  <span className="text-primary">Wryte</span> Faster
                </p>
              </div>

              <p className="text-muted-foreground mx-auto text-xl md:text-2xl lg:mx-0 lg:max-w-xl">
                From strategy to publication—AI-powered blog generation tailored to your company's
                voice, audience, and goals.
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
                <div className="text-secondary text-3xl font-bold">10K+</div>
                <div className="text-muted-foreground text-sm">Active Users</div>
              </div>
              <div className="space-y-1">
                <div className="text-secondary text-3xl font-bold">50M+</div>
                <div className="text-muted-foreground text-sm">Words Generated</div>
              </div>
              <div className="space-y-1">
                <div className="text-secondary text-3xl font-bold">99%</div>
                <div className="text-muted-foreground text-sm">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
