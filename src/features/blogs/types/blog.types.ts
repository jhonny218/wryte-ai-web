import { z } from "zod";

// Blog status enum
export const BlogStatus = z.enum([
  "DRAFT",
  "PUBLISHED",
  "SCHEDULED",
  "ARCHIVED",
]);

export const BlogSchema = z.object({
  id: z.string(),
  blogOutlineId: z.string(),
  content: z.string(),
  htmlContent: z.string(),
  wordCount: z.number(),
  status: BlogStatus,
  publishedAt: z.string().nullable().optional(),
  exportedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  // optional relation for client-side convenience
  outline: z.object({
    id: z.string(),
    blogTitle: z.object({
      id: z.string(),
      title: z.string(),
    }).optional(),
  }).optional(),
});

// TypeScript types
export type BlogStatusType = z.infer<typeof BlogStatus>;
export type Blog = z.infer<typeof BlogSchema>;
