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
    try {
      const res = await fetcher(`http://localhost:9234/api/${path}`, {
        method,
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: data ? JSON.stringify(data) : '',
      });

      return res.json() as T;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    post,
  };
};
