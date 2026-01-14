import { z } from 'zod';

// Job status enum
export const JobStatus = z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']);
export type JobStatusType = z.infer<typeof JobStatus>;

// Job schema - matches API response
export const JobSchema = z.object({
  id: z.string(),
  userId: z.string(),
  organizationId: z.string(),
  type: z.string(),
  status: JobStatus,
  input: z.record(z.string(), z.unknown()).optional(),
  result: z.unknown().optional().nullable(),
  error: z.string().optional().nullable(),
  createdAt: z.string(),
  startedAt: z.string().optional().nullable(),
  completedAt: z.string().optional().nullable(),
});

export type Job = z.infer<typeof JobSchema>;

// CreateTitlesJob response
export const CreateTitlesJobResponseSchema = z.object({
  jobId: z.string(),
  status: JobStatus,
});

export type CreateTitlesJobResponse = z.infer<typeof CreateTitlesJobResponseSchema>;
