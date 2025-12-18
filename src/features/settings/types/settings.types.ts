import { z } from 'zod';

// Enums
export const ContentFrequency = z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY']);
export const PlanningPeriod = z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']);
export const ContentTone = z.enum(['professional', 'casual', 'friendly', 'formal', 'witty', 'educational']);
export const PreferredLength = z.enum(['SHORT_FORM', 'MEDIUM_FORM', 'LONG_FORM']);

// Content Settings Schema
export const contentSettingsSchema = z.object({
  id: z.string().optional(),
  organizationId: z.string(),
  primaryKeywords: z.array(z.string()).min(1, 'At least one primary keyword is required').max(10, 'Maximum 10 primary keywords'),
  secondaryKeywords: z.array(z.string()).max(20, 'Maximum 20 secondary keywords').optional().default([]),
  frequency: ContentFrequency.optional(),
  planningPeriod: PlanningPeriod.optional(),
  tone: ContentTone.optional(),
  targetAudience: z.string().max(200, 'Target audience must be 200 characters or less').optional(),
  industry: z.string().max(100, 'Industry must be 100 characters or less').optional(),
  goals: z.array(z.string()).max(10, 'Maximum 10 goals').optional().default([]),
  competitorUrls: z.array(z.string().url('Must be a valid URL')).max(10, 'Maximum 10 competitor URLs').optional().default([]),
  topicsToAvoid: z.array(z.string()).max(20, 'Maximum 20 topics to avoid').optional().default([]),
  preferredLength: PreferredLength.optional(),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

// Content Settings Form Schema (for updates - all fields optional except organizationId)
export const contentSettingsFormSchema = z.object({
  primaryKeywords: z.array(z.string()).min(1, 'At least one primary keyword is required').max(10, 'Maximum 10 primary keywords').optional(),
  secondaryKeywords: z.array(z.string()).max(20, 'Maximum 20 secondary keywords').optional(),
  frequency: ContentFrequency.optional(),
  planningPeriod: PlanningPeriod.optional(),
  tone: ContentTone.optional(),
  targetAudience: z.string().max(200, 'Target audience must be 200 characters or less').optional(),
  industry: z.string().max(100, 'Industry must be 100 characters or less').optional(),
  goals: z.array(z.string()).max(10, 'Maximum 10 goals').optional(),
  competitorUrls: z.array(z.string().url('Must be a valid URL')).max(10, 'Maximum 10 competitor URLs').optional(),
  topicsToAvoid: z.array(z.string()).max(20, 'Maximum 20 topics to avoid').optional(),
  preferredLength: PreferredLength.optional(),
});

// TypeScript Types
export type ContentSettings = z.infer<typeof contentSettingsSchema>;
export type ContentSettingsFormData = z.infer<typeof contentSettingsFormSchema>;
export type ContentFrequencyType = z.infer<typeof ContentFrequency>;
export type PlanningPeriodType = z.infer<typeof PlanningPeriod>;
export type ContentToneType = z.infer<typeof ContentTone>;
export type PreferredLengthType = z.infer<typeof PreferredLength>;
