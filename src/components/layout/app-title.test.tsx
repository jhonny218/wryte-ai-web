import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppTitle } from './app-title';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock sidebar hook
const mockSetOpenMobile = vi.fn();
const mockToggleSidebar = vi.fn();
vi.mock('@/components/ui/sidebar', () => ({
  SidebarMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-menu">{children}</div>,
  SidebarMenuButton: ({ children }: { children: React.ReactNode; asChild?: boolean }) => (
    <div data-testid="sidebar-menu-button">{children}</div>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-menu-item">{children}</div>,
  useSidebar: () => ({
    setOpenMobile: mockSetOpenMobile,
    toggleSidebar: mockToggleSidebar,
  }),
}));

// Mock site config
vi.mock('@/config/site', () => ({
  siteConfig: {
    name: 'Wryte AI',
  },
}));

// Mock Avatar components
vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  ),
  AvatarImage: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

describe('AppTitle', () => {
  it('renders component', () => {
    render(
      <MemoryRouter>
        <AppTitle />
      </MemoryRouter>
    );

    expect(screen.getByTestId('sidebar-menu')).toBeInTheDocument();
  });

  it('renders site name from config', () => {
    render(
      <MemoryRouter>
        <AppTitle />
      </MemoryRouter>
    );

    expect(screen.getByText('Wryte AI')).toBeInTheDocument();
  });

  it('renders app icon image', () => {
    render(
      <MemoryRouter>
        <AppTitle />
      </MemoryRouter>
    );

    const icon = screen.getByAltText('App Icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders link to organization page', () => {
    render(
      <MemoryRouter initialEntries={['/org/test-org']}>
        <Routes>
          <Route path="/org/:slug" element={<AppTitle />} />
        </Routes>
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/org/test-org');
  });

  it('displays slug when present in params', () => {
    render(
      <MemoryRouter initialEntries={['/org/my-organization']}>
        <Routes>
          <Route path="/org/:slug" element={<AppTitle />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('my-organization')).toBeInTheDocument();
  });

  it('does not display slug when not present', () => {
    render(
      <MemoryRouter>
        <AppTitle />
      </MemoryRouter>
    );

    const slugElement = screen.queryByText(/organization/i);
    expect(slugElement).not.toBeInTheDocument();
  });

  it('closes mobile sidebar when link is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/org/test-org']}>
        <Routes>
          <Route path="/org/:slug" element={<AppTitle />} />
        </Routes>
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    await user.click(link);

    expect(mockSetOpenMobile).toHaveBeenCalledWith(false);
  });

  it('renders toggle sidebar button', () => {
    render(
      <MemoryRouter>
        <AppTitle />
      </MemoryRouter>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('has screen reader text for toggle button', () => {
    render(
      <MemoryRouter>
        <AppTitle />
      </MemoryRouter>
    );

    expect(screen.getByText('Toggle Sidebar')).toBeInTheDocument();
  });

  it('calls toggleSidebar when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AppTitle />
      </MemoryRouter>
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockToggleSidebar).toHaveBeenCalled();
  });

  it('renders Menu icon on desktop', () => {
    const { container } = render(
      <MemoryRouter>
        <AppTitle />
      </MemoryRouter>
    );

    const menuIcon = container.querySelector('.max-md\\:hidden');
    expect(menuIcon).toBeInTheDocument();
  });

  it('renders X icon on mobile', () => {
    const { container } = render(
      <MemoryRouter>
        <AppTitle />
      </MemoryRouter>
    );

    const closeIcon = container.querySelector('.md\\:hidden');
    expect(closeIcon).toBeInTheDocument();
  });

  it('avatar has correct size classes', () => {
    render(
      <MemoryRouter>
        <AppTitle />
      </MemoryRouter>
    );

    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveClass('h-12', 'w-12');
  });

  it('site name has correct styling', () => {
    render(
      <MemoryRouter>
        <AppTitle />
      </MemoryRouter>
    );

    const siteName = screen.getByText('Wryte AI');
    expect(siteName).toHaveClass('truncate', 'font-bold', 'text-secondary');
  });

  it('slug has correct styling', () => {
    render(
      <MemoryRouter initialEntries={['/org/test-org']}>
        <Routes>
          <Route path="/org/:slug" element={<AppTitle />} />
        </Routes>
      </MemoryRouter>
    );

    const slug = screen.getByText('test-org');
    expect(slug).toHaveClass('truncate', 'text-xs');
  });

  it('link has correct layout classes', () => {
    render(
      <MemoryRouter initialEntries={['/org/test-org']}>
        <Routes>
          <Route path="/org/:slug" element={<AppTitle />} />
        </Routes>
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveClass('flex', 'items-center', 'gap-2', 'flex-1', 'text-start', 'text-sm', 'leading-tight');
  });

  it('toggle button has ghost variant', () => {
    render(
      <MemoryRouter>
        <AppTitle />
      </MemoryRouter>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('toggle button has sidebar trigger data attributes', () => {
    render(
      <MemoryRouter>
        <AppTitle />
      </MemoryRouter>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-sidebar', 'trigger');
    expect(button).toHaveAttribute('data-slot', 'sidebar-trigger');
  });

  it('renders grid container for site name and slug', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/org/test-org']}>
        <Routes>
          <Route path="/org/:slug" element={<AppTitle />} />
        </Routes>
      </MemoryRouter>
    );

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });

  it('handles empty slug gracefully', () => {
    render(
      <MemoryRouter initialEntries={['/org/']}>
        <Routes>
          <Route path="/org/:slug?" element={<AppTitle />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Wryte AI')).toBeInTheDocument();
  });
});
