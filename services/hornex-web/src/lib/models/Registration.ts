import { teamSchema } from './Team';
import { tournamentSchema } from './Tournament';
import z from 'zod';

export const registration = z.object({
  id: z.string().uuid(),
  status: z.string(),
  game_slug: z.string(),
  platform_slug: z.string(),
  tournament: tournamentSchema,
  team: teamSchema,
  created_at: z.date(),
  updated_at: z.date(),
});
export type Registration = z.infer<typeof registration>;
