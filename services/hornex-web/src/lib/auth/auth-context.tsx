import { dataLoader as dataLoader } from '../api/request';
import { makeClientReqObj } from '../api/util';
import { reducer } from './auth-context.reducer';
import {
  AuthContextState,
  LoggedInUser,
  LoginRequest,
  Token,
} from './auth-context.types';
import { saveTokenWithCookies } from './utils';
import { get, set } from 'es-cookie';
import React, { createContext, useEffect, useReducer, useState } from 'react';

const { post: authenticateUser } = dataLoader<Token, LoginRequest>('login');
const { fetch: getCurrentUser } = dataLoader<LoggedInUser>('getCurrentUser');

const initialState: AuthContextState = {
  isAuthenticated: false,
  user: undefined,
};

export const AuthContext = createContext<{
  state: AuthContextState;
  login: (params: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  fetching: boolean;
  error?: string;
}>({
  state: initialState,
  login: async () => {
    return true;
  },
  logout: async () => {},
  fetching: false,
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  async function loadCurrentUser() {
    const { data: user, error } = await getCurrentUser({}, makeClientReqObj());
    if (error || !user) {
      setError(error?.message || 'Error fetching user');
      dispatch({ type: 'LOGIN_FAILED' });
      // saveTokenWithCookies();
      setFetching(false);
      return;
    }
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: user,
    });
  }

  useEffect(() => {
    const token = get('hx.auth.token');

    if (!state.isAuthenticated && token) {
      setFetching(true);
      setError(undefined);
      loadCurrentUser();
      setFetching(false);
    }
  }, []);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setFetching(true);
    setError(undefined);

    const { data: token, error } = await authenticateUser(undefined, {
      email,
      password,
    });
    if (!error && token) {
      saveTokenWithCookies(token);
      loadCurrentUser();
    } else {
      setError(error?.message || 'Error authenticating user');
      dispatch({ type: 'LOGIN_FAILED' });
      return false;
    }

    setFetching(false);
    return true;
  };

  const logout = async () => {
    set('hx.auth.token', '');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, fetching, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthContextProvider');
  }
  return context;
};
