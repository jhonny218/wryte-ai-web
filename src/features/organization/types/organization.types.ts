import { z } from 'zod';

// Organization member schema
export const organizationMemberSchema = z.object({
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER']),
});

// Content settings schema
export const contentSettingsSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  primaryKeywords: z.array(z.string()).min(1).max(10),
  secondaryKeywords: z.array(z.string()).max(20),
  frequency: z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY']).nullable().optional(),
  planningPeriod: z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']).nullable().optional(),
  tone: z.enum(['professional', 'casual', 'friendly', 'formal', 'witty', 'educational']).nullable().optional(),
  targetAudience: z.string().max(200).nullable().optional(),
  industry: z.string().max(100).nullable().optional(),
  goals: z.array(z.string()).max(10),
  competitorUrls: z.array(z.string().url()).max(10),
  topicsToAvoid: z.array(z.string()).max(20),
  preferredLength: z.enum(['SHORT_FORM', 'MEDIUM_FORM', 'LONG_FORM']).nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Organization schema
export const organizationSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  slug: z.string(),
  mission: z.string().max(1000),
  description: z.string().max(2000).nullable().optional(),
  websiteUrl: z.string().url().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER']).optional(), // User's role in this org
  members: z.array(organizationMemberSchema).optional(),
  contentSettings: contentSettingsSchema.optional(),
});

// User organizations response schema
export const userOrganizationsSchema = z.object({
  hasOrganizations: z.boolean(),
  organizations: z.array(organizationSchema),
  primaryOrganization: organizationSchema.nullable(),
});

// Type exports
export type Organization = z.infer<typeof organizationSchema>;
export type ContentSettings = z.infer<typeof contentSettingsSchema>;
export type OrganizationMember = z.infer<typeof organizationMemberSchema>;
export type UserOrganizationsData = z.infer<typeof userOrganizationsSchema>;
