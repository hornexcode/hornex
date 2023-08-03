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
  const post = async (payload?: Data, headers: Record<string, string> = {}) => {
    let error: FetchError | null = null;
    let data: T | null = null;

    const r = await fetcher(`${API_ROOT}/${path}`, {
      method,
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: payload ? JSON.stringify(payload) : '',
    });

    try {
      if (!r.ok) {
        try {
          // attempt to parse errors before returning as text
          const errorResponse = await r.json();
          error = {
            name: 'FetchError',
            message:
              errorResponse?.detail ??
              errorResponse?.error ??
              'Unable to fetch',
            code: r.status,
            response: errorResponse,
          };
        } catch (_) {
          const errorMessage = await r.text();
          error = new Error(errorMessage);
          error.code = r.status;
        }
      }

      if (r.status == 204) {
        return;
      }
    } catch (e: any) {
      error = e;
    } finally {
      return (await r.json()) as T;
      // return {
      //   data: ,
      //   error,
      //   headers: r.headers,
      //   status: r.status,
      // };
    }
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
