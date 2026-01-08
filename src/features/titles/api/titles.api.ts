import { apiClient } from "@/lib/api-client";
import type { Title } from '../types/title.types';

export const TitlesApi = {
  // get titles for an organization
  getTitles: async (organizationId: string): Promise<Title[]> => {
    const response = await apiClient.get(`/titles/${organizationId}`);
    return response.data?.data || response.data;
  },

  // post job to create titles
  createTitles: async (organizationId: string, dates: string[]): Promise<unknown> => {
    const response = await apiClient.post(`/jobs/title/`, { organizationId, dates });
    return response.data?.data || response.data;
  }
}
