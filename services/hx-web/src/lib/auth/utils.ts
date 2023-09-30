import { Token } from './auth-context.types';
import { remove, set } from 'es-cookie';

export const saveTokenWithCookies = (token: Token) => {
  const payload = JSON.parse(atob(token.access.split('.')[1])) as {
    user_id: string;
    exp: number;
  };

  set('hx', token.access, { expires: payload.exp });
};
