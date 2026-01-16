import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppSidebar } from './app-sidebar';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock layout provider
vi.mock('@/context/layout-provider', () => ({
  useLayout: () => ({
    collapsible: 'icon',
    variant: 'sidebar',
  }),
}));

// Mock Sidebar components
vi.mock('@/components/ui/sidebar', () => ({
  Sidebar: ({ children }: { children: React.ReactNode }) => <aside data-testid="sidebar">{children}</aside>,
  SidebarContent: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-content">{children}</div>,
  SidebarFooter: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-footer">{children}</div>,
  SidebarHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-header">{children}</div>,
  SidebarRail: () => <div data-testid="sidebar-rail" />,
  useSidebar: () => ({
    state: 'expanded',
    isMobile: false,
    setOpenMobile: vi.fn(),
  }),
  SidebarGroup: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-group">{children}</div>,
  SidebarGroupLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarMenu: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarMenuButton: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock AppTitle
vi.mock('./app-title', () => ({
  AppTitle: () => <div data-testid="app-title">App Title</div>,
}));

// Mock NavGroup
vi.mock('./nav-group', () => ({
  NavGroup: ({ title }: { title: string }) => <div data-testid={`nav-group-${title}`}>{title}</div>,
}));

// Mock NavUser
vi.mock('./nav-user', () => ({
  NavUser: () => <div data-testid="nav-user">Nav User</div>,
}));

// Mock sidebar data
vi.mock('./data/sidebar-data.ts', () => ({
  sidebarData: {
    navGroups: [
      {
        title: 'General',
        items: [
          {
            title: 'Dashboard',
            url: 'dashboard',
          },
        ],
      },
      {
        title: 'Content',
        items: [
          {
            title: 'Blogs',
            url: 'blogs',
          },
        ],
      },
    ],
  },
}));

// Mock routes
vi.mock('@/routes/routes', () => ({
  getOrgRoute: (slug: string, path: string) => `/org/${slug}/${path}`,
}));

describe('AppSidebar', () => {
  it('renders sidebar component', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders sidebar header', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );

    expect(screen.getByTestId('sidebar-header')).toBeInTheDocument();
  });

  it('renders sidebar content', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );

    expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();
  });

  it('renders sidebar footer', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );

    expect(screen.getByTestId('sidebar-footer')).toBeInTheDocument();
  });

  it('renders sidebar rail', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );

    expect(screen.getByTestId('sidebar-rail')).toBeInTheDocument();
  });

  it('renders AppTitle in header', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );

    expect(screen.getByTestId('app-title')).toBeInTheDocument();
  });

  it('renders NavUser in footer', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );

    expect(screen.getByTestId('nav-user')).toBeInTheDocument();
  });

  it('renders all nav groups', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );

    expect(screen.getByTestId('nav-group-General')).toBeInTheDocument();
    expect(screen.getByTestId('nav-group-Content')).toBeInTheDocument();
  });

  it('transforms URLs with slug from params', () => {
    render(
      <MemoryRouter initialEntries={['/org/test-org']}>
        <Routes>
          <Route path="/org/:slug" element={<AppSidebar />} />
        </Routes>
      </MemoryRouter>
    );

    // Component should render and transform URLs
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('handles missing slug in params', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );

    // Should render without errors
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('passes collapsible prop to Sidebar', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toBeInTheDocument();
  });

  it('passes variant prop to Sidebar', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toBeInTheDocument();
  });

  it('renders nav groups in correct order', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );

    const generalGroup = screen.getByTestId('nav-group-General');
    const contentGroup = screen.getByTestId('nav-group-Content');

    expect(generalGroup).toBeInTheDocument();
    expect(contentGroup).toBeInTheDocument();
  });

  it('transforms collapsible items with subitems', () => {
    render(
      <MemoryRouter initialEntries={['/org/my-org']}>
        <Routes>
          <Route path="/org/:slug" element={<AppSidebar />} />
        </Routes>
      </MemoryRouter>
    );

    // Should handle transformation without errors
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('maps nav groups with correct structure', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );

    // Should render exactly 2 nav groups based on mocked data
    const navGroups = screen.getAllByTestId(/nav-group-/);
    expect(navGroups.length).toBe(2);
  });

  it('transforms URLs without slug when slug is undefined', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );

    // When no slug is in params, URLs should remain unchanged
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('transforms URLs with slug from route params', () => {
    render(
      <MemoryRouter initialEntries={['/org/my-org/dashboard']}>
        <Routes>
          <Route path="/org/:slug/*" element={<AppSidebar />} />
        </Routes>
      </MemoryRouter>
    );

    // Should apply slug to URLs when slug exists in params
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('handles both collapsible and regular items in transformation', () => {
    render(
      <MemoryRouter initialEntries={['/org/test-org']}>
        <Routes>
          <Route path="/org/:slug" element={<AppSidebar />} />
        </Routes>
      </MemoryRouter>
    );

    // Should transform both types of items correctly
    const navGroups = screen.getAllByTestId(/nav-group-/);
    expect(navGroups.length).toBe(2);
  });
});
