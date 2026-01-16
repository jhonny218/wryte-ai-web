import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrganizationForm } from './OrganizationForm';
import { renderWithProviders } from '@/test/utils/test-utils';
import { organizationsApi } from '../api/organizations.api';

vi.mock('../api/organizations.api');
vi.mock('@/hooks/useToast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('OrganizationForm', () => {
  const mockInitialData = {
    name: 'Test Organization',
    mission: 'Test mission',
    description: 'Test description',
    websiteUrl: 'https://test.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders organization information heading', () => {
    renderWithProviders(
      <OrganizationForm organizationId="org-123" initialData={mockInitialData} />
    );

    expect(screen.getByText('Organization Information')).toBeInTheDocument();
  });

  it('renders description text', () => {
    renderWithProviders(
      <OrganizationForm organizationId="org-123" initialData={mockInitialData} />
    );

    expect(screen.getByText(/update your organization details/i)).toBeInTheDocument();
  });

  it('populates form with initial data', () => {
    renderWithProviders(
      <OrganizationForm organizationId="org-123" initialData={mockInitialData} />
    );

    const nameInput = screen.getByLabelText(/organization name/i) as HTMLInputElement;
    const missionTextarea = screen.getByLabelText(/mission statement/i) as HTMLTextAreaElement;

    expect(nameInput.value).toBe('Test Organization');
    expect(missionTextarea.value).toBe('Test mission');
  });

  it('renders save button', () => {
    renderWithProviders(
      <OrganizationForm organizationId="org-123" initialData={mockInitialData} />
    );

    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('submits form with updated data', async () => {
    const user = userEvent.setup();    vi.mocked(organizationsApi.updateOrganization).mockResolvedValue(undefined);

    renderWithProviders(
      <OrganizationForm organizationId="org-123" initialData={mockInitialData} />
    );

    const nameInput = screen.getByLabelText(/organization name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Organization');

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(organizationsApi.updateOrganization).toHaveBeenCalledWith('org-123', {
        name: 'Updated Organization',
        mission: 'Test mission',
        description: 'Test description',
        websiteUrl: 'https://test.com',
      });
    });
  });

  it('allows editing organization name', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OrganizationForm organizationId="org-123" initialData={mockInitialData} />
    );

    const nameInput = screen.getByLabelText(/organization name/i) as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'New Name');

    expect(nameInput.value).toBe('New Name');
  });

  it('allows editing mission statement', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OrganizationForm organizationId="org-123" initialData={mockInitialData} />
    );

    const missionTextarea = screen.getByLabelText(/mission statement/i) as HTMLTextAreaElement;
    await user.clear(missionTextarea);
    await user.type(missionTextarea, 'New mission');

    expect(missionTextarea.value).toBe('New mission');
  });

  it('renders with empty initial data', () => {
    renderWithProviders(<OrganizationForm organizationId="org-123" />);

    const nameInput = screen.getByLabelText(/organization name/i) as HTMLInputElement;
    expect(nameInput.value).toBe('');
  });
});
