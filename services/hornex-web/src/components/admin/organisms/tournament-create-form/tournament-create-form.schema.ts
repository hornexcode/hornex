import { z } from 'zod';

export const createFormSchema = z.object({
  game: z.enum(['league-of-legends']),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  registration_start_date: z.date(),
  // check_in_duration: z.number(), disabled for now
  start_date: z.date(),
  start_time: z.string(),
  feature_image: z.string().optional(),
  is_entry_free: z.boolean(),
  entry_fee: z.number().optional(),
  prize_pool_enabled: z.boolean().default(false),
  open_classification: z.boolean(),
  size: z.string(),
  team_size: z.string(),
  // map: z.string().default('summoners-rift'),
  prizes: z
    .array(
      z.object({
        place: z.number(),
        content: z.string().optional(),
      })
    )
    .optional(),
  terms: z.boolean(),
});
