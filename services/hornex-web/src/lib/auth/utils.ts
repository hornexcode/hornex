import { Token } from './auth-context.types';
import { remove, set } from 'es-cookie';
import { setCookie } from 'nookies';

export const saveTokenWithCookies = (token: Token) => {
  const payload = JSON.parse(atob(token.access.split('.')[1])) as {
    user_id: string;
    exp: number;
  };

  setCookie(null, 'hx.auth.token', token.access, {
    expires: new Date(payload.exp * 1000),
    path: '/',
  });
};
