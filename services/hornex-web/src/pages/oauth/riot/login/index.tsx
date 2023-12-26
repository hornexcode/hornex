import { dataLoader } from '@/lib/api';
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useEffect } from 'react';

const { fetch: connectRiotAccount } = dataLoader<{ redirect_url: string }>(
  'connectRiotAccount'
);
const { fetch: connectRiotAccountCallback } = dataLoader<{
  return_path: string;
}>('connectRiotAccountCallback');

const OauthRiotLogin: InferGetServerSidePropsType<
  typeof getServerSideProps
> = ({ redirectUrl }: { redirectUrl: string }) => {
  const router = useRouter();

  useEffect(() => {
    router.replace(redirectUrl);
  }, []);

  return <>authenticating...</>;
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const { code, state, return_path } = query;

  if (return_path) {
    // Case 1: User is not logged in and is redirected to the riot's login page
    const { data, error } = await connectRiotAccount(
      {
        return_path,
      },
      req
    );
    return {
      props: {
        redirectUrl: data?.redirect_url || '/',
      },
    };
  }

  // Case 2: User is logged in and is redirected to the callback page
  if (code !== undefined && state !== undefined) {
    const { data, error } = await connectRiotAccountCallback(
      {
        code,
        state,
      },
      req
    );

    if (!data && error) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    console.log(data);

    if (data?.return_path) {
      return {
        redirect: {
          destination: data.return_path,
          permanent: false,
        },
      };
    }
  }

  return {
    props: {
      return_path: return_path || '',
    },
  };
};

export default OauthRiotLogin;
