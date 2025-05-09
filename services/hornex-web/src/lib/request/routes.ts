import { getAvailableGamesResponse } from '../models/types';
import { Method } from '../routes/routes';
// const routes: APIRouteMap = {} as APIRouteMap;

export const routes = {
  login: {
    path: 'v1/token',
    method: Method.POST,
  },
  signUp: {
    path: 'v1/users',
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
  getGameIds: {
    path: 'v1/accounts/game-ids',
    method: Method.GET,
  },
  disconnectGameId: {
    path: 'v1/accounts/game-ids/[id]/disconnect',
    method: Method.DELETE,
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
    path: 'v1/tournaments/[tournamentId]/registrations',
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
    path: 'v1/teams/invites/users',
    method: Method.GET,
    schema: null,
  },
  countUserInvites: {
    path: 'v1/teams/invites/count',
    method: Method.GET,
    schema: null,
  },
  deleteTeamInvite: {
    path: 'v1/teams/[teamId]/invites/[id]',
    method: Method.DELETE,
    schema: null,
  },
  acceptInvite: {
    path: 'v1/teams/invites/accept',
    method: Method.POST,
    schema: null,
  },
  declineInvite: {
    path: 'v1/teams/invites/decline',
    method: Method.POST,
    schema: null,
  },
  profile: {
    path: 'v1/accounts/profile',
    method: Method.GET,
  },
  getPublicOrganizerProfile: {
    path: 'v1/accounts/profiles/[id]/details',
    method: Method.GET,
  },
  createProfile: {
    path: 'v1/accounts/profile',
    method: Method.POST,
  },
  updateProfile: {
    path: 'v1/accounts/profile',
    method: Method.PATCH,
  },
  getNotifications: {
    path: 'v1/notifications',
    method: Method.GET,
    schema: null,
  },
  readNotifications: {
    path: 'v1/notifications/readings',
    method: Method.PATCH,
    schema: null,
  },
  connectRiotAccount: {
    path: 'v1/accounts/league-of-legends/oauth/login',
    method: Method.GET,
  },
  connectRiotAccountCallback: {
    path: 'v1/accounts/league-of-legends/oauth/login/callback',
    method: Method.GET,
  },
  getTournamentRegistrations: {
    path: 'v1/tournaments/[id]/registrations',
    method: Method.GET,
  },
  getRegistrations: {
    path: 'v1/registrations',
    method: Method.GET,
  },
  getRegistration: {
    path: 'v1/registrations/[id]',
    method: Method.GET,
  },
  payRegistration: {
    path: 'v1/payments/registration',
    method: Method.POST,
  },
  createUserCheckIn: {
    path: 'v1/tournaments/[tournamentId]/teams/[teamId]/check-in',
    method: Method.POST,
    schema: null,
  },
  getTeamCheckInStatus: {
    path: 'v1/tournaments/[tournamentId]/teams/[teamId]/check-in/status',
    method: Method.GET,
    schema: null,
  },
  getParticipantCheckedInStatus: {
    path: 'v1/tournaments/[tournamentId]/participant/checked-in',
    method: Method.GET,
    schema: null,
  },
  listTournamentParticipants: {
    path: 'v1/tournaments/[tournamentId]/participants',
    method: Method.GET,
  },
  listTournamentTeams: {
    path: 'v1/tournaments/[tournamentId]/teams',
    method: Method.GET,
  },
  getTournamentPrizes: {
    path: 'v1/tournaments/[tournamentId]/prizes',
    method: Method.GET,
  },
  listTournamentStandings: {
    path: 'v1/tournaments/[tournamentId]/standings',
    method: Method.GET,
  },

  createTournament: {
    path: 'v1/org/tournaments',
    method: Method.POST,
    schema: null,
  },
  createAndRegisterTeam: {
    path: 'v1/tournaments/[tournamentId]/create-and-register-team',
    method: Method.POST,
  },
  'org:tournaments': {
    path: 'v1/org/tournaments',
    method: Method.GET,
  },
  'org:tournament:details': {
    path: 'v1/org/tournaments/[id]',
    method: Method.GET,
  },
  'organizer:tournament:update': {
    path: 'v1/org/tournaments/[tournamentId]',
    method: Method.PATCH,
  },
  'org:tournament:start': {
    path: 'v1/org/tournaments/[id]/start',
    method: Method.POST,
  },
  'org:tournament:check-in': {
    path: 'v1/org/tournaments/[tournamentId]/check-in',
    method: Method.POST,
  },
  mountTeam: {
    path: 'v1/teams/mount',
    method: Method.POST,
  },
  'org:tournament:matches': {
    path: 'v1/org/tournaments/[id]/matches',
    method: Method.GET,
  },
  'org:match:update': {
    path: 'v1/org/matches/[id]',
    method: Method.PATCH,
  },
  'org:tournament:match:start': {
    path: 'v1/org/tournaments/[tournamentId]/matches/[matchId]/start',
    method: Method.PATCH,
  },
  'org:tournament:match:end': {
    path: 'v1/org/tournaments/[tournamentId]/matches/[matchId]/end',
    method: Method.PATCH,
  },
  'org:tournament:teams': {
    path: 'v1/org/tournaments/[tournamentId]/registered-teams',
    method: Method.GET,
  },
  'org:tournament:registrations': {
    path: 'v1/org/tournaments/[tournamentId]/registrations',
    method: Method.GET,
  },
  'org:tournament:endRound': {
    path: 'v1/org/tournaments/[id]/end-round',
    method: Method.POST,
  },
  'org:tournament:finalize': {
    path: 'v1/org/tournaments/[id]/finalize',
    method: Method.PATCH,
  },
  'org:registration:delete': {
    path: 'v1/org/registrations/[id]/delete',
    method: Method.DELETE,
  },
  'org:tournament:results': {
    path: 'v1/org/tournaments/[tournamentId]/results',
    method: Method.GET,
  },
};
