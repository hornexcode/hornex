import TournamentsFeedPage from '@/components/ui/templates/tournaments-feed-template/tournaments-feed-template';
import { AppLayout } from '@/layouts';
import { GetTournamentsResponse } from '@/lib/models/types/rest/get-tournaments';
import { dataLoader } from '@/lib/request';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const { useData: getTournaments } =
  dataLoader<GetTournamentsResponse>('getTournaments');

type TournamentsProps = {
  game: string;
  platform: string;
};

export const getServerSideProps = (async ({ query: { game, platform } }) => {
  if (typeof game !== 'string' || typeof platform !== 'string') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageProps: {
        game,
        platform,
      },
    },
  };
}) satisfies GetServerSideProps<{
  pageProps: TournamentsProps;
}>;

const Tournaments = ({
  pageProps: { game, platform },
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    data: tournaments,
    error,
    isLoading,
  } = getTournaments({
    game,
    platform,
  });

  return (
    <div className="min-h-[100vh] p-8">
      <TournamentsFeedPage
        isLoading={isLoading}
        tournaments={
          tournaments || { count: 0, next: null, previous: null, results: [] }
        }
      />
    </div>
  );
};

Tournaments.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default Tournaments;
