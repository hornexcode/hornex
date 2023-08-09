/**
 * Team service
 *
 * This file contains all responses type for the service
 * hx-core
 */

import z from 'zod';

/* Get /api/v1/auth/teams */

export const getTeamsSchemaOutput = z.object({
  teams: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      image: z.string(),
    })
  ),
});

export type GetTeamsOutput = z.infer<typeof getTeamsSchemaOutput>;

/* -- */
