import { getCookieFromRequest } from './cookie';
import { routes } from './routes';
import * as Cookie from 'es-cookie';
import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import useSWR from 'swr';

const isServer = typeof window === 'undefined';
const API_ROOT = isServer
  ? `${process.env.API_URL}`
  : `${process.env.NEXT_PUBLIC_API_URL}`;
const HX_COOKIE = 'hx';

type Scalar = bigint | boolean | number | string;
type ParamMap = { [key: string]: Scalar | Scalar[] };

const fetcher = async (url: string, options: RequestInit = {}) => {
  return await fetch(url, options);
};

export const requestFactory = <T, Data = unknown>(
  routeKey: keyof typeof routes
) => {
  const { path, method, schema } = routes[routeKey];

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
      const url = `${API_ROOT}/${path}`;
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
      return fetcher(`${API_ROOT}/${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload ? JSON.stringify(payload) : '',
      }).then(getResponseObject);
    },

    get: async (options: RequestInit): Promise<FetchResponse<T>> => {
      return fetcher(`${API_ROOT}/${path}`, options).then(getResponseObject);
    },

    useData: () => {
      const cookie = isServer ? null : Cookie.get(HX_COOKIE);
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
