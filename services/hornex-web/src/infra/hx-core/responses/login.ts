import { z } from 'zod';

// const loginResponseSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
// });

export type LoginResponse = {
  access: string;
  refresh: string;
};
