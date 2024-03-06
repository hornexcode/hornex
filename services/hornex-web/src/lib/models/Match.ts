import { teamSchema } from './Team';
import z from 'zod';

export const matchSchema = z.object({
  id: z.string().uuid(),
  team_a: teamSchema,
  team_b: teamSchema,
  team_a_score: z.number(),
  team_b_score: z.number(),
  round: z.number(),
  status: z.enum(['not_started', 'underway', 'ended', 'cancelled']),
  winner: teamSchema.nullable(),
  finished_at: z.date().nullable(),
});

export type Match = z.infer<typeof matchSchema>;

export const getStatus = (match: Match) => {
  switch (match.status) {
    case 'not_started':
      return 'Not Started';
    case 'underway':
      return 'Underway';
    case 'ended':
      return 'Finished';
    case 'cancelled':
      return 'Cancelled';
  }
};
