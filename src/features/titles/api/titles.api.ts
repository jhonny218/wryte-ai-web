import { apiClient } from "@/lib/api-client";
import type { Title } from '../types/title.types';
import type { CreateTitlesJobResponse, Job } from '../types/job.types';

export const TitlesApi = {
  // get titles for an organization
  getTitles: async (organizationId: string): Promise<Title[]> => {
    const response = await apiClient.get(`/titles/${organizationId}`);
    return response.data?.data || response.data;
  },

  // post job to create titles
  createTitles: async (organizationId: string, dates: string[]): Promise<CreateTitlesJobResponse> => {
    const response = await apiClient.post(`/jobs/title/`, { organizationId, dates });
    return response.data?.data || response.data;
  },

  // get job status
  getJobStatus: async (jobId: string): Promise<Job> => {
    const response = await apiClient.get(`/jobs/${jobId}`);
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

  deleteTitle: async (
    organizationId: string,
    titleId: string
  ): Promise<void> => {
    await apiClient.delete(`/titles/${organizationId}/${titleId}`);
  }
}
