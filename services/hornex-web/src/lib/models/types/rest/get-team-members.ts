import { teamMember } from './entities';
import z from 'zod';

export const getTeamMembers = z.array(teamMember);
export type GetTeamMembersResponse = z.infer<typeof getTeamMembers>;
