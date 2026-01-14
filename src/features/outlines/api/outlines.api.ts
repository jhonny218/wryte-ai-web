import { apiClient } from "@/lib/api-client";
import type { Outline } from "@/features/outlines/types/outline.types";

export const OutlinesApi = {
  // get outlines for an organization
  getOutlines: async (organizationId: string): Promise<Outline[]> => {
    const response = await apiClient.get<{ success: boolean; status: number; data: Outline[] }>(
      `/outlines/${organizationId}`
    );
    return response.data.data;
  },

  // post job to create outlines
  createOutlines: async (
    organizationId: string,
    blogTitleId: string
  ): Promise<{ jobId: string }> => {
    const response = await apiClient.post<{ id?: string; jobId?: string; data?: { id?: string; jobId?: string } }>(
      `/jobs/outline/`,
      { organizationId, blogTitleId }
    );
    
    // Handle different response formats
    const data = response.data;
    
    // If response has jobId directly
    if (data.jobId) {
      return { jobId: data.jobId };
    }
    
    // If response is wrapped in data property
    if (data.data?.jobId) {
      return { jobId: data.data.jobId };
    }
    
    // If response has id (the job object itself)
    if (data.id) {
      return { jobId: data.id };
    }
    
    // If response is wrapped and has id
    if (data.data?.id) {
      return { jobId: data.data.id };
    }
    
    console.error('Unexpected response format:', data);
    throw new Error('Could not extract job ID from response');
  },

  // put to update outline
  updateOutline: async (
    organizationId: string,
    outlineId: string,
    data: Partial<Outline>
  ): Promise<Outline> => {
    const response = await apiClient.put<Outline>(
      `/outlines/${organizationId}/${outlineId}`,
      data
    );
    return response.data;
  },

  // delete outline
  deleteOutline: async (
    organizationId: string,
    outlineId: string
  ): Promise<void> => {
    await apiClient.delete(`/outlines/${organizationId}/${outlineId}`);
  },
};
