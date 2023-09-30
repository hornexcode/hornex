import { Token } from './auth-context.types';
import { remove, set } from 'es-cookie';

export const saveTokenWithCookies = (token?: Token) => {
  if (!token) {
    remove('hx-auth.token');
    return;
  }
  const payload = JSON.parse(atob(token.access.split('.')[1])) as {
    user_id: string;
    exp: number;
  };

  set('hx-auth.token', token.access, { expires: payload.exp });
};
