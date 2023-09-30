import z from 'zod';

// const routes: APIRouteMap = {} as APIRouteMap;
export const getAvailableGamesResponse = z.array(
  z.object({
    name: z.string(),
    slug: z.string(),
    platform: z.string(),
  })
);

export type GetAvailableGamesResponse = z.infer<
  typeof getAvailableGamesResponse
>;
