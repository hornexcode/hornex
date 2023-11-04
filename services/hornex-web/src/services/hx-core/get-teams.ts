/**
 * Team service
 *
 * This file contains all responses type for the service
 * hx-core
 */

import z from 'zod';

/* Get /api/v1/teams */

export const getTeamsSchemaOutput = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    platform: z.string(),
    game: z.string(),
    num_members: z.number(),
    created_by: z.string().uuid(),
  })
);

export type GetTeamsOutput = z.infer<typeof getTeamsSchemaOutput>;

export const getTeamSchemaOutput = z.object({
  id: z.string(),
  name: z.string(),
  platform: z.string(),
  game: z.string(),
  num_members: z.number(),
  created_by: z.string().uuid(),
});

export type GetTeamOutput = z.infer<typeof getTeamSchemaOutput>;

/* -- */
