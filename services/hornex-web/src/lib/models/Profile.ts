import z from 'zod';

export const profileSchema = z.object({
  id: z.string().optional(),
  discord_widget_id: z.string().optional(),
  discord_invite_code: z.string().optional(),
  twitter_username: z.string().optional(),
  twitch_username: z.string().optional(),
});
export type Profile = z.infer<typeof profileSchema>;
