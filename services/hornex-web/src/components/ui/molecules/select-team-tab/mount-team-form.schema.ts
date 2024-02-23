import { z } from 'zod';

export const mountTeamFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Team name must be at least 2 characters.',
  }),
  member_1_email: z.string().email(),
  member_2_email: z.string().email(),
  member_3_email: z.string().email(),
  member_4_email: z.string().email(),
});
