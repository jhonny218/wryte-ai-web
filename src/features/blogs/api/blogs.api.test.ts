import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BlogsApi } from './blogs.api';
import { apiClient } from '@/lib/api-client';
import type { Blog } from '../types/blog.types';

// Mock the api client
vi.mock('@/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('BlogsApi', () => {
  const mockOrganizationId = 'org-123';
  const mockBlogId = 'blog-456';

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear console.error mock
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('getBlogs', () => {
    it('fetches blogs for an organization', async () => {
      const mockBlogs: Blog[] = [
        {
          id: 'blog-1',
          organizationId: mockOrganizationId,
          outlineId: 'outline-1',
          title: 'Test Blog 1',
          content: 'Blog content 1',
          htmlContent: '<p>Blog content 1</p>',
          status: 'DRAFT',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'blog-2',
          organizationId: mockOrganizationId,
          outlineId: 'outline-2',
          title: 'Test Blog 2',
          content: 'Blog content 2',
          htmlContent: '<p>Blog content 2</p>',
          status: 'PUBLISHED',
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({
        data: {
          success: true,
          status: 200,
          data: mockBlogs,
        },
      });

      const result = await BlogsApi.getBlogs(mockOrganizationId);

      expect(apiClient.get).toHaveBeenCalledWith(`/blogs/${mockOrganizationId}`);
      expect(result).toEqual(mockBlogs);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Network error');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(BlogsApi.getBlogs(mockOrganizationId)).rejects.toThrow('Network error');
    });
  });

  describe('createBlog', () => {
    const mockOutlineId = 'outline-123';

    it('creates a blog job and returns jobId from direct jobId property', async () => {
      const mockResponse = {
        jobId: 'job-123',
      };

      vi.mocked(apiClient.post).mockResolvedValue({
        data: mockResponse,
      });

      const result = await BlogsApi.createBlog(mockOutlineId);

      expect(apiClient.post).toHaveBeenCalledWith('/jobs/blog/', {
        blogOutlineId: mockOutlineId,
        additionalInstructions: undefined,
      });
      expect(result).toEqual({ jobId: 'job-123' });
    });

    it('creates a blog job with additional instructions', async () => {
      const mockResponse = {
        jobId: 'job-456',
      };
      const additionalInstructions = 'Use a friendly tone';

      vi.mocked(apiClient.post).mockResolvedValue({
        data: mockResponse,
      });

      const result = await BlogsApi.createBlog(mockOutlineId, additionalInstructions);

      expect(apiClient.post).toHaveBeenCalledWith('/jobs/blog/', {
        blogOutlineId: mockOutlineId,
        additionalInstructions,
      });
      expect(result).toEqual({ jobId: 'job-456' });
    });

    it('extracts jobId from nested data.jobId', async () => {
      const mockResponse = {
        data: {
          jobId: 'job-789',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue({
        data: mockResponse,
      });

      const result = await BlogsApi.createBlog(mockOutlineId);

      expect(result).toEqual({ jobId: 'job-789' });
    });

    it('extracts jobId from id property', async () => {
      const mockResponse = {
        id: 'job-abc',
      };

      vi.mocked(apiClient.post).mockResolvedValue({
        data: mockResponse,
      });

      const result = await BlogsApi.createBlog(mockOutlineId);

      expect(result).toEqual({ jobId: 'job-abc' });
    });

    it('extracts jobId from nested data.id', async () => {
      const mockResponse = {
        data: {
          id: 'job-def',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue({
        data: mockResponse,
      });

      const result = await BlogsApi.createBlog(mockOutlineId);

      expect(result).toEqual({ jobId: 'job-def' });
    });

    it('throws error when jobId cannot be extracted', async () => {
      const mockResponse = {
        unexpected: 'format',
      };

      vi.mocked(apiClient.post).mockResolvedValue({
        data: mockResponse,
      });

      await expect(BlogsApi.createBlog(mockOutlineId)).rejects.toThrow(
        'Could not extract job ID from response'
      );
      expect(console.error).toHaveBeenCalledWith('Unexpected response format:', mockResponse);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Failed to create blog job');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(BlogsApi.createBlog(mockOutlineId)).rejects.toThrow('Failed to create blog job');
    });
  });

  describe('updateBlog', () => {
    it('updates a blog with partial data', async () => {
      const updates: Partial<Blog> = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      const mockUpdatedBlog: Blog = {
        id: mockBlogId,
        organizationId: mockOrganizationId,
        outlineId: 'outline-1',
        title: updates.title!,
        content: updates.content!,
        htmlContent: '<p>Updated content</p>',
        status: 'DRAFT',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue({
        data: mockUpdatedBlog,
      });

      const result = await BlogsApi.updateBlog(mockOrganizationId, mockBlogId, updates);

      expect(apiClient.put).toHaveBeenCalledWith(
        `/blogs/${mockOrganizationId}/${mockBlogId}`,
        updates
      );
      expect(result).toEqual(mockUpdatedBlog);
    });

    it('updates blog status', async () => {
      const updates: Partial<Blog> = {
        status: 'PUBLISHED',
      };

      const mockUpdatedBlog: Blog = {
        id: mockBlogId,
        organizationId: mockOrganizationId,
        outlineId: 'outline-1',
        title: 'Test Blog',
        content: 'Test content',
        htmlContent: '<p>Test content</p>',
        status: 'PUBLISHED',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue({
        data: mockUpdatedBlog,
      });

      const result = await BlogsApi.updateBlog(mockOrganizationId, mockBlogId, updates);

      expect(result.status).toBe('PUBLISHED');
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Failed to update blog');
      vi.mocked(apiClient.put).mockRejectedValue(mockError);

      await expect(
        BlogsApi.updateBlog(mockOrganizationId, mockBlogId, { title: 'New Title' })
      ).rejects.toThrow('Failed to update blog');
    });
  });

  describe('deleteBlog', () => {
    it('deletes a blog', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({ data: {} });

      await BlogsApi.deleteBlog(mockOrganizationId, mockBlogId);

      expect(apiClient.delete).toHaveBeenCalledWith(`/blogs/${mockOrganizationId}/${mockBlogId}`);
    });

    it('returns void on successful deletion', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({ data: {} });

      const result = await BlogsApi.deleteBlog(mockOrganizationId, mockBlogId);

      expect(result).toBeUndefined();
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Failed to delete blog');
      vi.mocked(apiClient.delete).mockRejectedValue(mockError);

      await expect(BlogsApi.deleteBlog(mockOrganizationId, mockBlogId)).rejects.toThrow(
        'Failed to delete blog'
      );
    });
  });
});
