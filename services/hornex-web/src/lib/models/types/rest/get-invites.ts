import { invite } from './entities';
import z from 'zod';

export const getInvites = z.array(invite);
export type GetInvitesResponse = z.infer<typeof getInvites>;
