import { apiClient } from "@/lib/api-client";
import type { ContentSettings } from "../types/settings.types";

// - `GET /api/v1/settings/:organizationId` - Get content settings
// - `PUT /api/v1/settings/:organizationId` - Update/create content settings

export const settingsApi = {
  // Get content settings for an organization
  getContentSettings: async (organizationId: string): Promise<ContentSettings> => {
    const response = await apiClient.get(`/settings/${organizationId}`);
    return response.data?.data || response.data;
  },

  // Update/create content settings for an organization
  updateContentSettings: async (organizationId: string, data: Partial<ContentSettings>): Promise<ContentSettings> => {
    const response = await apiClient.put(`/settings/${organizationId}`, data);
    return response.data?.data || response.data;
  },
}