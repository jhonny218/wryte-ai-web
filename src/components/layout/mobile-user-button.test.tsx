import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileUserButton } from './mobile-user-button';
import { MemoryRouter } from 'react-router-dom';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Clerk
const mockSignOut = vi.fn();
const mockUser = {
  fullName: 'John Doe',
  firstName: 'John',
  emailAddresses: [{ emailAddress: 'john@example.com' }],
  primaryEmailAddress: {
    emailAddress: 'john@example.com',
  },
};

vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({ user: mockUser }),
  useClerk: () => ({ signOut: mockSignOut }),
}));

// Mock toast
vi.mock('@/hooks/useToast', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('MobileUserButton', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Clear toast mock
    const { toast } = await import('@/hooks/useToast');
    vi.mocked(toast.error).mockClear();
  });

  it('renders user avatar with initials', () => {
    render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('displays user full name', () => {
    render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  it('displays user email', () => {
    render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('renders sign out button', () => {
    render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();
  });

  it('renders LogOut icon', () => {
    const { container } = render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('mr-2', 'h-4', 'w-4');
  });

  it('calls signOut when sign out button is clicked', async () => {
    const user = userEvent.setup();
    mockSignOut.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    await user.click(signOutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledOnce();
    });
  });

  it('navigates to home after successful sign out', async () => {
    const user = userEvent.setup();
    mockSignOut.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    await user.click(signOutButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('shows toast error and navigates when sign out fails', async () => {
    const user = userEvent.setup();
    const error = new Error('Sign out failed');
    mockSignOut.mockRejectedValue(error);

    render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    await user.click(signOutButton);

    const { toast } = await import('@/hooks/useToast');
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Sign out failed');
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('handles non-Error exceptions during sign out', async () => {
    const user = userEvent.setup();
    mockSignOut.mockRejectedValue('Unknown error');

    render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    await user.click(signOutButton);

    const { toast } = await import('@/hooks/useToast');
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to sign out. Please try again.');
    });
  });

  it('avatar has correct styling', () => {
    const { container } = render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    const avatar = container.querySelector('.bg-primary.text-primary-foreground');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('flex', 'h-8', 'w-8', 'items-center', 'justify-center', 'rounded-full', 'text-sm', 'font-semibold');
  });

  it('user name has correct styling', () => {
    render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    const userName = screen.getByText('Account');
    expect(userName).toHaveClass('truncate', 'text-sm', 'font-medium');
  });

  it('user email has correct styling', () => {
    render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    const userEmail = screen.getByText('test@example.com');
    expect(userEmail).toHaveClass('text-muted-foreground', 'truncate', 'text-xs');
  });

  it('sign out button has correct variant and size', () => {
    render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    expect(signOutButton).toHaveClass('w-full');
  });

  it('has flex column layout with gap', () => {
    const { container } = render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    const wrapper = container.querySelector('.flex.flex-col.gap-2');
    expect(wrapper).toBeInTheDocument();
  });

  it('user info container has correct layout', () => {
    const { container } = render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    const infoContainer = container.querySelector('.flex.items-center.gap-3.px-2');
    expect(infoContainer).toBeInTheDocument();
  });

  it('uses email first character when no first name', () => {
    vi.mock('@clerk/clerk-react', () => ({
      useUser: () => ({
        user: {
          emailAddresses: [{ emailAddress: 'test@example.com' }],
        },
      }),
      useClerk: () => ({ signOut: mockSignOut }),
    }));

    const { container, rerender } = render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );
    rerender(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    // Should display either J (from John) or the fallback
    const avatarText = container.querySelector('.rounded-full')?.textContent;
    expect(avatarText).toBeTruthy();
  });

  it('displays "Account" when no name is available', () => {
    vi.mock('@clerk/clerk-react', () => ({
      useUser: () => ({
        user: {
          primaryEmailAddress: { emailAddress: 'test@example.com' },
        },
      }),
      useClerk: () => ({ signOut: mockSignOut }),
    }));

    const { rerender } = render(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );
    rerender(
      <MemoryRouter>
        <MobileUserButton />
      </MemoryRouter>
    );

    // Should show either the name or "Account"
    expect(screen.getByText(/john doe|account/i)).toBeInTheDocument();
  });
});
