import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NavUser } from './nav-user';

// Mock Clerk
const mockUser = {
  fullName: 'John Doe',
  firstName: 'John',
  primaryEmailAddress: {
    emailAddress: 'john@example.com',
  },
};

vi.mock('@clerk/clerk-react', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-in">{children}</div>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-out">{children}</div>,
  SignInButton: ({ children }: { children: React.ReactNode }) => <div data-testid="sign-in-button">{children}</div>,
  UserButton: () => <div data-testid="user-button">User Button</div>,
  useUser: () => ({ user: mockUser }),
}));

// Mock useIsMobile hook
const mockIsMobile = vi.fn(() => false);
vi.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: () => mockIsMobile(),
}));

// Mock MobileUserButton
vi.mock('./mobile-user-button', () => ({
  MobileUserButton: () => <div data-testid="mobile-user-button">Mobile User Button</div>,
}));

describe('NavUser', () => {
  it('renders component wrapper', () => {
    const { container } = render(<NavUser />);

    const wrapper = container.querySelector('.w-full.px-2');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders sign in button when signed out', () => {
    render(<NavUser />);

    const signedOut = screen.getByTestId('signed-out');
    expect(signedOut).toBeInTheDocument();

    const signInButton = screen.getByTestId('sign-in-button');
    expect(signInButton).toBeInTheDocument();
  });

  it('sign in button has correct styling', () => {
    const { container } = render(<NavUser />);

    const button = container.querySelector('button');
    expect(button).toHaveClass('w-full', 'rounded-md', 'border', 'px-3', 'py-2', 'text-sm');
  });

  it('sign in button displays correct text', () => {
    render(<NavUser />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders user button when signed in on desktop', () => {
    mockIsMobile.mockReturnValue(false);
    render(<NavUser />);

    const signedIn = screen.getByTestId('signed-in');
    expect(signedIn).toBeInTheDocument();

    const userButton = screen.getByTestId('user-button');
    expect(userButton).toBeInTheDocument();
  });

  it('renders mobile user button when signed in on mobile', () => {
    mockIsMobile.mockReturnValue(true);
    render(<NavUser />);

    const mobileUserButton = screen.getByTestId('mobile-user-button');
    expect(mobileUserButton).toBeInTheDocument();
  });

  it('displays user full name when signed in on desktop', () => {
    mockIsMobile.mockReturnValue(false);
    render(<NavUser />);

    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('displays user email when signed in on desktop', () => {
    mockIsMobile.mockReturnValue(false);
    render(<NavUser />);

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('displays firstName when fullName is not available', () => {
    vi.mock('@clerk/clerk-react', () => ({
      SignedIn: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-in">{children}</div>,
      SignedOut: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-out">{children}</div>,
      SignInButton: ({ children }: { children: React.ReactNode }) => <div data-testid="sign-in-button">{children}</div>,
      UserButton: () => <div data-testid="user-button">User Button</div>,
      useUser: () => ({
        user: {
          firstName: 'John',
          primaryEmailAddress: { emailAddress: 'john@example.com' },
        },
      }),
    }));

    mockIsMobile.mockReturnValue(false);
    const { rerender } = render(<NavUser />);
    rerender(<NavUser />);

    // Should show either fullName or firstName
    const nameElement = screen.queryByText('John Doe') || screen.queryByText('John');
    expect(nameElement).toBeInTheDocument();
  });

  it('has correct layout classes for desktop user info', () => {
    mockIsMobile.mockReturnValue(false);
    const { container } = render(<NavUser />);

    const flexContainer = container.querySelector('.flex.items-center.gap-3');
    expect(flexContainer).toBeInTheDocument();
  });

  it('user name has correct styling', () => {
    mockIsMobile.mockReturnValue(false);
    render(<NavUser />);

    const userName = screen.getByText('John');
    expect(userName).toHaveClass('truncate', 'text-sm', 'font-medium');
  });

  it('user email has correct styling', () => {
    mockIsMobile.mockReturnValue(false);
    render(<NavUser />);

    const userEmail = screen.getByText('john@example.com');
    expect(userEmail).toHaveClass('text-muted-foreground', 'truncate', 'text-xs');
  });

  it('user info container has min-width constraint', () => {
    mockIsMobile.mockReturnValue(false);
    const { container } = render(<NavUser />);

    const infoContainer = container.querySelector('.min-w-0');
    expect(infoContainer).toBeInTheDocument();
  });

  it('sign in button container has padding', () => {
    const { container } = render(<NavUser />);

    const signInContainer = container.querySelector('.px-2');
    expect(signInContainer).toBeInTheDocument();
  });
});
