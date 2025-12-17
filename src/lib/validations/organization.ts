import { z } from 'zod';

// Step 1: Organization Info Schema
export const organizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required').max(100, 'Name is too long'),
  mission: z.string().min(1, 'Mission statement is required').max(500, 'Mission is too long'),
  description: z.string().max(1000, 'Description is too long').optional().or(z.literal('')),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

// Step 2: Content Settings Schema
export const contentSettingsSchema = z.object({
  // Strategy
  primaryKeywords: z
    .array(z.string())
    .min(1, 'At least one keyword is required')
    .max(10, 'Maximum 10 keywords allowed'),
  secondaryKeywords: z.array(z.string()).max(20, 'Maximum 20 keywords allowed'),
  frequency: z.string().optional().or(z.literal('')),
  planningPeriod: z.string().optional().or(z.literal('')),

  // Style & Audience
  tone: z.string().optional().or(z.literal('')),
  targetAudience: z.string().max(200, 'Target audience is too long').optional().or(z.literal('')),
  industry: z.string().max(100, 'Industry is too long').optional().or(z.literal('')),
  goals: z.array(z.string()).max(10, 'Maximum 10 goals allowed'),
  competitorUrls: z
    .array(z.url('Must be a valid URL'))
    .max(10, 'Maximum 10 competitor URLs allowed'),
  topicsToAvoid: z.array(z.string()).max(20, 'Maximum 20 topics allowed'),
  preferredLength: z.string().optional().or(z.literal('')),
});

// Combined schema for the full form (flattened for form handling)
export const onboardingSchema = z.object({
  name: organizationSchema.shape.name,
  mission: organizationSchema.shape.mission,
  description: organizationSchema.shape.description,
  websiteUrl: organizationSchema.shape.websiteUrl,
  primaryKeywords: contentSettingsSchema.shape.primaryKeywords,
  secondaryKeywords: contentSettingsSchema.shape.secondaryKeywords,
  frequency: contentSettingsSchema.shape.frequency,
  planningPeriod: contentSettingsSchema.shape.planningPeriod,
  tone: contentSettingsSchema.shape.tone,
  targetAudience: contentSettingsSchema.shape.targetAudience,
  industry: contentSettingsSchema.shape.industry,
  goals: contentSettingsSchema.shape.goals,
  competitorUrls: contentSettingsSchema.shape.competitorUrls,
  topicsToAvoid: contentSettingsSchema.shape.topicsToAvoid,
  preferredLength: contentSettingsSchema.shape.preferredLength,
});

// API payload schema (nested structure)
export const createOrganizationSchema = z.object({
  name: organizationSchema.shape.name,
  mission: organizationSchema.shape.mission,
  description: organizationSchema.shape.description,
  websiteUrl: organizationSchema.shape.websiteUrl,
  contentSettings: contentSettingsSchema,
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;
export type ContentSettingsFormData = z.infer<typeof contentSettingsSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type CreateOrganizationData = z.infer<typeof createOrganizationSchema>;
