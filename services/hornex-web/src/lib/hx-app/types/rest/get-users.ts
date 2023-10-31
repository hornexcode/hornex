import { user } from './entities';
import z from 'zod';

export const getUsers = z.array(user);
export type GetUsersResponse = z.infer<typeof getUsers>;
