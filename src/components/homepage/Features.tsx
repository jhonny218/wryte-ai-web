import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target, BarChart3, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: Target,
    title: 'Brand Voice Matching',
    description:
      "AI learns your company's unique voice, tone, and style to create content that sounds authentically yours, maintaining consistency across all blogs.",
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description:
      'Track blog performance with built-in analytics. Monitor views, engagement, and SEO rankings to optimize your content strategy over time.',
  },
  {
    icon: Sparkles,
    title: 'Smart SEO Optimization',
    description:
      'Automatically optimize every blog for search engines with keyword integration, meta descriptions, proper headings, and readability improvements.',
  },
];

const featureList: string[] = [
  'AI-Powered Generation',
  'SEO Optimized',
  'Brand Voice Matching',
  'Calendar Planning',
  'Team Collaboration',
  'CMS Integration',
  'Analytics Dashboard',
  'Export Options',
  'Batch Generation',
];

export const Features = () => {
  return (
    <section id="features" className="container space-y-12 py-20">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
          Powerful{' '}
          <span className="from-secondary/60 to-secondary bg-linear-to-b bg-clip-text text-transparent">
            Features
          </span>
        </h2>
        <p className="text-muted-foreground mt-4 text-lg md:text-xl">
          Everything you need to create, manage, and optimize your company's blog content
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {featureList.map((feature: string) => (
          <Badge key={feature} variant="secondary" className="px-4 py-2 text-sm">
            {feature}
          </Badge>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="group border-primary/20 hover:border-primary/40 relative overflow-hidden transition-all hover:shadow-xl"
          >
            <div className="from-secondary/10 to-primary/10 absolute top-0 right-0 h-40 w-40 rounded-full bg-gradient-to-br blur-3xl transition-all group-hover:scale-150" />

            <CardHeader className="space-y-4 p-6">
              <div className="from-secondary/20 to-primary/20 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br transition-all group-hover:scale-110 group-hover:rotate-3">
                <Icon className="text-primary h-7 w-7" />
              </div>
              <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>

            <CardContent className="p-6 pt-0">
              <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
