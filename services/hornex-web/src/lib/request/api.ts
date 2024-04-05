'use client';
import { getCookieFromRequest } from './cookie';
import { routes } from './routes';
import { Route } from '@/lib/routes';
import { IncomingMessage } from 'http';
import { destroyCookie, parseCookies } from 'nookies';
import useSWR, { SWRConfiguration } from 'swr';

// type APIRouteMap = { [key in APIRouteName]: Route };

const isServer = typeof window === 'undefined';
const API_ROOT = isServer
  ? `${process.env.API_URL}`
  : `${process.env.NEXT_PUBLIC_API_URL}`;
const HX_COOKIE = 'hx';

export type ParamMap = {
  [key: string]: string[] | string | number | undefined;
};

const fetcher = async (url: string, options: RequestInit = {}) => {
  // include cookies if Client side
  if (!isServer) {
    options.credentials = 'include';
  }

  return await fetch(url, options);
};

export const dataLoader = <T, Data = unknown>(
  routeKey: keyof typeof routes
) => {
  const { path, method } = routes[routeKey];

  const route = new Route(`${API_ROOT}/${path}`);

  const abortController = new AbortController();
  const signal = abortController.signal;

  const getResponseObject = async <UDT = T>(
    res: Response
  ): Promise<FetchResponse<UDT>> => {
    let data: UDT | null | undefined = null;
    let error: FetchError | undefined = undefined;
    try {
      if (!signal.aborted) {
        if (res.ok) {
          try {
            data = (await res.json()) as UDT;
          } catch (e) {
            console.error('Error parsing response', e);
          }
        } else {
          try {
            const errRes = await res.json();

            error = {
              name: 'FetchError',
              message: (errRes?.error || errRes?.detail) ?? 'Unable to fetch',
              code: res.status,
              response: errRes,
            };

            console.log('not ok', error);
            if (error.code === 401) {
              destroyCookie(null, 'next-auth.session-token');
            }

            if (res.status === 400) {
              // construct error validations
              const validations: Record<string, string>[] = [];
              for (const key in errRes) {
                if (Array.isArray(errRes[key])) {
                  validations.push({ [key]: errRes[key].join(', ') });
                }
              }
              error.validations = validations;
            }
          } catch (_) {
            const errorMessage = await res.text();
            error = new Error(errorMessage);
            error.code = res.status;
          }
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

  return {
    /**
     * This request happens on the server side
     * @param params
     * @param req
     * @param headers
     * @returns
     */
    fetch: async (
      params: ParamMap,
      req: IncomingMessage,
      headers: Record<string, string> = {}
    ): Promise<FetchResponse<T>> => {
      // Server side request

      const url = route.href(params);
      const token = getCookieFromRequest(req, HX_COOKIE);

      // Make sure we pass along the session cookie when we make our request.
      const options: RequestInit = {};

      if (token) {
        options.headers = {
          Authorization: `Bearer ${token}`,
        };
      }

      options.headers = { ...headers, ...options.headers };
      return fetcher(url, options).then(getResponseObject);
    },

    /**
     * This request only happens on the client side
     * @param params
     * @param payload
     * @returns
     */
    post: async (
      params: ParamMap = {},
      payload?: Data
    ): Promise<FetchResponse<T>> => {
      return fetcher(route.href(params), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload ? JSON.stringify(payload) : '',
        signal,
      }).then(getResponseObject);
    },

    put: async (
      params: ParamMap = {},
      payload?: Data
    ): Promise<FetchResponse<T>> => {
      return fetcher(route.href(params), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload ? JSON.stringify(payload) : '',
      }).then(getResponseObject);
    },

    submit: async (
      params: ParamMap = {},
      payload?: Data
    ): Promise<FetchResponse<T>> => {
      const token = parseCookies(null)[HX_COOKIE];

      return fetcher(route.href(params), {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: payload ? JSON.stringify(payload) : '',
        signal,
      }).then(getResponseObject);
    },

    delete: async (
      params: ParamMap = {},
      payload?: Data
    ): Promise<FetchResponse<T>> => {
      return fetcher(route.href(params), {
        method: 'DELETE',
        body: payload ? JSON.stringify(payload) : '',
      }).then(getResponseObject);
    },

    get: async (
      params: ParamMap = {},
      options: RequestInit = {},
      headers: Record<string, string> = {}
    ): Promise<FetchResponse<T>> => {
      return fetcher(route.href(params), {
        ...options,
        headers: { ...options.headers, ...headers },
      }).then(getResponseObject);
    },

    useData: <UDT = T>(
      params: ParamMap = {},
      config?: SWRConfiguration,
      headers: Record<string, string> = {}
    ) => {
      const token = parseCookies(null)[HX_COOKIE];
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      return useSWR<UDT>(
        path,
        (url: string, options: RequestInit = {}) =>
          fetcher(route.href(params), {
            ...options,
            headers: { ...options.headers, ...headers },
          }).then((r) => {
            if (r.ok) {
              return r.json();
            }
            throw new Error(r.statusText);
          }),
        {
          ...config,
          // revalidateOnFocus: false,
          // revalidateIfStale: false,
        }
      );
    },

    abortController,
  };
};

export interface FetchError extends Error {
  code?: number;
  response?: any;
  validations?: Record<string, string>[];
}

export type FetchResponse<T> = {
  data: T | null | undefined;
  error: FetchError | null | undefined;
  headers?: Headers | null | undefined;
  status?: number;
};
