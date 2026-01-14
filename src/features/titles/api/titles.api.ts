import { apiClient } from "@/lib/api-client";
import type { Title } from '../types/title.types';
import type { CreateTitlesJobResponse } from '../../jobs/types/job.types';

export const TitlesApi = {
  // get titles for an organization
  getTitles: async (organizationId: string): Promise<Title[]> => {
    const response = await apiClient.get(`/titles/${organizationId}`);
    return response.data?.data || response.data;
  },

  // get titles for a specific month
  getCalendarTitles: async (organizationId: string, year: number, month: number): Promise<Title[]> => {
    const paddedMonth = String(month).padStart(2, '0');
    const response = await apiClient.get(`/calendar`, {
      params: {
        orgId: organizationId,
        year: year.toString(),
        month: paddedMonth
      }
    });
    return response.data?.data || response.data;
  },

  // post job to create titles
  createTitles: async (organizationId: string, dates: string[]): Promise<CreateTitlesJobResponse> => {
    const response = await apiClient.post(`/jobs/title/`, { organizationId, dates });
    return response.data?.data || response.data;
  },

  // put to update title
  updateTitle: async (
    organizationId: string,
    titleId: string,
    updates: Partial<Pick<Title, 'title' | 'status' | 'scheduledDate'>>
  ): Promise<Title> => {
    const response = await apiClient.put(`/titles/${organizationId}/${titleId}`, updates);
    return response.data?.data || response.data;
  },

  // delete title
  deleteTitle: async (
    organizationId: string,
    titleId: string
  ): Promise<void> => {
    await apiClient.delete(`/titles/${organizationId}/${titleId}`);
  }
}
