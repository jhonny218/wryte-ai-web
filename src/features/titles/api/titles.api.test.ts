import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TitlesApi } from './titles.api';
import { apiClient } from '@/lib/api-client';
import type { Title } from '../types/title.types';

// Mock the api client
vi.mock('@/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('TitlesApi', () => {
  const mockOrganizationId = 'org-123';
  const mockTitleId = 'title-456';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTitles', () => {
    it('fetches titles for an organization', async () => {
      const mockTitles: Title[] = [
        {
          id: 'title-1',
          organizationId: mockOrganizationId,
          title: 'Test Title 1',
          status: 'PENDING',
          scheduledDate: '2024-01-01',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'title-2',
          organizationId: mockOrganizationId,
          title: 'Test Title 2',
          status: 'APPROVED',
          scheduledDate: null,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockTitles },
      });

      const result = await TitlesApi.getTitles(mockOrganizationId);

      expect(apiClient.get).toHaveBeenCalledWith(`/titles/${mockOrganizationId}`);
      expect(result).toEqual(mockTitles);
    });

    it('handles response without nested data property', async () => {
      const mockTitles: Title[] = [
        {
          id: 'title-1',
          organizationId: mockOrganizationId,
          title: 'Test Title',
          status: 'PENDING',
          scheduledDate: null,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({
        data: mockTitles,
      });

      const result = await TitlesApi.getTitles(mockOrganizationId);

      expect(result).toEqual(mockTitles);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Network error');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(TitlesApi.getTitles(mockOrganizationId)).rejects.toThrow('Network error');
    });
  });

  describe('getCalendarTitles', () => {
    it('fetches titles for a specific month', async () => {
      const mockTitles: Title[] = [
        {
          id: 'title-1',
          organizationId: mockOrganizationId,
          title: 'January Title',
          status: 'APPROVED',
          scheduledDate: '2024-01-15',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockTitles },
      });

      const result = await TitlesApi.getCalendarTitles(mockOrganizationId, 2024, 1);

      expect(apiClient.get).toHaveBeenCalledWith('/calendar', {
        params: {
          orgId: mockOrganizationId,
          year: '2024',
          month: '01',
        },
      });
      expect(result).toEqual(mockTitles);
    });

    it('pads single-digit month with zero', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: [] },
      });

      await TitlesApi.getCalendarTitles(mockOrganizationId, 2024, 5);

      expect(apiClient.get).toHaveBeenCalledWith('/calendar', {
        params: {
          orgId: mockOrganizationId,
          year: '2024',
          month: '05',
        },
      });
    });

    it('does not pad double-digit month', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: [] },
      });

      await TitlesApi.getCalendarTitles(mockOrganizationId, 2024, 12);

      expect(apiClient.get).toHaveBeenCalledWith('/calendar', {
        params: {
          orgId: mockOrganizationId,
          year: '2024',
          month: '12',
        },
      });
    });

    it('handles response without nested data property', async () => {
      const mockTitles: Title[] = [
        {
          id: 'title-1',
          organizationId: mockOrganizationId,
          title: 'Test Title',
          status: 'APPROVED',
          scheduledDate: '2024-01-15',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({
        data: mockTitles,
      });

      const result = await TitlesApi.getCalendarTitles(mockOrganizationId, 2024, 1);

      expect(result).toEqual(mockTitles);
    });
  });

  describe('createTitles', () => {
    it('creates a job to generate titles', async () => {
      const mockDates = ['2024-01-01', '2024-01-02'];
      const mockResponse = {
        jobId: 'job-123',
        status: 'PENDING' as const,
      };

      vi.mocked(apiClient.post).mockResolvedValue({
        data: { data: mockResponse },
      });

      const result = await TitlesApi.createTitles(mockOrganizationId, mockDates);

      expect(apiClient.post).toHaveBeenCalledWith('/jobs/title/', {
        organizationId: mockOrganizationId,
        dates: mockDates,
      });
      expect(result).toEqual(mockResponse);
    });

    it('handles response without nested data property', async () => {
      const mockDates = ['2024-01-01'];
      const mockResponse = {
        jobId: 'job-123',
        status: 'PENDING' as const,
      };

      vi.mocked(apiClient.post).mockResolvedValue({
        data: mockResponse,
      });

      const result = await TitlesApi.createTitles(mockOrganizationId, mockDates);

      expect(result).toEqual(mockResponse);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Failed to create job');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(TitlesApi.createTitles(mockOrganizationId, ['2024-01-01'])).rejects.toThrow(
        'Failed to create job'
      );
    });
  });

  describe('updateTitle', () => {
    it('updates a title with partial data', async () => {
      const updates = {
        title: 'Updated Title',
        status: 'APPROVED' as const,
      };

      const mockUpdatedTitle: Title = {
        id: mockTitleId,
        organizationId: mockOrganizationId,
        title: updates.title,
        status: updates.status,
        scheduledDate: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue({
        data: { data: mockUpdatedTitle },
      });

      const result = await TitlesApi.updateTitle(mockOrganizationId, mockTitleId, updates);

      expect(apiClient.put).toHaveBeenCalledWith(
        `/titles/${mockOrganizationId}/${mockTitleId}`,
        updates
      );
      expect(result).toEqual(mockUpdatedTitle);
    });

    it('updates scheduledDate', async () => {
      const updates = {
        scheduledDate: '2024-02-15',
      };

      const mockUpdatedTitle: Title = {
        id: mockTitleId,
        organizationId: mockOrganizationId,
        title: 'Test Title',
        status: 'PENDING',
        scheduledDate: updates.scheduledDate,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue({
        data: { data: mockUpdatedTitle },
      });

      const result = await TitlesApi.updateTitle(mockOrganizationId, mockTitleId, updates);

      expect(result.scheduledDate).toBe(updates.scheduledDate);
    });

    it('handles response without nested data property', async () => {
      const updates = { status: 'REJECTED' as const };
      const mockUpdatedTitle: Title = {
        id: mockTitleId,
        organizationId: mockOrganizationId,
        title: 'Test Title',
        status: updates.status,
        scheduledDate: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue({
        data: mockUpdatedTitle,
      });

      const result = await TitlesApi.updateTitle(mockOrganizationId, mockTitleId, updates);

      expect(result).toEqual(mockUpdatedTitle);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Failed to update title');
      vi.mocked(apiClient.put).mockRejectedValue(mockError);

      await expect(
        TitlesApi.updateTitle(mockOrganizationId, mockTitleId, { status: 'APPROVED' })
      ).rejects.toThrow('Failed to update title');
    });
  });

  describe('deleteTitle', () => {
    it('deletes a title', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({ data: {} });

      await TitlesApi.deleteTitle(mockOrganizationId, mockTitleId);

      expect(apiClient.delete).toHaveBeenCalledWith(`/titles/${mockOrganizationId}/${mockTitleId}`);
    });

    it('returns void on successful deletion', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({ data: {} });

      const result = await TitlesApi.deleteTitle(mockOrganizationId, mockTitleId);

      expect(result).toBeUndefined();
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Failed to delete title');
      vi.mocked(apiClient.delete).mockRejectedValue(mockError);

      await expect(TitlesApi.deleteTitle(mockOrganizationId, mockTitleId)).rejects.toThrow(
        'Failed to delete title'
      );
    });
  });
});
