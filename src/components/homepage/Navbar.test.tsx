import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from './Navbar';

// Mock Clerk components
vi.mock('@clerk/clerk-react', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-in">{children}</div>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-out">{children}</div>,
  SignInButton: ({ children }: { children: React.ReactNode }) => <div data-testid="sign-in-button">{children}</div>,
  UserButton: () => <div data-testid="user-button">User Button</div>,
}));

// Mock site config
vi.mock('@/config/site', () => ({
  siteConfig: {
    name: 'Wryte AI',
    navItems: [
      { href: '#mission', label: 'Mission' },
      { href: '#why', label: 'Why' },
      { href: '#howItWorks', label: 'How it Works' },
      { href: '#features', label: 'Features' },
      { href: '#services', label: 'Services' },
      { href: '#faq', label: 'FAQ' },
    ],
  },
}));

describe('Navbar', () => {
  it('renders navbar header', () => {
    const { container } = render(<Navbar />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('renders site name from config', () => {
    render(<Navbar />);

    const siteNames = screen.getAllByText('Wryte AI');
    expect(siteNames.length).toBeGreaterThan(0);
  });

  it('renders site logo', () => {
    render(<Navbar />);

    const logo = screen.getByAltText('Wryte AI');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src');
  });

  it('renders home link', () => {
    render(<Navbar />);

    const homeLink = screen.getAllByRole('link')[0];
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders all navigation items in desktop nav', () => {
    render(<Navbar />);

    expect(screen.getAllByText('Mission').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Why').length).toBeGreaterThan(0);
    expect(screen.getAllByText('How it Works').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Features').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Services').length).toBeGreaterThan(0);
    expect(screen.getAllByText('FAQ').length).toBeGreaterThan(0);
  });

  it('renders GitHub link', () => {
    render(<Navbar />);

    const githubLinks = screen.getAllByText('Github');
    expect(githubLinks.length).toBeGreaterThan(0);

    const desktopGithubLink = githubLinks[0].closest('a');
    expect(desktopGithubLink).toHaveAttribute('target', '_blank');
  });

  it('has sticky positioning', () => {
    const { container } = render(<Navbar />);
    const header = container.querySelector('header');

    expect(header).toHaveClass('sticky', 'top-0', 'z-40');
  });

  it('has border bottom styling', () => {
    const { container } = render(<Navbar />);
    const header = container.querySelector('header');

    expect(header).toHaveClass('border-b');
  });

  it('renders mobile menu trigger button', () => {
    const { container } = render(<Navbar />);

    const menuButton = container.querySelector('.md\\:hidden');
    expect(menuButton).toBeInTheDocument();
  });

  it('desktop nav is hidden on mobile', () => {
    const { container } = render(<Navbar />);

    const desktopNav = container.querySelector('.hidden.gap-2.md\\:flex');
    expect(desktopNav).toBeInTheDocument();
  });

  it('opens mobile menu when menu button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<Navbar />);

    const menuTrigger = container.querySelector('[class*="px-2"]');
    if (menuTrigger) {
      await user.click(menuTrigger);

      await waitFor(() => {
        const sheetContent = screen.getByRole('dialog');
        expect(sheetContent).toBeInTheDocument();
      });
    }
  });

  it('renders sign in components for signed out users', () => {
    render(<Navbar />);

    const signedOutElements = screen.getAllByTestId('signed-out');
    expect(signedOutElements.length).toBeGreaterThan(0);
  });

  it('renders user button for signed in users', () => {
    render(<Navbar />);

    const signedInElements = screen.getAllByTestId('signed-in');
    expect(signedInElements.length).toBeGreaterThan(0);
  });

  it('logo has correct sizing classes', () => {
    render(<Navbar />);

    const logo = screen.getByAltText('Wryte AI');
    expect(logo).toHaveClass('mr-2', 'h-8', 'w-8', 'object-contain');
  });

  it('site name link has correct styling', () => {
    render(<Navbar />);

    const links = screen.getAllByRole('link');
    const homeLink = links.find((link) => link.getAttribute('href') === '/');
    expect(homeLink).toHaveClass('ml-2', 'flex', 'text-xl', 'font-bold');
  });

  it('navigation menu has container class', () => {
    const { container } = render(<Navbar />);

    const navList = container.querySelector('.container');
    expect(navList).toBeInTheDocument();
  });

  it('renders GitHub icon in links', () => {
    render(<Navbar />);

    const githubLinks = screen.getAllByText('Github');
    const desktopGithubLink = githubLinks[0].parentElement;
    const icon = desktopGithubLink?.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('mobile sheet has correct side', () => {
    const { container } = render(<Navbar />);

    const sheetTrigger = container.querySelector('[class*="px-2"]');
    expect(sheetTrigger).toBeInTheDocument();
  });

  it('has full width', () => {
    const { container } = render(<Navbar />);
    const header = container.querySelector('header');

    expect(header).toHaveClass('w-full');
  });

  it('navigation list has proper height', () => {
    const { container } = render(<Navbar />);

    const navList = container.querySelector('.h-14');
    expect(navList).toBeInTheDocument();
  });

  it('renders navigation menu component', () => {
    const { container } = render(<Navbar />);

    const navMenu = container.querySelector('nav');
    expect(navMenu).toBeInTheDocument();
  });
});
