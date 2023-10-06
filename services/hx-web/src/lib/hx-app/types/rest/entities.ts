import z from 'zod';

export const game = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  platforms: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
    })
  ),
});
export type Game = z.infer<typeof game>;

export const lolTournament = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  is_public: z.boolean(),
  status: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  is_entry_free: z.boolean(),
  is_prize_pool_fixed: z.boolean(),
  prize_pool: z.number(),
  entry_fee: z.number(),
  max_teams: z.number(),
  team_size: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  organizer: z.string(),
  game: z.string(),
  platform: z.string(),
  teams: z.array(z.string()),
  tier: z.string(),
});
export type LOLTournament = z.infer<typeof lolTournament>;
