import { user } from './User';
import z from 'zod';

export const team = z.object({
  id: z.string(),
  name: z.string(),
  created_by: z.string(),
  game: z.string(),
  platform: z.string(),
  num_members: z.number(),
});
export type Team = z.infer<typeof team>;

export const teamInvite = z.object({
  id: z.string().uuid(),
  user: user,
  created_at: z.string(),
  updated_at: z.string(),
  accepted_at: z.string(),
  declined_at: z.string(),
  expired_at: z.string(),
  team: z.string().uuid(),
});
export type TeamInvite = z.infer<typeof teamInvite>;
