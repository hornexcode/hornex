import { z } from 'zod';

// const loginResponseSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
// });

export type LoginResponse = {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
};
