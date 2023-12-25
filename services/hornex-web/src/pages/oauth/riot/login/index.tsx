import { dataLoader } from '@/lib/api';
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const { useData: connectRiotAccount } = dataLoader<{ redirect_url: string }>(
  'connectRiotAccount'
);
const { fetch: connectRiotAccountCallback } = dataLoader<{
  return_path: string;
}>('connectRiotAccountCallback');

const OauthRiotLogin: InferGetServerSidePropsType<
  typeof getServerSideProps
> = ({ return_path }: { return_path: string }) => {
  // const returnPather = atom('');
  // const [returnPath, setReturnPath] = useAtom(returnPather);

  const router = useRouter();
  // const { code, state, return_path } = router.query;

  console.log('@louise1', return_path);

  // Case 1: User is not logged in and is redirected to the riot's login page
  const { data, error } = connectRiotAccount({
    return_path,
  });
  console.log('@louise2', data, error);

  if (error) {
    return <>error</>;
  }

  router.replace(data?.redirect_url || '/');

  return <>authenticating...</>;
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const { code, state, return_path } = query;

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
      console.log('error -> ', error.response?.message);
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

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
