import axios, { AxiosError } from 'axios';
import Router from 'next/router';
import { set, get } from 'es-cookie';

const createClientAPI = () => {
  // const token = get('hx-auth.token');

  const api = axios.create({
    baseURL: 'http://localhost:9234',
    withCredentials: true
  });

  /* api.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      console.log('passou aqui', error.response);
      if (error.response?.status === 401) {
        set('hx-auth.token', '');
        Router.push('/login');
      }
    }
  ); */

  return api;
};

export const clientAPI = createClientAPI();
