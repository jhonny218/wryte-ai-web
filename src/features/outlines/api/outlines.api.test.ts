import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OutlinesApi } from './outlines.api';
import { apiClient } from '../../../lib/api-client';
import type { Outline } from '../types/outline.types';

// Test-only shape used by these unit tests. The real `Outline` zod schema
// stores content under `structure`, but tests here use a simpler shape.
type TestOutline = {
  id: string;
  organizationId: string;
  blogTitleId: string;
  title?: string;
  introduction?: string;
  sections?: Array<Record<string, unknown>>;
  conclusion?: string;
  createdAt: string;
  updatedAt: string;
};

// Mock the api client
vi.mock('@/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('OutlinesApi', () => {
  const mockOrganizationId = 'org-123';
  const mockOutlineId = 'outline-456';
  const mockTitleId = 'title-789';

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear console.error mock
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('getOutlines', () => {
    it('fetches outlines for an organization', async () => {
      const mockOutlines = [
        {
          id: 'outline-1',
          organizationId: mockOrganizationId,
          blogTitleId: 'title-1',
          title: 'Test Outline 1',
          introduction: 'Intro 1',
          sections: [],
          conclusion: 'Conclusion 1',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'outline-2',
          organizationId: mockOrganizationId,
          blogTitleId: 'title-2',
          title: 'Test Outline 2',
          introduction: 'Intro 2',
          sections: [],
          conclusion: 'Conclusion 2',
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      ] as unknown as Outline[];

      const mockedGet = apiClient.get as unknown as { mockResolvedValue: (v: unknown) => void };
      mockedGet.mockResolvedValue({
        data: {
          success: true,
          status: 200,
          data: mockOutlines,
        },
      });

      const result = await OutlinesApi.getOutlines(mockOrganizationId);

      expect(apiClient.get).toHaveBeenCalledWith(`/outlines/${mockOrganizationId}`);
      expect(result).toEqual(mockOutlines);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Network error');
      (apiClient.get as unknown as { mockRejectedValue: (e: unknown) => void }).mockRejectedValue(mockError);

      await expect(OutlinesApi.getOutlines(mockOrganizationId)).rejects.toThrow('Network error');
    });
  });

  describe('createOutlines', () => {
    it('creates an outline job and returns jobId from direct jobId property', async () => {
      const mockResponse = {
        jobId: 'job-123',
      };

      (apiClient.post as unknown as { mockResolvedValue: (v: unknown) => void }).mockResolvedValue({ data: mockResponse });

      const result = await OutlinesApi.createOutlines(mockOrganizationId, mockTitleId);

      expect(apiClient.post).toHaveBeenCalledWith('/jobs/outline/', {
        organizationId: mockOrganizationId,
        blogTitleId: mockTitleId,
      });
      expect(result).toEqual({ jobId: 'job-123' });
    });

    it('extracts jobId from nested data.jobId', async () => {
      const mockResponse = {
        data: {
          jobId: 'job-789',
        },
      };

      (apiClient.post as unknown as { mockResolvedValue: (v: unknown) => void }).mockResolvedValue({ data: mockResponse });

      const result = await OutlinesApi.createOutlines(mockOrganizationId, mockTitleId);

      expect(result).toEqual({ jobId: 'job-789' });
    });

    it('extracts jobId from id property', async () => {
      const mockResponse = {
        id: 'job-abc',
      };

      (apiClient.post as unknown as { mockResolvedValue: (v: unknown) => void }).mockResolvedValue({ data: mockResponse });

      const result = await OutlinesApi.createOutlines(mockOrganizationId, mockTitleId);

      expect(result).toEqual({ jobId: 'job-abc' });
    });

    it('extracts jobId from nested data.id', async () => {
      const mockResponse = {
        data: {
          id: 'job-def',
        },
      };

      (apiClient.post as unknown as { mockResolvedValue: (v: unknown) => void }).mockResolvedValue({ data: mockResponse });

      const result = await OutlinesApi.createOutlines(mockOrganizationId, mockTitleId);

      expect(result).toEqual({ jobId: 'job-def' });
    });

    it('throws error when jobId cannot be extracted', async () => {
      const mockResponse = {
        unexpected: 'format',
      };

      (apiClient.post as unknown as { mockResolvedValue: (v: unknown) => void }).mockResolvedValue({ data: mockResponse });

      await expect(OutlinesApi.createOutlines(mockOrganizationId, mockTitleId)).rejects.toThrow(
        'Could not extract job ID from response'
      );
      expect(console.error).toHaveBeenCalledWith('Unexpected response format:', mockResponse);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Failed to create outline job');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(OutlinesApi.createOutlines(mockOrganizationId, mockTitleId)).rejects.toThrow(
        'Failed to create outline job'
      );
    });
  });

  describe('updateOutline', () => {
    it('updates an outline with partial data', async () => {
      const updates: Partial<TestOutline> = {
        title: 'Updated Outline Title',
        introduction: 'Updated introduction',
      };

      const mockUpdatedOutline: unknown = {
        id: mockOutlineId,
        blogTitleId: mockTitleId,
        seoKeywords: [],
        suggestedImages: [],
        status: 'DRAFT',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        organizationId: mockOrganizationId,
        structure: {
          title: updates.title,
          structure: {
            introduction: updates.introduction,
            sections: [],
            conclusion: undefined,
          },
        },
      } as unknown as Outline;

      (apiClient.put as unknown as { mockResolvedValue: (v: unknown) => void }).mockResolvedValue({ data: mockUpdatedOutline });

      const result = await OutlinesApi.updateOutline(mockOrganizationId, mockOutlineId, updates as unknown as Partial<Outline>);

      expect(apiClient.put).toHaveBeenCalledWith(`/outlines/${mockOrganizationId}/${mockOutlineId}`, updates);
      expect(result).toEqual(mockUpdatedOutline);
    });

    it('updates outline sections', async () => {
      const updates2: Partial<TestOutline> = {
        sections: [
          { heading: 'Section 1', subheadings: [], points: [] },
          { heading: 'Section 2', subheadings: [], points: [] },
        ] as unknown as Array<Record<string, unknown>>,
      };

      const mockUpdatedOutline2: unknown = {
        id: mockOutlineId,
        blogTitleId: mockTitleId,
        seoKeywords: [],
        suggestedImages: [],
        status: 'DRAFT',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        organizationId: mockOrganizationId,
        structure: {
          title: 'Test Outline',
          structure: {
            introduction: 'Intro',
            sections: updates2.sections as unknown as Array<Record<string, unknown>>,
            conclusion: 'Conclusion',
          },
        },
      } as unknown as Outline;

      (apiClient.put as unknown as { mockResolvedValue: (v: unknown) => void }).mockResolvedValue({ data: mockUpdatedOutline2 });

      const result2 = await OutlinesApi.updateOutline(mockOrganizationId, mockOutlineId, updates2 as unknown as Partial<Outline>);

      expect(result2.structure?.structure?.sections).toEqual(updates2.sections);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Failed to update outline');
      (apiClient.put as unknown as { mockRejectedValue: (e: unknown) => void }).mockRejectedValue(mockError);

      await expect(
        OutlinesApi.updateOutline(mockOrganizationId, mockOutlineId, { title: 'New Title' } as unknown as Partial<Outline>)
      ).rejects.toThrow('Failed to update outline');
    });
  });

  describe('deleteOutline', () => {
    it('deletes an outline', async () => {
      (apiClient.delete as unknown as { mockResolvedValue: (v: unknown) => void }).mockResolvedValue({ data: {} });

      await OutlinesApi.deleteOutline(mockOrganizationId, mockOutlineId);

      expect(apiClient.delete).toHaveBeenCalledWith(`/outlines/${mockOrganizationId}/${mockOutlineId}`);
    });

    it('returns void on successful deletion', async () => {
      (apiClient.delete as unknown as { mockResolvedValue: (v: unknown) => void }).mockResolvedValue({ data: {} });

      const result = await OutlinesApi.deleteOutline(mockOrganizationId, mockOutlineId);

      expect(result).toBeUndefined();
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Failed to delete outline');
      (apiClient.delete as unknown as { mockRejectedValue: (e: unknown) => void }).mockRejectedValue(mockError);

      await expect(OutlinesApi.deleteOutline(mockOrganizationId, mockOutlineId)).rejects.toThrow('Failed to delete outline');
    });
  });
});
