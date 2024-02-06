import { IncomingMessage } from 'http';
import { parseCookies } from 'nookies';

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
    const cookies = parseCookies({ req });
    return cookies[name];
  }
  return undefined;
}
