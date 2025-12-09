import { Badge } from '@/components/ui/badge';
import { Target, Clock, Users } from 'lucide-react';

export const Mission = () => {
  return (
    <section id="mission" className="container py-20">
      <div className="mx-auto max-w-8xl space-y-24 sm:space-y-32">
        {/* Mission & Vision */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-8 md:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
          
          <div className="relative space-y-8">
            <div className="space-y-4">
              <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20">Our Mission</Badge>
              <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                Empower Every Company to{' '}
                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  Tell Their Story
                </span>
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl max-w-3xl leading-relaxed">
                We believe great content shouldn't be a luxury reserved for companies with massive marketing teams. 
                Wryte AI democratizes professional blog creation, giving every business the power to engage their 
                audience, rank on search engines, and grow their brand—without the time drain or cost of traditional content creation.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 pt-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                  <Target className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Quality at Scale</h3>
                  <p className="text-muted-foreground text-sm">Consistent, professional content without compromising quality</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Time Freedom</h3>
                  <p className="text-muted-foreground text-sm">Hours of work reduced to minutes with AI assistance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Human + AI</h3>
                  <p className="text-muted-foreground text-sm">AI amplifies your creativity, you stay in control</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
