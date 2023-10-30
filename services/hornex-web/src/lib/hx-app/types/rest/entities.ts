import z from 'zod';

export const user = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});
export type User = z.infer<typeof user>;

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

export const tournament = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  is_public: z.boolean(),
  status: z.string(),
  start_date: z.string(),
  end_date: z.string(),
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
  classification: z.string(),
  feature_image: z.string(),
});
export type Tournament = z.infer<typeof tournament>;

export const teamMember = z.object({
  id: z.string().uuid(),
  is_admin: z.boolean(),
  joined_at: z.string(),
  team: z.string().uuid(),
  user,
});
export type TeamMember = z.infer<typeof teamMember>;
