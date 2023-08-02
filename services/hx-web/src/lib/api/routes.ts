import { Method } from '../routes/routes';

// const routes: APIRouteMap = {} as APIRouteMap;

export const routes = {
  login: {
    path: 'v1/auth/login',
    method: Method.POST,
  },
  me: {
    path: 'v1/auth/me',
    method: Method.POST,
  },
};
