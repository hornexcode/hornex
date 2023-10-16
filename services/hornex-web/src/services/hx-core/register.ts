/**
 * Register service
 *
 * This file contains all responses type for the service
 * hx-core
 */

import z from 'zod';

/* POST /api/v1/auth/register */
export const registerSchemaInput = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  terms: z.boolean(),
});
export type RegisterInput = z.infer<typeof registerSchemaInput>;

export const registerSchemaOutput = z.object({
  access_token: z.string(),
});
export type RegisterOutput = z.infer<typeof registerSchemaOutput>;

/* -- */
