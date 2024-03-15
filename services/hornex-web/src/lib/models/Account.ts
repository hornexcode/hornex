import z from 'zod';

const gameIdSchema = z.object({
  id: z.string(),
  game: z.string(),
  nickname: z.string(),
  is_active: z.boolean(),
  metadata: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type GameId = z.infer<typeof gameIdSchema>;
