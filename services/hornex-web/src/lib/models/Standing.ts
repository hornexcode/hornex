import z from 'zod';

export const standingSchema = z.object({
  id: z.string().uuid(),
  tournament: z.string().uuid(),
  team: z.object({
    name: z.string(),
  }),
  score: z.number(),
  wins: z.number(),
  losses: z.number(),
});

export type Standing = z.infer<typeof standingSchema>;
