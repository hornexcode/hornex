import axios, { AxiosError } from 'axios';
import { GetServerSidePropsContext } from 'next';
import * as Cookies from 'es-cookie';
import { signOut } from '../auth';

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
