/**
 * Team service
 *
 * This file contains all responses type for the service
 * hx-core
 */

import z from 'zod';

/* Get /api/v1/auth/teams */

export const getTeamsSchemaOutput = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    created_by: z.string().uuid(),
    game_id: z.string().uuid()
  })
);

export type GetTeamsOutput = z.infer<typeof getTeamsSchemaOutput>;

/* -- */
