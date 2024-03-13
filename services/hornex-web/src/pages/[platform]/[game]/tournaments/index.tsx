import TournamentsFeedPage from '@/components/ui/templates/tournaments-feed-template/tournaments-feed-template';
import { AppLayout } from '@/layouts';
import { GetTournamentsResponse } from '@/lib/models/types/rest/get-tournaments';
import { dataLoader } from '@/lib/request';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React from 'react';

const { fetch: getTournaments } =
  dataLoader<GetTournamentsResponse>('getTournaments');

type TournamentPageProps = {
  game: string;
  platform: string;
  tournaments: GetTournamentsResponse;
};

export const getServerSideProps = (async ({
  query: { game, platform },
  req,
}) => {
  if (typeof game !== 'string' || typeof platform !== 'string') {
    return {
      notFound: true,
    };
  }

  const { data: tournaments, error } = await getTournaments(
    { game, platform },
    req
  );

  if (error || !tournaments) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      game,
      platform,
      tournaments,
    },
  };
}) satisfies GetServerSideProps<TournamentPageProps>;

const Tournaments = ({
  tournaments,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <TournamentsFeedPage data={tournaments} />;
};

Tournaments.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default Tournaments;
