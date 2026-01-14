import { z } from "zod";

// Outline status enum
export const OutlineStatus = z.enum([
  "APPROVED",
  "PENDING",
  "REJECTED",
  "DRAFT",
]);

export const OutlineIntroductionSchema = z
  .object({
    summary: z.string().optional(),
    keyPoints: z.array(z.string()).optional(),
  })
  .optional();

export const OutlineSectionSchema = z.object({
  heading: z.string(),
  subheadings: z.array(z.string()).optional(),
  points: z.array(z.string()).optional(),
});

export const OutlineConclusionSchema = z
  .object({
    summary: z.string().optional(),
    cta: z.string().optional(),
  })
  .optional();

// Inner structure that contains the actual content
export const OutlineStructureSchema = z
  .object({
    introduction: OutlineIntroductionSchema,
    sections: z.array(OutlineSectionSchema).optional(),
    conclusion: OutlineConclusionSchema,
    suggestedImages: z.array(z.string()).optional(),
  })
  .catchall(z.unknown())
  .optional();

// Wrapper structure that the server returns
export const OutlineStructureWrapperSchema = z
  .object({
    title: z.string().optional(),
    structure: OutlineStructureSchema,
    seoKeywords: z.array(z.string()).optional(),
    metaDescription: z.string().optional(),
  })
  .catchall(z.unknown())
  .optional();

export const OutlineSchema = z.object({
  id: z.string(),
  blogTitleId: z.string(),
  structure: OutlineStructureWrapperSchema,
  seoKeywords: z.array(z.string()),
  metaDescription: z.string().nullable().optional(),
  suggestedImages: z.array(z.string()),
  status: OutlineStatus,
  createdAt: z.string(),
  updatedAt: z.string(),
  blogTitle: z.object({
    id: z.string(),
    title: z.string(),
  }).optional(),
  // optional relation id for client-side convenience
  fullBlogId: z.string().nullable().optional(),
});

// TypeScript types
export type OutlineStatusType = z.infer<typeof OutlineStatus>;
export type OutlineIntroduction = z.infer<typeof OutlineIntroductionSchema>;
export type OutlineSection = z.infer<typeof OutlineSectionSchema>;
export type OutlineConclusion = z.infer<typeof OutlineConclusionSchema>;
export type OutlineStructure = z.infer<typeof OutlineStructureSchema>;
export type OutlineStructureWrapper = z.infer<typeof OutlineStructureWrapperSchema>;
export type Outline = z.infer<typeof OutlineSchema>;