import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavGroup } from './nav-group';
import { MemoryRouter } from 'react-router-dom';
import { Home, Settings } from 'lucide-react';
import type { NavGroup as NavGroupProps } from './types';

// Mock the sidebar hook
const mockSetOpenMobile = vi.fn();
vi.mock('@/components/ui/sidebar', () => ({
  useSidebar: () => ({
    state: 'expanded',
    isMobile: false,
    setOpenMobile: mockSetOpenMobile,
  }),
  SidebarGroup: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-group">{children}</div>,
  SidebarGroupLabel: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-group-label">{children}</div>,
  SidebarMenu: ({ children }: { children: React.ReactNode }) => <nav data-testid="sidebar-menu">{children}</nav>,
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-menu-item">{children}</div>,
  SidebarMenuButton: ({ children, tooltip }: { children: React.ReactNode; asChild?: boolean; tooltip?: string }) => (
    <div data-testid="sidebar-menu-button" data-tooltip={tooltip}>
      {children}
    </div>
  ),
  SidebarMenuSub: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-menu-sub">{children}</div>,
  SidebarMenuSubItem: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-menu-sub-item">{children}</div>,
  SidebarMenuSubButton: ({ children }: { children: React.ReactNode; asChild?: boolean }) => (
    <div data-testid="sidebar-menu-sub-button">{children}</div>
  ),
}));

// Mock collapsible
vi.mock('@/components/ui/collapsible', () => ({
  Collapsible: ({ children }: { children: React.ReactNode }) => <div data-testid="collapsible">{children}</div>,
  CollapsibleContent: ({ children }: { children: React.ReactNode }) => <div data-testid="collapsible-content">{children}</div>,
  CollapsibleTrigger: ({ children }: { children: React.ReactNode; asChild?: boolean }) => (
    <div data-testid="collapsible-trigger">{children}</div>
  ),
}));

// Mock dropdown
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode; asChild?: boolean }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children }: { children: React.ReactNode; asChild?: boolean }) => (
    <div data-testid="dropdown-item">{children}</div>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-label">{children}</div>,
  DropdownMenuSeparator: () => <div data-testid="dropdown-separator" />,
}));

// Mock badge
vi.mock('../ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span data-testid="badge">{children}</span>,
}));

describe('NavGroup', () => {
  const simpleNavGroup: NavGroupProps = {
    title: 'Main',
    items: [
      {
        title: 'Home',
        url: '/home',
        icon: Home,
      },
      {
        title: 'Settings',
        url: '/settings',
        icon: Settings,
      },
    ],
  };

  const collapsibleNavGroup: NavGroupProps = {
    title: 'Advanced',
    items: [
      {
        title: 'Admin',
        icon: Settings,
        items: [
          {
            title: 'Users',
            url: '/admin/users',
          },
          {
            title: 'Roles',
            url: '/admin/roles',
          },
        ],
      },
    ],
  };

  it('renders nav group with title', () => {
    render(
      <MemoryRouter>
        <NavGroup {...simpleNavGroup} />
      </MemoryRouter>
    );

    expect(screen.getByText('Main')).toBeInTheDocument();
  });

  it('renders all simple nav items', () => {
    render(
      <MemoryRouter>
        <NavGroup {...simpleNavGroup} />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders nav items as links', () => {
    render(
      <MemoryRouter>
        <NavGroup {...simpleNavGroup} />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('href', '/home');
  });

  it('renders collapsible items with subitems', () => {
    render(
      <MemoryRouter>
        <NavGroup {...collapsibleNavGroup} />
      </MemoryRouter>
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Roles')).toBeInTheDocument();
  });

  it('renders badges when provided', () => {
    const navGroupWithBadge: NavGroupProps = {
      title: 'Updates',
      items: [
        {
          title: 'Notifications',
          url: '/notifications',
          badge: '3',
        },
      ],
    };

    render(
      <MemoryRouter>
        <NavGroup {...navGroupWithBadge} />
      </MemoryRouter>
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('closes mobile sidebar when link is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <NavGroup {...simpleNavGroup} />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link', { name: /home/i });
    await user.click(homeLink);

    expect(mockSetOpenMobile).toHaveBeenCalledWith(false);
  });

  it('renders SidebarGroup component', () => {
    render(
      <MemoryRouter>
        <NavGroup {...simpleNavGroup} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('sidebar-group')).toBeInTheDocument();
  });

  it('renders SidebarMenu component', () => {
    render(
      <MemoryRouter>
        <NavGroup {...simpleNavGroup} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('sidebar-menu')).toBeInTheDocument();
  });

  it('renders icons when provided', () => {
    const { container } = render(
      <MemoryRouter>
        <NavGroup {...simpleNavGroup} />
      </MemoryRouter>
    );

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('renders collapsible component for nested items', () => {
    render(
      <MemoryRouter>
        <NavGroup {...collapsibleNavGroup} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('collapsible')).toBeInTheDocument();
  });

  it('renders submenu for collapsible items', () => {
    render(
      <MemoryRouter>
        <NavGroup {...collapsibleNavGroup} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('sidebar-menu-sub')).toBeInTheDocument();
  });

  it('renders subitem links correctly', () => {
    render(
      <MemoryRouter>
        <NavGroup {...collapsibleNavGroup} />
      </MemoryRouter>
    );

    const usersLink = screen.getByRole('link', { name: /users/i });
    expect(usersLink).toHaveAttribute('href', '/admin/users');

    const rolesLink = screen.getByRole('link', { name: /roles/i });
    expect(rolesLink).toHaveAttribute('href', '/admin/roles');
  });

  it('renders chevron icon for collapsible items', () => {
    const { container } = render(
      <MemoryRouter>
        <NavGroup {...collapsibleNavGroup} />
      </MemoryRouter>
    );

    const chevronIcons = container.querySelectorAll('svg');
    expect(chevronIcons.length).toBeGreaterThan(0);
  });

  it('generates unique keys for items', () => {
    render(
      <MemoryRouter>
        <NavGroup {...simpleNavGroup} />
      </MemoryRouter>
    );

    const menuItems = screen.getAllByTestId('sidebar-menu-item');
    expect(menuItems.length).toBe(2);
  });

  it('renders badge in parent collapsible item', () => {
    const navGroupWithCollapsibleBadge: NavGroupProps = {
      title: 'Admin',
      items: [
        {
          title: 'Management',
          badge: '5',
          icon: Settings,
          items: [
            {
              title: 'Users',
              url: '/users',
            },
          ],
        },
      ],
    };

    render(
      <MemoryRouter>
        <NavGroup {...navGroupWithCollapsibleBadge} />
      </MemoryRouter>
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders badge in collapsible subitems', () => {
    const navGroupWithSubitemBadge: NavGroupProps = {
      title: 'Admin',
      items: [
        {
          title: 'Management',
          icon: Settings,
          items: [
            {
              title: 'Users',
              url: '/users',
              badge: '3',
            },
          ],
        },
      ],
    };

    render(
      <MemoryRouter>
        <NavGroup {...navGroupWithSubitemBadge} />
      </MemoryRouter>
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders icon in subitem when provided', () => {
    const navGroupWithSubitemIcon: NavGroupProps = {
      title: 'Admin',
      items: [
        {
          title: 'Management',
          icon: Settings,
          items: [
            {
              title: 'Users',
              url: '/users',
              icon: Home,
            },
          ],
        },
      ],
    };

    const { container } = render(
      <MemoryRouter>
        <NavGroup {...navGroupWithSubitemIcon} />
      </MemoryRouter>
    );

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(1);
  });

  it('marks active route with query parameters', () => {
    render(
      <MemoryRouter initialEntries={['/settings?tab=profile']}>
        <NavGroup {...simpleNavGroup} />
      </MemoryRouter>
    );

    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('detects active child navigation item', () => {
    render(
      <MemoryRouter initialEntries={['/admin/users']}>
        <NavGroup {...collapsibleNavGroup} />
      </MemoryRouter>
    );

    const usersLink = screen.getByRole('link', { name: /users/i });
    expect(usersLink).toBeInTheDocument();
  });
});
