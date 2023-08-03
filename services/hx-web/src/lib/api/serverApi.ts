import axios, { AxiosError } from 'axios';
import * as Cookies from 'es-cookie';
import { GetServerSidePropsContext } from 'next';

export const serverAPI = (ctx: GetServerSidePropsContext) => {
  const cookies = Cookies.parse(ctx.req.headers.cookie || '');

  const api = axios.create({
    baseURL: 'http://localhost:9234',
    headers: {
      Authorization: `Bearer ${cookies['hx-auth.token']}`
    }
  });

  return api;
};
