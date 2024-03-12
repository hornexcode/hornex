import Baron from '@/assets/images/games/league-of-legends/baron.jpg';
import SummonersRiftMap from '@/assets/images/games/league-of-legends/summoners-rift-map.png';
import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import { LeagueOfLegendsLogo } from '@/components/ui/atoms/icons/league-of-legends-icon';
import { LolFlatIcon } from '@/components/ui/atoms/icons/lol-flat-icon';
import TournamentsFeedTemplate from '@/components/ui/templates/tournaments-feed-template/tournaments-feed-template';
import { AppLayout } from '@/layouts';
import { GetTournamentsResponse } from '@/lib/models/types/rest/get-tournaments';
import { dataLoader as dataLoader } from '@/lib/request';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const { useData: getTournaments } =
  dataLoader<GetTournamentsResponse>('getTournaments');

type TournamentsProps = {
  game: string;
  platform: string;
};

export const getServerSideProps = (async ({ query: { game, platform } }) => {
  if (typeof game !== 'string' || typeof platform !== 'string') {
    game = 'league-of-legends';
    platform = 'pc';
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

const CompetePage = ({
  pageProps: { game, platform },
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, error, isLoading } = getTournaments({ game, platform });
  if (!data) return null;

  return (
    <div className="px-8">
      <section id="available-games">
        <TournamentsFeedTemplate isLoading={isLoading} data={data} />
      </section>
    </div>
  );
};

CompetePage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default CompetePage;
