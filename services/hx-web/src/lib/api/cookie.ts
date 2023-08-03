import { IncomingMessage } from 'http';

import {
  get as getCookie,
  parse as parseCookie,
  set as setCookie,
} from 'es-cookie';

/**
 * getCookieFromRequest accepts a CookieNames enum to get the cookie from the request. If the value is present it is returned as a string.
 *
 * If the value is not present, undefined is returned.
 *
 * @param { CookieNames } name The name of the cookie to get.
 * @param { IncomingMessage } req The request to get the cookie from.
 * @returns string | undefined
 */
export function getCookieFromRequest(req: IncomingMessage): string | undefined {
  const name = 'hx-jwt';
  if (req.headers.cookie) {
    const { [name]: cookie } = parseCookie(req.headers.cookie);
    if (cookie) {
      return cookie;
    }
  }
  return undefined;
}
