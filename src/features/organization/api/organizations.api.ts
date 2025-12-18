import { apiClient } from "@/lib/api-client";
import type { Organization, UserOrganizationsData } from "../types/organization.types";

// - `GET /api/v1/organizations` - Get all user's organizations
// - `POST /api/v1/organizations` - Create organization (with optional settings)
// - `GET /api/v1/organizations/:orgId` - Get organization by ID
// - `GET /api/v1/organizations/slug/:slug` - Get organization by slug
// - `PUT /api/v1/organizations/:orgId` - Update organization

export const organizationsApi = {
  // Get all organizations for current user
  getUserOrganizations: async (): Promise<UserOrganizationsData> => {
    const response = await apiClient.get("/users/me/organizations");
    const data = response.data?.data || response.data;
    return data;
  },

  // Get first organization (primary org)
  getPrimaryOrganization: async (): Promise<Organization | null> => {
    const response = await apiClient.get("/users/me/organizations");
    const data = response.data?.data || response.data;
    return data.primaryOrganization || null;
  },

  // Get organization by ID
  getOrganizationById: async (orgId: string): Promise<Organization> => {
    const response = await apiClient.get(`/organizations/${orgId}`);
    return response.data?.data || response.data;
  },

  // Get organization by slug (for settings page)
  getOrganizationBySlug: async (slug: string): Promise<Organization> => {
    const response = await apiClient.get(`/organizations/slug/${slug}`);
    return response.data?.data || response.data;
  },

  // Update organization
  updateOrganization: async (orgId: string, data: Partial<Organization>): Promise<Organization> => {
    const response = await apiClient.put(`/organizations/${orgId}`, data);
    return response.data?.data || response.data;
  },
}