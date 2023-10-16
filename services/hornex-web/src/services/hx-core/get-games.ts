/**
 * Game service
 *
 * This file contains all responses type for the service
 * hx-core
 */

import z from 'zod';

/* Get /api/v1/auth/games */

export const getGamesSchemaOutput = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }),
);

export type GetGamesOutput = z.infer<typeof getGamesSchemaOutput>;

/* -- */
