import { describe, it, expect, vi, beforeEach } from 'vitest';
import { settingsApi } from './settings.api';
import { apiClient } from '@/lib/api-client';
import type { ContentSettings } from '../types/settings.types';

// Mock the api client
vi.mock('@/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe('settingsApi', () => {
  const mockOrganizationId = 'org-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getContentSettings', () => {
    it('fetches content settings for an organization', async () => {
      const mockSettings: ContentSettings = {
        id: 'settings-1',
        organizationId: mockOrganizationId,
        brandVoice: 'Professional and friendly',
        targetAudience: 'Tech professionals',
        contentGoals: 'Educate and inform',
        tonePreference: 'Professional',
        seoKeywords: ['tech', 'innovation', 'software'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockSettings },
      });

      const result = await settingsApi.getContentSettings(mockOrganizationId);

      expect(apiClient.get).toHaveBeenCalledWith(`/settings/${mockOrganizationId}`);
      expect(result).toEqual(mockSettings);
    });

    it('handles response without nested data property', async () => {
      const mockSettings: ContentSettings = {
        id: 'settings-1',
        organizationId: mockOrganizationId,
        brandVoice: 'Professional',
        targetAudience: 'General audience',
        contentGoals: 'Engage readers',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: mockSettings,
      });

      const result = await settingsApi.getContentSettings(mockOrganizationId);

      expect(result).toEqual(mockSettings);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Settings not found');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(settingsApi.getContentSettings(mockOrganizationId)).rejects.toThrow(
        'Settings not found'
      );
    });
  });

  describe('updateContentSettings', () => {
    it('updates content settings with partial data', async () => {
      const updates: Partial<ContentSettings> = {
        brandVoice: 'Updated brand voice',
        targetAudience: 'Updated target audience',
      };

      const mockUpdatedSettings: ContentSettings = {
        id: 'settings-1',
        organizationId: mockOrganizationId,
        brandVoice: updates.brandVoice!,
        targetAudience: updates.targetAudience!,
        contentGoals: 'Existing goals',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue({
        data: { data: mockUpdatedSettings },
      });

      const result = await settingsApi.updateContentSettings(mockOrganizationId, updates);

      expect(apiClient.put).toHaveBeenCalledWith(`/settings/${mockOrganizationId}`, updates);
      expect(result).toEqual(mockUpdatedSettings);
    });

    it('updates SEO keywords', async () => {
      const updates: Partial<ContentSettings> = {
        seoKeywords: ['new', 'keywords', 'list'],
      };

      const mockUpdatedSettings: ContentSettings = {
        id: 'settings-1',
        organizationId: mockOrganizationId,
        brandVoice: 'Professional',
        targetAudience: 'Tech professionals',
        contentGoals: 'Engage',
        seoKeywords: updates.seoKeywords,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue({
        data: { data: mockUpdatedSettings },
      });

      const result = await settingsApi.updateContentSettings(mockOrganizationId, updates);

      expect(result.seoKeywords).toEqual(updates.seoKeywords);
    });

    it('updates tone preference', async () => {
      const updates: Partial<ContentSettings> = {
        tonePreference: 'Casual',
      };

      const mockUpdatedSettings: ContentSettings = {
        id: 'settings-1',
        organizationId: mockOrganizationId,
        brandVoice: 'Professional',
        targetAudience: 'Tech professionals',
        contentGoals: 'Engage',
        tonePreference: updates.tonePreference,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue({
        data: { data: mockUpdatedSettings },
      });

      const result = await settingsApi.updateContentSettings(mockOrganizationId, updates);

      expect(result.tonePreference).toBe(updates.tonePreference);
    });

    it('handles response without nested data property', async () => {
      const updates: Partial<ContentSettings> = {
        contentGoals: 'New goals',
      };

      const mockUpdatedSettings: ContentSettings = {
        id: 'settings-1',
        organizationId: mockOrganizationId,
        brandVoice: 'Professional',
        targetAudience: 'Tech professionals',
        contentGoals: updates.contentGoals!,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue({
        data: mockUpdatedSettings,
      });

      const result = await settingsApi.updateContentSettings(mockOrganizationId, updates);

      expect(result).toEqual(mockUpdatedSettings);
    });

    it('creates settings when they do not exist', async () => {
      const newSettings: Partial<ContentSettings> = {
        brandVoice: 'New brand voice',
        targetAudience: 'New audience',
        contentGoals: 'New goals',
      };

      const mockCreatedSettings: ContentSettings = {
        id: 'settings-new',
        organizationId: mockOrganizationId,
        brandVoice: newSettings.brandVoice!,
        targetAudience: newSettings.targetAudience!,
        contentGoals: newSettings.contentGoals!,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue({
        data: { data: mockCreatedSettings },
      });

      const result = await settingsApi.updateContentSettings(mockOrganizationId, newSettings);

      expect(result).toEqual(mockCreatedSettings);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Failed to update settings');
      vi.mocked(apiClient.put).mockRejectedValue(mockError);

      await expect(
        settingsApi.updateContentSettings(mockOrganizationId, { brandVoice: 'New voice' })
      ).rejects.toThrow('Failed to update settings');
    });
  });
});
