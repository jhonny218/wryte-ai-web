import { Outlet } from 'react-router-dom';
import { SignedIn, UserButton } from '@clerk/clerk-react';

export function DashboardLayout() {
  return (
    <div className="bg-background min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 py-6 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <nav className="grid items-start gap-2">
            {/* Sidebar navigation will go here */}
            <span className="group hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium">
              Overview
            </span>
            <span className="group hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium">
              Settings
            </span>
          </nav>
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
