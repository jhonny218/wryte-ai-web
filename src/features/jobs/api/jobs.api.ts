import { apiClient } from "@/lib/api-client";
import type { Job } from "../types/job.types";

export const JobsApi = {
  // get job status
  getJobStatus: async (jobId: string): Promise<Job> => {
    const response = await apiClient.get(`/jobs/${jobId}`);
    return response.data?.data || response.data;
  },
};