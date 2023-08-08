import * as Cookie from 'es-cookie';
import z from 'zod';

import { routes } from './routes';

const isServer = typeof window === 'undefined';
const API_ROOT = `${process.env.NEXT_PUBLIC_API_URL}`;

export const dataLoadersV2 = <T, Data = unknown>(
  routeKey: keyof typeof routes,
  schema?: z.Schema<T>
) => {
  const { path, method } = routes[routeKey];

  const safeFetch = async (url: string, options?: RequestInit) => {
    const cookie = isServer ? null : Cookie.get('hx-auth.token');

    const res = await fetch(url, {
      method,
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookie ? `Bearer ${cookie}` : ''
      },
      ...options
    });

    if (!res.ok) {
      throw newHTTPError('Unexpected response', res, options?.method);
    }

    const json = await res.json().catch(() => {
      throw newHTTPError('Invalid JSON body', res, options?.method);
    });

    if (schema) {
      const result = schema.safeParse(json);
      if (!result.success) {
        throw newHTTPError('Unexpected response schema', res, options?.method);
      }

      return result.data;
    }
    return json as T;
  };

  // Post data to the API
  const post = async (payload?: Data): Promise<T> => {
    return safeFetch(`${API_ROOT}/${path}`, {
      body: payload ? JSON.stringify(payload) : ''
    }).catch((error) => {
      throw new Error('Error fetching data');
    });
  };

  const get = async () => {
    return safeFetch(`${API_ROOT}/${path}`).catch((error) => {
      throw new Error('Error fetching data');
    });
  };

  const patch = async (param: string, payload?: Data): Promise<T> => {
    return safeFetch(`${API_ROOT}/${path}/${param}`, {
      body: payload ? JSON.stringify(payload) : ''
    }).catch((error) => {
      throw new Error('Error fetching data');
    });
  };

  return {
    post,
    get,
    patch
  };
};

function newHTTPError(reason: string, response: Response, method?: string) {
  const text = response.text().catch(() => null);
  const message = `Error fetching ${method} ${response.url}: ${response.status}.${reason}`;

  console.error(`${message}. Response body: ${text}`);
  return new HTTPError(message, response.status);
}

export class HTTPError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.status = status;
  }
}
