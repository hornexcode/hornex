import { teamInvite } from './entities';
import z from 'zod';

export const getTeamInvites = z.array(teamInvite);
export type GetTeamInvitesResponse = z.infer<typeof getTeamInvites>;
