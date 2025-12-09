import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Zap, Clock, TrendingUp } from 'lucide-react';
import pilot from '@/assets/pilot.png';

export const Why = () => {
  return (
    <section id="why" className="container py-20">
      <div className="mx-auto max-w-8xl space-y-8">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <Badge variant="secondary" className="mb-2">Why Choose Wryte AI</Badge>
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            Not Just Another{' '}
            <span className="from-secondary/60 to-secondary bg-gradient-to-b bg-clip-text text-transparent">
              AI Writing Tool
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg md:text-xl">
            While others give you a blank box and generic outputs, we provide an end-to-end blog creation workflow
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="group relative overflow-hidden border-secondary/20 transition-all hover:border-secondary/40 hover:shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl transition-all group-hover:scale-150" />
              <CardHeader className="space-y-3 relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 transition-all group-hover:scale-110">
                  <Zap className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Complete Workflow</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-muted-foreground text-sm">
                  From strategy and planning to writing and publishing—everything in one platform. No juggling multiple tools.
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-primary/20 transition-all hover:border-primary/40 hover:shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl transition-all group-hover:scale-150" />
              <CardHeader className="space-y-3 relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 transition-all group-hover:scale-110">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Brand Voice Precision</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-muted-foreground text-sm">
                  AI that actually sounds like you. We analyze your company's voice to create authentic content, not generic fluff.
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-secondary/20 transition-all hover:border-secondary/40 hover:shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl transition-all group-hover:scale-150" />
              <CardHeader className="space-y-3 relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 transition-all group-hover:scale-110">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>SEO-First Approach</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-muted-foreground text-sm">
                  Every blog is optimized for search engines from the start—keywords, structure, meta data, and readability built-in.
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-primary/20 transition-all hover:border-primary/40 hover:shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl transition-all group-hover:scale-150" />
              <CardHeader className="space-y-3 relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 transition-all group-hover:scale-110">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Calendar Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-muted-foreground text-sm">
                  Plan months ahead with visual calendar, seasonal awareness, and automated scheduling—never miss a publishing date.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-secondary/20 to-primary/20 blur-2xl opacity-50" />
            <img 
              src={pilot} 
              alt="Wryte AI Dashboard" 
              className="relative rounded-xl border border-secondary/20 shadow-2xl w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
