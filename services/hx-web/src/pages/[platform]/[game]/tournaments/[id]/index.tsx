import TournamentDetailsTemplate from '@/components/templates/tournament-page-template';
import { AppLayout } from '@/layouts';
import { FetchError, requestFactory } from '@/lib/api';
import { Tournament } from '@/lib/hx-app/types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const { fetch: getTournament } = requestFactory<Tournament>('getTournament');

type TournamentProps = {
  params: {
    platform: string;
    game: string;
    id: string;
  };
  tournament: Tournament;
};

const Tournament: InferGetServerSidePropsType<typeof getServerSideProps> = ({
  params,
  tournament,
}: TournamentProps) => {
  // TODO: add switch to render different types of tournament template
  // switch (params.game) {
  //   case LEAGUE_OF_LEGENDS:
  //     return <TournamentDetailsTemplate />;
  //   default:
  //     break;
  // }
  return <TournamentDetailsTemplate tournament={tournament} />;
};

Tournament.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data: tournament, error } = await getTournament(
    {
      tournamentId: ctx.query.id || '',
      platform: ctx.query.platform || '',
      game: ctx.query.game || '',
    },
    ctx.req
  );

  if (error as FetchError) {
    if (error?.code === 401) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    return {
      notFound: true,
    };
  }

  return {
    props: {
      params: ctx.params,
      tournament,
    },
  };
};

export default Tournament;
