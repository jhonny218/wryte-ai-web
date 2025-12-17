import { Outlet } from 'react-router-dom';
// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { Navbar } from '@/components/homepage/Navbar';
import { siteConfig } from '@/config/site';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export function RootLayout() {
  return (
    <div className="bg-background min-h-screen font-sans antialiased">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="mb-5 flex w-full items-center justify-center py-3">
        <span className="text-sm md:text-base">
          © {new Date().getFullYear()} {siteConfig.name}. Made with 🧠 and{' '}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="ml-1 cursor-help text-sm underline decoration-dotted md:text-base">
              code.
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            Built with React, TypeScript, Vite, Tailwind CSS & shadcn/ui
          </TooltipContent>
        </Tooltip>
      </footer>
    </div>
  );
}
