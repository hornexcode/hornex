import { z } from 'zod';

export const teamSchema = z.object({
  id: z.string(),
  name: z.string(),
  platform: z.string(),
  game: z.string(),
  num_members: z.number(),
  created_by: z.string().uuid(),
});
export type Team = z.infer<typeof teamSchema>;
