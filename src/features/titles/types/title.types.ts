import { z } from 'zod';

// Title status enum
export const TitleStatus = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'DRAFT']);

// Title schema
export const titleSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  title: z.string(),
  status: TitleStatus,
  scheduledDate: z.string().nullable().optional(),
  aiGenerationContext: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  outline: z.any().nullable().optional(),
});

// TypeScript types
export type Title = z.infer<typeof titleSchema>;
export type TitleStatusType = z.infer<typeof TitleStatus>;
