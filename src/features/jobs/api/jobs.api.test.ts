import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JobsApi } from './jobs.api';
import { apiClient } from '@/lib/api-client';
import type { Job } from '../types/job.types';

// Mock the api client
vi.mock('@/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('JobsApi', () => {
  const mockJobId = 'job-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getJobStatus', () => {
    it('fetches job status by ID', async () => {
      const mockJob: Job = {
        id: mockJobId,
        userId: 'user-123',
        organizationId: 'org-456',
        type: 'TITLE_GENERATION',
        status: 'PENDING',
        input: {
          dates: ['2024-01-01', '2024-01-02'],
        },
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockJob },
      });

      const result = await JobsApi.getJobStatus(mockJobId);

      expect(apiClient.get).toHaveBeenCalledWith(`/jobs/${mockJobId}`);
      expect(result).toEqual(mockJob);
    });

    it('fetches job with PROCESSING status', async () => {
      const mockJob: Job = {
        id: mockJobId,
        userId: 'user-123',
        organizationId: 'org-456',
        type: 'OUTLINE_GENERATION',
        status: 'PROCESSING',
        input: {
          blogTitleId: 'title-123',
        },
        startedAt: '2024-01-01T00:01:00Z',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockJob },
      });

      const result = await JobsApi.getJobStatus(mockJobId);

      expect(result.status).toBe('PROCESSING');
      expect(result.startedAt).toBeDefined();
    });

    it('fetches job with COMPLETED status', async () => {
      const mockJob: Job = {
        id: mockJobId,
        userId: 'user-123',
        organizationId: 'org-456',
        type: 'BLOG_GENERATION',
        status: 'COMPLETED',
        input: {
          blogOutlineId: 'outline-123',
        },
        result: {
          blogId: 'blog-789',
        },
        startedAt: '2024-01-01T00:01:00Z',
        completedAt: '2024-01-01T00:02:00Z',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockJob },
      });

      const result = await JobsApi.getJobStatus(mockJobId);

      expect(result.status).toBe('COMPLETED');
      expect(result.result).toBeDefined();
      expect(result.completedAt).toBeDefined();
    });

    it('fetches job with FAILED status', async () => {
      const mockJob: Job = {
        id: mockJobId,
        userId: 'user-123',
        organizationId: 'org-456',
        type: 'TITLE_GENERATION',
        status: 'FAILED',
        input: {
          dates: ['2024-01-01'],
        },
        error: 'Failed to generate titles: API error',
        startedAt: '2024-01-01T00:01:00Z',
        completedAt: '2024-01-01T00:02:00Z',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockJob },
      });

      const result = await JobsApi.getJobStatus(mockJobId);

      expect(result.status).toBe('FAILED');
      expect(result.error).toBeDefined();
    });

    it('handles response without nested data property', async () => {
      const mockJob: Job = {
        id: mockJobId,
        userId: 'user-123',
        organizationId: 'org-456',
        type: 'TITLE_GENERATION',
        status: 'PENDING',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: mockJob,
      });

      const result = await JobsApi.getJobStatus(mockJobId);

      expect(result).toEqual(mockJob);
    });

    it('handles job with null result', async () => {
      const mockJob: Job = {
        id: mockJobId,
        userId: 'user-123',
        organizationId: 'org-456',
        type: 'TITLE_GENERATION',
        status: 'PENDING',
        result: null,
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockJob },
      });

      const result = await JobsApi.getJobStatus(mockJobId);

      expect(result.result).toBeNull();
    });

    it('handles job with null error', async () => {
      const mockJob: Job = {
        id: mockJobId,
        userId: 'user-123',
        organizationId: 'org-456',
        type: 'TITLE_GENERATION',
        status: 'PENDING',
        error: null,
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockJob },
      });

      const result = await JobsApi.getJobStatus(mockJobId);

      expect(result.error).toBeNull();
    });

    it('handles job with complex input data', async () => {
      const mockJob: Job = {
        id: mockJobId,
        userId: 'user-123',
        organizationId: 'org-456',
        type: 'BLOG_GENERATION',
        status: 'PROCESSING',
        input: {
          blogOutlineId: 'outline-123',
          additionalInstructions: 'Use a friendly tone',
          metadata: {
            requestedBy: 'user-123',
            priority: 'high',
          },
        },
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockJob },
      });

      const result = await JobsApi.getJobStatus(mockJobId);

      expect(result.input).toEqual(mockJob.input);
    });

    it('throws error when job not found', async () => {
      const mockError = new Error('Job not found');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(JobsApi.getJobStatus(mockJobId)).rejects.toThrow('Job not found');
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Network error');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(JobsApi.getJobStatus(mockJobId)).rejects.toThrow('Network error');
    });
  });
});
