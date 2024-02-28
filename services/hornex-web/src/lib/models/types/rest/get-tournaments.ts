import { tournamentSchema } from '../../Tournament';
import z from 'zod';

export const getTournaments = z.object({
  results: z.array(tournamentSchema),
  count: z.number(),
  previous: z.string().nullable(),
  next: z.string().nullable(),
});
export type GetTournamentsResponse = z.infer<typeof getTournaments>;
