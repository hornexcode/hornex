import z from 'zod';

export const prizeSchema = z.object({
  id: z.number(),
  place: z.number(),
  amount: z.number(),
  content: z.string(),
});
export type Prize = z.infer<typeof prizeSchema>;
