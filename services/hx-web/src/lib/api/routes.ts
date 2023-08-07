import { Method } from '../routes/routes';

// const routes: APIRouteMap = {} as APIRouteMap;

export const routes = {
  login: {
    path: 'v1/auth/login',
    method: Method.POST
  },
  signup: {
    path: 'v1/auth/signup',
    method: Method.POST,
  },
  logout: {
    path: 'v1/auth/logout',
    method: Method.POST
  },
  currentUser: {
    path: 'v1/users/current',
    method: Method.GET
  },
  createTeam: {
    path: 'v1/teams',
    method: Method.POST
  },
  findTeam: {
    path: 'v1/teams',
    method: Method.GET
  }
};
