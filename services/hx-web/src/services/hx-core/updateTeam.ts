/**
 * Update team service
 *
 * This file contains all responses type for the service
 * hx-core
 */

import z from 'zod';

/* PATCH /api/v1/teams */
export const updateTeamSchemaInput = z.object({
  name: z.string().min(2, { message: 'Minimum 2 characters for team name' }),
});
export type UpdateTeamInput = z.infer<typeof updateTeamSchemaInput>;

export const updateTeamSchemaOutput = z.object({
  name: z.string(),
});
export type UpdateTeamOutput = z.infer<typeof updateTeamSchemaOutput>;

/* -- */
