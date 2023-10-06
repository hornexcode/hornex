import { game } from './entities';
import z from 'zod';

// const routes: APIRouteMap = {} as APIRouteMap;

export const getAvailableGamesResponse = z.array(game);
export type GetAvailableGamesResponse = z.infer<
  typeof getAvailableGamesResponse
>;
