import { ActionType, AuthContextState } from './auth-context.types';

export const reducer = (state: AuthContextState, action: ActionType) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case 'LOGIN_FAILED':
      return {
        ...state,
        isAuthenticated: false,
        user: undefined,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: undefined,
      };
    default:
      return state;
  }
};
