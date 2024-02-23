import z from 'zod';

export const participantSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  email: z.string(),
});
export type Participant = z.infer<typeof participantSchema>;
