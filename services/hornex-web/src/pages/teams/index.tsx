import { TeamDetailsPage } from '@/components/system-design/templates/team-detail-page';
import { AppLayout } from '@/layouts';
import { dataLoader } from '@/lib/api';
import { GetInvitesResponse } from '@/lib/hx-app/types';
import {
  GetTeamsOutput,
  getTeamsSchemaOutput as schema,
} from '@/services/hx-core/get-teams';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const { fetch: getTeams } = dataLoader<GetTeamsOutput>('getTeams');
const { fetch: getInvites } = dataLoader<GetInvitesResponse>('getUserInvites');

const TeamsPage = ({
  teams,
  invites,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!teams) {
    return <div>loading</div>;
  }

  return <TeamDetailsPage teams={teams} invites={invites} />;
};

TeamsPage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data: teams, error: teamsError } = await getTeams({}, ctx.req);
  const { data: invites, error: invitesError } = await getInvites({}, ctx.req);
  return {
    props: { ...teams, invites },
  };
};

export default TeamsPage;
