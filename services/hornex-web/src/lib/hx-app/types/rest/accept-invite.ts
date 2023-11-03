import z from 'zod';

export const acceptInviteRequestParams = z.object({ invite_id: z.string() });
export type AcceptInviteRequestParams = z.infer<
  typeof acceptInviteRequestParams
>;
