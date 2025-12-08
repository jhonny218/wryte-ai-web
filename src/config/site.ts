export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Wryte AI',
  position: 'Senior Software Engineer',
  description: 'Senior/Staff Software Engineer building performant, accessible products at scale.',
  navItems: [
    { href: '#about', label: 'About' },
    { href: '#howItWorks', label: 'How it Works' },
    { href: '#features', label: 'Features' },
    { href: '#services', label: 'Services' },
    { href: '#faq', label: 'FAQ' },
  ],
  links: [
    {
      label: 'GitHub',
      href: 'https://github.com/jhonny218',
      external: true,
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/jhonny-m-gonzalez/',
      external: true,
    },
    { label: 'Email', href: 'mailto:Jhonny218@gmail.com' },
  ],
};
