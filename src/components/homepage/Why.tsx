import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Zap, Clock, TrendingUp } from 'lucide-react';
import pilot from '@/assets/pilot.png';

export const Why = () => {
  return (
    <section id="why" className="container py-20">
      <div className="max-w-8xl mx-auto space-y-8">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <Badge variant="secondary" className="mb-2">
            Why Choose Wryte AI
          </Badge>
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            Not Just Another{' '}
            <span className="from-secondary/60 to-secondary bg-gradient-to-b bg-clip-text text-transparent">
              AI Writing Tool
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg md:text-xl">
            While others give you a blank box and generic outputs, we provide an end-to-end blog
            creation workflow
          </p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="group border-secondary/20 hover:border-secondary/40 relative overflow-hidden transition-all hover:shadow-xl">
              <div className="bg-secondary/10 absolute top-0 right-0 h-32 w-32 rounded-full blur-2xl transition-all group-hover:scale-150" />
              <CardHeader className="relative space-y-3">
                <div className="bg-secondary/20 flex h-12 w-12 items-center justify-center rounded-xl transition-all group-hover:scale-110">
                  <Zap className="text-secondary h-6 w-6" />
                </div>
                <CardTitle>Complete Workflow</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-muted-foreground text-sm">
                  From strategy and planning to writing and publishing—everything in one platform.
                  No juggling multiple tools.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-primary/20 hover:border-primary/40 relative overflow-hidden transition-all hover:shadow-xl">
              <div className="bg-primary/10 absolute top-0 right-0 h-32 w-32 rounded-full blur-2xl transition-all group-hover:scale-150" />
              <CardHeader className="relative space-y-3">
                <div className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-xl transition-all group-hover:scale-110">
                  <Target className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Brand Voice Precision</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-muted-foreground text-sm">
                  AI that actually sounds like you. We analyze your company's voice to create
                  authentic content, not generic fluff.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-secondary/20 hover:border-secondary/40 relative overflow-hidden transition-all hover:shadow-xl">
              <div className="bg-secondary/10 absolute top-0 right-0 h-32 w-32 rounded-full blur-2xl transition-all group-hover:scale-150" />
              <CardHeader className="relative space-y-3">
                <div className="bg-secondary/20 flex h-12 w-12 items-center justify-center rounded-xl transition-all group-hover:scale-110">
                  <TrendingUp className="text-secondary h-6 w-6" />
                </div>
                <CardTitle>SEO-First Approach</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-muted-foreground text-sm">
                  Every blog is optimized for search engines from the start—keywords, structure,
                  meta data, and readability built-in.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-primary/20 hover:border-primary/40 relative overflow-hidden transition-all hover:shadow-xl">
              <div className="bg-primary/10 absolute top-0 right-0 h-32 w-32 rounded-full blur-2xl transition-all group-hover:scale-150" />
              <CardHeader className="relative space-y-3">
                <div className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-xl transition-all group-hover:scale-110">
                  <Clock className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Calendar Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-muted-foreground text-sm">
                  Plan months ahead with visual calendar, seasonal awareness, and automated
                  scheduling—never miss a publishing date.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="relative hidden lg:block">
            <div className="from-secondary/20 to-primary/20 absolute -inset-4 rounded-xl bg-gradient-to-r opacity-50 blur-2xl" />
            <img
              src={pilot}
              alt="Wryte AI Dashboard"
              className="border-secondary/20 relative w-full rounded-xl border object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
