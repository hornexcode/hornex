import z from 'zod';

export const declineInviteRequestParams = z.object({ invite_id: z.string() });
export type DeclineInviteRequestParams = z.infer<
  typeof declineInviteRequestParams
>;
