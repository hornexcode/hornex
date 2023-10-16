import { parse as parseCookie } from 'es-cookie';
import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

/**
 * getCookieFromRequest accepts a CookieNames enum to get the cookie from the request. If the value is present it is returned as a string.
 *
 * If the value is not present, undefined is returned.
 *
 * @param { CookieNames } name The name of the cookie to get.
 * @param { IncomingMessage } req The request to get the cookie from.
 * @returns string | undefined
 */
export function getCookieFromRequest(
  req: IncomingMessage,
  name: string = ''
): string | undefined {
  if (req.headers.cookie) {
    const { [name]: cookie } = parseCookie(req.headers.cookie);
    if (cookie) {
      return cookie;
    }
  }
  return undefined;
}
