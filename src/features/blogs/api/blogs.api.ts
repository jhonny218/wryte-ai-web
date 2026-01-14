import { apiClient } from "@/lib/api-client";
import type { Blog } from "../types/blog.types";

export const BlogsApi = {
  // get blogs for an organization
  getBlogs: async (organizationId: string): Promise<Blog[]> => {
    const response = await apiClient.get<{ success: boolean; status: number; data: Blog[] }>(
      `/blogs/${organizationId}`
    );
    return response.data.data;
  },

  // post job to create blog from outline
  createBlog: async (
    blogOutlineId: string,
    additionalInstructions?: string
  ): Promise<{ jobId: string }> => {
    const response = await apiClient.post<{ id?: string; jobId?: string; data?: { id?: string; jobId?: string } }>(
      `/jobs/blog/`,
      { blogOutlineId, additionalInstructions }
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

    console.error("Unexpected response format:", data);
    throw new Error("Could not extract job ID from response");
  },

  // put to update blog
  updateBlog: async (
    organizationId: string,
    blogId: string,
    data: Partial<Blog>
  ): Promise<Blog> => {
    const response = await apiClient.put<Blog>(
      `/blogs/${organizationId}/${blogId}`,
      data
    );
    return response.data;
  },

  // delete blog
  deleteBlog: async (
    organizationId: string,
    blogId: string
  ): Promise<void> => {
    await apiClient.delete(`/blogs/${organizationId}/${blogId}`);
  }
};
