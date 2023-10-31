import { getCookieFromRequest } from './cookie';
import { routes } from './routes';
import { Route } from '@/lib/routes';
import { IncomingMessage } from 'http';
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
  return await fetch(url, options);
};

export const dataLoader = <T, Data = unknown>(
  routeKey: keyof typeof routes
) => {
  const { path, method } = routes[routeKey];

  const route = new Route(`${API_ROOT}/${path}`);

  const getResponseObject = async <UDT = T>(
    res: Response
  ): Promise<FetchResponse<UDT>> => {
    let data: UDT | null | undefined = null;
    let error: FetchError | null | undefined = null;

    try {
      if (res.ok) {
        data = await res.json();
        // if (schema) {
        //   data = schema.safeParse(data);
        //   if (!data.success) {
        //     throw new Error(result.error.message);
        //   }
        // }
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

  return {
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

    post: async (payload?: Data): Promise<FetchResponse<T>> => {
      // Client side request

      // get cookie from client
      const cookie = document.cookie;

      // TODO: this is a hack, we need to find a better way to get the cookie
      const token = cookie.split(';').find((c) => c.includes(HX_COOKIE));

      return fetcher(`${API_ROOT}/${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.split('=')[1]}`,
        },
        body: payload ? JSON.stringify(payload) : '',
      }).then(getResponseObject);
    },

    get: async (
      params: ParamMap = {},
      options: RequestInit = {},
      headers: Record<string, string> = {}
    ): Promise<FetchResponse<T>> => {
      if (!isServer) {
        const cookie = document.cookie;
        const token = cookie.split(';').find((c) => c.includes(HX_COOKIE));

        headers = {
          ...headers,
          Authorization: `Bearer ${token?.split('=')[1]}`,
        };
      }

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
      if (!isServer) {
        // get cookie from client
        const cookie = document.cookie;

        // TODO: this is a hack, we need to find a better way to get the cookie
        const token = cookie.split(';').find((c) => c.includes(HX_COOKIE));

        headers = {
          ...headers,
          Authorization: `Bearer ${token?.split('=')[1]}`,
        };
      }

      return useSWR<UDT>(
        path,
        (url: string, options: RequestInit = {}) =>
          fetcher(route.href(params), {
            ...options,
            headers: { ...options.headers, ...headers },
          }).then((r) => r.json()),
        {
          revalidateOnFocus: false,
          ...config,
        }
      );
    },
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
