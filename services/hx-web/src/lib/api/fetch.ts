import * as Cookie from 'es-cookie';
import useSWR from 'swr';
import z from 'zod';

import { routes } from './routes';

const isServer = typeof window === 'undefined';
const API_ROOT = `${process.env.NEXT_PUBLIC_API_URL}`;

export const dataLoadersV2 = <T, Data = unknown>(
  routeKey: keyof typeof routes,
  schema?: z.Schema<T>
) => {
  const { path, method } = routes[routeKey];

  const _fetch = async (url: string, options?: RequestInit) => {
    let data: T | undefined = undefined;
    let error: FetchError | undefined = undefined;

    const cookie = isServer ? null : Cookie.get('hx-auth.token');

    const res = await fetch(url, {
      method,
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookie ? `Bearer ${cookie}` : '',
      },
      ...options,
    });

    try {
      if (res.ok) {
        data = await res.json();
        if (schema) {
          const result = schema.safeParse(data);
          if (!result.success) {
            throw new Error(result.error.message);
          }
        }
      } else {
        try {
          const errRes = await res.json();
          error = {
            name: 'FetchError',
            message: errRes?.error ?? 'Unable to fetch',
            code: res.status,
            response: errRes,
          };
        } catch (_) {
          const errorMessage = await res.text();
          error = new Error(errorMessage);
          error.code = res.status;
        }
      }
    } catch (e: any) {
      error = e;
    } finally {
      return {
        data,
        error,
        headers: res.headers,
        status: res.status,
      };
    }
  };

  const post = (payload?: Data): Promise<FetchResponse<T>> => {
    return _fetch(`${API_ROOT}/${path}`, {
      body: payload ? JSON.stringify(payload) : '',
    });
  };

  const get = (): Promise<FetchResponse<T>> => {
    return _fetch(`${API_ROOT}/${path}`);
  };

  const patch = async (
    param: string,
    payload?: Data
  ): Promise<FetchResponse<T>> => {
    return _fetch(`${API_ROOT}/${path}/${param}`, {
      body: payload ? JSON.stringify(payload) : '',
    });
  };

  /**
   * This method is intended to be used with SWR
   */
  const useData = () => {
    const cookie = isServer ? null : Cookie.get('hx-auth.token');
    return useSWR<T>(path, (url: string, options?: RequestInit) =>
      fetch(`${API_ROOT}/${url}`, {
        ...options,
        method,
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookie ? `Bearer ${cookie}` : '',
        },
      }).then((res) => res.json())
    );
  };

  return {
    post,
    get,
    patch,
    useData,
  };
};

async function newHTTPError(response: Response, method?: string) {
  try {
    const errRes = await response.json();
  } catch (error: any) {}
}

export interface FetchError extends Error {
  code?: number;
  response?: any;
}

export type FetchResponse<T> = {
  data?: T;
  error?: FetchError;
  status?: number;
};

export class HTTPError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.status = status;
  }
}
