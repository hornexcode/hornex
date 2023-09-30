import { routes } from './routes';
import * as Cookie from 'es-cookie';
import useSWR from 'swr';
import z from 'zod';

const isServer = typeof window === 'undefined';
const API_ROOT = `${process.env.NEXT_PUBLIC_API_URL}`;

export const dataLoadersV2 = <T, Data = unknown>(
  routeKey: keyof typeof routes,
  schema?: z.Schema<T>
) => {
  const { path, method } = routes[routeKey];

  const fetcher = async (url: string, options?: RequestInit) => {
    let data: T | undefined = undefined;
    let error: FetchError | undefined = undefined;

    const token = isServer ? null : Cookie.get('hx-auth.token');

    const res = await fetch(url, {
      method,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
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
            message: (errRes?.error || errRes?.detail) ?? 'Unable to fetch',
            validations: errRes?.validations,
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
    return fetcher(`${API_ROOT}/${path}`, {
      body: payload ? JSON.stringify(payload) : '',
    });
  };

  const get = (options?: RequestInit): Promise<FetchResponse<T>> => {
    return fetcher(`${API_ROOT}/${path}`, options);
  };

  const patch = async (
    param: string,
    payload?: Data
  ): Promise<FetchResponse<T>> => {
    return fetcher(`${API_ROOT}/${path}/${param}`, {
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

export interface FetchError extends Error {
  code?: number;
  response?: any;
  validations?: Record<string, string>[];
}

export type FetchResponse<T> = {
  data?: T;
  error?: FetchError;
  status?: number;
};
