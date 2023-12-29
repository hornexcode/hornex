import TeamsTemplate from '@/components/ui/templates/teams';
import { AppLayout } from '@/layouts';
import { dataLoader } from '@/lib/api';
import { GetInvitesResponse } from '@/lib/models/types';
import {
  GetTeamsOutput,
  getTeamsSchemaOutput as schema,
} from '@/services/hx-core/get-teams';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { parseCookies } from 'nookies';

const { useData: useGetTeams } = dataLoader<GetTeamsOutput>('getTeams');
const { useData: useGetInvites } =
  dataLoader<GetInvitesResponse>('getUserInvites');

const TeamsPage = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  const { data: teams, error, isLoading } = useGetTeams({});
  const {
    data: invites,
    error: invitesError,
    isLoading: isInvitesLoading,
  } = useGetInvites({});

  if (error) {
    return <div>{error.message}</div>;
  }

  if (invitesError) {
    return <div>{invitesError.message}</div>;
  }
  isInvitesLoading;
  if (teams && !isLoading && invites && !isInvitesLoading) {
    return (
      <div className="mx-auto w-full max-w-[1160px]">
        <TeamsTemplate teams={teams} invites={invites} />
      </div>
    );
  }
};

TeamsPage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // const token = ctx.req.cookies['hx.auth.token'];
  // const token = console.log(token);
  const { ['hx.auth.token']: token } = parseCookies(ctx);
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default TeamsPage;
