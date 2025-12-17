import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText, Calendar, Layout, PenTool } from 'lucide-react';

export const HowItWorks = () => {
  return (
    <section id="howItWorks" className="container py-20">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
          How It{' '}
          <span className="from-secondary/60 to-secondary bg-linear-to-b bg-clip-text text-transparent">
            Works
          </span>
        </h2>
        <p className="text-muted-foreground mt-4 text-lg md:text-xl">
          From onboarding to publication, create SEO-optimized blogs in four simple steps
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group border-primary/20 from-primary/5 hover:border-primary/50 hover:shadow-primary/10 relative overflow-hidden bg-gradient-to-br to-transparent transition-all hover:shadow-2xl">
          <div className="bg-primary/10 group-hover:bg-primary/20 absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl transition-all" />
          <CardHeader className="space-y-4 p-6">
            <div className="bg-primary/10 group-hover:bg-primary/20 flex h-16 w-16 items-center justify-center rounded-2xl transition-all group-hover:scale-110 group-hover:rotate-3">
              <FileText className="text-primary h-8 w-8" />
            </div>
            <div className="space-y-2">
              <div className="text-primary text-sm font-semibold">Step 1</div>
              <CardTitle className="text-xl">Onboarding</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <CardDescription className="text-base leading-relaxed">
              Share your company info, target audience, keywords, and content strategy to
              personalize your blog generation
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="group border-secondary/20 from-secondary/5 hover:border-secondary/50 hover:shadow-secondary/10 relative overflow-hidden bg-gradient-to-br to-transparent transition-all hover:shadow-2xl">
          <div className="bg-secondary/10 group-hover:bg-secondary/20 absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl transition-all" />
          <CardHeader className="space-y-4 p-6">
            <div className="bg-secondary/10 group-hover:bg-secondary/20 flex h-16 w-16 items-center justify-center rounded-2xl transition-all group-hover:scale-110 group-hover:rotate-3">
              <Calendar className="text-secondary h-8 w-8" />
            </div>
            <div className="space-y-2">
              <div className="text-secondary text-sm font-semibold">Step 2</div>
              <CardTitle className="text-xl">Plan & Schedule</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <CardDescription className="text-base leading-relaxed">
              AI generates blog titles based on your inputs. Approve, edit, or regenerate titles and
              organize them in a calendar view
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="group border-primary/20 from-primary/5 hover:border-primary/50 hover:shadow-primary/10 relative overflow-hidden bg-gradient-to-br to-transparent transition-all hover:shadow-2xl">
          <div className="bg-primary/10 group-hover:bg-primary/20 absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl transition-all" />
          <CardHeader className="space-y-4 p-6">
            <div className="bg-primary/10 group-hover:bg-primary/20 flex h-16 w-16 items-center justify-center rounded-2xl transition-all group-hover:scale-110 group-hover:rotate-3">
              <Layout className="text-primary h-8 w-8" />
            </div>
            <div className="space-y-2">
              <div className="text-primary text-sm font-semibold">Step 3</div>
              <CardTitle className="text-xl">Design Layout</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <CardDescription className="text-base leading-relaxed">
              Review AI-generated blog structure with sections, SEO suggestions, and imagery
              recommendations before writing
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="group border-secondary/20 from-secondary/5 hover:border-secondary/50 hover:shadow-secondary/10 relative overflow-hidden bg-gradient-to-br to-transparent transition-all hover:shadow-2xl">
          <div className="bg-secondary/10 group-hover:bg-secondary/20 absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl transition-all" />
          <CardHeader className="space-y-4 p-6">
            <div className="bg-secondary/10 group-hover:bg-secondary/20 flex h-16 w-16 items-center justify-center rounded-2xl transition-all group-hover:scale-110 group-hover:rotate-3">
              <PenTool className="text-secondary h-8 w-8" />
            </div>
            <div className="space-y-2">
              <div className="text-secondary text-sm font-semibold">Step 4</div>
              <CardTitle className="text-xl">Generate & Publish</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <CardDescription className="text-base leading-relaxed">
              AI writes your complete SEO-optimized blog with proper formatting. Export or publish
              directly to your CMS
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
