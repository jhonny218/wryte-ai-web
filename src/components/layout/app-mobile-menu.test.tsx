import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppMobileMenu } from './app-mobile-menu';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock the sidebar hook
const mockToggleSidebar = vi.fn();
vi.mock('@/components/ui/sidebar', () => ({
  useSidebar: () => ({
    toggleSidebar: mockToggleSidebar,
  }),
}));

// Mock site config
vi.mock('@/config/site', () => ({
  siteConfig: {
    name: 'Wryte AI',
  },
}));

describe('AppMobileMenu', () => {
  it('renders mobile menu header', () => {
    const { container } = render(
      <MemoryRouter>
        <AppMobileMenu />
      </MemoryRouter>
    );

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('renders site name from config', () => {
    render(
      <MemoryRouter>
        <AppMobileMenu />
      </MemoryRouter>
    );

    expect(screen.getByText('Wryte AI')).toBeInTheDocument();
  });

  it('renders menu toggle button', () => {
    render(
      <MemoryRouter>
        <AppMobileMenu />
      </MemoryRouter>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('has screen reader text for toggle button', () => {
    render(
      <MemoryRouter>
        <AppMobileMenu />
      </MemoryRouter>
    );

    expect(screen.getByText('Toggle Sidebar')).toBeInTheDocument();
  });

  it('calls toggleSidebar when button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AppMobileMenu />
      </MemoryRouter>
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockToggleSidebar).toHaveBeenCalledOnce();
  });

  it('renders Menu icon', () => {
    const { container } = render(
      <MemoryRouter>
        <AppMobileMenu />
      </MemoryRouter>
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('h-5', 'w-5');
  });

  it('displays slug when present in params', () => {
    render(
      <MemoryRouter initialEntries={['/org/test-org']}>
        <Routes>
          <Route path="/org/:slug" element={<AppMobileMenu />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('test-org')).toBeInTheDocument();
  });

  it('does not display slug when not present', () => {
    render(
      <MemoryRouter>
        <AppMobileMenu />
      </MemoryRouter>
    );

    const slugElement = screen.queryByText(/test-org/i);
    expect(slugElement).not.toBeInTheDocument();
  });

  it('has correct header styling', () => {
    const { container } = render(
      <MemoryRouter>
        <AppMobileMenu />
      </MemoryRouter>
    );

    const header = container.querySelector('header');
    expect(header).toHaveClass('flex', 'h-14', 'items-center', 'gap-4', 'border-b', 'px-4', 'lg:hidden');
  });

  it('button has ghost variant', () => {
    render(
      <MemoryRouter>
        <AppMobileMenu />
      </MemoryRouter>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('shrink-0');
  });

  it('site name has correct styling', () => {
    render(
      <MemoryRouter>
        <AppMobileMenu />
      </MemoryRouter>
    );

    const siteName = screen.getByText('Wryte AI');
    expect(siteName).toHaveClass('text-sm', 'font-bold');
  });

  it('slug has correct styling', () => {
    render(
      <MemoryRouter initialEntries={['/org/test-org']}>
        <Routes>
          <Route path="/org/:slug" element={<AppMobileMenu />} />
        </Routes>
      </MemoryRouter>
    );

    const slug = screen.getByText('test-org');
    expect(slug).toHaveClass('text-muted-foreground', 'text-xs');
  });

  it('has flex-1 class on content container', () => {
    const { container } = render(
      <MemoryRouter>
        <AppMobileMenu />
      </MemoryRouter>
    );

    const contentContainer = container.querySelector('.flex-1');
    expect(contentContainer).toBeInTheDocument();
  });
});
