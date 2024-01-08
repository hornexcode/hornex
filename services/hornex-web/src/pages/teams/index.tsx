import TeamsTemplate from '@/components/ui/templates/teams';
import { AppLayout } from '@/layouts';
import { GetInvitesResponse } from '@/lib/models/types';
import { dataLoader } from '@/lib/request';
import { makeClientReqObj } from '@/lib/request/util';
import {
  GetTeamsOutput,
  getTeamsSchemaOutput as schema,
} from '@/services/hx-core/get-teams';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

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
  return {
    props: {},
  };
};

export default TeamsPage;
