import TournamentDetailsTemplate from '@/components/templates/tournament-page-template';
import { AppLayout } from '@/layouts';
import { requestFactory } from '@/lib/api';
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
  // const search = new URLSearchParams();

  // Object.entries(ctx.query).forEach(([key, value]) => {
  //   search.append(key, `${value}`); // maybe you want to do `Array.isArray(value)` checks, etc
  //   // basically, serialize it as you wish based on its type
  // });
  // console.log('dhina', id, platform, game);
  const { data: tournament, error } = await getTournament(
    {
      id: ctx.query.id || '',
      platform: ctx.query.platform || '',
      game: ctx.query.game || '',
    },
    ctx.req
  );

  if (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      params: ctx.params,
    },
  };
};

export default Tournament;
