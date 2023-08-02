import { routes } from './routes';
import { getCookieFromRequest } from './cookie';

const isServer = typeof window === 'undefined';
const API_ROOT = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const fetcher = async (url: string, options?: RequestInit) => {
  return fetch(url, options);
};

export const dataLoaders = <T, Data = unknown>(
  routeKey: keyof typeof routes
) => {
  const { path, method } = routes[routeKey];

  // Post data to the API
  const post = async (data?: Data, headers: Record<string, string> = {}) => {
    let error: FetchError | null = null;

    const r = await fetcher(`http://localhost:9234/api/${path}`, {
      method,
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: data ? JSON.stringify(data) : '',
    });

    if (!r.ok) {
      try {
        // attempt to parse errors before returning as text
        const errorResponse = await r.json();
        error = {
          name: 'FetchError',
          message:
            errorResponse?.detail ?? errorResponse?.error ?? 'Unable to fetch',
          code: r.status,
          response: errorResponse,
        };
      } catch (_) {
        const errorMessage = await r.text();
        error = new Error(errorMessage);
        error.code = r.status;
      }
    }

    return r.json() as T;
  };

  return {
    post,
  };
};

export interface FetchError extends Error {
  code?: number;
  id?: string;
  response?: any;
}
