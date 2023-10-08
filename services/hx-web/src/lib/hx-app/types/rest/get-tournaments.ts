import { tournament } from './entities';
import z from 'zod';

export const getTournaments = z.object({
  results: z.array(tournament),
  count: z.number(),
  previous: z.string().nullable(),
  next: z.string().nullable(),
});
export type GetTournamentsResponse = z.infer<typeof getTournaments>;
