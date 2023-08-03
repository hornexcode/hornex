import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import * as Cookies from 'es-cookie';
import { serverAPI } from '../api/serverApi';

export const ssrAuthGuard = (fn: GetServerSideProps) => {
  return async (ctx: GetServerSidePropsContext) => {
    const cookies = Cookies.parse(ctx.req.headers.cookie || '');

    if (
      cookies['hx-auth.token'] == undefined ||
      cookies['hx-auth.token'] == ''
    ) {
      return {
        redirect: {
          destination: '/',
          permanent: true
        }
      };
    }

    // verify token validity
    const res = await serverAPI(ctx).get(
      'http://localhost:9234/api/v1/users/current'
    );

    try {
      if (res.statusText === 'OK') {
        return fn(ctx);
      } else {
        return {
          redirect: {
            destination: '/',
            permanent: true
          }
        };
      }
    } catch (error) {
      console.log('Internal Server Error', error);
      return {
        redirect: {
          destination: '/',
          permanent: true
        }
      };
    }
  };
};
