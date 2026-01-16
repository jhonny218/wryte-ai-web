import { describe, it, expect, vi, beforeEach } from 'vitest';
import { organizationsApi } from './organizations.api';
import { apiClient } from '@/lib/api-client';
import type { Organization, UserOrganizationsData } from '../types/organization.types';

// Mock the api client
vi.mock('@/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe('organizationsApi', () => {
  const mockOrganizationId = 'org-123';
  const mockSlug = 'test-org';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserOrganizations', () => {
    it('fetches all user organizations', async () => {
      const mockData: UserOrganizationsData = {
        primaryOrganization: {
          id: 'org-1',
          name: 'Primary Org',
          slug: 'primary-org',
          userId: 'user-123',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        otherOrganizations: [
          {
            id: 'org-2',
            name: 'Other Org',
            slug: 'other-org',
            userId: 'user-123',
            createdAt: '2024-01-02T00:00:00Z',
            updatedAt: '2024-01-02T00:00:00Z',
          },
        ],
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockData },
      });

      const result = await organizationsApi.getUserOrganizations();

      expect(apiClient.get).toHaveBeenCalledWith('/users/me/organizations');
      expect(result).toEqual(mockData);
    });

    it('handles response without nested data property', async () => {
      const mockData: UserOrganizationsData = {
        primaryOrganization: {
          id: 'org-1',
          name: 'Primary Org',
          slug: 'primary-org',
          userId: 'user-123',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        otherOrganizations: [],
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: mockData,
      });

      const result = await organizationsApi.getUserOrganizations();

      expect(result).toEqual(mockData);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Network error');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(organizationsApi.getUserOrganizations()).rejects.toThrow('Network error');
    });
  });

  describe('getPrimaryOrganization', () => {
    it('fetches the primary organization', async () => {
      const mockPrimaryOrg: Organization = {
        id: 'org-1',
        name: 'Primary Org',
        slug: 'primary-org',
        userId: 'user-123',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const mockData: UserOrganizationsData = {
        primaryOrganization: mockPrimaryOrg,
        otherOrganizations: [],
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockData },
      });

      const result = await organizationsApi.getPrimaryOrganization();

      expect(apiClient.get).toHaveBeenCalledWith('/users/me/organizations');
      expect(result).toEqual(mockPrimaryOrg);
    });

    it('returns null when primary organization is not present', async () => {
      const mockData: UserOrganizationsData = {
        primaryOrganization: null,
        otherOrganizations: [],
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockData },
      });

      const result = await organizationsApi.getPrimaryOrganization();

      expect(result).toBeNull();
    });

    it('handles response without nested data property', async () => {
      const mockPrimaryOrg: Organization = {
        id: 'org-1',
        name: 'Primary Org',
        slug: 'primary-org',
        userId: 'user-123',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const mockData: UserOrganizationsData = {
        primaryOrganization: mockPrimaryOrg,
        otherOrganizations: [],
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: mockData,
      });

      const result = await organizationsApi.getPrimaryOrganization();

      expect(result).toEqual(mockPrimaryOrg);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Network error');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(organizationsApi.getPrimaryOrganization()).rejects.toThrow('Network error');
    });
  });

  describe('getOrganizationById', () => {
    it('fetches organization by ID', async () => {
      const mockOrganization: Organization = {
        id: mockOrganizationId,
        name: 'Test Organization',
        slug: 'test-org',
        userId: 'user-123',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockOrganization },
      });

      const result = await organizationsApi.getOrganizationById(mockOrganizationId);

      expect(apiClient.get).toHaveBeenCalledWith(`/organizations/${mockOrganizationId}`);
      expect(result).toEqual(mockOrganization);
    });

    it('handles response without nested data property', async () => {
      const mockOrganization: Organization = {
        id: mockOrganizationId,
        name: 'Test Organization',
        slug: 'test-org',
        userId: 'user-123',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: mockOrganization,
      });

      const result = await organizationsApi.getOrganizationById(mockOrganizationId);

      expect(result).toEqual(mockOrganization);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Organization not found');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(organizationsApi.getOrganizationById(mockOrganizationId)).rejects.toThrow(
        'Organization not found'
      );
    });
  });

  describe('getOrganizationBySlug', () => {
    it('fetches organization by slug', async () => {
      const mockOrganization: Organization = {
        id: mockOrganizationId,
        name: 'Test Organization',
        slug: mockSlug,
        userId: 'user-123',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockOrganization },
      });

      const result = await organizationsApi.getOrganizationBySlug(mockSlug);

      expect(apiClient.get).toHaveBeenCalledWith(`/organizations/slug/${mockSlug}`);
      expect(result).toEqual(mockOrganization);
    });

    it('handles response without nested data property', async () => {
      const mockOrganization: Organization = {
        id: mockOrganizationId,
        name: 'Test Organization',
        slug: mockSlug,
        userId: 'user-123',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: mockOrganization,
      });

      const result = await organizationsApi.getOrganizationBySlug(mockSlug);

      expect(result).toEqual(mockOrganization);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Organization not found');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(organizationsApi.getOrganizationBySlug(mockSlug)).rejects.toThrow(
        'Organization not found'
      );
    });
  });

  describe('updateOrganization', () => {
    it('updates organization with partial data', async () => {
      const updates: Partial<Organization> = {
        name: 'Updated Organization Name',
      };

      const mockUpdatedOrganization: Organization = {
        id: mockOrganizationId,
        name: updates.name!,
        slug: mockSlug,
        userId: 'user-123',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue({
        data: { data: mockUpdatedOrganization },
      });

      const result = await organizationsApi.updateOrganization(mockOrganizationId, updates);

      expect(apiClient.put).toHaveBeenCalledWith(`/organizations/${mockOrganizationId}`, updates);
      expect(result).toEqual(mockUpdatedOrganization);
    });

    it('updates multiple organization fields', async () => {
      const updates: Partial<Organization> = {
        name: 'New Name',
        slug: 'new-slug',
      };

      const mockUpdatedOrganization: Organization = {
        id: mockOrganizationId,
        name: updates.name!,
        slug: updates.slug!,
        userId: 'user-123',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue({
        data: { data: mockUpdatedOrganization },
      });

      const result = await organizationsApi.updateOrganization(mockOrganizationId, updates);

      expect(result.name).toBe(updates.name);
      expect(result.slug).toBe(updates.slug);
    });

    it('handles response without nested data property', async () => {
      const updates: Partial<Organization> = {
        name: 'Updated Name',
      };

      const mockUpdatedOrganization: Organization = {
        id: mockOrganizationId,
        name: updates.name!,
        slug: mockSlug,
        userId: 'user-123',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue({
        data: mockUpdatedOrganization,
      });

      const result = await organizationsApi.updateOrganization(mockOrganizationId, updates);

      expect(result).toEqual(mockUpdatedOrganization);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('Failed to update organization');
      vi.mocked(apiClient.put).mockRejectedValue(mockError);

      await expect(
        organizationsApi.updateOrganization(mockOrganizationId, { name: 'New Name' })
      ).rejects.toThrow('Failed to update organization');
    });
  });
});
