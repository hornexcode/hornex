import z from 'zod';

// const routes: APIRouteMap = {} as APIRouteMap;
export const game = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  platforms: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
    })
  ),
});
export type Game = z.infer<typeof game>;

export const getAvailableGamesResponse = z.array(game);
export type GetAvailableGamesResponse = z.infer<
  typeof getAvailableGamesResponse
>;
