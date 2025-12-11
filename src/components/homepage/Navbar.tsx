import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { buttonVariants } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import icon from '@/assets/icon.png';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { siteConfig } from '@/config/site';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <header className="dark:bg-background sticky top-0 z-40 w-full border-b bg-white dark:border-b-slate-700">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container flex h-14 w-screen justify-between px-4">
          <NavigationMenuItem className="flex font-bold">
            <a rel="noreferrer noopener" href="/" className="ml-2 flex text-xl font-bold">
              <img src={icon} alt="Wryte AI" className="mr-2 h-8 w-8 object-contain" />
              {siteConfig.name}
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu className="flex h-5 w-5 md:hidden" onClick={() => setIsOpen(true)}>
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={'left'}>
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold">{siteConfig.name}</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 flex flex-col items-center justify-center gap-2">
                  {siteConfig.navItems.map(({ href, label }) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: 'ghost' })}
                    >
                      {label}
                    </a>
                  ))}
                  <a
                    rel="noreferrer noopener"
                    href="https://github.com/leoMirandaa/shadcn-landing-page.git"
                    target="_blank"
                    className={`w-[110px] border ${buttonVariants({
                      variant: 'secondary',
                    })}`}
                  >
                    <GitHubLogoIcon className="mr-2 h-5 w-5" />
                    Github
                  </a>
                  {/* Mobile sign-in / user controls */}
                  <SignedOut>
                    <div className="w-full flex items-center justify-center">
                      <SignInButton mode="modal">
                        <button
                          onClick={() => setIsOpen(false)}
                          className={buttonVariants({ variant: 'default' })}
                        >
                          Sign In
                        </button>
                      </SignInButton>
                    </div>
                  </SignedOut>
                  <SignedIn>
                    <div className="w-full flex items-center justify-center">
                      <UserButton />
                    </div>
                  </SignedIn>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden gap-2 md:flex">
            {siteConfig.navItems.map(({ href, label }, i) => (
              <a
                rel="noreferrer noopener"
                href={href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: 'ghost',
                })}`}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden gap-2 md:flex">
            <a
              rel="noreferrer noopener"
              href="https://github.com/leoMirandaa/shadcn-landing-page.git"
              target="_blank"
              className={`border ${buttonVariants({ variant: 'secondary' })}`}
            >
              <GitHubLogoIcon className="mr-2 h-5 w-5" />
              Github
            </a>

            <SignedOut>
              <SignInButton mode="modal">
                <button className={buttonVariants({ variant: 'default' })}>Sign In</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
