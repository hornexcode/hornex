import TeamsListPage from '@/components/system-design/templates/teams-list-page';
import { AppLayout } from '@/layouts';
import { dataLoader } from '@/lib/api';
import { GetInvitesResponse } from '@/lib/hx-app/types';
import {
  GetTeamsOutput,
  getTeamsSchemaOutput as schema,
} from '@/services/hx-core/get-teams';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const { useData: getTeams } = dataLoader<GetTeamsOutput>('getTeams');
const { fetch: getInvites } = dataLoader<GetInvitesResponse>('getUserInvites');

const TeamsPage = ({
  invites,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: teams, error, isLoading } = getTeams({});

  if (error) {
    return <div>{error.message}</div>;
  }

  if (teams && !isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1160px]">
        <TeamsListPage teams={teams} invites={invites} />
      </div>
    );
  }
};

TeamsPage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data: invites } = await getInvites(
    {
      status: 'pending',
    },
    ctx.req
  );
  return {
    props: { invites },
  };
};

export default TeamsPage;
