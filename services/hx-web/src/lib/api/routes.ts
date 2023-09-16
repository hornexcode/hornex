import { Method } from '../routes/routes';
import z from 'zod';
// const routes: APIRouteMap = {} as APIRouteMap;

export const routes = {
  login: {
    path: 'v1/auth/login',
    method: Method.POST,
  },
  register: {
    path: 'v1/auth/register',
    method: Method.POST,
  },
  logout: {
    path: 'v1/auth/logout',
    method: Method.POST,
  },
  currentUser: {
    path: 'v1/users/current',
    method: Method.GET,
  },
  createTeam: {
    path: 'v1/teams',
    method: Method.POST,
  },
  findTeam: {
    path: 'v1/teams',
    method: Method.GET,
  },
  getTeams: {
    path: 'v1/teams',
    method: Method.GET,
  },
  updateTeam: {
    path: 'v1/teams',
    method: Method.PATCH,
  },
  getEmailConfirmationCode: {
    path: 'v1/auth/register-confirm',
    method: Method.GET,
  },
  confirmRegister: {
    path: 'v1/auth/register-confirm',
    method: Method.POST,
  },
  getGames: {
    path: 'v1/games',
    method: Method.GET,
  },
};
