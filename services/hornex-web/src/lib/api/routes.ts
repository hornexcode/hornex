import { getAvailableGamesResponse } from '../hx-app/types';
import { Method } from '../routes/routes';
import z from 'zod';
// const routes: APIRouteMap = {} as APIRouteMap;

export const routes = {
  login: {
    path: 'v1/token',
    method: Method.POST,
    schema: null,
  },
  register: {
    path: 'v1/auth/register',
    method: Method.POST,
    schema: null,
  },
  logout: {
    path: 'v1/auth/logout',
    method: Method.POST,
    schema: null,
  },
  getCurrentUser: {
    path: 'v1/users/current-user',
    method: Method.GET,
    schema: null,
  },
  searchUsers: {
    path: 'v1/users/search',
    method: Method.GET,
    schema: null,
  },
  createTeam: {
    path: 'v1/teams',
    method: Method.POST,
    schema: null,
  },
  getTeam: {
    path: 'v1/teams/[teamId]',
    method: Method.GET,
    schema: null,
  },
  getTeams: {
    path: 'v1/teams',
    method: Method.GET,
  },
  updateTeam: {
    path: 'v1/teams/[id]',
    method: Method.PUT,
  },
  deleteTeam: {
    path: 'v1/teams/[id]',
    method: Method.DELETE,
    schema: null,
  },
  getEmailConfirmationCode: {
    path: 'v1/auth/register-confirm',
    method: Method.GET,
    schema: null,
  },
  confirmRegister: {
    path: 'v1/auth/register-confirm',
    method: Method.POST,
    schema: null,
  },
  getGames: {
    path: 'v1/games',
    method: Method.GET,
    schema: null,
  },
  getAvailableGames: {
    path: 'v1/games',
    method: Method.GET,
    schema: getAvailableGamesResponse,
  },
  getTournaments: {
    path: 'v1/[platform]/[game]/tournaments',
    method: Method.GET,
    schema: null,
  },
  getTournament: {
    path: 'v1/[platform]/[game]/tournaments/[tournamentId]/details',
    method: Method.GET,
    schema: null,
  },
  registerTeam: {
    path: 'v1/[platform]/[game]/tournaments/[tournamentId]/register',
    method: Method.POST,
    schema: null,
  },
  getTeamMembers: {
    path: 'v1/teams/[id]/members',
    method: Method.GET,
    schema: null,
  },
  deleteTeamMember: {
    path: 'v1/teams/[teamId]/members/[id]',
    method: Method.DELETE,
    schema: null,
  },
  getTeamInvites: {
    path: 'v1/teams/[id]/invites',
    method: Method.GET,
    schema: null,
  },
  inviteUser: {
    path: 'v1/teams/[id]/invites',
    method: Method.POST,
    schema: null,
  },
  getUserInvites: {
    path: 'v1/invites',
    method: Method.GET,
    schema: null,
  },
  deleteTeamInvite: {
    path: 'v1/teams/[teamId]/invites/[id]',
    method: Method.DELETE,
    schema: null,
  },
  acceptInvite: {
    path: 'v1/invites/accept',
    method: Method.POST,
    schema: null,
  },
  declineInvite: {
    path: 'v1/invites/decline',
    method: Method.POST,
    schema: null,
  },
};
