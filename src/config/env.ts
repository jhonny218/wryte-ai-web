import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_CLERK_PUBLISHABLE_KEY: z.string(),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

// Vite exposes env vars as import.meta.env
export const env = envSchema.parse(import.meta.env);
