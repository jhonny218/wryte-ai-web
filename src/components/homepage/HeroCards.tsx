import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Check, Linkedin } from 'lucide-react';
import { LightBulbIcon } from './Icons';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { siteConfig } from '@/config/site';

export const HeroCards = () => {
  return (
    <div className="relative hidden h-[500px] w-[700px] flex-row flex-wrap gap-8 lg:flex">
      {/* Testimonial */}
      <Card className="bg-background absolute -top-[15px] z-10 w-[340px] shadow-black/10 drop-shadow-xl dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage alt="" src="https://github.com/shadcn.png" />
            <AvatarFallback>SH</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">John Doe React</CardTitle>
            <CardDescription>@john_doe</CardDescription>
          </div>
        </CardHeader>

        <CardContent>This landing page is awesome!</CardContent>
      </Card>

      {/* Team */}
      <Card className="bg-background absolute top-4 right-[20px] z-10 flex w-80 flex-col items-center justify-center shadow-black/10 drop-shadow-xl dark:shadow-white/10">
        <CardHeader className="mt-8 flex items-center justify-center pb-2">
          <img
            src="https://i.pravatar.cc/150?img=58"
            alt="user avatar"
            className="absolute -top-12 aspect-square h-24 w-24 rounded-full object-cover grayscale-0"
          />
          <CardTitle className="text-center">{siteConfig.name}</CardTitle>
          <CardDescription className="text-primary font-normal">
            {siteConfig.position}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-2 text-center">
          <p>{siteConfig.description}</p>
        </CardContent>

        <CardFooter>
          <div>
            <a
              rel="noreferrer noopener"
              href={siteConfig.links.find((link) => link.label === 'GitHub')?.href}
              target="_blank"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
              })}
            >
              <span className="sr-only">Github icon</span>
              <GitHubLogoIcon className="h-5 w-5" />
            </a>

            <a
              rel="noreferrer noopener"
              href={siteConfig.links.find((link) => link.label === 'LinkedIn')?.href}
              target="_blank"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
              })}
            >
              <span className="sr-only">Linkedin icon</span>
              <Linkedin size="20" />
            </a>
          </div>
        </CardFooter>
      </Card>

      {/* Pricing */}
      <Card className="bg-background absolute top-[150px] left-[50px] z-10 w-72 shadow-black/10 drop-shadow-xl dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="item-center flex justify-between">
            Free
            <Badge variant="secondary" className="text-primary text-sm">
              Most popular
            </Badge>
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">$0</span>
            <span className="text-muted-foreground"> /month</span>
          </div>

          <CardDescription>
            Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="w-full">Start Free Trial</Button>
        </CardContent>

        <hr className="m-auto mb-4 w-4/5" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {['4 Team member', '4 GB Storage', 'Upto 6 pages'].map((benefit: string) => (
              <span key={benefit} className="flex">
                <Check className="text-green-500" /> <h3 className="ml-2">{benefit}</h3>
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>

      {/* Service */}
      <Card className="bg-background absolute -right-[10px] bottom-[35px] z-10 w-[350px] shadow-black/10 drop-shadow-xl dark:shadow-white/10">
        <CardHeader className="flex items-start justify-start gap-4 space-y-1 md:flex-row">
          <div className="bg-primary/20 mt-1 rounded-2xl p-1">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>Light & dark mode</CardTitle>
            <CardDescription className="text-md mt-2">
              Lorem ipsum dolor sit amet consect adipisicing elit. Consectetur natusm.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </div>
  );
};
