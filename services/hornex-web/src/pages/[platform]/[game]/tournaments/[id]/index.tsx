import TournamentPage from '@/components/ui/templates/tournament-details-template';
import { AppLayout } from '@/layouts';
import { dataLoader } from '@/lib/api';
import { Tournament } from '@/lib/hx-app/types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

export type GameID = {
  id: string;
  nickname: string;
  game: string;
};

const { fetch: getTournament } = dataLoader<Tournament>('getTournament');
const { fetch: getGameIds } = dataLoader<GameID[]>('getGameIds');

type TournamentProps = {
  params: {
    platform: string;
    game: string;
    id: string;
  };
  tournament: Tournament;
  gameIds: GameID[];
};

const Tournament: InferGetServerSidePropsType<typeof getServerSideProps> = ({
  params,
  tournament,
  gameIds,
}: TournamentProps) => {
  // TODO: add switch to render different types of tournament template
  // switch (params.game) {
  //   case LEAGUE_OF_LEGENDS:
  //     return <TournamentDetailsTemplate />;
  //   default:
  //     break;
  // }
  return <TournamentPage tournament={tournament} gameIds={gameIds} />;
};

Tournament.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data: tournament, error: tournamentError } = await getTournament(
    {
      tournamentId: ctx.query.id || '',
      platform: ctx.query.platform || '',
      game: ctx.query.game || '',
    },
    ctx.req
  );

  if (!tournament || tournamentError) {
    return {
      notFound: true,
    };
  }

  const { data: gameIds, error: gameIdsError } = await getGameIds({}, ctx.req);
  if (!gameIds || gameIdsError) {
    return {
      props: {
        params: ctx.params,
        tournament,
        gameIds: [],
      },
    };
  }

  return {
    props: {
      params: ctx.params,
      tournament,
      gameIds,
    },
  };
};

export default Tournament;
