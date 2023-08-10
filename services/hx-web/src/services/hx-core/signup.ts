/**
 * Signup service
 *
 * This file contains all responses type for the service
 * hx-core
 */

import z from 'zod';

/* POST /api/v1/auth/signup */
export const signupSchemaInput = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  terms: z.boolean(),
});
export type SignupInput = z.infer<typeof signupSchemaInput>;

export const signupSchemaOutput = z.object({
  access_token: z.string(),
});
export type SignupOutput = z.infer<typeof signupSchemaOutput>;

/* -- */
