import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsForm } from './SettingsForm';
import { renderWithProviders } from '@/test/utils/test-utils';
import { settingsApi } from '../api/settings.api';
import type { ContentSettings } from '../types/settings.types';

vi.mock('../api/settings.api');
vi.mock('@/hooks/useToast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('SettingsForm', () => {
  const mockInitialData: ContentSettings = {
    organizationId: 'org-123',
    primaryKeywords: ['keyword1', 'keyword2'],
    secondaryKeywords: ['secondary1'],
    postingDaysOfWeek: ['MON', 'WED', 'FRI'],
    tone: 'professional',
    targetAudience: 'developers',
    industry: 'technology',
    goals: ['goal1'],
    competitorUrls: ['https://competitor.com'],
    topicsToAvoid: ['topic1'],
    preferredLength: 'MEDIUM_FORM',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders content settings heading', () => {
    renderWithProviders(
      <SettingsForm organizationId="org-123" initialData={mockInitialData} />
    );

    expect(screen.getByText(/content settings/i)).toBeInTheDocument();
  });

  it('populates form with initial data', () => {
    renderWithProviders(
      <SettingsForm organizationId="org-123" initialData={mockInitialData} />
    );

    expect(screen.getByText('keyword1')).toBeInTheDocument();
    expect(screen.getByText('keyword2')).toBeInTheDocument();
  });

  it('renders save button', () => {
    renderWithProviders(
      <SettingsForm organizationId="org-123" initialData={mockInitialData} />
    );

    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('submits form with updated data', async () => {
    const user = userEvent.setup();
    vi.mocked(settingsApi.updateContentSettings).mockResolvedValue(mockInitialData);

    renderWithProviders(
      <SettingsForm organizationId="org-123" initialData={mockInitialData} />
    );

    const targetAudienceInput = screen.getByLabelText(/target audience/i);
    await user.clear(targetAudienceInput);
    await user.type(targetAudienceInput, 'designers');

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(settingsApi.updateContentSettings).toHaveBeenCalledWith('org-123', expect.objectContaining({
        targetAudience: 'designers',
      }));
    });
  });

  it('displays primary keywords as badges', () => {
    renderWithProviders(
      <SettingsForm organizationId="org-123" initialData={mockInitialData} />
    );

    expect(screen.getByText('keyword1')).toBeInTheDocument();
    expect(screen.getByText('keyword2')).toBeInTheDocument();
  });

  it('reset button restores initial values and clears dirty state', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SettingsForm organizationId="org-123" initialData={mockInitialData} />
    );

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    const resetButton = screen.getByRole('button', { name: /reset/i });

    // Change an input to make the form dirty
    const targetAudienceInput = screen.getByLabelText(/target audience/i);
    await user.clear(targetAudienceInput);
    await user.type(targetAudienceInput, 'designers');
    expect(saveButton).toBeEnabled();

    // Click reset
    await user.click(resetButton);

    // Expect value restored to initial and save disabled
    expect(screen.getByLabelText(/target audience/i)).toHaveValue('developers');
    expect(saveButton).toBeDisabled();
  });

  it('allows adding and removing a competitor URL', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsForm organizationId="org-123" initialData={{ ...mockInitialData, competitorUrls: [] }} />);

    const urlInput = screen.getByPlaceholderText(/https:\/\/competitor.com/i);
    await user.type(urlInput, 'https://example.com');
    // There are multiple Add buttons; find the one after this input
    const addButtons = screen.getAllByRole('button', { name: /add/i });
    const addBtn = addButtons.find((b) => (urlInput.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0);
    if (!addBtn) throw new Error('Competitor Add button not found');
    await user.click(addBtn);

    expect(screen.getByText('https://example.com')).toBeInTheDocument();

    // Remove it
    const badge = screen.getByText('https://example.com').closest('div');
    if (!badge) throw new Error('Badge container not found');
    const removeBtn = within(badge).getByRole('button');
    await user.click(removeBtn);
    expect(screen.queryByText('https://example.com')).not.toBeInTheDocument();
  });

  it('shows error toast when update fails', async () => {
    const user = userEvent.setup();
    const err = { response: { data: { message: 'Uh oh' } } };
    vi.mocked(settingsApi.updateContentSettings).mockRejectedValue(err);

    renderWithProviders(<SettingsForm organizationId="org-123" initialData={mockInitialData} />);

    // Make a change
    const targetAudienceInput = screen.getByLabelText(/target audience/i);
    await user.clear(targetAudienceInput);
    await user.type(targetAudienceInput, 'designers');

    // Submit
    await user.click(screen.getByRole('button', { name: /save changes/i }));
    // Expect the API was called and the toast.error path was taken
    await waitFor(() => {
      expect(settingsApi.updateContentSettings).toHaveBeenCalled();
    });
    const { toast } = await import('@/hooks/useToast');
    expect(vi.mocked(toast.error)).toHaveBeenCalled();
  });

  it('renders with empty initial data', () => {
    renderWithProviders(<SettingsForm organizationId="org-123" />);

    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('allows adding new keyword', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SettingsForm organizationId="org-123" initialData={{ ...mockInitialData, primaryKeywords: [] }} />
    );

    const keywordInput = screen.getByPlaceholderText(/add a primary keyword/i);
    await user.type(keywordInput, 'newkeyword');
    const primaryContainer = keywordInput.closest('div');
    const addButton = primaryContainer ? within(primaryContainer).getByRole('button', { name: /add/i }) : screen.getByRole('button', { name: /add/i });
    await user.click(addButton);

    expect(screen.getByText('newkeyword')).toBeInTheDocument();
  });

  it('disables save button when not dirty', () => {
    renderWithProviders(
      <SettingsForm organizationId="org-123" initialData={mockInitialData} />
    );

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    expect(saveButton).toBeDisabled();
  });
});
