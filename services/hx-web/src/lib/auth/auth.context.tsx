import { get, set } from 'es-cookie';
import React, { createContext, useEffect, useReducer, useState } from 'react';

import { User } from '@/domain';
import { CurrentUser } from '@/infra/hx-core/responses/current-user';
import { LoginResponse } from '@/infra/hx-core/responses/login';

type AuthContextState = {
  isAuthenticated: boolean;
  user?: User;
};

const initialState: AuthContextState = {
  isAuthenticated: false,
  user: undefined
};

type ActionType = {
  type: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT';
  payload?: User;
};

const reducer = (state: AuthContextState, action: ActionType) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      };
    case 'LOGIN_FAILED':
      return {
        ...state,
        isAuthenticated: false,
        user: undefined
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: undefined
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<{
  state: AuthContextState;
  login: (params: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetching: boolean;
  error?: string;
}>({
  state: initialState,
  login: async () => {},
  logout: async () => {},
  fetching: false
});

export const AuthContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const token = get('hx-auth.token');

    if (!state.isAuthenticated && token) {
      setFetching(true);
      setError(undefined);

      fetch('http://localhost:9234/api/v1/users/current', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          return res.json();
        })
        .then(({ user }: CurrentUser) => {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              id: user.id,
              firstName: user.first_name,
              lastName: user.last_name,
              email: user.email
            }
          });
          setFetching(false);
        })
        .finally(() => setFetching(false));
    }
  }, []);

  const login = async ({
    email,
    password
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setFetching(true);
      setError(undefined);
      // TODO: move to api client
      const res = await fetch('http://localhost:9234/api/v1/auth/login', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = (await res.json()) as LoginResponse;
        set('hx-auth.token', data.access_token, { expires: data.exp });

        setError(undefined);
        setFetching(false);
      } else {
        try {
          // attempt to parse errors before returning as text
          const errorResponse = await res.json();
          setError(
            errorResponse.message ||
              errorResponse?.detail ||
              errorResponse?.error ||
              'Error logging in'
          );
        } catch (error) {
          // Error 500
          setError('Unable to log in');
          dispatch({ type: 'LOGIN_FAILED' });
        } finally {
          setFetching(false);
        }
      }
    } catch (error) {
      console.log('Error making request to api :', error);
      setError('Internal server error');
      dispatch({ type: 'LOGIN_FAILED' });
    } finally {
      setFetching(false);
    }
  };

  const logout = async () => {
    set('hx-auth.token', '');
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
