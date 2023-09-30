import { LoggedUser } from '@/domain';

export type LoginRequest = {
  email: string;
  password: string;
};

export type Token = {
  access: string;
  refresh: string;
};

export type AuthContextState = {
  isAuthenticated: boolean;
  user?: LoggedUser;
};

export type LoggedInUser = {
  id: string;
  email: string;
  name: string;
};

export type ActionType = {
  type: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT';
  payload?: LoggedUser;
};
