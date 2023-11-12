import TeamsPage from '@/components/ui/templates/teams';
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

const Teams = ({
  invites,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: teams, error, isLoading } = getTeams({});

  if (error) {
    return <div>{error.message}</div>;
  }

  if (teams && !isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1160px]">
        <TeamsPage teams={teams} invites={invites} />
      </div>
    );
  }
};

Teams.getLayout = (page: React.ReactElement) => {
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

export default Teams;
