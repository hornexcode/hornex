import * as Cookie from 'es-cookie';

import { routes } from './routes';

const isServer = typeof window === 'undefined';
const API_ROOT = `${process.env.NEXT_PUBLIC_API_URL}`;

const fetcher = async (url: string, options?: RequestInit) => {
  return await fetch(url, options);
};

export const dataLoaders = <T, Data = unknown>(
  routeKey: keyof typeof routes
) => {
  const { path, method } = routes[routeKey];

  // Post data to the API
  const post = async (
    payload?: Data,
    headers: Record<string, string> = {}
  ): Promise<T> => {
    let error: HttpError | null = null;
    let data: T;

    const cookie = isServer ? null : Cookie.get('hx-auth.token');

    try {
      const r = await fetcher(`${API_ROOT}/${path}`, {
        method,
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookie ? `Bearer ${cookie}` : '',
          ...headers,
        },
        body: payload ? JSON.stringify(payload) : '',
      });

      if (r.ok) {
        try {
          data = (await r.json()) as T;
          return data;
        } catch (e: any) {
          throw new Error("Couldn't parse response");
        }
      } else {
        try {
          error = (await r.json()) as HttpError;
        } catch (e: any) {
          throw new Error("Couldn't parse response");
        }

        throw error;
      }
    } catch (e: any) {
      console.log(e);
      throw e;
    }
  };

  const get = async (headers: Record<string, string> = {}) => {
    let error: HttpError;

    try {
      const r = await fetcher(`${API_ROOT}/${path}`, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      if (r.ok) {
        try {
          return (await r.json()) as T;
        } catch (e: any) {
          throw new Error("Couldn't parse response");
        }
      } else {
        try {
          error = (await r.json()) as HttpError;
        } catch (e: any) {
          throw new Error("Couldn't parse response");
        }

        throw error;
      }
    } catch (e: any) {
      console.log(e);
      throw e;
    }
  };

  const find = async (param: string, headers: Record<string, string> = {}) => {
    const cookie = isServer ? null : Cookie.get('hx-auth.token');
    let error: HttpError;

    try {
      const r = await fetcher(`${API_ROOT}/${path}/${param}`, {
        method,
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookie ? `Bearer ${cookie}` : '',
          ...headers,
        },
      });

      if (r.ok) {
        try {
          return (await r.json()) as T;
        } catch (e: any) {
          throw new Error("Couldn't parse response");
        }
      } else {
        try {
          error = (await r.json()) as HttpError;
        } catch (e: any) {
          throw new Error("Couldn't parse response");
        }

        throw error;
      }
    } catch (e: any) {
      console.log(e);
      throw e;
    }
  };

  return {
    post,
    get,
    find,
  };
};

export interface HttpError extends Error {
  code?: number;
  id?: string;
  response?: any;
}
